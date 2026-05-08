package com.libnoname.noname

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.activity.result.ActivityResult
import androidx.documentfile.provider.DocumentFile
import com.getcapacitor.*
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import java.io.ByteArrayOutputStream
import java.util.Base64
import androidx.core.content.edit
import androidx.core.net.toUri

@CapacitorPlugin(name = "SafFs")
class SafFsPlugin : Plugin() {

    private val prefsName = "saffs_prefs"
    private val keyTreeUri = "tree_uri"

    @PluginMethod
    fun pickDirectory(call: PluginCall) {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT_TREE).apply {
            addFlags(
                Intent.FLAG_GRANT_READ_URI_PERMISSION or
                        Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
                        Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION or
                        Intent.FLAG_GRANT_PREFIX_URI_PERMISSION
            )
        }
        startActivityForResult(call, intent, "onPickDirectoryResult")
    }

    @SuppressLint("WrongConstant")
    @ActivityCallback
    private fun onPickDirectoryResult(call: PluginCall, result: ActivityResult) {
        if (result.resultCode != android.app.Activity.RESULT_OK) {
            call.reject("User cancelled")
            return
        }
        val uri: Uri? = result.data?.data
        if (uri == null) {
            call.reject("No directory selected")
            return
        }

        // 持久化权限
        val flags = result.data?.flags ?: 0
        val takeFlags = flags and
                (Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)

        try {
            context.contentResolver.takePersistableUriPermission(uri, takeFlags)
        } catch (_: SecurityException) {
            // 有的设备会给不到 write；至少保存 uri
        }

        saveTreeUri(uri.toString())
        val ret = JSObject()
        ret.put("uri", uri.toString())
        call.resolve(ret)
    }

    @PluginMethod
    fun getDirectory(call: PluginCall) {
        val uri = loadTreeUri()
        val ret = JSObject()
        ret.put("uri", uri)
        call.resolve(ret)
    }

    // ------------------------
    // Minimal FS API
    // ------------------------

    @PluginMethod
    fun list(call: PluginCall) {
        val path = call.getString("path", "") ?: ""
        val root = requireRoot(call) ?: return
        val dir = resolveDir(root, path) ?: run {
            call.reject("Directory not found: $path")
            return
        }
        if (!dir.isDirectory) {
            call.reject("Not a directory: $path")
            return
        }

        val arr = JSONArray()
        dir.listFiles().forEach { f ->
            arr.put(statToJson(f, combine(path, f.name ?: "")))
        }

        val ret = JSObject()
        ret.put("items", arr)
        call.resolve(ret)
    }

    @PluginMethod
    fun readFile(call: PluginCall) {
        val path = call.getString("path")
        if (path.isNullOrBlank()) {
            call.reject("Missing path")
            return
        }
        val root = requireRoot(call) ?: return
        val file = resolveFile(root, path) ?: run {
            call.reject("File not found: $path")
            return
        }
        if (file.isDirectory) {
            call.reject("Path is a directory: $path")
            return
        }

        try {
            val uri = file.uri
            val bytes = context.contentResolver.openInputStream(uri)?.use { input ->
                val bos = ByteArrayOutputStream()
                val buf = ByteArray(8192)
                while (true) {
                    val r = input.read(buf)
                    if (r <= 0) break
                    bos.write(buf, 0, r)
                }
                bos.toByteArray()
            } ?: run {
                call.reject("Failed to open input stream")
                return
            }

            val b64 = Base64.getEncoder().encodeToString(bytes)
            val ret = JSObject()
            ret.put("data", b64)
            call.resolve(ret)
        } catch (e: Exception) {
            call.reject("Read failed: ${e.message}", e)
        }
    }

    @PluginMethod
    fun writeFile(call: PluginCall) {
        val path = call.getString("path")
        val data = call.getString("data")
        val overwrite = call.getBoolean("overwrite", true) ?: true

        if (path.isNullOrBlank() || data.isNullOrBlank()) {
            call.reject("Missing path or data")
            return
        }

        val root = requireRoot(call) ?: return

        try {
            val parentPath = parentOf(path)
            val name = nameOf(path)
            val parentDir = ensureDir(root, parentPath) ?: run {
                call.reject("Failed to create parent directory: $parentPath")
                return
            }

            var target = parentDir.findFile(name)
            if (target != null && target.isDirectory) {
                call.reject("Target is a directory: $path")
                return
            }

            if (target != null && !overwrite) {
                call.reject("File exists and overwrite=false: $path")
                return
            }

            if (target == null) {
                // MIME 最简处理：统一 application/octet-stream
                target = parentDir.createFile("application/octet-stream", name)
                    ?: run {
                        call.reject("Failed to create file: $path")
                        return
                    }
            }

            val bytes = Base64.getDecoder().decode(data)
            context.contentResolver.openOutputStream(target.uri, "wt")?.use { out ->
                out.write(bytes)
                out.flush()
            } ?: run {
                call.reject("Failed to open output stream")
                return
            }

            call.resolve()
        } catch (e: Exception) {
            call.reject("Write failed: ${e.message}", e)
        }
    }

    @PluginMethod
    fun mkdir(call: PluginCall) {
        val path = call.getString("path", "") ?: ""
        val root = requireRoot(call) ?: return
        val dir = ensureDir(root, path)
        if (dir == null) {
            call.reject("Failed to create directory: $path")
            return
        }
        call.resolve()
    }

    @PluginMethod
    fun delete(call: PluginCall) {
        val path = call.getString("path")
        val recursive = call.getBoolean("recursive", true) ?: true
        if (path.isNullOrBlank()) {
            call.reject("Missing path")
            return
        }
        val root = requireRoot(call) ?: return
        val node = resolveAny(root, path) ?: run {
            call.reject("Not found: $path")
            return
        }

        try {
            val ok = if (node.isDirectory && recursive) deleteRecursive(node) else node.delete()
            if (!ok) {
                call.reject("Delete failed: $path")
                return
            }
            call.resolve()
        } catch (e: Exception) {
            call.reject("Delete failed: ${e.message}", e)
        }
    }

    @PluginMethod
    fun stat(call: PluginCall) {
        val path = call.getString("path", "")
        if (path == null) {
            call.reject("Missing path")
            return
        }
        val root = requireRoot(call) ?: return
        val node = if (path.isBlank()) root else resolveAny(root, path)
        if (node == null) {
            call.reject("Not found: $path")
            return
        }
        call.resolve(statToJson(node, path))
    }

    @PluginMethod
    fun exists(call: PluginCall) {
        val path = call.getString("path", "")
        if (path == null) {
            call.reject("Missing path")
            return
        }
        val root = requireRoot(call) ?: return
        val node = if (path.isBlank()) root else resolveAny(root, path)
        val ret = JSObject()
        ret.put("exists", node != null)
        call.resolve(ret)
    }

    // ------------------------
    // Helpers
    // ------------------------

    private fun requireRoot(call: PluginCall): DocumentFile? {
        val uriStr = loadTreeUri()
        if (uriStr.isNullOrBlank()) {
            call.reject("No directory authorized. Call pickDirectory() first.")
            return null
        }
        val uri = uriStr.toUri()
        val root = DocumentFile.fromTreeUri(context, uri)
        if (root == null || !root.exists() || !root.isDirectory) {
            call.reject("Authorized directory is invalid. Please pickDirectory() again.")
            return null
        }
        return root
    }

    private fun saveTreeUri(uri: String) {
        context.getSharedPreferences(prefsName, Context.MODE_PRIVATE)
            .edit {
                putString(keyTreeUri, uri)
            }
    }

    private fun loadTreeUri(): String? {
        return context.getSharedPreferences(prefsName, Context.MODE_PRIVATE)
            .getString(keyTreeUri, null)
    }

    private fun normalize(path: String): List<String> {
        return path.split("/")
            .map { it.trim() }
            .filter { it.isNotEmpty() && it != "." }
            .also {
                if (it.any { seg -> seg == ".." }) {
                    throw IllegalArgumentException("Path must not contain '..'")
                }
            }
    }

    private fun resolveAny(root: DocumentFile, relPath: String): DocumentFile? {
        val segs = normalize(relPath)
        var cur: DocumentFile? = root
        for (s in segs) {
            cur = cur?.findFile(s) ?: return null
        }
        return cur
    }

    private fun resolveDir(root: DocumentFile, relPath: String): DocumentFile? {
        if (relPath.isBlank()) return root
        val node = resolveAny(root, relPath) ?: return null
        return if (node.isDirectory) node else null
    }

    private fun resolveFile(root: DocumentFile, relPath: String): DocumentFile? {
        val node = resolveAny(root, relPath) ?: return null
        return if (node.isFile) node else null
    }

    private fun ensureDir(root: DocumentFile, relPath: String): DocumentFile? {
        val segs = normalize(relPath)
        var cur: DocumentFile = root
        for (s in segs) {
            val next = cur.findFile(s)
            cur = when {
                next == null -> cur.createDirectory(s) ?: return null
                next.isDirectory -> next
                else -> return null
            }
        }
        return cur
    }

    private fun deleteRecursive(dir: DocumentFile): Boolean {
        dir.listFiles().forEach { f ->
            val ok = if (f.isDirectory) deleteRecursive(f) else f.delete()
            if (!ok) return false
        }
        return dir.delete()
    }

    private fun statToJson(f: DocumentFile, path: String): JSObject {
        val o = JSObject()
        o.put("path", path)
        o.put("name", f.name ?: "")
        o.put("isDir", f.isDirectory)
        if (f.isFile) {
            o.put("size", f.length())
        }
        // SAF 下 lastModified() 在部分 provider 下可能为 0
        val lm = f.lastModified()
        if (lm > 0) o.put("mtime", lm)
        return o
    }

    private fun parentOf(path: String): String {
        val segs = normalize(path)
        return if (segs.size <= 1) "" else segs.dropLast(1).joinToString("/")
    }

    private fun nameOf(path: String): String {
        val segs = normalize(path)
        if (segs.isEmpty()) throw IllegalArgumentException("Invalid path")
        return segs.last()
    }

    private fun combine(base: String, name: String): String {
        return if (base.isBlank()) name else "$base/$name"
    }
}

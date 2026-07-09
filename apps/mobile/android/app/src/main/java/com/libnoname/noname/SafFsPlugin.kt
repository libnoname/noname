package com.libnoname.noname

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.provider.DocumentsContract
import android.util.Base64
import androidx.activity.result.ActivityResult
import androidx.documentfile.provider.DocumentFile
import com.getcapacitor.JSArray
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.ByteArrayOutputStream
import java.nio.charset.Charset

@CapacitorPlugin(name = "SafFs")
class SafFsPlugin : Plugin() {
    private val prefsName = "SafFs"
    private val rootUriKey = "rootUri"

    private val rootUri: Uri?
        get() = getContext()
            .getSharedPreferences(prefsName, 0)
            .getString(rootUriKey, null)
            ?.let(Uri::parse)

    @PluginMethod
    fun hasAccess(call: PluginCall) {
        call.resolve(accessResult())
    }

    @PluginMethod
    fun requestAccess(call: PluginCall) {
        if (hasPersistedAccess()) {
            call.resolve(accessResult())
            return
        }

        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT_TREE).apply {
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
            addFlags(Intent.FLAG_GRANT_PREFIX_URI_PERMISSION)
        }
        startActivityForResult(call, intent, "handleOpenDocumentTree")
    }

    @ActivityCallback
    fun handleOpenDocumentTree(call: PluginCall, result: ActivityResult) {
        if (result.resultCode != Activity.RESULT_OK) {
            call.reject("未选择游戏目录")
            return
        }

        val uri = result.data?.data
        if (uri == null) {
            call.reject("未获取到目录授权")
            return
        }

        val grantFlags =
            Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
        val flags = result.data?.flags ?: grantFlags
        val takeFlags = flags and grantFlags

        try {
            getContext().contentResolver.takePersistableUriPermission(uri, takeFlags)
            getContext()
                .getSharedPreferences(prefsName, 0)
                .edit()
                .putString(rootUriKey, uri.toString())
                .apply()
            call.resolve(accessResult())
        } catch (e: Exception) {
            call.reject("保存目录授权失败: ${e.message}", e)
        }
    }

    @PluginMethod
    fun checkFile(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val file = find(fileName)
            JSObject().put("type", when {
                file == null -> "none"
                file.isFile -> "file"
                file.isDirectory -> "directory"
                else -> "none"
            })
        }
    }

    @PluginMethod
    fun checkDir(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: throw IllegalArgumentException("缺少 dir")
            val file = find(dir)
            JSObject().put("type", when {
                file == null -> "none"
                file.isFile -> "file"
                file.isDirectory -> "directory"
                else -> "none"
            })
        }
    }

    @PluginMethod
    fun readFile(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val file = requireFile(fileName)
            val bytes = getContext().contentResolver.openInputStream(file.uri)?.use { input ->
                val output = ByteArrayOutputStream()
                input.copyTo(output)
                output.toByteArray()
            } ?: throw IllegalStateException("无法读取文件")
            JSObject().put("data", Base64.encodeToString(bytes, Base64.NO_WRAP))
        }
    }

    @PluginMethod
    fun readFileAsText(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val file = requireFile(fileName)
            val text = getContext().contentResolver.openInputStream(file.uri)?.use { input ->
                input.bufferedReader(Charset.forName("UTF-8")).readText()
            } ?: throw IllegalStateException("无法读取文件")
            JSObject().put("data", text)
        }
    }

    @PluginMethod
    fun writeFile(call: PluginCall) {
        wrap(call) {
            val path = call.getString("path") ?: throw IllegalArgumentException("缺少 path")
            val data = call.getString("data") ?: throw IllegalArgumentException("缺少 data")
            val bytes = Base64.decode(data, Base64.DEFAULT)
            val file = createOrReplaceFile(path)
            getContext().contentResolver.openOutputStream(file.uri, "rwt")?.use { output ->
                output.write(bytes)
            } ?: throw IllegalStateException("无法写入文件")
            JSObject().put("success", true)
        }
    }

    @PluginMethod
    fun removeFile(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val file = requireFile(fileName)
            if (!file.delete()) throw IllegalStateException("删除文件失败")
            JSObject().put("success", true)
        }
    }

    @PluginMethod
    fun getFileList(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: ""
            val folder = requireDirectory(dir)
            val folders = JSArray()
            val files = JSArray()

            folder.listFiles()
                .filter { file -> !file.name.isNullOrEmpty() }
                .filter { file -> !file.name!!.startsWith(".") && !file.name!!.startsWith("_") }
                .forEach { file ->
                    if (file.isDirectory) folders.put(file.name) else files.put(file.name)
                }

            JSObject()
                .put("folders", folders)
                .put("files", files)
        }
    }

    @PluginMethod
    fun createDir(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: throw IllegalArgumentException("缺少 dir")
            ensureDirectory(dir)
            JSObject().put("success", true)
        }
    }

    @PluginMethod
    fun removeDir(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: throw IllegalArgumentException("缺少 dir")
            val folder = requireDirectory(dir)
            if (!folder.delete()) throw IllegalStateException("删除目录失败")
            JSObject().put("success", true)
        }
    }

    private fun wrap(call: PluginCall, block: () -> JSObject) {
        try {
            call.resolve(block())
        } catch (e: Exception) {
            call.reject(e.message ?: e.toString(), e)
        }
    }

    private fun accessResult(): JSObject {
        val uri = rootUri
        return JSObject()
            .put("granted", hasPersistedAccess())
            .put("rootUri", uri?.toString())
    }

    private fun hasPersistedAccess(): Boolean {
        val uri = rootUri ?: return false
        return getContext().contentResolver.persistedUriPermissions.any { permission ->
            permission.uri == uri && permission.isReadPermission && permission.isWritePermission
        }
    }

    private fun root(): DocumentFile {
        val uri = rootUri ?: throw IllegalStateException("尚未授权游戏目录")
        if (!hasPersistedAccess()) throw IllegalStateException("游戏目录授权已失效")
        return DocumentFile.fromTreeUri(getContext(), uri)
            ?: throw IllegalStateException("无法打开游戏目录")
    }

    private fun segments(path: String): List<String> {
        val normalized = path.replace('\\', '/').trim('/')
        if (normalized.isEmpty()) return emptyList()

        return normalized
            .split("/")
            .filter { it.isNotEmpty() && it != "." }
            .map {
                if (it == "..") throw IllegalArgumentException("路径不能包含 ..")
                it
            }
    }

    private fun find(path: String): DocumentFile? {
        return segments(path).fold(root() as DocumentFile?) { current, name ->
            current?.findFile(name)
        }
    }

    private fun requireFile(path: String): DocumentFile {
        val file = find(path) ?: throw IllegalArgumentException("$path 不存在")
        if (!file.isFile) throw IllegalArgumentException("$path 不是文件")
        return file
    }

    private fun requireDirectory(path: String): DocumentFile {
        val folder = if (segments(path).isEmpty()) root() else find(path)
        if (folder == null) throw IllegalArgumentException("$path 不存在")
        if (!folder.isDirectory) throw IllegalArgumentException("$path 不是文件夹")
        return folder
    }

    private fun ensureDirectory(path: String): DocumentFile {
        return segments(path).fold(root()) { current, name ->
            val existing = current.findFile(name)
            when {
                existing == null -> current.createDirectory(name)
                    ?: throw IllegalStateException("创建目录失败: $name")
                existing.isDirectory -> existing
                else -> throw IllegalArgumentException("$name 已存在且不是文件夹")
            }
        }
    }

    private fun createOrReplaceFile(path: String): DocumentFile {
        val parts = segments(path)
        if (parts.isEmpty()) throw IllegalArgumentException("缺少文件路径")

        val parent = ensureDirectory(parts.dropLast(1).joinToString("/"))
        val name = parts.last()
        val existing = parent.findFile(name)

        if (existing != null) {
            if (!existing.isFile) throw IllegalArgumentException("$path 不是文件")
            return existing
        }

        val uri = DocumentsContract.createDocument(
            getContext().contentResolver,
            parent.uri,
            "application/octet-stream",
            name
        ) ?: throw IllegalStateException("创建文件失败: $path")

        return DocumentFile.fromSingleUri(getContext(), uri)
            ?: throw IllegalStateException("无法打开新建文件: $path")
    }
}

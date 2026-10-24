package com.libnoname.noname

import android.app.Activity
import android.content.Intent
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
    private val store: SafOverlayStore
        get() = SafOverlayStore(getContext())

    @PluginMethod
    fun hasAccess(call: PluginCall) {
        call.resolve(accessResult())
    }

    @PluginMethod
    fun requestAccess(call: PluginCall) {
        if (store.hasPersistedAccess()) {
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
            store.saveRootUri(uri)
            call.resolve(accessResult())
        } catch (e: Exception) {
            call.reject("保存目录授权失败: ${e.message}", e)
        }
    }

    @PluginMethod
    fun checkFile(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val file = store.findSaf(fileName)
            JSObject().put("type", when {
                file != null && file.isFile -> "file"
                file != null && file.isDirectory -> "directory"
                else -> when (store.assetType(fileName)) {
                    EntryType.FILE -> "file"
                    EntryType.DIRECTORY -> "directory"
                    EntryType.NONE -> "none"
                }
            })
        }
    }

    @PluginMethod
    fun checkDir(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: throw IllegalArgumentException("缺少 dir")
            val file = store.findSaf(dir)
            JSObject().put("type", when {
                file != null && file.isFile -> "file"
                file != null && file.isDirectory -> "directory"
                else -> when (store.assetType(dir)) {
                    EntryType.FILE -> "file"
                    EntryType.DIRECTORY -> "directory"
                    EntryType.NONE -> "none"
                }
            })
        }
    }

    @PluginMethod
    fun readFile(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val bytes = openOverlayInput(fileName).use { input ->
                val output = ByteArrayOutputStream()
                input.copyTo(output)
                output.toByteArray()
            }
            JSObject().put("data", Base64.encodeToString(bytes, Base64.NO_WRAP))
        }
    }

    @PluginMethod
    fun readFileAsText(call: PluginCall) {
        wrap(call) {
            val fileName = call.getString("fileName") ?: throw IllegalArgumentException("缺少 fileName")
            val text = openOverlayInput(fileName).use { input ->
                input.bufferedReader(Charset.forName("UTF-8")).readText()
            }
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
            val file = store.findSaf(fileName)
            if (file == null) {
                if (store.assetType(fileName) != EntryType.NONE) {
                    throw IllegalArgumentException("内置资源只读: $fileName")
                }
                throw IllegalArgumentException("$fileName 不存在")
            }
            if (!file.isFile) throw IllegalArgumentException("$fileName 不是文件")
            if (!file.delete()) throw IllegalStateException("删除文件失败")
            JSObject().put("success", true)
        }
    }

    @PluginMethod
    fun getFileList(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: ""
            val entries = linkedMapOf<String, Boolean>()

            store.listAsset(dir)
                .filter { entry -> isVisible(entry.name) }
                .forEach { entry -> entries[entry.name] = entry.isDirectory }

            val safFolder = store.findSaf(dir)
            if (safFolder != null) {
                if (!safFolder.isDirectory) throw IllegalArgumentException("$dir 不是文件夹")
                safFolder.listFiles()
                    .filter { file -> !file.name.isNullOrEmpty() && isVisible(file.name!!) }
                    .forEach { file -> entries[file.name!!] = file.isDirectory }
            } else if (entries.isEmpty() && store.assetType(dir) == EntryType.NONE) {
                throw IllegalArgumentException("$dir 不存在")
            }

            val folders = JSArray()
            val files = JSArray()
            entries.forEach { (name, isDirectory) ->
                if (isDirectory) folders.put(name) else files.put(name)
            }

            JSObject()
                .put("folders", folders)
                .put("files", files)
        }
    }

    @PluginMethod
    fun createDir(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: ""
            ensureDirectory(dir)
            JSObject().put("success", true)
        }
    }

    @PluginMethod
    fun removeDir(call: PluginCall) {
        wrap(call) {
            val dir = call.getString("dir") ?: throw IllegalArgumentException("缺少 dir")
            val folder = store.findSaf(dir)
            if (folder == null) {
                if (store.assetType(dir) != EntryType.NONE) {
                    throw IllegalArgumentException("内置资源只读: $dir")
                }
                throw IllegalArgumentException("$dir 不存在")
            }
            if (!folder.isDirectory) throw IllegalArgumentException("$dir 不是文件夹")
            if (!folder.delete()) throw IllegalStateException("删除目录失败")
            JSObject().put("success", true)
        }
    }

    private fun isVisible(name: String): Boolean {
        return !name.startsWith(".") && !name.startsWith("_")
    }

    private fun openOverlayInput(path: String): java.io.InputStream {
        val safFile = store.findSaf(path)
        if (safFile != null) {
            if (!safFile.isFile) throw IllegalArgumentException("$path 不是文件")
            return store.openSafInput(safFile) ?: throw IllegalStateException("无法读取文件")
        }

        return store.openAsset(path) ?: throw IllegalArgumentException("$path 不存在")
    }

    private fun wrap(call: PluginCall, block: () -> JSObject) {
        try {
            call.resolve(block())
        } catch (e: Exception) {
            call.reject(e.message ?: e.toString(), e)
        }
    }

    private fun accessResult(): JSObject {
        val uri = store.rootUri
        return JSObject()
            .put("granted", store.hasPersistedAccess())
            .put("rootUri", uri?.toString())
    }

    private fun ensureDirectory(path: String): DocumentFile {
        return store.segments(path).fold(store.root()) { current, name ->
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
        val parts = store.segments(path)
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

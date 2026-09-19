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
            call.reject("保存目录授权失败: ${e.message}", FileSystemException.IO_ERROR, e)
        }
    }

    @PluginMethod
    fun stat(call: PluginCall) {
        wrap(call) {
            overlayStat(requiredPath(call, allowEmpty = true)) ?: JSObject().put("type", "none")
        }
    }

    @PluginMethod
    fun list(call: PluginCall) {
        wrap(call) {
            listResult(requiredPath(call, allowEmpty = true))
        }
    }

    @PluginMethod
    fun read(call: PluginCall) {
        wrap(call) {
            readResult(requiredPath(call))
        }
    }

    @PluginMethod
    fun write(call: PluginCall) {
        wrap(call) {
            val path = requiredPath(call)
            val data = call.getString("data") ?: throw invalidPath(path, "缺少 data")
            writeBytes(path, Base64.decode(data, Base64.DEFAULT))
        }
    }

    @PluginMethod
    fun createDir(call: PluginCall) {
        wrap(call) {
            createDirResult(call)
        }
    }

    @PluginMethod
    fun remove(call: PluginCall) {
        wrap(call) {
            removeResult(requiredPath(call), call.getBoolean("recursive") == true)
        }
    }

    @PluginMethod
    fun checkFile(call: PluginCall) {
        wrap(call) {
            checkTypeResult(requiredPath(call, keys = arrayOf("path", "fileName")))
        }
    }

    @PluginMethod
    fun checkDir(call: PluginCall) {
        wrap(call) {
            checkTypeResult(requiredPath(call, allowEmpty = true, keys = arrayOf("path", "dir")))
        }
    }

    @PluginMethod
    fun readFile(call: PluginCall) {
        wrap(call) {
            readResult(requiredPath(call, keys = arrayOf("path", "fileName")))
        }
    }

    @PluginMethod
    fun readFileAsText(call: PluginCall) {
        wrap(call) {
            val path = requiredPath(call, keys = arrayOf("path", "fileName"))
            val text = openOverlayInput(path).use { input ->
                input.bufferedReader(Charset.forName("UTF-8")).readText()
            }
            JSObject().put("data", text)
        }
    }

    @PluginMethod
    fun writeFile(call: PluginCall) {
        wrap(call) {
            val path = requiredPath(call)
            val data = call.getString("data") ?: throw invalidPath(path, "缺少 data")
            val parent = store.segments(path).dropLast(1).joinToString("/")
            if (parent.isNotEmpty()) {
                ensureDirectory(parent)
            }
            writeBytes(path, Base64.decode(data, Base64.DEFAULT))
        }
    }

    @PluginMethod
    fun removeFile(call: PluginCall) {
        wrap(call) {
            val path = requiredPath(call, keys = arrayOf("path", "fileName"))
            val info = overlayStat(path) ?: throw notFound(path)
            if (info.getString("type") != "file") {
                throw notFile(path)
            }
            removeResult(path, recursive = false)
        }
    }

    @PluginMethod
    fun getFileList(call: PluginCall) {
        wrap(call) {
            val path = requiredPath(call, allowEmpty = true, keys = arrayOf("path", "dir"))
            val entries = listEntries(path)
            val folders = JSArray()
            val files = JSArray()
            entries.forEach { (name, type) ->
                if (name.startsWith(".") || name.startsWith("_")) {
                    return@forEach
                }
                if (type == "directory") {
                    folders.put(name)
                } else if (type == "file") {
                    files.put(name)
                }
            }
            JSObject().put("folders", folders).put("files", files)
        }
    }

    @PluginMethod
    fun removeDir(call: PluginCall) {
        wrap(call) {
            val path = requiredPath(call, keys = arrayOf("path", "dir"))
            val info = overlayStat(path) ?: throw notFound(path)
            if (info.getString("type") != "directory") {
                throw notDirectory(path)
            }
            removeResult(path, recursive = true)
        }
    }

    private fun checkTypeResult(path: String): JSObject {
        val info = overlayStat(path)
        val type = info?.getString("type")
        return JSObject().put(
            "type",
            if (type == "file" || type == "directory") type else "none"
        )
    }

    private fun listResult(path: String): JSObject {
        val listed = JSArray()
        listEntries(path).forEach { (name, type) ->
            listed.put(JSObject().put("name", name).put("type", type))
        }
        return JSObject().put("entries", listed)
    }

    private fun listEntries(path: String): LinkedHashMap<String, String> {
        val saf = store.findSaf(path)
        val assetType = store.assetType(path)

        when {
            saf != null && saf.isFile -> throw notDirectory(path)
            saf == null && assetType == EntryType.FILE -> throw notDirectory(path)
            saf == null && assetType == EntryType.NONE && path.isNotEmpty() -> throw notFound(path)
        }

        val entries = linkedMapOf<String, String>()
        store.listAsset(path).forEach { entry ->
            entries[entry.name] = if (entry.isDirectory) "directory" else "file"
        }

        if (saf != null) {
            if (!saf.isDirectory) throw notDirectory(path)
            saf.listFiles().forEach { file ->
                val name = file.name ?: return@forEach
                entries[name] = when {
                    file.isDirectory -> "directory"
                    file.isFile -> "file"
                    else -> "other"
                }
            }
        }
        return entries
    }

    private fun readResult(path: String): JSObject {
        val bytes = openOverlayInput(path).use { input ->
            val output = ByteArrayOutputStream()
            input.copyTo(output)
            output.toByteArray()
        }
        return JSObject().put("data", Base64.encodeToString(bytes, Base64.NO_WRAP))
    }

    private fun writeBytes(path: String, bytes: ByteArray): JSObject {
        val file = createOrReplaceFile(path)
        getContext().contentResolver.openOutputStream(file.uri, "rwt")?.use { output ->
            output.write(bytes)
        } ?: throw ioError(path, "无法写入文件")
        return JSObject().put("success", true)
    }

    private fun createDirResult(call: PluginCall): JSObject {
        val path = requiredPath(call, allowEmpty = true, keys = arrayOf("path", "dir"))
        val recursive = if (call.data.has("recursive")) {
            call.getBoolean("recursive") == true
        } else {
            call.getString("path") == null && call.getString("dir") != null
        }
        if (path.isEmpty()) {
            store.root()
            return JSObject().put("success", true)
        }
        if (recursive) {
            ensureDirectory(path)
        } else {
            createDirectoryNonRecursive(path)
        }
        return JSObject().put("success", true)
    }

    private fun removeResult(path: String, recursive: Boolean): JSObject {
        val saf = store.findSaf(path)
        if (saf == null) {
            if (store.assetType(path) != EntryType.NONE) {
                throw permissionDenied(path, "内置资源只读")
            }
            throw notFound(path)
        }

        if (saf.isDirectory) {
            val children = saf.listFiles()
            if (!recursive && children.isNotEmpty()) {
                throw ioError(path, "Directory is not empty")
            }
        }

        if (!saf.delete()) {
            throw ioError(path, "删除失败")
        }
        return JSObject().put("success", true)
    }

    private fun overlayStat(path: String): JSObject? {
        val saf = store.findSaf(path)
        if (saf != null) {
            val result = JSObject().put(
                "type",
                when {
                    saf.isFile -> "file"
                    saf.isDirectory -> "directory"
                    else -> "other"
                }
            )
            if (saf.isFile) {
                val size = saf.length()
                if (size >= 0) {
                    result.put("size", size)
                }
            }
            val modified = saf.lastModified()
            if (modified > 0) {
                result.put("modifiedAt", modified)
            }
            return result
        }

        return when (store.assetType(path)) {
            EntryType.FILE -> {
                val result = JSObject().put("type", "file")
                store.assetSize(path)?.let { result.put("size", it) }
                result
            }
            EntryType.DIRECTORY -> JSObject().put("type", "directory")
            EntryType.NONE -> if (path.isEmpty()) JSObject().put("type", "directory") else null
        }
    }

    private fun openOverlayInput(path: String): java.io.InputStream {
        val safFile = store.findSaf(path)
        if (safFile != null) {
            if (!safFile.isFile) throw notFile(path)
            return store.openSafInput(safFile) ?: throw ioError(path, "无法读取文件")
        }

        return store.openAsset(path) ?: when (store.assetType(path)) {
            EntryType.DIRECTORY -> throw notFile(path)
            else -> throw notFound(path)
        }
    }

    private fun wrap(call: PluginCall, block: () -> JSObject) {
        try {
            call.resolve(block())
        } catch (e: FileSystemException) {
            call.reject(e.detail, e.code, e)
        } catch (e: IllegalArgumentException) {
            call.reject(e.message ?: e.toString(), FileSystemException.INVALID_PATH, e)
        } catch (e: Exception) {
            call.reject(e.message ?: e.toString(), FileSystemException.IO_ERROR, e)
        }
    }

    private fun accessResult(): JSObject {
        val uri = store.rootUri
        return JSObject()
            .put("granted", store.hasPersistedAccess())
            .put("rootUri", uri?.toString())
    }

    private fun requiredPath(
        call: PluginCall,
        allowEmpty: Boolean = false,
        keys: Array<String> = arrayOf("path"),
    ): String {
        val path = keys.firstNotNullOfOrNull { key -> call.getString(key) }
        if (path == null) {
            if (allowEmpty) return ""
            throw FileSystemException(FileSystemException.INVALID_PATH, "", "缺少 ${keys.joinToString("/")}")
        }
        val segments = store.segments(path)
        if (segments.isEmpty()) {
            if (allowEmpty) {
                return ""
            }
            throw FileSystemException(FileSystemException.INVALID_PATH, path, "Path must be a non-empty relative path")
        }
        return store.normalize(path)
    }

    private fun createDirectoryNonRecursive(path: String): DocumentFile {
        when (store.overlayType(path)) {
            EntryType.FILE, EntryType.DIRECTORY -> throw alreadyExists(path)
            EntryType.NONE -> {}
        }

        val parts = store.segments(path)
        val name = parts.last()
        val parentPath = parts.dropLast(1).joinToString("/")
        val parent = resolveWritableDirectory(parentPath, path)
        val existing = parent.findFile(name)
        if (existing != null) {
            throw alreadyExists(path)
        }
        return parent.createDirectory(name) ?: throw ioError(path, "创建目录失败")
    }

    private fun ensureDirectory(path: String): DocumentFile {
        if (path.isEmpty()) return store.root()
        val parts = store.segments(path)
        var current = store.root()
        parts.forEachIndexed { index, name ->
            val existing = current.findFile(name)
            val isLeaf = index == parts.lastIndex
            current = when {
                existing == null -> current.createDirectory(name)
                    ?: throw ioError(path, "创建目录失败: $name")
                existing.isDirectory -> existing
                isLeaf -> throw alreadyExists(path)
                else -> throw notDirectory(path)
            }
        }
        return current
    }

    private fun resolveWritableDirectory(parentPath: String, requestPath: String): DocumentFile {
        if (parentPath.isEmpty()) {
            return store.root()
        }

        val overlayType = store.overlayType(parentPath)
        when (overlayType) {
            EntryType.FILE -> throw notDirectory(requestPath)
            EntryType.NONE -> throw notFound(requestPath)
            EntryType.DIRECTORY -> {}
        }

        return materializeSafDirectory(parentPath, requestPath)
    }

    private fun materializeSafDirectory(path: String, requestPath: String): DocumentFile {
        return store.segments(path).fold(store.root()) { current, name ->
            val existing = current.findFile(name)
            when {
                existing != null && existing.isDirectory -> existing
                existing != null -> throw notDirectory(requestPath)
                else -> current.createDirectory(name)
                    ?: throw ioError(requestPath, "创建目录失败: $name")
            }
        }
    }

    private fun createOrReplaceFile(path: String): DocumentFile {
        val parts = store.segments(path)
        if (parts.isEmpty()) throw invalidPath(path, "缺少文件路径")

        val parent = resolveWritableDirectory(parts.dropLast(1).joinToString("/"), path)
        val name = parts.last()
        val existing = parent.findFile(name)
        if (existing != null) {
            if (!existing.isFile) throw notFile(path)
            return existing
        }

        val uri = DocumentsContract.createDocument(
            getContext().contentResolver,
            parent.uri,
            "application/octet-stream",
            name
        ) ?: throw ioError(path, "创建文件失败")

        return DocumentFile.fromSingleUri(getContext(), uri)
            ?: throw ioError(path, "无法打开新建文件")
    }

    private fun notFound(path: String) =
        FileSystemException(FileSystemException.NOT_FOUND, path, "Path does not exist")

    private fun notFile(path: String) =
        FileSystemException(FileSystemException.NOT_FILE, path, "Path is not a file")

    private fun notDirectory(path: String) =
        FileSystemException(FileSystemException.NOT_DIRECTORY, path, "Path is not a directory")

    private fun alreadyExists(path: String) =
        FileSystemException(FileSystemException.ALREADY_EXISTS, path, "A file or directory already exists")

    private fun permissionDenied(path: String, detail: String) =
        FileSystemException(FileSystemException.PERMISSION_DENIED, path, detail)

    private fun invalidPath(path: String, detail: String) =
        FileSystemException(FileSystemException.INVALID_PATH, path, detail)

    private fun ioError(path: String, detail: String) =
        FileSystemException(FileSystemException.IO_ERROR, path, detail)
}

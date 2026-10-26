package com.libnoname.noname

import android.content.Context
import android.net.Uri
import androidx.documentfile.provider.DocumentFile
import java.io.IOException
import java.io.InputStream

class SafOverlayStore(private val context: Context) {
    companion object {
        private const val PREFS_NAME = "SafFs"
        private const val ROOT_URI_KEY = "rootUri"
        const val ASSET_BASE_PATH = "public"
    }

    val rootUri: Uri?
        get() = context
            .getSharedPreferences(PREFS_NAME, 0)
            .getString(ROOT_URI_KEY, null)
            ?.let(Uri::parse)

    fun saveRootUri(uri: Uri) {
        context
            .getSharedPreferences(PREFS_NAME, 0)
            .edit()
            .putString(ROOT_URI_KEY, uri.toString())
            .apply()
    }

    fun hasPersistedAccess(): Boolean {
        val uri = rootUri ?: return false
        return context.contentResolver.persistedUriPermissions.any { permission ->
            permission.uri == uri && permission.isReadPermission && permission.isWritePermission
        }
    }

    fun root(): DocumentFile {
        val uri = rootUri ?: throw IllegalStateException("尚未授权游戏目录")
        if (!hasPersistedAccess()) throw IllegalStateException("游戏目录授权已失效")
        return DocumentFile.fromTreeUri(context, uri)
            ?: throw IllegalStateException("无法打开游戏目录")
    }

    fun segments(path: String): List<String> {
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

    fun normalize(path: String): String {
        return segments(path).joinToString("/")
    }

    fun findSaf(path: String, pnpmCompat: Boolean = false): DocumentFile? {
        val exact = findSafExact(path)
        if (exact != null || !pnpmCompat || !path.contains(".pnpm")) return exact
        return findSafExact(path.replace(".pnpm", "_pnpm"))
    }

    fun findSafExact(path: String): DocumentFile? {
        val parts = segments(path)
        if (!hasPersistedAccess()) return null
        return try {
            parts.fold(root() as DocumentFile?) { current, name ->
                current?.findFile(name)
            }
        } catch (_: Exception) {
            null
        }
    }

    fun openSafInput(file: DocumentFile): InputStream? {
        return context.contentResolver.openInputStream(file.uri)
    }

    fun assetPath(path: String, basePath: String? = ASSET_BASE_PATH): String {
        val normalized = normalize(path).replace(".pnpm", "_pnpm")
        return listOfNotNull(basePath?.trim('/'), normalized)
            .filter { it.isNotEmpty() }
            .joinToString("/")
    }

    fun openAsset(path: String, basePath: String? = ASSET_BASE_PATH): InputStream? {
        return try {
            context.assets.open(assetPath(path, basePath))
        } catch (_: IOException) {
            null
        }
    }

    fun assetType(path: String, basePath: String? = ASSET_BASE_PATH): EntryType {
        val assetPath = assetPath(path, basePath)

        try {
            context.assets.open(assetPath).close()
            return EntryType.FILE
        } catch (_: IOException) {
        }

        return try {
            val entries = context.assets.list(assetPath)
            if (entries != null && entries.isNotEmpty()) EntryType.DIRECTORY else EntryType.NONE
        } catch (_: IOException) {
            EntryType.NONE
        }
    }

    fun listAsset(path: String, basePath: String? = ASSET_BASE_PATH): List<AssetEntry> {
        val dir = assetPath(path, basePath)
        val entries = try {
            context.assets.list(dir)?.toList().orEmpty()
        } catch (_: IOException) {
            emptyList()
        }

        return entries.mapNotNull { name ->
            val child = if (path.trim('/').isEmpty()) name else "${path.trimEnd('/')}/$name"
            when (assetType(child, basePath)) {
                EntryType.FILE -> AssetEntry(name, false)
                EntryType.DIRECTORY -> AssetEntry(name, true)
                EntryType.NONE -> null
            }
        }
    }
}

enum class EntryType {
    NONE,
    FILE,
    DIRECTORY,
}

data class AssetEntry(
    val name: String,
    val isDirectory: Boolean,
)

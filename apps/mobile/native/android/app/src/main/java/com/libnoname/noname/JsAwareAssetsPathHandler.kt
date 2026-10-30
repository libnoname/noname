package com.libnoname.noname

import android.content.Context
import android.util.Log
import android.webkit.MimeTypeMap
import android.webkit.WebResourceResponse
import androidx.webkit.WebViewAssetLoader


class JsAwarePathHandler(
    private val context: Context,
    private val basePath: String?
) : WebViewAssetLoader.PathHandler {
    private val store = SafOverlayStore(context)

    override fun handle(path: String): WebResourceResponse? {
        return try {
            val normalized = store.normalize(path)
            val safFile = store.findSaf(normalized, pnpmCompat = true)

            if (safFile != null && safFile.isFile) {
                val stream = store.openSafInput(safFile)
                if (stream != null) {
                    return WebResourceResponse(guessMime(normalized), "UTF-8", stream)
                }
            }

            val assetPath = store.assetPath(normalized, basePath)
            val stream = context.assets.open(assetPath)
            val mime = guessMime(assetPath)
            WebResourceResponse(mime, "UTF-8", stream)

        } catch (e: Exception) {
            Log.e("NonameFileServer", "Failed to fetch $path ${e.toString()}")
            null
        }
    }

    private fun guessMime(name: String): String {
        val ext = MimeTypeMap.getFileExtensionFromUrl(name)
        return MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext)
            ?: when (ext) {
                "js" -> "application/javascript"
                "mjs" -> "application/javascript"
                "json" -> "application/json"
                "css" -> "text/css"
                "html" -> "text/html"
                "map" -> "application/json"
                else -> "application/octet-stream"
            }
    }
}

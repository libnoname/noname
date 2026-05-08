package com.libnoname.noname

import android.content.Context
import android.util.Log
import android.webkit.MimeTypeMap
import android.webkit.WebResourceResponse
import androidx.webkit.WebViewAssetLoader
import java.io.IOException
import java.nio.file.Paths


class JsAwarePathHandler(
    private val context: Context,
    private val basePath: String?
) : WebViewAssetLoader.PathHandler {

    override fun handle(path: String): WebResourceResponse? {
        return try {
            val normalized = path.trimStart('/').replace(".pnpm", "_pnpm")

            val assetPath = if (basePath != null) {
                Paths.get(basePath, normalized).toString()
            } else {
                normalized
            }

            val stream = context.assets.open(assetPath)
            val mime = guessMime(assetPath)
            WebResourceResponse(mime, "UTF-8", stream)

        } catch (e: IOException) {
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


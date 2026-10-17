package com.libnoname.noname

class FileSystemException(
    val code: String,
    val path: String,
    val detail: String,
) : Exception("$code: $path: $detail") {
    companion object {
        const val NOT_FOUND = "NOT_FOUND"
        const val ALREADY_EXISTS = "ALREADY_EXISTS"
        const val NOT_FILE = "NOT_FILE"
        const val NOT_DIRECTORY = "NOT_DIRECTORY"
        const val PERMISSION_DENIED = "PERMISSION_DENIED"
        const val INVALID_PATH = "INVALID_PATH"
        const val IO_ERROR = "IO_ERROR"
    }
}

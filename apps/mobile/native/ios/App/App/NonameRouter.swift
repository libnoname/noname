import Capacitor
import Foundation

/// 沙盒覆盖层（writable overlay）路由器。
///
/// 与安卓端 `JsAwareAssetsPathHandler` 等价的 iOS 实现：
/// 安卓通过 `WebViewAssetLoader` 拦截 `https://localhost/*` 的**所有**资源请求
/// （包括普通 `fetch`、`<script src>`、`<img src>` 等），先查 SAF 目录命中则返回
/// 用户文件，否则回退内置 assets。
///
/// iOS 侧 Capacitor 用的是 `WKURLSchemeHandler`（`WebViewAssetHandler`），它把请求
/// 交给 `Router.route(for:)`，并把**返回值直接当作磁盘绝对路径**去读取：
///
/// ```swift
/// // @capacitor/ios WebViewAssetHandler.swift
/// startPath = router.route(for: stringToLoad)
/// let fileUrl = URL(fileURLWithPath: startPath)
/// data = try Data(contentsOf: fileUrl)
/// ```
///
/// 因此只要在这里先查沙盒、命中时返回沙盒文件的绝对路径，就能让普通 fetch 请求
/// 也走可写覆盖层，从而支持从 Documents 目录加载扩展。
class NonameRouter: NSObject, Router {
    /// Capacitor 的内置资源根目录（`native/ios/App/App/public`）。
    var basePath: String = ""

    private lazy var documentsURL: URL? = {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
    }()

    func route(for path: String) -> String {
        let fallback = path.isEmpty || path == "/" ? basePath + "/index.html" : basePath + path
        guard let normalized = Self.normalize(path) else { return fallback }
        if let overlayURL = overlayFileURL(for: normalized) {
            return overlayURL.path
        }
        return fallback
    }

    private func overlayFileURL(for normalized: String) -> URL? {
        guard let documentsURL else { return nil }

        let candidate = documentsURL.appendingPathComponent(normalized)

        var isDirectory: ObjCBool = false
        guard FileManager.default.fileExists(atPath: candidate.path, isDirectory: &isDirectory),
              !isDirectory.boolValue else {
            return nil
        }

        return candidate
    }

    static func normalize(_ path: String) -> String? {
        let unified = path.replacingOccurrences(of: "\\", with: "/")
        let rawSegments = unified.split(separator: "/", omittingEmptySubsequences: true)

        var segments: [String] = []
        for raw in rawSegments {
            let segment = String(raw)
            if segment.isEmpty || segment == "." { continue }
            if segment == ".." { return nil }
            segments.append(segment)
        }

        return segments.joined(separator: "/")
    }
}

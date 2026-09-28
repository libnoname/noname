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
    /// Capacitor 的内置资源根目录（`ios/App/App/public`）。
    var basePath: String = ""

    /// 游戏用来存放可写数据的沙盒目录名，位于 App 的 Documents 下。
    /// 与 `apps/mobile/src/fs/ios.ts` 中的 `WRITABLE_ROOT` 保持一致。
    static let writableRoot = "noname"

    /// 是否启用沙盒覆盖层（仅 iOS 真机/模拟器构建启用；测试时可关闭）。
    var isOverlayEnabled = true

    private lazy var documentsURL: URL? = {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
    }()

    /// Capacitor 会传进来 URL 的 `path` 部分，例如 `/noname/entry.js`。
    /// 返回磁盘绝对路径：命中沙盒则返回沙盒路径，否则回退内置资源路径。
    func route(for path: String) -> String {
        // 与官方 CapacitorRouter 的语义严格对齐（必须逐字对齐，否则会加载失败）：
        //   - 无扩展名（含空路径 "/"）视为 SPA 路由，回退到 index.html；
        //   - 有扩展名则直接拼接 basePath。
        // 注意官方在无扩展名分支返回的是 `basePath + "/index.html"` 而不是
        // `basePath + path`，这里若照字面拼接会得到目录路径，
        // `Data(contentsOf:)` 读目录抛错 → 首页加载失败 → 黑屏。
        let pathURL = URL(fileURLWithPath: path)
        let fallback = pathURL.pathExtension.isEmpty ? basePath + "/index.html" : basePath + path

        guard isOverlayEnabled else { return fallback }

        // 只有带扩展名、看起来像静态资源的路径才尝试覆盖层查找。
        // 无扩展名的路径是 SPA 路由，官方实现会把它当作 index.html。
        guard !pathURL.pathExtension.isEmpty else { return fallback }

        guard let normalized = Self.normalize(path) else {
            // 归一化失败（例如包含 `..`）时直接使用内置资源，避免路径穿越。
            return fallback
        }

        if let overlayURL = overlayFileURL(for: normalized) {
            return overlayURL.path
        }

        // `pnpm` 的目录名在不同平台不一致：安卓打包时会把 `.pnpm` 改名为 `_pnpm`
        // （见 `apps/mobile/afterSync.ts` 的 `patchAndroidAssets`），iOS 的 `public/`
        // 则保持 `.pnpm` 原样。用户若从安卓侧拷来覆盖层文件，目录名会是 `_pnpm`，
        // 因此这里做一次兼容查找：先按原名找，未命中再按 `_pnpm` 找。
        if normalized.contains(".pnpm") {
            let compatNormalized = normalized.replacingOccurrences(of: ".pnpm", with: "_pnpm")
            if let compatURL = overlayFileURL(for: compatNormalized) {
                return compatURL.path
            }
        }

        return fallback
    }

    // MARK: - Private

    /// 拼接沙盒内对应的文件路径，并确认该文件确实存在、且是普通文件。
    private func overlayFileURL(for normalized: String) -> URL? {
        guard let documentsURL else { return nil }

        let candidate = documentsURL
            .appendingPathComponent(Self.writableRoot, isDirectory: true)
            .appendingPathComponent(normalized)

        var isDirectory: ObjCBool = false
        guard FileManager.default.fileExists(atPath: candidate.path, isDirectory: &isDirectory),
              !isDirectory.boolValue else {
            return nil
        }

        return candidate
    }

    /// 归一化 URL path：去掉首尾 `/`、过滤 `.` 空段，遇到 `..` 返回 nil。
    /// 与安卓 `SafOverlayStore.segments` 的行为一致。
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

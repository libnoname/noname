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

    /// 可写层相对 App `Documents/` 的根目录名。
    ///
    /// 取**空字符串**表示直接把 `Documents/` 当作游戏根目录，与
    /// `apps/mobile/src/fs/ios.ts` 的 `WRITABLE_ROOT`、以及安卓端
    /// 「用户选定目录自身即根目录」的语义保持一致。
    ///
    /// 好处：iOS「文件」App 暴露的正是 `Documents/`，玩家手动放进去的
    /// 素材（`image/character/...`）与扩展能被这一层直接读到。
    static let writableRoot = ""

    /// 是否启用沙盒覆盖层（仅 iOS 真机/模拟器构建启用；测试时可关闭）。
    var isOverlayEnabled = true

    private lazy var documentsURL: URL? = {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first
    }()

    /// Capacitor 会传进来 URL 的 `path` 部分，例如 `/noname/entry.js`。
    /// 返回磁盘绝对路径：命中沙盒则返回沙盒路径，否则回退内置资源路径。
    func route(for path: String) -> String {
        // 先剥掉查询串与锚点，再按路径定位文件。
        //
        // 「边玩边下」（apps/mobile/src/lazy-assets.ts）在补齐某个素材后，
        // 需要让 WebView 重新请求同一个文件——而把 `style.backgroundImage` /
        // `audio.src` 设成与之前完全相同的值属于空操作。因此那边会给 URL 追加
        // 一个 `?_lazy=<时间戳>` 后缀；这里统一丢弃，保证两种写法都指向同一个文件。
        // （Capacitor 不同版本传进来的可能是 `url.path` 也可能是含 query 的字符串，
        //  在本地剥一次就不必依赖它的实现细节。）
        let cleanedPath = Self.stripQuery(path)

        // 与官方 CapacitorRouter 的语义严格对齐（必须逐字对齐，否则会加载失败）：
        //   - 无扩展名（含空路径 "/"）视为 SPA 路由，回退到 index.html；
        //   - 有扩展名则直接拼接 basePath。
        // 注意官方在无扩展名分支返回的是 `basePath + "/index.html"` 而不是
        // `basePath + path`，这里若照字面拼接会得到目录路径，
        // `Data(contentsOf:)` 读目录抛错 → 首页加载失败 → 黑屏。
        let pathURL = URL(fileURLWithPath: cleanedPath)
        let fallback = pathURL.pathExtension.isEmpty ? basePath + "/index.html" : basePath + cleanedPath

        guard isOverlayEnabled else { return fallback }

        // 只有带扩展名、看起来像静态资源的路径才尝试覆盖层查找。
        // 无扩展名的路径是 SPA 路由，官方实现会把它当作 index.html。
        guard !pathURL.pathExtension.isEmpty else { return fallback }

        guard let normalized = Self.normalize(cleanedPath) else {
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

        // writableRoot 为空时，Documents 本身就是游戏根目录；
        // 此时不能再去 appendingPathComponent("")，否则会多出一层路径分隔符。
        let base = Self.writableRoot.isEmpty
            ? documentsURL
            : documentsURL.appendingPathComponent(Self.writableRoot, isDirectory: true)
        let candidate = base.appendingPathComponent(normalized)

        var isDirectory: ObjCBool = false
        guard FileManager.default.fileExists(atPath: candidate.path, isDirectory: &isDirectory),
              !isDirectory.boolValue else {
            return nil
        }

        return candidate
    }

    /// 剥掉 URL 里的查询串与锚点，只留下路径部分。
    ///
    /// 供「边玩边下」的缓存击穿后缀（`?v=<时间戳>`）使用：加了后缀才能让 WebView
    /// 重新请求同一个文件，而定位文件时又必须把它去掉。
    static func stripQuery(_ path: String) -> String {
        guard let index = path.firstIndex(where: { $0 == "?" || $0 == "#" }) else {
            return path
        }
        return String(path[path.startIndex..<index])
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

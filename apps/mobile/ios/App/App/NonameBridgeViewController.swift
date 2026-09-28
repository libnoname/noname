import Capacitor
import UIKit

/// 无名杀的 iOS 桥接 ViewController。
///
/// 继承自 Capacitor 的 `CAPBridgeViewController`，唯一的改动是重写 `router()`，
/// 返回我们的 `NonameRouter`，让 WebView 的资源请求（`capacitor://localhost/*`）
/// 先走沙盒覆盖层，再回退内置资源 —— 与安卓端 `MainActivity` 注册
/// `WebViewAssetLoader(JsAwarePathHandler)` 的效果等价。
///
/// 需要在 `Main.storyboard` 中把初始 ViewController 的 `customClass` 指向本类。
class NonameBridgeViewController: CAPBridgeViewController {
    private let nonameRouter = NonameRouter()

    override public func router() -> Router {
        return nonameRouter
    }
}

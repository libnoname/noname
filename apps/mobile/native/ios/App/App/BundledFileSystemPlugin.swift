import Capacitor
import Foundation

/// 直接查询 App 包内 public/，不依赖构建时生成的资源清单。
@objc(BundledFileSystemPlugin)
public class BundledFileSystemPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BundledFileSystemPlugin"
    public let jsName = "BundledFileSystem"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "stat", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readdir", returnType: CAPPluginReturnPromise)
    ]

    @objc func stat(_ call: CAPPluginCall) {
        do {
            let url = try resourceURL(call)
            do {
                let values = try url.resourceValues(forKeys: [.isDirectoryKey])
                call.resolve(["type": values.isDirectory == true ? "directory" : "file"])
            } catch let error as NSError where error.domain == NSCocoaErrorDomain &&
                (error.code == NSFileReadNoSuchFileError || error.code == NSFileNoSuchFileError) {
                call.resolve(["type": "none"])
            }
        } catch {
            call.reject(error.localizedDescription)
        }
    }

    @objc func readdir(_ call: CAPPluginCall) {
        do {
            let url = try resourceURL(call)
            let entries = try FileManager.default.contentsOfDirectory(
                at: url, includingPropertiesForKeys: [.isDirectoryKey]
            )
            var folders: [String] = []
            var files: [String] = []
            for entry in entries {
                let values = try entry.resourceValues(forKeys: [.isDirectoryKey])
                if values.isDirectory == true {
                    folders.append(entry.lastPathComponent)
                } else {
                    files.append(entry.lastPathComponent)
                }
            }
            call.resolve(["folders": folders.sorted(), "files": files.sorted()])
        } catch {
            call.reject(error.localizedDescription)
        }
    }

    private func resourceURL(_ call: CAPPluginCall) throws -> URL {
        guard let path = call.getString("path"),
              let normalized = NonameRouter.normalize(path),
              let resources = Bundle.main.resourceURL else {
            throw NSError(domain: "BundledFileSystem", code: 1,
                          userInfo: [NSLocalizedDescriptionKey: "无效的内置资源路径"])
        }
        let root = resources.appendingPathComponent("public", isDirectory: true).resolvingSymlinksInPath()
        let url = root.appendingPathComponent(normalized).resolvingSymlinksInPath()
        // 同时限制符号链接目标，避免查询 public/ 之外的路径。
        guard url.path == root.path || url.path.hasPrefix(root.path + "/") else {
            throw NSError(domain: "BundledFileSystem", code: 1,
                          userInfo: [NSLocalizedDescriptionKey: "内置资源路径越界"])
        }
        return url
    }
}

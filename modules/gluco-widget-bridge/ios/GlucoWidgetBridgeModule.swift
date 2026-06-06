import ExpoModulesCore
import WidgetKit

public class GlucoWidgetBridgeModule: Module {
  private static let appGroupId = "group.com.mistergooddeal.glucoscan"
  private static let snapshotKey = "widgetDataSnapshot"

  public func definition() -> ModuleDefinition {
    Name("GlucoWidgetBridge")

    AsyncFunction("saveSnapshot") { (json: String) in
      guard let defaults = UserDefaults(suiteName: Self.appGroupId) else { return }
      defaults.set(json, forKey: Self.snapshotKey)
    }

    AsyncFunction("loadSnapshot") { () -> String? in
      guard let defaults = UserDefaults(suiteName: Self.appGroupId) else { return nil }
      return defaults.string(forKey: Self.snapshotKey)
    }

    AsyncFunction("reloadWidget") { () in
      WidgetCenter.shared.reloadTimelines(ofKind: "GlucoScanCarbWidget")
      WidgetCenter.shared.reloadTimelines(ofKind: "CarbWidget")
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
}

import Foundation

enum WidgetStorage {
    static let appGroupId = "group.com.mistergooddeal.glucoscan"
    static let snapshotKey = "widgetDataSnapshot"

    static func load() -> WidgetData {
        guard
            let defaults = UserDefaults(suiteName: appGroupId),
            let json = defaults.string(forKey: snapshotKey),
            let data = json.data(using: .utf8),
            let snapshot = try? JSONDecoder().decode(WidgetData.self, from: data)
        else {
            return .empty
        }

        return snapshot
    }

    static func save(json: String) {
        guard let defaults = UserDefaults(suiteName: appGroupId) else { return }
        defaults.set(json, forKey: snapshotKey)
    }
}

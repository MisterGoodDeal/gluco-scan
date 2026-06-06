import WidgetKit
import SwiftUI

enum CarbWidgetKind {
    static let identifier = "GlucoScanCarbWidget"
}

struct CarbWidgetEntry: TimelineEntry {
    let date: Date
    let data: WidgetData
    let family: WidgetFamily
}

struct CarbWidgetProvider: TimelineProvider {
    func placeholder(in context: Context) -> CarbWidgetEntry {
        CarbWidgetEntry(date: Date(), data: .empty, family: context.family)
    }

    func getSnapshot(in context: Context, completion: @escaping (CarbWidgetEntry) -> Void) {
        completion(
            CarbWidgetEntry(
                date: Date(),
                data: WidgetStorage.load(),
                family: context.family
            )
        )
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<CarbWidgetEntry>) -> Void) {
        let entry = CarbWidgetEntry(
            date: Date(),
            data: WidgetStorage.load(),
            family: context.family
        )
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 30, to: Date())
            ?? Date().addingTimeInterval(1800)
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }
}

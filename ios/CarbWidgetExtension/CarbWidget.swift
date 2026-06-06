import WidgetKit
import SwiftUI

private struct CarbWidgetEntryView: View {
    let entry: CarbWidgetEntry

    var body: some View {
        let content = Group {
            if #available(iOS 17.0, *) {
                CarbWidgetView(entry: entry)
                    .containerBackground(for: .widget) {
                        Color(.systemBackground)
                    }
            } else {
                CarbWidgetView(entry: entry)
                    .padding()
                    .background(Color(.systemBackground))
            }
        }

        if entry.family == .systemMedium {
            content.widgetURL(URL(string: "glucoscan://statistics")!)
        } else {
            content
        }
    }
}

struct CarbWidget: Widget {
    let kind: String = CarbWidgetKind.identifier

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: CarbWidgetProvider()) { entry in
            CarbWidgetEntryView(entry: entry)
        }
        .configurationDisplayName(WidgetL10n.displayName)
        .description(WidgetL10n.description)
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

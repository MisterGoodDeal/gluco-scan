import SwiftUI
import WidgetKit

private enum HeatmapPalette {
    static let columns = 16
    static let rows = 7
    static let spacing: CGFloat = 3
    static let cellRadiusRatio: CGFloat = 0.24

    static func colors(for colorScheme: ColorScheme) -> [Color] {
        if colorScheme == .dark {
            return [
                Color(hex: 0x1A2030),
                Color(hex: 0x0F3D2E),
                Color(hex: 0x136B3A),
                Color(hex: 0x22A055),
                Color(hex: 0x3DDC84),
            ]
        }

        return [
            Color(hex: 0xE2E8F0),
            Color(hex: 0xDCFCE7),
            Color(hex: 0x86EFAC),
            Color(hex: 0x22C55E),
            Color(hex: 0x15803D),
        ]
    }

    static func maxCarbs(in days: [WidgetHeatmapDay]) -> Double {
        days.reduce(0) { max($0, $1.carbs) }
    }

    static func level(for carbs: Double, maxCarbs: Double) -> Int {
        if carbs <= 0 { return 0 }
        if maxCarbs <= 0 { return 1 }

        let ratio = carbs / maxCarbs
        if ratio <= 0.25 { return 1 }
        if ratio <= 0.5 { return 2 }
        if ratio <= 0.75 { return 3 }
        return 4
    }
}

struct HeatmapGridView: View {
    @Environment(\.colorScheme) private var colorScheme

    let days: [WidgetHeatmapDay]

    var body: some View {
        let palette = HeatmapPalette.colors(for: colorScheme)
        let visibleDays = Array(days.suffix(HeatmapPalette.columns * HeatmapPalette.rows))
        let maxCarbs = HeatmapPalette.maxCarbs(in: visibleDays)
        let columns = HeatmapPalette.columns
        let rows = HeatmapPalette.rows
        let spacing = HeatmapPalette.spacing

        GeometryReader { geometry in
            let cellWidth = max(
                2,
                (geometry.size.width - spacing * CGFloat(columns - 1)) / CGFloat(columns)
            )
            let cornerRadius = max(1, cellWidth * HeatmapPalette.cellRadiusRatio)

            HStack(alignment: .top, spacing: spacing) {
                ForEach(0..<columns, id: \.self) { column in
                    VStack(spacing: spacing) {
                        ForEach(0..<rows, id: \.self) { row in
                            let index = column * rows + row
                            RoundedRectangle(cornerRadius: cornerRadius)
                                .fill(palette[heatmapLevel(at: index, in: visibleDays, maxCarbs: maxCarbs)])
                                .frame(height: cellWidth)
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
    }

    private func heatmapLevel(at index: Int, in visibleDays: [WidgetHeatmapDay], maxCarbs: Double) -> Int {
        guard index < visibleDays.count else { return 0 }
        return HeatmapPalette.level(for: visibleDays[index].carbs, maxCarbs: maxCarbs)
    }
}

struct CarbWidgetView: View {
    let entry: CarbWidgetEntry

    private var data: WidgetData { entry.data }

    var body: some View {
        Group {
            switch entry.family {
            case .systemSmall:
                smallContent
            case .systemMedium:
                HeatmapGridView(days: data.heatmap)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            default:
                EmptyView()
            }
        }
        .padding(entry.family == .systemSmall ? 12 : 0)
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private var smallContent: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(formatGrams(data.summary.todayCarbs))
                .font(.title2.weight(.semibold))
                .lineLimit(1)
                .minimumScaleFactor(0.8)

            Spacer(minLength: 0)

            VStack(spacing: 8) {
                widgetActionLink(
                    title: WidgetL10n.addFood,
                    systemImage: "plus",
                    url: "glucoscan://products/add"
                )
                widgetActionLink(
                    title: WidgetL10n.addMeal,
                    systemImage: "plus",
                    url: "glucoscan://meal/create"
                )
            }
        }
    }

    private func widgetActionLink(title: String, systemImage: String, url: String) -> some View {
        Link(destination: URL(string: url)!) {
            HStack(spacing: 6) {
                Image(systemName: systemImage)
                    .font(.caption2.weight(.semibold))
                Text(title)
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.85)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.horizontal, 10)
            .padding(.vertical, 8)
            .background(Color(.secondarySystemFill))
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
    }

    private func formatGrams(_ value: Double) -> String {
        if value.truncatingRemainder(dividingBy: 1) == 0 {
            return "\(Int(value))g"
        }
        return String(format: "%.1fg", value)
    }
}

private extension Color {
    init(hex: UInt32) {
        let red = Double((hex >> 16) & 0xFF) / 255.0
        let green = Double((hex >> 8) & 0xFF) / 255.0
        let blue = Double(hex & 0xFF) / 255.0
        self.init(red: red, green: green, blue: blue)
    }
}

#if DEBUG
struct CarbWidgetView_Previews: PreviewProvider {
    static var previews: some View {
        let empty = WidgetData.empty
        let sample = WidgetData(
            summary: WidgetSummary(
                todayCarbs: 72,
                weekAverageCarbs: 58,
                monthAverageCarbs: 61,
                maxDayCarbs: 120,
                totalMealsToday: 3,
                lastUpdate: ISO8601DateFormatter().string(from: Date())
            ),
            heatmap: (0..<112).map { index in
                WidgetHeatmapDay(date: "2026-01-\((index % 28) + 1)", carbs: Double((index * 7) % 130))
            }
        )

        Group {
            CarbWidgetView(entry: CarbWidgetEntry(date: .now, data: empty, family: .systemSmall))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small empty")

            CarbWidgetView(entry: CarbWidgetEntry(date: .now, data: sample, family: .systemSmall))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
                .previewDisplayName("Small usage")

            CarbWidgetView(entry: CarbWidgetEntry(date: .now, data: sample, family: .systemMedium))
                .previewContext(WidgetPreviewContext(family: .systemMedium))
                .previewDisplayName("Medium heatmap")
        }
    }
}
#endif

import Foundation

struct WidgetHeatmapDay: Codable {
    let date: String
    let carbs: Double
}

struct WidgetSummary: Codable {
    let todayCarbs: Double
    let weekAverageCarbs: Double
    let monthAverageCarbs: Double
    let maxDayCarbs: Double
    let totalMealsToday: Int
    let lastUpdate: String
}

struct WidgetData: Codable {
    let summary: WidgetSummary
    let heatmap: [WidgetHeatmapDay]
}

extension WidgetData {
    static let empty = WidgetData(
        summary: WidgetSummary(
            todayCarbs: 0,
            weekAverageCarbs: 0,
            monthAverageCarbs: 0,
            maxDayCarbs: 0,
            totalMealsToday: 0,
            lastUpdate: ""
        ),
        heatmap: []
    )

    var hasData: Bool {
        summary.totalMealsToday > 0 || heatmap.contains(where: { $0.carbs > 0 })
    }
}

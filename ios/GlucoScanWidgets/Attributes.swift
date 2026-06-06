import ActivityKit
import WidgetKit
import SwiftUI

struct CarbLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var placeholder: String
    }

    var title: String
}

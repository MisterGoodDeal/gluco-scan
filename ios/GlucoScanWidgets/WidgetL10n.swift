import Foundation

enum WidgetL10n {
    private static var isFrench: Bool {
        Locale.preferredLanguages.first?.hasPrefix("fr") == true
    }

    static var addFood: String {
        localized(french: "Nouvel aliment", english: "Add food")
    }

    static var addMeal: String {
        localized(french: "Nouveau repas", english: "Add meal")
    }

    static var displayName: String {
        localized(french: "Calendrier glucides", english: "Carbohydrate Calendar")
    }

    static var description: String {
        localized(
            french: "Suivez votre consommation quotidienne de glucides.",
            english: "Track your daily carbohydrate intake at a glance."
        )
    }

    private static func localized(french: String, english: String) -> String {
        isFrench ? french : english
    }
}

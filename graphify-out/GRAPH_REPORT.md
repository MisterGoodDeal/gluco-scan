# Graph Report - gluco-scan  (2026-08-19)

## Corpus Check
- 331 files · ~254,314 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1612 nodes · 4262 edges · 126 communities (80 shown, 46 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.71)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `87ae6698`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- statisticsCompute.service.ts
- productImage.service.ts
- preferences.store.ts
- openFoodFacts.service.ts
- MealCreateLayout.tsx
- import-export.service.ts
- ProductFormSheet.tsx
- expo
- ProductTag
- useBlurSettings
- scripts
- ProductsTabLayout.tsx
- MealDetailSheet.tsx
- TutorialOverlay.tsx
- ProductSpotlightSearch.tsx
- dependencies
- MealsTabLayout.tsx
- meal.store.ts
- getCookingFactor.ts
- CompositionsTabLayout.tsx
- StatisticsHomeScreen.tsx
- WidgetKit
- .application
- meal.repository.ts
- SettingsTabLayout.tsx
- formatDecimal
- CarbWidget
- carbs.ts
- HorizontalBarChart.tsx
- product.ts
- i18n/index.ts
- chartUtils.ts
- CarbWidgetView
- sync-versions.mjs
- client.ts
- AppSelect.tsx
- devDependencies
- HeatmapGridView
- HeatmapGridView
- MealTimeWheelPicker.tsx
- CarbWidgetEntry
- include
- useTutorialStore
- MealItemConversionLine.tsx
- CarbWidgetEntry
- ContributionHeatmap/index.tsx
- generate-tutorial-gs.mjs
- ProgressSteps.tsx
- TabBarHeightReporter.tsx
- MainActivity
- Codable
- ReactNativeWidgetExtensionModule
- package.json
- constants/tutorial.ts
- Foundation
- WidgetL10n
- CarbWidgetView
- WidgetL10n
- WidgetSummary
- reset-project.js
- CarbLiveActivityAttributes
- MainApplication
- Welcome to your Expo app 👋
- expo-router
- WidgetStorage
- TutorialCollapsibleShell.tsx
- gluco-widget-bridge/package.json
- isValidEan
- utils/mealType.ts
- gradlew
- metro.config.js
- TutorialAnchor.tsx
- uniwind-types.d.ts
- react
- bump-version.mjs
- AGENTS.md
- expo-blur
- expo-camera
- expo-device
- expo-file-system
- expo-font
- expo-glass-effect
- @expo-google-fonts/instrument-sans
- expo-haptics
- expo-image
- expo-image-manipulator
- expo-image-picker
- expo-linking
- expo-localization
- expo-router
- expo-sqlite
- expo-status-bar
- expo-system-ui
- @expo/ui
- expo-web-browser
- fflate
- gluco-widget-bridge
- heroui-native
- lucide-react-native
- gluco-widget-bridge/index.ts
- expo-mlkit-ocr
- react-dom
- react-native-gesture-handler
- react-native-mmkv
- react-native-progress-steps
- react-native-reanimated
- react-native-responsive-screen
- react-native-safe-area-context
- react-native-screens
- react-native-svg
- react-native-ui-datepicker
- react-native-web
- react-native-widget-extension
- react-native-worklets
- tailwind-merge
- tailwindcss
- uniwind
- zustand
- git-push-version.mjs
- css.d.ts

## God Nodes (most connected - your core abstractions)
1. `formatDecimal()` - 47 edges
2. `ProductTag` - 40 edges
3. `scripts` - 35 edges
4. `AppButton` - 30 edges
5. `Product` - 28 edges
6. `filterMealsByPeriod()` - 27 edges
7. `ProductFormSheet()` - 26 edges
8. `useTutorialStore` - 26 edges
9. `triggerImpactLight()` - 26 edges
10. `EnrichedMealRecord` - 25 edges

## Surprising Connections (you probably didn't know these)
- `.body` --calls--> `CarbWidgetView`  [INFERRED]
  ios/GlucoScanWidgets/CarbWidget.swift → ios/GlucoScanWidgets/CarbWidgetView.swift
- `.body` --calls--> `CarbWidgetView`  [INFERRED]
  ios/CarbWidgetExtension/CarbWidget.swift → ios/CarbWidgetExtension/CarbWidgetView.swift
- `.body` --calls--> `CarbWidget`  [INFERRED]
  ios/CarbWidgetExtension/CarbWidgetBundle.swift → ios/CarbWidgetExtension/CarbWidget.swift
- `.previews` --calls--> `WidgetSummary`  [INFERRED]
  ios/CarbWidgetExtension/CarbWidgetView.swift → ios/CarbWidgetExtension/WidgetModels.swift
- `.body` --calls--> `CarbWidget`  [INFERRED]
  ios/GlucoScanWidgets/CarbWidgetBundle.swift → ios/GlucoScanWidgets/CarbWidget.swift

## Import Cycles
- None detected.

## Communities (126 total, 46 thin omitted)

### Community 0 - "statisticsCompute.service.ts"
Cohesion: 0.06
Nodes (80): MealsDayPager(), MealsDayPagerProps, MealsTabLayout(), day(), today, TUTORIAL_PAYLOAD, StatisticsPeriodSelectorProps, useMealStatistics() (+72 more)

### Community 1 - "productImage.service.ts"
Cohesion: 0.06
Nodes (60): CompositionImageMosaicProps, PRODUCT_IMAGE_THUMB_RADIUS, ProductImage(), ProductImageProps, MealItemThumbnails(), MealItemThumbnailsProps, ProductRow(), ProductRowProps (+52 more)

### Community 2 - "preferences.store.ts"
Cohesion: 0.06
Nodes (53): EditingBoundary, EditingField, getBoundaryTime(), MealTypeScheduleSettings(), OPTIONS, ThemePreferencePicker(), UnitSystemPicker(), AppThemeProvider() (+45 more)

### Community 3 - "openFoodFacts.service.ts"
Cohesion: 0.07
Nodes (50): DEFAULT_GRAMS, OFF_BASE_URL, OFF_RATE_LIMIT, OFF_RATE_WINDOW_MS, OFF_SEARCH_BASE_URL, OFF_SEARCH_DEBOUNCE_MS, OFF_SEARCH_MIN_QUERY_LENGTH, OFF_SEARCH_PAGE_SIZE (+42 more)

### Community 4 - "MealCreateLayout.tsx"
Cohesion: 0.08
Nodes (29): BackgroundGradient(), GRADIENTS, styles, MealItemConversionLine(), ProductSpotlightSearch(), getUnitTabValue(), QuantityPickerConfirm, QuantityPickerModal() (+21 more)

### Community 5 - "import-export.service.ts"
Cohesion: 0.12
Nodes (40): exportToGsFile(), buildExportPayload(), clearUserDataTables(), deserializePayload(), ensureSystemProducts(), EXPORT_VERSION, importCookingConversions(), importFromGsBytes() (+32 more)

### Community 6 - "ProductFormSheet.tsx"
Cohesion: 0.13
Nodes (30): InputNumber(), InputNumberProps, SearchInput(), SearchInputProps, SearchInputVariant, EanScanField(), EanScanFieldProps, ProductEanListEditor() (+22 more)

### Community 7 - "expo"
Cohesion: 0.05
Nodes (41): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+33 more)

### Community 8 - "ProductTag"
Cohesion: 0.13
Nodes (27): TagIcon(), TagIconProps, ProductNameInlineTags(), ProductNameInlineTagsProps, ProductTagFilterBar(), ProductTagFilterBarProps, ProductTagPicker(), ProductTagPickerProps (+19 more)

### Community 9 - "useBlurSettings"
Cohesion: 0.07
Nodes (23): hapticTabListeners, unstable_settings, GlassPanel(), GlassPanelProps, TabBarIcon(), TabBarIconProps, TabBarBackground(), BlurScreenFooter() (+15 more)

### Community 10 - "scripts"
Cohesion: 0.06
Nodes (35): scripts, android, build:all, build:android, build:ios, bump-version, generate:tutorial-gs, git:push (+27 more)

### Community 11 - "ProductsTabLayout.tsx"
Cohesion: 0.11
Nodes (24): ButtonIconProps, ProductsTabLayout(), AppButton, AppButtonLabel, AppButtonProps, ButtonProps, AppChip, AppChipProps (+16 more)

### Community 12 - "MealDetailSheet.tsx"
Cohesion: 0.15
Nodes (24): DayMealsView(), DayMealsViewProps, dateKeyFromPicker(), MealCalendarDay(), MealCalendarDayProps, MealCalendarPicker(), MealCalendarPickerProps, MealDetailSheet() (+16 more)

### Community 13 - "TutorialOverlay.tsx"
Cohesion: 0.14
Nodes (22): TutorialSpotlightDim(), TutorialSpotlightDimProps, dimStyle, styles, TutorialOverlay(), MEALS_DATE_PICKER_SNAP_RATIO, useTutorialCardTopInset(), buildMealDetailSheetSpotlightHole() (+14 more)

### Community 14 - "ProductSpotlightSearch.tsx"
Cohesion: 0.11
Nodes (20): ButtonIcon(), CompositionImageMosaic(), FaIcon(), FaIconProps, CompositionRowProps, OffSearchResultRow(), OffSearchResultRowProps, ProductOffSearchSheet() (+12 more)

### Community 15 - "dependencies"
Cohesion: 0.07
Nodes (27): expo-constants, expo-document-picker, expo-linear-gradient, expo-sharing, expo-splash-screen, @gorhom/bottom-sheet, i18next, dependencies (+19 more)

### Community 16 - "MealsTabLayout.tsx"
Cohesion: 0.14
Nodes (16): DOT_OFFSETS, MealsDayScrollIndicator(), MealsDayScrollIndicatorProps, styles, TutorialStepCard(), TutorialStepCardProps, MealDatePickerSheet(), MealDatePickerSheetProps (+8 more)

### Community 17 - "meal.store.ts"
Cohesion: 0.13
Nodes (18): CompositionsTabLayout(), CompositionItemRow, compositionRepository, CompositionRow, CreateCompositionInput, loadComposition(), mapItemRow(), mealRepository (+10 more)

### Community 18 - "getCookingFactor.ts"
Cohesion: 0.18
Nodes (17): DEFAULT_COOKING_CONVERSIONS, formatCarbs(), OcrLabelReviewSheet(), buildOcrCookingTags(), convertCookedCarbsPer100gToRaw(), OCR_COOKING_TYPE_TAGS, MealDetailStats, selectMealDetailStats() (+9 more)

### Community 19 - "CompositionsTabLayout.tsx"
Cohesion: 0.16
Nodes (14): CompositionRow(), BlurScreenHeader(), BlurScreenHeaderProps, estimateBlurHeaderHeight(), CompositionList(), CompositionListProps, ProductList(), ProductListProps (+6 more)

### Community 20 - "StatisticsHomeScreen.tsx"
Cohesion: 0.13
Nodes (19): ScrollReveal(), ScrollRevealActiveContext, ScrollRevealProps, ScrollRevealContext, ScrollRevealContextValue, ScrollRevealProvider(), ScrollRevealProviderProps, useScrollRevealContext() (+11 more)

### Community 21 - "WidgetKit"
Cohesion: 0.14
Nodes (9): ActivityKit, CarbWidgetKind, Color, UInt32, CarbWidgetKind, Color, UInt32, SwiftUI (+1 more)

### Community 22 - ".application"
Cohesion: 0.12
Nodes (17): Any, expo, ExpoAppDelegate, ExpoReactNativeFactoryDelegate, AppDelegate, ReactNativeDelegate, Bool, Void (+9 more)

### Community 23 - "meal.repository.ts"
Cohesion: 0.16
Nodes (14): getDatabase(), globalUnitRepository, GlobalUnitRow, CreateMealInput, loadMealWithItems(), mapMealItemRow(), MealItemRow, MealRow (+6 more)

### Community 24 - "SettingsTabLayout.tsx"
Cohesion: 0.17
Nodes (11): CookingConversionSettings(), SectionItemProps, SettingsTabLayout(), APP_VERSION, useMassDisplay(), getLanguageLabelKey(), useCookingConversionStore, defaultDisplayMassQuantity() (+3 more)

### Community 25 - "formatDecimal"
Cohesion: 0.18
Nodes (12): CountUpText(), CountUpTextProps, CarbValue(), CarbValueProps, MealStatisticsSection(), toEnrichedMeal(), StatisticsSummaryCards(), StatisticsSummaryCardsProps (+4 more)

### Community 26 - "CarbWidget"
Cohesion: 0.12
Nodes (18): CarbWidget, String, WidgetConfiguration, CarbWidgetBundle, .body, Widget, CarbWidget, .body (+10 more)

### Community 27 - "carbs.ts"
Cohesion: 0.20
Nodes (15): backfillLegacyMealItems(), GlobalUnitRow, LegacyMealItemRow, mapProduct(), ProductRow, ProductUnitRow, computeCarbs(), computeItemCarbs() (+7 more)

### Community 28 - "HorizontalBarChart.tsx"
Cohesion: 0.20
Nodes (14): ChartScrollTrack(), ChartScrollTrackProps, getMaxValue(), MAX_VISIBLE_BAR_CHART_BARS, HorizontalBarChart(), HorizontalBarChartPoint, HorizontalBarChartProps, ChartScrollTrackMetrics (+6 more)

### Community 29 - "product.ts"
Cohesion: 0.18
Nodes (8): MealStatisticsSectionProps, ProductStore, readCompactList(), storage, Product, ProductUnit, LegacyExportProduct, normalizeForSearch()

### Community 30 - "i18n/index.ts"
Cohesion: 0.19
Nodes (11): CarbInputGroup(), CarbInputGroupProps, isValidPartialDecimal(), parseGramsInput(), CustomTypeOptions, i18next, getDecimalSeparator(), getSortLocale() (+3 more)

### Community 31 - "chartUtils.ts"
Cohesion: 0.19
Nodes (13): CHART_COLORS, describeDonutSlice(), getChartColor(), getChartLabelStep(), getChartMaxValue(), polarToCartesian(), shouldShowChartLabel(), LineChart() (+5 more)

### Community 32 - "CarbWidgetView"
Cohesion: 0.20
Nodes (14): CarbWidgetEntryView, .body, CarbWidgetEntry, CarbWidgetView, .data, CarbWidgetView_Previews, .previews, .smallContent (+6 more)

### Community 33 - "sync-versions.mjs"
Cohesion: 0.12
Nodes (15): androidCodeMatch, androidNameMatch, androidVersionCode, appJson, appJsonPath, buildGradle, buildGradlePath, iosBuildMatch (+7 more)

### Community 34 - "client.ts"
Cohesion: 0.23
Nodes (10): DatabaseGate(), DatabaseGateProps, initDatabase(), WidgetBootstrap(), getRouteKey(), handleWidgetDeepLink(), ROUTES, subscribeWidgetDeepLinks() (+2 more)

### Community 35 - "AppSelect.tsx"
Cohesion: 0.18
Nodes (12): APP_SELECT_DIALOG_ICON_BUTTON_CLASS, AppSelect(), AppSelectBaseProps, AppSelectMultipleProps, AppSelectOption, AppSelectProps, AppSelectSingleProps, AppSelectTriggerVariant (+4 more)

### Community 36 - "devDependencies"
Cohesion: 0.13
Nodes (15): expo-build-properties, devDependencies, expo-build-properties, prettier, react-native-cli-bump-version, @react-native-community/cli, @types/react, typescript (+7 more)

### Community 37 - "HeatmapGridView"
Cohesion: 0.23
Nodes (10): .body, HeatmapGridView, .body, HeatmapPalette, CGFloat, Color, ColorScheme, Double (+2 more)

### Community 38 - "HeatmapGridView"
Cohesion: 0.23
Nodes (10): .body, HeatmapGridView, .body, HeatmapPalette, CGFloat, Color, ColorScheme, Double (+2 more)

### Community 39 - "MealTimeWheelPicker.tsx"
Cohesion: 0.20
Nodes (12): MealTimePickerSheet(), MealTimePickerSheetProps, HOURS_12, HOURS_24, MealTimeWheelPicker(), MealTimeWheelPickerProps, MINUTES, pad() (+4 more)

### Community 40 - "CarbWidgetEntry"
Cohesion: 0.22
Nodes (10): .body, CarbWidgetEntry, CarbWidgetProvider, Context, Date, Timeline, Void, WidgetData (+2 more)

### Community 41 - "include"
Cohesion: 0.15
Nodes (12): ./assets/*, expo-env.d.ts, expo/tsconfig.base, .expo/types/**/*.ts, **/*.ts, **/*.tsx, compilerOptions, paths (+4 more)

### Community 42 - "useTutorialStore"
Cohesion: 0.26
Nodes (7): TutorialWelcomeModal(), TutorialHost(), TutorialHostProps, styles, TutorialOverlayLayer(), TutorialOverlayLayerProps, useTutorialStore

### Community 43 - "MealItemConversionLine.tsx"
Cohesion: 0.31
Nodes (8): MealItemConversionLineProps, MealItem, MealItemQuantityType, MealItemUnitType, convertRawToCooked(), formatMealItemConversion(), FormatMealItemConversionParams, formatMealItemQuantity()

### Community 44 - "CarbWidgetEntry"
Cohesion: 0.24
Nodes (9): CarbWidgetEntry, CarbWidgetProvider, Context, Date, Timeline, Void, WidgetData, WidgetFamily (+1 more)

### Community 45 - "ContributionHeatmap/index.tsx"
Cohesion: 0.32
Nodes (10): buildGridColumns(), ContributionHeatmap(), ContributionHeatmapProps, getCellRadius(), getHeatmapLevel(), getHeatmapLevelColors(), getHeatmapMaxCarbs(), HEATMAP_GRID_COLUMNS (+2 more)

### Community 46 - "generate-tutorial-gs.mjs"
Cohesion: 0.22
Nodes (9): addDays(), base, compressed, data, outPath, pad(), payloadPath, root (+1 more)

### Community 47 - "ProgressSteps.tsx"
Cohesion: 0.24
Nodes (7): AppProgressStepsProps, ProgressStepperBar(), ProgressStepperBarProps, styles, StepIcon(), styles, FONT_FAMILY

### Community 48 - "TabBarHeightReporter.tsx"
Cohesion: 0.25
Nodes (7): TabBarHeightReporter(), TutorialInlineBanner(), TutorialMealCreateBanner(), TutorialMealCreateBannerProps, useTutorialCardBottomInset(), TabBarLayoutState, useTabBarLayoutStore

### Community 49 - "MainActivity"
Cohesion: 0.31
Nodes (5): MainActivity, DefaultReactActivityDelegate, Bundle, ReactActivity, ReactActivityDelegate

### Community 50 - "Codable"
Cohesion: 0.33
Nodes (9): Codable, Bool, Double, Int, String, WidgetData, .hasData, WidgetHeatmapDay (+1 more)

### Community 51 - "ReactNativeWidgetExtensionModule"
Cohesion: 0.22
Nodes (6): ExpoModulesCore, ReactNativeWidgetExtensionModule, ModuleDefinition, Module, GlucoWidgetBridgeModule, ModuleDefinition

### Community 52 - "package.json"
Cohesion: 0.20
Nodes (9): exclude, nativeModulesDir, expo, autolinking, main, name, private, version (+1 more)

### Community 53 - "constants/tutorial.ts"
Cohesion: 0.20
Nodes (9): TUTORIAL_BACKUP_FILENAME, TUTORIAL_FEATURED_PRODUCT_ID, TUTORIAL_KEYS, TUTORIAL_MEALS_ADD_ANCHOR_ID, TUTORIAL_MEALS_DAY_NAV_ANCHOR_ID, TUTORIAL_MEALS_SAVED_MEAL_ANCHOR_ID, TUTORIAL_MMKV_ID, TUTORIAL_PRODUCTS_ADD_ANCHOR_ID (+1 more)

### Community 54 - "Foundation"
Cohesion: 0.22
Nodes (4): Foundation, String, WidgetData, WidgetStorage

### Community 55 - "WidgetL10n"
Cohesion: 0.36
Nodes (8): Bool, String, WidgetL10n, .addFood, .addMeal, .description, .displayName, .isFrench

### Community 56 - "CarbWidgetView"
Cohesion: 0.36
Nodes (7): CarbWidgetView, .data, .previews, .smallContent, CarbWidgetEntry, String, WidgetData

### Community 57 - "WidgetL10n"
Cohesion: 0.36
Nodes (8): Bool, String, WidgetL10n, .addFood, .addMeal, .description, .displayName, .isFrench

### Community 58 - "WidgetSummary"
Cohesion: 0.33
Nodes (8): Bool, Double, Int, String, WidgetData, .hasData, WidgetHeatmapDay, WidgetSummary

### Community 59 - "reset-project.js"
Cohesion: 0.22
Nodes (7): exampleDirPath, fs, oldDirs, path, readline, rl, root

### Community 60 - "CarbLiveActivityAttributes"
Cohesion: 0.36
Nodes (8): ActivityAttributes, Hashable, CarbLiveActivityAttributes, ContentState, String, CarbLiveActivityAttributes, ContentState, String

### Community 61 - "MainApplication"
Cohesion: 0.39
Nodes (5): MainApplication, Application, Configuration, ReactApplication, ReactHost

### Community 62 - "Welcome to your Expo app 👋"
Cohesion: 0.29
Nodes (6): Get a fresh project, Get started, Join the community, Learn more, Other setup steps, Welcome to your Expo app 👋

### Community 63 - "expo-router"
Cohesion: 0.33
Nodes (4): expo-router, dismissMealCreateIfOpen(), navigateToTutorialStep(), resetTutorialNavigation()

### Community 64 - "WidgetStorage"
Cohesion: 0.33
Nodes (3): String, WidgetData, WidgetStorage

### Community 65 - "TutorialCollapsibleShell.tsx"
Cohesion: 0.33
Nodes (5): HIDE_EASING, SHOW_EASING, styles, TutorialCollapsibleShell(), TutorialCollapsibleShellProps

### Community 66 - "gluco-widget-bridge/package.json"
Cohesion: 0.40
Nodes (4): main, name, types, version

### Community 67 - "isValidEan"
Cohesion: 0.60
Nodes (4): getMmkv(), LegacyProduct, migrateFromMmkvIfNeeded(), isValidEan()

### Community 68 - "utils/mealType.ts"
Cohesion: 0.70
Nodes (4): inferMealTypeFromTime(), isInRange(), MealTypeLabelKey, toMinutes()

### Community 69 - "gradlew"
Cohesion: 0.83
Nodes (3): gradlew script, die(), warn()

### Community 70 - "metro.config.js"
Cohesion: 0.50
Nodes (3): config, { getDefaultConfig }, { withUniwindConfig }

### Community 71 - "TutorialAnchor.tsx"
Cohesion: 0.67
Nodes (3): TutorialAnchor(), TutorialAnchorProps, registerTutorialAnchor()

### Community 72 - "uniwind-types.d.ts"
Cohesion: 0.50
Nodes (3): NOTE: This file is generated by uniwind and it should not be edited manually., uniwind, UniwindConfig

### Community 73 - "react"
Cohesion: 0.67
Nodes (3): react, react, ProgressSteps()

## Knowledge Gaps
- **405 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+400 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `dependencies`?**
  _High betweenness centrality (0.180) - this node is a cross-community bridge._
- **Why does `ProgressSteps()` connect `react` to `MealCreateLayout.tsx`, `ProgressSteps.tsx`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `.application`, `package.json`, `react`, `expo-blur`, `expo-camera`, `expo-device`, `expo-file-system`, `expo-font`, `expo-glass-effect`, `@expo-google-fonts/instrument-sans`, `expo-haptics`, `expo-image`, `expo-image-manipulator`, `expo-image-picker`, `expo-linking`, `expo-localization`, `expo-router`, `expo-sqlite`, `expo-status-bar`, `expo-system-ui`, `@expo/ui`, `expo-web-browser`, `fflate`, `gluco-widget-bridge`, `heroui-native`, `lucide-react-native`, `expo-mlkit-ocr`, `react-dom`, `react-native-gesture-handler`, `react-native-mmkv`, `react-native-progress-steps`, `react-native-reanimated`, `react-native-responsive-screen`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-ui-datepicker`, `react-native-web`, `react-native-widget-extension`, `react-native-worklets`, `tailwind-merge`, `tailwindcss`, `uniwind`, `zustand`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _405 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `statisticsCompute.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05791026238161776 - nodes in this community are weakly interconnected._
- **Should `productImage.service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06486486486486487 - nodes in this community are weakly interconnected._
- **Should `preferences.store.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05765765765765766 - nodes in this community are weakly interconnected._
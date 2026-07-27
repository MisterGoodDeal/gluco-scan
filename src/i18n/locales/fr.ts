export type TranslationSchema = {
  tabs: {
    products: string;
    meals: string;
    statistics: string;
    settings: string;
  };
  common: {
    back: string;
    backA11y: string;
    cancel: string;
    save: string;
    reset: string;
    add: string;
    authorize: string;
    searchPlaceholder: string;
    grams: string;
    gramsUnit: string;
    ounces: string;
    ouncesUnit: string;
    carbsPer100g: string;
    ean: string;
    delete: string;
    confirm: string;
    usageCount: string;
    carbs: string;
    next: string;
    previous: string;
    loading: string;
    fieldRequired: string;
    invalidValue: string;
  };
  scanner: {
    cameraPermission: string;
    authorizeCamera: string;
    scanProduct: string;
    scanModalTitle: string;
  };
  products: {
    title: string;
    addButton: string;
    addProduct: string;
    editProduct: string;
    editSubtitle: string;
    addSubtitle: string;
    emptyList: string;
    editA11y: string;
    deleteA11y: string;
    unknownProduct: string;
    customUnits: string;
    unitName: string;
    unitAbbreviation: string;
    unitGrams: string;
    unitMass: string;
    addUnit: string;
    noCustomUnits: string;
    noEans: string;
    addEan: string;
    duplicateEan: string;
    eanTaken: string;
    eanCount: string;
    compactListOnA11y: string;
    compactListOffA11y: string;
    refreshFromOffA11y: string;
    refreshNoEan: string;
    refreshNoData: string;
    refreshSuccess: string;
    photo: string;
    addPhoto: string;
    changePhoto: string;
    removePhoto: string;
    removePhotoA11y: string;
    photoSourceTitle: string;
    photoFromCamera: string;
    photoFromGallery: string;
    photoFromOff: string;
    photoCustom: string;
    photoPermissionDenied: string;
    photoCameraPermissionDenied: string;
    tagsSection: string;
    tagsPlaceholder: string;
    cookingConversion: string;
    cookingFactor: string;
    cookingConversionPreview: string;
    filterAll: string;
    filterPlaceholder: string;
    filterLabel: string;
    filterActiveA11y: string;
    filterResetA11y: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleteSuccess: string;
    deleteError: string;
    searchOffButton: string;
    searchOffTitle: string;
    searchOffPlaceholder: string;
    searchOffHint: string;
    searchOffNoResults: string;
    searchOffShowWithoutCarbs: string;
    searchOffMissingCarbs: string;
    searchOffAdding: string;
  };
  tags: {
    starch: string;
    pasta: string;
    rice: string;
    potato: string;
    semolina: string;
    couscous: string;
    quinoa: string;
    bulgur: string;
    lentils: string;
    chickpeas: string;
    beans: string;
    bread: string;
    cereal: string;
    fruit: string;
    vegetable: string;
    protein: string;
    dairy: string;
    dessert: string;
    drink: string;
    snack: string;
    sweet: string;
    other: string;
  };
  meals: {
    title: string;
    addMeal: string;
    dayTotal: string;
    emptyDay: string;
    emptyToday: string;
    mealCarbs: string;
    createTitle: string;
    editTitle: string;
    editItemHint: string;
    editItemA11y: string;
    stepInfo: string;
    stepFoods: string;
    stepSummary: string;
    mealType: string;
    date: string;
    time: string;
    setCurrentTime: string;
    addFood: string;
    scanProduct: string;
    searchProduct: string;
    searchSpotlightPlaceholder: string;
    searchNoResults: string;
    searchEmptyHint: string;
    productNotFoundOff: string;
    mealTotal: string;
    saveMeal: string;
    noItems: string;
    selectQuantity: string;
    breakfast: string;
    lunch: string;
    snack: string;
    collation: string;
    dinner: string;
    itemLine: string;
    itemLinePortion: string;
    deleteA11y: string;
    goToTodayA11y: string;
    openDatePickerA11y: string;
    pickDateTitle: string;
    pickDateHint: string;
    previousDayA11y: string;
    nextDayA11y: string;
    weighingType: string;
    weighingRaw: string;
    weighingCooked: string;
    quantityCooked: string;
    quantityRaw: string;
    rawEquivalent: string;
    cookedEquivalent: string;
    itemCount: string;
    editMealA11y: string;
    viewDetails: string;
    viewDetailsA11y: string;
    deleteConfirmTitle: string;
    deleteConfirmMessage: string;
    deleteSuccess: string;
    deleteError: string;
    addedTitle: string;
    updatedTitle: string;
    addedDescription: string;
    updatedDescription: string;
    saveSuccess: string;
    saveError: string;
  };
  settings: {
    title: string;
    appearance: string;
    appearanceDescription: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
    language: string;
    languageFr: string;
    languageEn: string;
    units: string;
    unitsDescription: string;
    unitMetric: string;
    unitImperial: string;
    globalUnits: string;
    addUnit: string;
    editUnit: string;
    deleteUnitConfirm: string;
    export: string;
    exportDescription: string;
    import: string;
    importDescription: string;
    exportSuccess: string;
    importSuccess: string;
    importError: string;
    mealTypeSchedule: string;
    mealTypeScheduleDescription: string;
    mealTypeScheduleCollationHint: string;
    mealTypeScheduleStart: string;
    mealTypeScheduleEnd: string;
    cookingConversions: string;
    cookingConversionsHint: string;
    unitDeleted: string;
    unitDeleteError: string;
  };
  modal: {
    eanLabel: string;
    nameLabel: string;
    carbsLabel: string;
    namePlaceholder: string;
    importOff: string;
    invalidEan: string;
    nameRequired: string;
    invalidCarbs: string;
    scanPlaceholder: string;
    scanEanA11y: string;
    stopScanA11y: string;
    cameraRequired: string;
    invalidBarcode: string;
  };
  errors: {
    productNotFound: string;
    missingNutriments: string;
    network: string;
    networkStatus: string;
    invalidResponse: string;
    invalidBarcode: string;
    offRateLimit: string;
    generic: string;
  };
  tutorial: {
    welcome: {
      title: string;
      message: string;
      start: string;
      skip: string;
    };
    finish: string;
    quit: {
      title: string;
      message: string;
      button: string;
      confirm: string;
    };
    collapse: {
      minimizeA11y: string;
      expandA11y: string;
      fabA11y: string;
    };
    settings: {
      title: string;
      relaunch: string;
      relaunchDescription: string;
      disabledDuringTutorial: string;
    };
    steps: {
      products: { title: string; message: string };
      productsAdd: { title: string; message: string };
      productForm: { title: string; message: string };
      mealsDayNav: { title: string; message: string };
      mealsToday: { title: string; message: string };
      mealsCalendar: { title: string; message: string };
      mealsAdd: { title: string; message: string };
      mealCreate: { title: string; message: string; hint: string };
      mealsSaved: { title: string; message: string };
      mealsDetail: { title: string; message: string };
      statistics: { title: string; message: string };
      settings: { title: string; message: string };
      finish: { title: string; message: string };
    };
  };
  statistics: {
    title: string;
    period: {
      "7d": string;
      "30d": string;
      "90d": string;
      "1y": string;
      all: string;
    };
    summary: {
      totalCarbs: string;
      averagePerDay: string;
      day: string;
      mealCount: string;
      productCount: string;
      mostConsumedProduct: string;
    };
    empty: {
      title: string;
      description: string;
    };
    widgets: {
      dailyCarbs: string;
      trend: string;
      byMealType: string;
      byCategory: string;
      topProducts: string;
      topCarbs: string;
      starchBreakdown: string;
      mealDistribution: string;
      cookedVsRaw: string;
      favoriteMeals: string;
      mostConsumedTags: string;
      heatmap: string;
      consistency: string;
      bestDays: string;
      records: string;
    };
    cookedRaw: {
      raw: string;
      cooked: string;
    };
    favoriteMeals: {
      line: string;
    };
    consistency: {
      description: string;
    };
    heatmap: {
      dayTotal: string;
      less: string;
      more: string;
    };
    records: {
      highestMealLabel: string;
      highestDayLabel: string;
      mostProductLabel: string;
      mostCategoryLabel: string;
    };
    productDetail: {
      title: string;
      timesConsumed: string;
      lastConsumed: string;
      totalCarbs: string;
      averagePortion: string;
      averageCookedPortion: string;
      averageRawPortion: string;
      favoriteMealType: string;
      never: string;
    };
    mealDetail: {
      title: string;
      dayPercentage: string;
      equivalentRaw: string;
      equivalentCooked: string;
      tags: string;
      mostCarbRich: string;
    };
  };
};

export const fr: TranslationSchema = {
  tabs: {
    products: "Produits",
    meals: "Repas",
    statistics: "Statistiques",
    settings: "Réglages",
  },
  common: {
    back: "← Retour",
    backA11y: "Retour",
    cancel: "Annuler",
    save: "Enregistrer",
    reset: "Reset",
    add: "Ajouter",
    authorize: "Autoriser",
    searchPlaceholder: "Rechercher un produit…",
    grams: "Grammes",
    gramsUnit: "g",
    ounces: "Onces",
    ouncesUnit: "oz",
    carbsPer100g: "{{value}} g / 100g",
    ean: "EAN {{ean}}",
    delete: "Supprimer",
    confirm: "Confirmer",
    usageCount: "{{count}} utilisation(s)",
    carbs: "{{value}} g glucides",
    next: "Suivant",
    previous: "Précédent",
    loading: "Chargement…",
    fieldRequired: "Champ requis",
    invalidValue: "Valeur invalide",
  },
  scanner: {
    cameraPermission:
      "GlucoScan a besoin de la caméra pour scanner les codes-barres",
    authorizeCamera: "Autoriser la caméra",
    scanProduct: "Scanner un produit",
    scanModalTitle: "Scanner",
  },
  products: {
    title: "Mes produits",
    addButton: "+ Ajouter",
    addProduct: "Ajouter un produit",
    editProduct: "Modifier un produit",
    editSubtitle: "Modifiez les informations du produit",
    addSubtitle: "Saisissez les informations du produit",
    emptyList: "Aucun produit.\nAjoutez-en un manuellement",
    editA11y: "Modifier un produit",
    deleteA11y: "Supprimer",
    unknownProduct: "Produit inconnu",
    customUnits: "Unités personnalisées",
    unitName: "Nom",
    unitAbbreviation: "Abréviation",
    unitGrams: "Équivalent (g)",
    unitMass: "Équivalent ({{unit}})",
    addUnit: "Ajouter une unité",
    noCustomUnits: "Aucune unité personnalisée",
    noEans: "Aucun code EAN",
    addEan: "Ajouter un code EAN",
    duplicateEan: "Ce code EAN est déjà dans la liste",
    eanTaken: "Le code EAN {{ean}} est déjà utilisé par un autre produit",
    eanCount: "{{count}} codes EAN",
    compactListOnA11y: "Vue compacte activée, passer en vue détaillée",
    compactListOffA11y: "Passer en vue compacte",
    refreshFromOffA11y: "Actualiser depuis Open Food Facts",
    refreshNoEan: "Ajoutez un code EAN pour actualiser les informations",
    refreshNoData: "Aucune donnée trouvée sur Open Food Facts pour ce code",
    refreshSuccess: "Informations mises à jour depuis Open Food Facts",
    photo: "Photo",
    addPhoto: "Ajouter une photo",
    changePhoto: "Modifier",
    removePhoto: "Supprimer",
    removePhotoA11y: "Supprimer la photo du produit",
    photoSourceTitle: "Ajouter une photo",
    photoFromCamera: "Prendre une photo",
    photoFromGallery: "Choisir dans la galerie",
    photoFromOff: "Image Open Food Facts",
    photoCustom: "Photo personnelle",
    photoPermissionDenied:
      "Autorisez l’accès à vos photos pour ajouter une image",
    photoCameraPermissionDenied:
      "Autorisez l’accès à la caméra pour prendre une photo",
    tagsSection: "Tags",
    tagsPlaceholder: "Sélectionner des tags",
    cookingConversion: "Conversion cuisson",
    cookingFactor: "Facteur cuisson",
    cookingConversionPreview:
      "{{raw}} {{rawUnit}} cru = {{cooked}} {{cookedUnit}} cuit",
    filterAll: "Tous",
    filterPlaceholder: "Filtrer par tag",
    filterLabel: "Filtrer les produits",
    filterActiveA11y: "Filtrer les produits, {{count}} tag sélectionné",
    filterResetA11y: "Réinitialiser les filtres",
    deleteConfirmTitle: "Supprimer ce produit ?",
    deleteConfirmMessage: "Cette action est irréversible",
    deleteSuccess: "Produit supprimé",
    deleteError: "Impossible de supprimer le produit",
    searchOffButton: "Rechercher",
    searchOffTitle: "Rechercher sur Open Food Facts",
    searchOffPlaceholder: "Burger, frites, salade…",
    searchOffHint: "Saisissez au moins 3 caractères",
    searchOffNoResults: "Aucun résultat",
    searchOffShowWithoutCarbs: "Afficher les produits sans glucides",
    searchOffMissingCarbs: "Glucides non renseignés",
    searchOffAdding: "Ajout en cours…",
  },
  tags: {
    starch: "Féculent",
    pasta: "Pâtes",
    rice: "Riz",
    potato: "Pomme de terre",
    semolina: "Semoule",
    couscous: "Couscous",
    quinoa: "Quinoa",
    bulgur: "Boulgour",
    lentils: "Lentilles",
    chickpeas: "Pois chiches",
    beans: "Haricots",
    bread: "Pain",
    cereal: "Céréales",
    fruit: "Fruit",
    vegetable: "Légume",
    protein: "Protéine",
    dairy: "Produit laitier",
    dessert: "Dessert",
    drink: "Boisson",
    snack: "Snack",
    sweet: "Sucré",
    other: "Autre",
  },
  meals: {
    title: "Mes repas",
    addMeal: "Nouveau repas",
    dayTotal: "Total : {{value}} g glucides",
    emptyDay: "Aucun repas pour ce jour",
    emptyToday: "Aucun repas pour aujourd'hui. Commencez par en ajouter un.",
    mealCarbs: "{{value}} g glucides",
    createTitle: "Nouveau repas",
    editTitle: "Modifier le repas",
    editItemHint: "Appuyez sur un aliment pour modifier sa quantité",
    editItemA11y: "Modifier la quantité de {{name}}",
    stepInfo: "Informations",
    stepFoods: "Aliments",
    stepSummary: "Résumé",
    mealType: "Type de repas",
    date: "Date",
    time: "Heure",
    setCurrentTime: "Maintenant",
    addFood: "Ajouter un aliment",
    scanProduct: "Scanner un produit",
    searchProduct: "Rechercher dans mes produits",
    searchSpotlightPlaceholder: "Rechercher un aliment…",
    searchNoResults: "Aucun produit trouvé",
    searchEmptyHint: "Aucun produit enregistré",
    productNotFoundOff:
      "Produit introuvable sur Open Food Facts. Ajoutez-le manuellement dans l'onglet Produits, puis recherchez-le ci-dessous.",
    mealTotal: "Total du repas",
    saveMeal: "Enregistrer le repas",
    noItems: "Ajoutez au moins un aliment",
    selectQuantity: "Quantité",
    breakfast: "Petit déjeuner",
    lunch: "Déjeuner",
    snack: "Goûter",
    collation: "Collation",
    dinner: "Dîner",
    itemLine: "{{name}} — {{quantity}} {{unit}} ({{carbs}} g)",
    itemLinePortion: "{{name}} — {{portion}} ({{carbs}} g)",
    deleteA11y: "Supprimer le repas",
    goToTodayA11y: "Revenir aux repas du jour",
    openDatePickerA11y: "Choisir une date",
    pickDateTitle: "Choisir une date",
    pickDateHint: "Les glucides du jour s’affichent sous chaque date",
    previousDayA11y: "Jour précédent",
    nextDayA11y: "Jour suivant",
    weighingType: "Type de pesée",
    weighingRaw: "Cru",
    weighingCooked: "Cuit",
    quantityCooked: "{{value}} {{unit}} cuits",
    quantityRaw: "{{value}} {{unit}} crus",
    rawEquivalent: "≈ {{value}} {{unit}} crus",
    cookedEquivalent: "≈ {{value}} {{unit}} cuits",
    itemCount: "{{count}} aliments",
    editMealA11y: "Modifier le repas",
    viewDetails: "Détail",
    viewDetailsA11y: "Voir le détail du repas",
    deleteConfirmTitle: "Supprimer ce repas ?",
    deleteConfirmMessage: "Cette action est irréversible",
    deleteSuccess: "Repas supprimé",
    deleteError: "Impossible de supprimer le repas",
    addedTitle: "Repas ajouté",
    updatedTitle: "Repas modifié",
    addedDescription: "{{mealType}} a été ajouté avec {{carbs}} g de glucides",
    updatedDescription:
      "{{mealType}} a été modifié avec {{carbs}} g de glucides",
    saveSuccess: "Repas enregistré",
    saveError: "Impossible d'enregistrer le repas",
  },
  settings: {
    title: "Paramètres",
    appearance: "Apparence",
    appearanceDescription: "Clair, sombre, ou selon le réglage système",
    themeSystem: "Système",
    themeLight: "Clair",
    themeDark: "Sombre",
    language: "Langue",
    languageFr: "Français",
    languageEn: "English",
    units: "Unités de mesure",
    unitsDescription: "Affichage des masses en grammes ou en onces",
    unitMetric: "Métrique",
    unitImperial: "Impérial",
    globalUnits: "Unités globales",
    addUnit: "Ajouter une unité",
    editUnit: "Modifier l'unité",
    deleteUnitConfirm: "Supprimer cette unité ?",
    export: "Exporter les données",
    exportDescription: "Fichier .gs (sauvegarde complète)",
    import: "Importer des données",
    importDescription: "Fusionner depuis un fichier .gs",
    exportSuccess: "Export réussi",
    importSuccess: "Import réussi",
    importError: "Import impossible",
    mealTypeSchedule: "Plages horaires des repas",
    mealTypeScheduleDescription:
      "Définissez les créneaux pour la sélection automatique du type de repas lors de la création",
    mealTypeScheduleCollationHint:
      "En dehors de ces plages, le repas est classé en collation",
    mealTypeScheduleStart: "Début — {{meal}}",
    mealTypeScheduleEnd: "Fin — {{meal}}",
    cookingConversions: "Conversions de cuisson",
    cookingConversionsHint: "Affecte uniquement les futurs repas",
    unitDeleted: "Unité supprimée",
    unitDeleteError: "Impossible de supprimer l'unité",
  },
  tutorial: {
    welcome: {
      title: "Bienvenue",
      message:
        "Souhaitez-vous découvrir l'application avec des données d'exemple ?",
      start: "Commencer",
      skip: "Ignorer",
    },
    finish: "Terminer",
    quit: {
      title: "Quitter le tutoriel",
      message: "Vos données seront restaurées",
      button: "Quitter",
      confirm: "Quitter",
    },
    collapse: {
      minimizeA11y: "Réduire la carte du tutoriel",
      expandA11y: "Afficher la carte du tutoriel",
      fabA11y: "Afficher le tutoriel",
    },
    settings: {
      title: "Tutoriel",
      relaunch: "Relancer le tutoriel",
      relaunchDescription: "Découvrir l'application avec des données d'exemple",
      disabledDuringTutorial: "Indisponible pendant le tutoriel",
    },
    steps: {
      products: {
        title: "Vos produits",
        message:
          "Retrouvez ici tous vos aliments et utilisez la recherche pour les filtrer",
      },
      productsAdd: {
        title: "Ajouter un aliment",
        message:
          "Appuyez ici pour ajouter un aliment manuellement, par exemple un plat maison sans code-barres",
      },
      productForm: {
        title: "Fiche produit",
        message:
          "En cliquant sur un produit, vous pouvez le modifier ou le supprimer",
      },
      mealsDayNav: {
        title: "Naviguer entre les jours",
        message:
          "Les flèches changent de jour. Les points indiquent les jours proches : le trait coloré est le jour affiché, les points plus visibles correspondent aux jours avec des repas.",
      },
      mealsToday: {
        title: "Revenir à aujourd'hui",
        message:
          "Après avoir parcouru d'autres dates, ce bouton vous ramène rapidement au jour actuel.",
      },
      mealsCalendar: {
        title: "Calendrier",
        message:
          "Parcourez le calendrier pour sauter à une date. Le chiffre sous chaque jour correspond aux glucides consommés ce jour-là.",
      },
      mealsAdd: {
        title: "Ajouter un repas",
        message: "Appuyez ici pour créer un nouveau repas pour le jour sélectionné",
      },
      mealCreate: {
        title: "Créer un repas",
        message: "Créez un repas et ajoutez un produit pour continuer",
        hint: "Enregistrez un repas avec au moins un aliment",
      },
      mealsSaved: {
        title: "Repas enregistré",
        message:
          "Il apparaît dans la liste du jour avec ses aliments dépliés. Parcourez le résumé avant d'ouvrir le détail complet",
      },
      mealsDetail: {
        title: "Détail du repas",
        message:
          "Retrouvez les aliments, le total de glucides et les mini statistiques. Vous pouvez modifier le repas depuis ici",
      },
      statistics: {
        title: "Statistiques",
        message:
          "Explorez le tableau de bord à votre rythme. Quand vous avez terminé, appuyez sur Suivant",
      },
      settings: {
        title: "Paramètres",
        message:
          "Personnalisez l'app ici : apparence et langue, unités (grammes ou onces), plages horaires des repas, conversions cuit/cru, unités personnalisées et export ou import de vos données. Parcourez les sections à votre rythme, puis appuyez sur Suivant",
      },
      finish: {
        title: "C'est parti",
        message: "Vous êtes prêt à utiliser l'application",
      },
    },
  },
  modal: {
    eanLabel: "Codes EAN",
    nameLabel: "Nom du produit",
    carbsLabel: "Glucides / 100g",
    namePlaceholder: "Mon produit",
    importOff: "Importer automatiquement",
    invalidEan: "Code EAN invalide",
    nameRequired: "Le nom du produit est requis",
    invalidCarbs: "Glucides / 100g invalides",
    scanPlaceholder: "Scanner un code-barres",
    scanEanA11y: "Scanner le code EAN",
    stopScanA11y: "Arrêter le scan",
    cameraRequired: "Autorisez la caméra pour scanner le code-barres",
    invalidBarcode: "Code-barres invalide",
  },
  errors: {
    productNotFound: "Produit non trouvé pour le code {{ean}}",
    missingNutriments: "Données glucides indisponibles pour le code {{ean}}",
    network: "Impossible de contacter Open Food Facts",
    networkStatus: "Erreur réseau ({{status}})",
    invalidResponse: "Réponse invalide du serveur",
    invalidBarcode: "Code-barres invalide",
    offRateLimit:
      "Limite Open Food Facts atteinte (15/min). Attendez {{seconds}}s avant de rescanner",
    generic: "Une erreur est survenue",
  },
  statistics: {
    title: "Statistiques",
    period: {
      "7d": "7 jours",
      "30d": "30 jours",
      "90d": "90 jours",
      "1y": "1 an",
      all: "Tout",
    },
    summary: {
      totalCarbs: "Total glucides",
      averagePerDay: "Moyenne / jour",
      day: "jour",
      mealCount: "Nombre de repas",
      productCount: "Produits consommés",
      mostConsumedProduct: "Produit le plus consommé",
    },
    empty: {
      title: "Aucun repas enregistré",
      description: "Enregistrez vos repas pour voir vos statistiques",
    },
    widgets: {
      dailyCarbs: "Glucides journaliers",
      trend: "Tendance des glucides",
      byMealType: "Glucides par type de repas",
      byCategory: "Glucides par catégorie",
      topProducts: "Produits les plus consommés",
      topCarbs: "Produits les plus glucidiques",
      starchBreakdown: "Répartition des féculents",
      mealDistribution: "Répartition dans la journée",
      cookedVsRaw: "Cru vs cuit",
      favoriteMeals: "Repas favoris",
      mostConsumedTags: "Tags les plus consommés",
      heatmap: "Calendrier des glucides",
      consistency: "Score de régularité",
      bestDays: "Meilleurs jours",
      records: "Records",
    },
    cookedRaw: {
      raw: "Cru",
      cooked: "Cuit",
    },
    favoriteMeals: {
      line: "{{count}} fois · moy. {{average}} g",
    },
    consistency: {
      description: "Mesure la régularité de votre apport quotidien en glucides",
    },
    heatmap: {
      dayTotal: "Total : {{value}} g glucides",
      less: "Moins",
      more: "Plus",
    },
    records: {
      highestMealLabel: "Repas le plus glucidique :",
      highestDayLabel: "Jour le plus glucidique :",
      mostProductLabel: "Produit le plus consommé :",
      mostCategoryLabel: "Catégorie la plus consommée :",
    },
    productDetail: {
      title: "Statistiques",
      timesConsumed: "Fois consommé",
      lastConsumed: "Dernière consommation",
      totalCarbs: "Total glucides générés",
      averagePortion: "Portion moyenne",
      averageCookedPortion: "Portion cuite moyenne",
      averageRawPortion: "Portion crue moyenne",
      favoriteMealType: "Type de repas favori",
      never: "Jamais",
    },
    mealDetail: {
      title: "Statistiques",
      dayPercentage: "Part du jour",
      equivalentRaw: "Équivalent cru",
      equivalentCooked: "Équivalent cuit",
      tags: "Tags impliqués",
      mostCarbRich: "Produit le plus glucidique",
    },
  },
};

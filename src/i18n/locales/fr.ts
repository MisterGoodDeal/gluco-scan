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
    weighingType: string;
    weighingRaw: string;
    weighingCooked: string;
    quantityCooked: string;
    quantityRaw: string;
    rawEquivalent: string;
    cookedEquivalent: string;
    itemCount: string;
    editMealA11y: string;
    viewDetailsA11y: string;
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
    cookingConversions: string;
    cookingConversionsHint: string;
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
    settings: {
      title: string;
      relaunch: string;
      relaunchDescription: string;
      disabledDuringTutorial: string;
    };
    steps: {
      products: { title: string; message: string };
      productForm: { title: string; message: string };
      meals: { title: string; message: string };
      mealCreate: { title: string; message: string; hint: string };
      settings: { title: string; message: string };
      finish: { title: string; message: string };
    };
  };
  statistics: {
    title: string;
    period: {
      '7d': string;
      '30d': string;
      '90d': string;
      '1y': string;
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
    products: 'Produits',
    meals: 'Repas',
    statistics: 'Statistiques',
    settings: 'Réglages',
  },
  common: {
    back: '← Retour',
    backA11y: 'Retour',
    cancel: 'Annuler',
    save: 'Enregistrer',
    reset: 'Reset',
    add: 'Ajouter',
    authorize: 'Autoriser',
    searchPlaceholder: 'Rechercher un produit…',
    grams: 'Grammes',
    gramsUnit: 'g',
    ounces: 'Onces',
    ouncesUnit: 'oz',
    carbsPer100g: '{{value}} g / 100g',
    ean: 'EAN {{ean}}',
    delete: 'Supprimer',
    confirm: 'Confirmer',
    usageCount: '{{count}} utilisation(s)',
    carbs: '{{value}} g glucides',
    next: 'Suivant',
    previous: 'Précédent',
    loading: 'Chargement…',
  },
  scanner: {
    cameraPermission: 'GlucoScan a besoin de la caméra pour scanner les codes-barres.',
    authorizeCamera: 'Autoriser la caméra',
    scanProduct: 'Scanner un produit',
    scanModalTitle: 'Scanner',
  },
  products: {
    title: 'Mes produits',
    addButton: '+ Ajouter',
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier un produit',
    editSubtitle: 'Modifiez les informations du produit.',
    addSubtitle: 'Saisissez les informations du produit.',
    emptyList: 'Aucun produit.\nAjoutez-en un manuellement.',
    editA11y: 'Modifier un produit',
    deleteA11y: 'Supprimer',
    unknownProduct: 'Produit inconnu',
    customUnits: 'Unités personnalisées',
    unitName: 'Nom',
    unitAbbreviation: 'Abréviation',
    unitGrams: 'Équivalent (g)',
    unitMass: 'Équivalent ({{unit}})',
    addUnit: 'Ajouter une unité',
    noCustomUnits: 'Aucune unité personnalisée.',
    noEans: 'Aucun code EAN.',
    addEan: 'Ajouter un code EAN',
    duplicateEan: 'Ce code EAN est déjà dans la liste.',
    eanTaken: 'Le code EAN {{ean}} est déjà utilisé par un autre produit.',
    eanCount: '{{count}} codes EAN',
    compactListOnA11y: 'Vue compacte activée, passer en vue détaillée',
    compactListOffA11y: 'Passer en vue compacte',
    refreshFromOffA11y: 'Actualiser depuis Open Food Facts',
    refreshNoEan: 'Ajoutez un code EAN pour actualiser les informations.',
    refreshNoData: 'Aucune donnée trouvée sur Open Food Facts pour ce code.',
    photo: 'Photo',
    addPhoto: 'Ajouter une photo',
    changePhoto: 'Changer la photo',
    removePhoto: 'Supprimer',
    removePhotoA11y: 'Supprimer la photo du produit',
    photoSourceTitle: 'Ajouter une photo',
    photoFromCamera: 'Prendre une photo',
    photoFromGallery: 'Choisir dans la galerie',
    photoFromOff: 'Image Open Food Facts',
    photoCustom: 'Photo personnelle',
    photoPermissionDenied: 'Autorisez l’accès à vos photos pour ajouter une image.',
    photoCameraPermissionDenied: 'Autorisez l’accès à la caméra pour prendre une photo.',
    tagsSection: 'Tags',
    tagsPlaceholder: 'Sélectionner des tags',
    cookingConversion: 'Conversion cuisson',
    cookingFactor: 'Facteur cuisson',
    cookingConversionPreview: '{{raw}} {{rawUnit}} cru = {{cooked}} {{cookedUnit}} cuit',
    filterAll: 'Tous',
  },
  tags: {
    starch: 'Féculent',
    pasta: 'Pâtes',
    rice: 'Riz',
    potato: 'Pomme de terre',
    semolina: 'Semoule',
    couscous: 'Couscous',
    quinoa: 'Quinoa',
    bulgur: 'Boulgour',
    lentils: 'Lentilles',
    chickpeas: 'Pois chiches',
    beans: 'Haricots',
    bread: 'Pain',
    cereal: 'Céréales',
    fruit: 'Fruit',
    vegetable: 'Légume',
    protein: 'Protéine',
    dairy: 'Produit laitier',
    dessert: 'Dessert',
    drink: 'Boisson',
    snack: 'Snack',
    sweet: 'Sucré',
    other: 'Autre',
  },
  meals: {
    title: 'Mes repas',
    addMeal: 'Nouveau repas',
    dayTotal: 'Total : {{value}} g glucides',
    emptyDay: 'Aucun repas pour ce jour.',
    emptyToday: "Aucun repas pour aujourd'hui. Commencez par en ajouter un.",
    mealCarbs: '{{value}} g glucides',
    createTitle: 'Nouveau repas',
    editTitle: 'Modifier le repas',
    editItemHint: 'Appuyez sur un aliment pour modifier sa quantité.',
    editItemA11y: 'Modifier la quantité de {{name}}',
    stepInfo: 'Informations',
    stepFoods: 'Aliments',
    stepSummary: 'Résumé',
    mealType: 'Type de repas',
    date: 'Date',
    time: 'Heure',
    addFood: 'Ajouter un aliment',
    scanProduct: 'Scanner un produit',
    searchProduct: 'Rechercher dans mes produits',
    searchSpotlightPlaceholder: 'Rechercher un aliment…',
    searchNoResults: 'Aucun produit trouvé',
    searchEmptyHint: 'Aucun produit enregistré',
    productNotFoundOff:
      "Produit introuvable sur Open Food Facts. Ajoutez-le manuellement dans l'onglet Produits, puis recherchez-le ci-dessous.",
    mealTotal: 'Total du repas',
    saveMeal: 'Enregistrer le repas',
    noItems: 'Ajoutez au moins un aliment',
    selectQuantity: 'Quantité',
    breakfast: 'Petit déjeuner',
    lunch: 'Déjeuner',
    snack: 'Goûter',
    collation: 'Collation',
    dinner: 'Dîner',
    itemLine: '{{name}} — {{quantity}} {{unit}} ({{carbs}} g)',
    itemLinePortion: '{{name}} — {{portion}} ({{carbs}} g)',
    deleteA11y: 'Supprimer le repas',
    goToTodayA11y: "Revenir aux repas du jour",
    weighingType: 'Type de pesée',
    weighingRaw: 'Cru',
    weighingCooked: 'Cuit',
    quantityCooked: '{{value}} {{unit}} cuits',
    quantityRaw: '{{value}} {{unit}} crus',
    rawEquivalent: '≈ {{value}} {{unit}} crus',
    cookedEquivalent: '≈ {{value}} {{unit}} cuits',
    itemCount: '{{count}} aliments',
    editMealA11y: 'Modifier le repas',
    viewDetailsA11y: 'Voir le détail du repas',
  },
  settings: {
    title: 'Paramètres',
    appearance: 'Apparence',
    appearanceDescription: 'Clair, sombre, ou selon le réglage système.',
    themeSystem: 'Système',
    themeLight: 'Clair',
    themeDark: 'Sombre',
    language: 'Langue',
    languageFr: 'Français',
    languageEn: 'English',
    units: 'Unités de mesure',
    unitsDescription: 'Affichage des masses en grammes ou en onces.',
    unitMetric: 'Métrique',
    unitImperial: 'Impérial',
    globalUnits: 'Unités globales',
    addUnit: 'Ajouter une unité',
    editUnit: 'Modifier l\'unité',
    deleteUnitConfirm: 'Supprimer cette unité ?',
    export: 'Exporter les données',
    exportDescription: 'Fichier .gs (sauvegarde complète)',
    import: 'Importer des données',
    importDescription: 'Fusionner depuis un fichier .gs',
    exportSuccess: 'Export réussi',
    importSuccess: 'Import réussi',
    importError: 'Import impossible',
    cookingConversions: 'Conversions de cuisson',
    cookingConversionsHint: 'Affecte uniquement les futurs repas.',
  },
  tutorial: {
    welcome: {
      title: 'Bienvenue',
      message: 'Souhaitez-vous découvrir l\'application avec des données d\'exemple ?',
      start: 'Commencer',
      skip: 'Ignorer',
    },
    finish: 'Terminer',
    quit: {
      title: 'Quitter le tutoriel',
      message: 'Vos données seront restaurées.',
      button: 'Quitter',
      confirm: 'Quitter',
    },
    settings: {
      title: 'Tutoriel',
      relaunch: 'Relancer le tutoriel',
      relaunchDescription: 'Découvrir l\'application avec des données d\'exemple',
      disabledDuringTutorial: 'Indisponible pendant le tutoriel',
    },
    steps: {
      products: {
        title: 'Vos produits',
        message: 'Retrouvez ici tous vos aliments.',
      },
      productForm: {
        title: 'Fiche produit',
        message: 'Chaque produit peut avoir ses propres portions.',
      },
      meals: {
        title: 'Historique des repas',
        message: 'Consultez votre historique alimentaire.',
      },
      mealCreate: {
        title: 'Créer un repas',
        message: 'Créez un repas et ajoutez un produit pour continuer.',
        hint: 'Enregistrez un repas avec au moins un aliment.',
      },
      settings: {
        title: 'Paramètres',
        message: 'Gérez vos unités globales et vos sauvegardes.',
      },
      finish: {
        title: 'C\'est parti',
        message: 'Vous êtes prêt à utiliser l\'application.',
      },
    },
  },
  modal: {
    eanLabel: 'Codes EAN',
    nameLabel: 'Nom du produit',
    carbsLabel: 'Glucides / 100g',
    namePlaceholder: 'Mon produit',
    importOff: 'Importer automatiquement',
    invalidEan: 'Code EAN invalide',
    nameRequired: 'Le nom du produit est requis',
    invalidCarbs: 'Glucides / 100g invalides',
    scanPlaceholder: 'Scanner un code-barres',
    scanEanA11y: 'Scanner le code EAN',
    stopScanA11y: 'Arrêter le scan',
    cameraRequired: 'Autorisez la caméra pour scanner le code-barres.',
    invalidBarcode: 'Code-barres invalide',
  },
  errors: {
    productNotFound: 'Produit non trouvé pour le code {{ean}}',
    missingNutriments: 'Données glucides indisponibles pour le code {{ean}}',
    network: 'Impossible de contacter Open Food Facts',
    networkStatus: 'Erreur réseau ({{status}})',
    invalidResponse: 'Réponse invalide du serveur',
    invalidBarcode: 'Code-barres invalide',
    offRateLimit:
      'Limite Open Food Facts atteinte (15/min). Attendez {{seconds}}s avant de rescanner.',
    generic: 'Une erreur est survenue',
  },
  statistics: {
    title: 'Statistiques',
    period: {
      '7d': '7 jours',
      '30d': '30 jours',
      '90d': '90 jours',
      '1y': '1 an',
      all: 'Tout',
    },
    summary: {
      totalCarbs: 'Total glucides',
      averagePerDay: 'Moyenne / jour',
      day: 'jour',
      mealCount: 'Nombre de repas',
      productCount: 'Produits consommés',
      mostConsumedProduct: 'Produit le plus consommé',
    },
    empty: {
      title: 'Aucun repas enregistré',
      description: 'Enregistrez vos repas pour voir vos statistiques.',
    },
    widgets: {
      dailyCarbs: 'Glucides journaliers',
      trend: 'Tendance des glucides',
      byMealType: 'Glucides par type de repas',
      byCategory: 'Glucides par catégorie',
      topProducts: 'Produits les plus consommés',
      topCarbs: 'Produits les plus glucidiques',
      starchBreakdown: 'Répartition des féculents',
      mealDistribution: 'Répartition dans la journée',
      cookedVsRaw: 'Cru vs cuit',
      favoriteMeals: 'Repas favoris',
      mostConsumedTags: 'Tags les plus consommés',
      heatmap: 'Calendrier des glucides',
      consistency: 'Score de régularité',
      bestDays: 'Meilleurs jours',
      records: 'Records',
    },
    cookedRaw: {
      raw: 'Cru',
      cooked: 'Cuit',
    },
    favoriteMeals: {
      line: '{{count}} fois · moy. {{average}} g',
    },
    consistency: {
      description: 'Mesure la régularité de votre apport quotidien en glucides.',
    },
    heatmap: {
      dayTotal: 'Total : {{value}} g glucides',
    },
    records: {
      highestMealLabel: 'Repas le plus glucidique :',
      highestDayLabel: 'Jour le plus glucidique :',
      mostProductLabel: 'Produit le plus consommé :',
      mostCategoryLabel: 'Catégorie la plus consommée :',
    },
    productDetail: {
      title: 'Statistiques',
      timesConsumed: 'Fois consommé',
      lastConsumed: 'Dernière consommation',
      totalCarbs: 'Total glucides générés',
      averagePortion: 'Portion moyenne',
      averageCookedPortion: 'Portion cuite moyenne',
      averageRawPortion: 'Portion crue moyenne',
      favoriteMealType: 'Type de repas favori',
      never: 'Jamais',
    },
    mealDetail: {
      title: 'Statistiques',
      dayPercentage: 'Part du jour',
      equivalentRaw: 'Équivalent cru',
      equivalentCooked: 'Équivalent cuit',
      tags: 'Tags impliqués',
      mostCarbRich: 'Produit le plus glucidique',
    },
  },
};

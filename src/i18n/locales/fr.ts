export type TranslationSchema = {
  tabs: {
    products: string;
    meals: string;
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
};

export const fr: TranslationSchema = {
  tabs: {
    products: 'Produits',
    meals: 'Repas',
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
    editProduct: 'Modifier le produit',
    editSubtitle: 'Modifiez les informations du produit.',
    addSubtitle: 'Saisissez les informations du produit.',
    emptyList: 'Aucun produit.\nAjoutez-en un manuellement.',
    editA11y: 'Modifier le produit',
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
};

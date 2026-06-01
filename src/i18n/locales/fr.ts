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
    addUnit: string;
  };
  meals: {
    title: string;
    addMeal: string;
    dayTotal: string;
    emptyDay: string;
    emptyToday: string;
    mealCarbs: string;
    createTitle: string;
    stepInfo: string;
    stepFoods: string;
    stepSummary: string;
    mealType: string;
    date: string;
    time: string;
    addFood: string;
    scanProduct: string;
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
  };
  settings: {
    title: string;
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
    addUnit: 'Ajouter une unité',
  },
  meals: {
    title: 'Mes repas',
    addMeal: 'Nouveau repas',
    dayTotal: 'Total : {{value}} g glucides',
    emptyDay: 'Aucun repas pour ce jour.',
    emptyToday: "Aucun repas pour aujourd'hui. Commencez par en ajouter un.",
    mealCarbs: '{{value}} g glucides',
    createTitle: 'Nouveau repas',
    stepInfo: 'Informations',
    stepFoods: 'Aliments',
    stepSummary: 'Résumé',
    mealType: 'Type de repas',
    date: 'Date',
    time: 'Heure',
    addFood: 'Ajouter un aliment',
    scanProduct: 'Scanner un produit',
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
  },
  settings: {
    title: 'Paramètres',
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
  modal: {
    eanLabel: 'Code EAN',
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

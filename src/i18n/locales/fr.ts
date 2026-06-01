export type TranslationSchema = {
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
  };
  scanner: {
    cameraPermission: string;
    authorizeCamera: string;
    emptyList: string;
    myProductsA11y: string;
    totalCarbs: string;
    resetSessionA11y: string;
    removeProductA11y: string;
    completeProduct: string;
    incompleteProductSubtitle: string;
    addToMeal: string;
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
    addToMealA11y: string;
    deleteA11y: string;
    unknownProduct: string;
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
  },
  scanner: {
    cameraPermission: 'GlucoScan a besoin de la caméra pour scanner les codes-barres.',
    authorizeCamera: 'Autoriser la caméra',
    emptyList: 'Scannez un produit pour commencer',
    myProductsA11y: 'Mes produits',
    totalCarbs: 'Glucides totaux',
    resetSessionA11y: 'Réinitialiser la session',
    removeProductA11y: 'Supprimer le produit',
    completeProduct: 'Compléter le produit',
    incompleteProductSubtitle: 'Produit introuvable ou incomplet — complétez les informations.',
    addToMeal: 'Ajouter au repas',
  },
  products: {
    title: 'Mes produits',
    addButton: '+ Ajouter',
    addProduct: 'Ajouter un produit',
    editProduct: 'Modifier le produit',
    editSubtitle: 'Modifiez les informations du produit.',
    addSubtitle: 'Scannez le code-barres puis complétez les informations.',
    emptyList: 'Aucun produit en cache.\nScannez ou ajoutez-en un manuellement.',
    editA11y: 'Modifier le produit',
    addToMealA11y: 'Ajouter au repas',
    deleteA11y: 'Supprimer',
    unknownProduct: 'Produit inconnu',
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

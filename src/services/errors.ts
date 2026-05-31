export class ProductNotFoundError extends Error {
  constructor(ean: string) {
    super(`Produit non trouvé pour le code ${ean}`);
    this.name = 'ProductNotFoundError';
  }
}

export class MissingNutrimentsError extends Error {
  constructor(ean: string) {
    super(`Données glucides indisponibles pour le code ${ean}`);
    this.name = 'MissingNutrimentsError';
  }
}

export class NetworkError extends Error {
  constructor(message = 'Impossible de contacter Open Food Facts') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class InvalidBarcodeError extends Error {
  constructor() {
    super('Code-barres invalide');
    this.name = 'InvalidBarcodeError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Une erreur est survenue';
};

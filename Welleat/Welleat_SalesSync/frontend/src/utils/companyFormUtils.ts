import { CompanyFormData } from '../types';

/**
 * Vérifie la validité des données d'un formulaire d'entreprise.
 * Vérifie la présence des champs obligatoires et la validité de certaines valeurs.
 * @param data - Données du formulaire.
 * @returns true si les données sont valides, false sinon.
 */
export function validateCompanyFormData(data: CompanyFormData): boolean {
  if (
    !data.name ||
    !data.address ||
    !data.city ||
    !data.postalCode ||
    !data.establishmentType ||
    !data.organizationType ||
    data.numberOfCanteens < 0 ||
    data.numberOfCentralKitchens < 0 ||
    !data.typeOfFunctioning
  ) {
    return false;
  }
  return true;
}

/**
 * Retourne un objet "vierge" pour réinitialiser le formulaire d'entreprise.
 * @returns Un objet CompanyFormData vide.
 */
export function getResetCompanyFormData(): CompanyFormData {
  return {
    name: '',
    address: '',
    city: '',
    postalCode: '',
    comments: '',
    establishmentType: 'client potentiel',
    organizationType: 'Non spécifique',
    numberOfCanteens: 0,
    numberOfCentralKitchens: 0,
    interlocutors: [],
    typeOfFunctioning: 'autonome',
  };
}

/**
 * Nettoie le localStorage pour le formulaire d'entreprise et supprime
 * un éventuel tableau d'emails déjà traités.
 * @param clearProcessedEmails - Fonction de nettoyage optionnelle des emails traités.
 */
export function clearFormLocalStorage(
  clearProcessedEmails?: () => void
): void {
  localStorage.removeItem('companyFormData');
  localStorage.removeItem('processedEmails');
  if (clearProcessedEmails) {
    clearProcessedEmails();
  }
}

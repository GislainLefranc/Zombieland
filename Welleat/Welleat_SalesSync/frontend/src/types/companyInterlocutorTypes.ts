
export type EstablishmentType = 'client potentiel' | 'client' | 'ambassadeur';


export type OrganizationType =
  | 'Non spécifique'
  | 'collectivité'
  | 'intercommunalité'
  | 'département'
  | 'région';


export type FunctioningType = 'autonome' | 'en régie centrale' | 'délégation';

export interface Interlocutor {
  id: number;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  email: string;
  phone?: string;
  position?: string;
  comment?: string;
  interlocutorType?: string;
  interlocutor_type?: string;
  isPrincipal?: boolean;
  is_principal?: boolean;
  isIndependent?: boolean;
  is_independent?: boolean;
  uniqueKey?: string;
  unique_key?: string;
  InterlocutorCompany?: {
    isPrincipal?: boolean;
    is_principal?: boolean;
  };
}

export interface Company {
  id?: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  comments?: string;
  establishmentType: EstablishmentType;
  organizationType: OrganizationType;
  numberOfCanteens: number;
  numberOfCentralKitchens: number;

  createdBy?: number;

  assignedTo?: number;
}

export interface CompanyFormData {
  id?: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  comments?: string;
  establishmentType: EstablishmentType;
  organizationType: OrganizationType;
  numberOfCanteens: number;
  numberOfCentralKitchens: number;


  typeOfFunctioning: FunctioningType;

  interlocutors: Interlocutor[];
}


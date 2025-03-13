// ========================
// Types de Base
// ========================

export interface BaseEntity {
  id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface SelectedEntities {
  companies: Set<number>;
  interlocutors: Set<number>;
  users: Set<number>;
}

// ========================
// Énumérations
// ========================

export type EstablishmentType = 'client potentiel' | 'client' | 'ambassadeur';

export type OrganizationType =
  | 'Non spécifique'
  | 'collectivité'
  | 'intercommunalité'
  | 'département'
  | 'région';

export type FunctioningType = 'autonome' | 'en régie centrale' | 'délégation';

export type InterlocutorType = 'client potentiel' | 'client' | 'ambassadeur';

export type Permission =
  | 'CREATE_USER'
  | 'UPDATE_USER'
  | 'DELETE_USER'
  | 'CREATE_COMPANY'
  | 'UPDATE_COMPANY'
  | 'DELETE_COMPANY'
  | 'CREATE_SIMULATION'
  | 'APPROVE_SIMULATION'
  | 'REJECT_SIMULATION'
  | 'CREATE_EQUIPMENT'
  | 'UPDATE_EQUIPMENT'
  | 'DELETE_EQUIPMENT'
  | 'CREATE_QUOTE'
  | 'UPDATE_QUOTE'
  | 'DELETE_QUOTE'
  | 'CREATE_FORMULA'
  | 'UPDATE_FORMULA'
  | 'DELETE_FORMULA';

export enum QuoteStatus {
  PROJET = 'projet',
  ACCEPTE = 'accepté',
  REFUSE = 'refusé',
  EN_COURS = 'en_cours',
  TERMINE = 'terminé'
}




export type SimulationStatus = 'projet' | 'en attente' | 'approuvé' | 'rejeté';

// ========================
// Interfaces Métier
// ========================

export interface Role extends BaseEntity {
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface User extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  password?: string;
  role_id: number;
  // Relations
  role?: Role;
  created_simulations?: Simulation[];
  assigned_simulations?: Simulation[];
  created_companies?: Company[];
  assigned_companies?: Company[];
  interlocutors?: Interlocutor[];
  companies?: Company[];
  simulations?: Simulation[];
}

export interface Interlocutor extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position?: string;
  interlocutor_type: InterlocutorType;
  comment?: string;
  is_principal: boolean;
  is_independent: boolean;
  unique_key: string;
  primary_company_id?: number | null;
  user_id?: number | null;
  // Relations
  company?: Company;
  user?: User;
  interlocutor_company?: InterlocutorCompany;
}

export interface InterlocutorCompany {
  is_principal: boolean;
}

export interface Functioning extends BaseEntity {
  company_id: number;
  type_of_functioning: FunctioningType;
  // Relations
  company?: Company;
}

export interface Simulation extends BaseEntity {
  user_id: number;
  company_id: number;
  cost_per_dish: number;
  dishes_per_day: number;
  waste_percentage: number;
  daily_production_savings: number;
  monthly_production_savings: number;
  daily_waste_savings: number;
  monthly_waste_savings: number;
  status: SimulationStatus;
  created_by: number;
  assigned_to?: number;
  // Relations
  company?: Company;
  user?: User;
  creator?: User;
  assigned_user?: User;
}

export interface Formula extends BaseEntity {
  name: string;
  description?: string;
  price_ht: string;
  installation_price: string;
  maintenance_price: string;
  hotline_price: string;
  options?: Option[];
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  companies: Array<{
    id: number;
    name: string;
    address: string;
    city: string;
    postalCode: string;
  }>;
  interlocutors: Array<Interlocutor>;
}

export interface Equipment extends BaseEntity {
  name: string;
  description?: string;
  free_equipment: boolean;
  price: number;
  price_ht: number;
  category?: string;
  notes?: string;
  image?: string;
  formula_compatible: boolean;
  formula_discount: number;
}

export interface QuoteEquipment {
  quote_id: number;
  equipment_id: number;
  quantity: number;
  unit_price: number;
  unit_price_ht: number;
  is_first_unit_free: boolean;
  // Relations
  Equipment?: Equipment;
}

export interface FormulaDiscount extends BaseEntity {
  formula_id: number;
  equipment_id: number;
  discount_percentage: number;
  created_by: number;
  updated_by: number;
  // Relations
  formula?: Formula;
  equipment?: Equipment;
}

export interface FormulaEquipment extends BaseEntity {
  formula_id: number;
  equipment_id: number;
  quantity: number;
  is_mandatory: boolean;
  notes?: string;
  created_by: number;
  updated_by: number;
  // Relations
  formula?: Formula;
  equipment?: Equipment;
}

// ========================
// Interfaces de Formulaire
// ========================


export interface Company extends BaseEntity {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  comments?: string;
  establishmentType: EstablishmentType;
  organizationType: OrganizationType;
  typeOfFunctioning: FunctioningType;
  numberOfCanteens: number;
  numberOfCentralKitchens: number;
  createdBy: number;
  assignedTo?: number;
  interlocutors?: Interlocutor[];
  functionings?: Functioning[];
  simulations?: Simulation[];
}

export interface CompanyFormData {
  id?: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  comments?: string;
  establishment_type: EstablishmentType;
  organization_type: OrganizationType;
  number_of_canteens: number;
  number_of_central_kitchens: number;
  type_of_functioning: FunctioningType;
  interlocutors: Interlocutor[];
}

export interface QuoteFormData {
  company_id: number;
  interlocutor_id: number;
  formula_id?: number;
  engagement_duration: number;
  status: QuoteStatus;
  notes?: string;
  formula_options?: number[];
  equipments?: {
    equipment_id: number;
    quantity: number;
    unit_price: number;
    is_first_unit_free: boolean;
    unit_price_ht?: number;
  }[];
  discount_type?: 'percentage' | 'fixed_amount';
  discount_value?: number;
  discount_reason?: string;
}

// ========================
// Interfaces pour AssignModal
// ========================

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: SelectedEntities;
  viewMode: 'list' | 'grid';
  onAssign: () => void;
  setError: (error: string | null) => void; 
}

export interface Filters {
  search: string;
  type: string;
  status: string;
  date: string;
}

// ========================
// Interfaces Diverses
// ========================

export interface AssignableCompany {
  id: number;
  name: string;
}

export interface AssignableInterlocutor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface AssignableUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface DashboardData {
  companies: Company[];
  interlocutors: Interlocutor[];
}

export interface SelectableItem {
  id: number;
}

export interface ListViewProps<T extends SelectableItem> {
  items: T[];
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
  onRowClick: (item: T) => void;
}

export type ViewMode =
  | 'companies'
  | 'interlocutors'
  | 'independentInterlocutors'
  | 'users'
  | 'welleat'
  | 'simulations'
  | 'roles'
  | 'functions'
  | 'dashboard'
  | 'profile'
  | 'settings'
  | 'companyCreate'
  | 'companyEdit'
  | 'simulationCreate'
  | 'simulationEdit'
  | 'interlocutorCreate'
  | 'interlocutorEdit'
  | 'userCreate'
  | 'userEdit'
  | 'roleCreate'
  | 'roleEdit'
  | 'functionCreate'
  | 'functionEdit';

// ========================
// Interfaces pour Options
// ========================

export interface Option extends BaseEntity {
  id: number;
  name: string;
  description?: string;
  price_ht: string;
  price_ttc: string;
  category: 'installation' | 'maintenance' | 'hotline';
  createdAt?: string;
  updatedAt?: string;
}

export interface InitialFormulaData {
  name: string;
  description?: string;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  options?: Option[];
  price_ht?: number;
  equipments?: Equipment[];
}

export interface CreateFormulaDTO {
  name: string;
  description?: string;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  option_ids?: number[];
  equipment_ids?: number[];
}

export interface FormulaFilterParams {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  has_options?: boolean;
}

export interface FormulaFormData {
  name: string;
  description?: string;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  price_ht: number;
  options?: Option[];
  option_ids?: number[];
  equipments?: Equipment[];
}

export enum OptionCategory {
  INSTALLATION = 'installation',
  MAINTENANCE = 'maintenance',
  HOTLINE = 'hotline'
}

export interface FormulaOption {
  formula_id: number;
  option_id: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormulaOptionDetails {
  id: number;
  name: string;
  price_ht: number;
  price_ttc?: number;
}

export interface FormulaDetails {
  id: number;
  name: string;
  description?: string;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  options: Array<{
    id: number;
    name: string;
    price_ht: number;
    price_ttc?: number;
  }>;
}

// ========================
// Interfaces supplémentaires pour Email
// ========================

export interface EmailRecipient {
  email: string;
  firstName?: string;
  lastName?: string;
  isSelected?: boolean;
}

export interface EmailListProps {
  emails: EmailRecipient[];
  onRemoveEmail: (email: string) => void;
}

export interface EmailFormProps {
  onAddEmail: (email: string) => void;
  customEmail: string;
  setCustomEmail: (email: string) => void;
}
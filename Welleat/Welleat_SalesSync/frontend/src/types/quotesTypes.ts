// src/types/quotesTypes.ts

import { BaseEntity } from './index';

/**
 * Représente la structure d’une ligne d’équipement dans un devis.
 */
export interface Formula extends BaseEntity {
  name: string;
  description?: string;
  price_ht: number;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  options?: FormulaOption[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FormulaOption {
  id: number;
  name: string;
  price_ht: number;
  price_ttc?: number;
}

/**
 * Représente une formule (en base de données) + ses options
 */
export interface Formula {
  id: number;
  name: string;
  description?: string;
  price_ht: number;      
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  options?: FormulaOption[];
}

/**
 * Interface principale d'un Devis (côté base)
 */
export interface Quote extends BaseEntity {
  user_id: number;
  interlocutor_ids?: number[];
  company_id?: number;
  status: string; 
  valid_until?: Date | string;
  engagement_duration: number;
  formula_id?: number;
  installation_included: boolean;
  installation_one_time?: boolean;
  maintenance_included: boolean;
  hotline_included: boolean;
  notes?: string;
  discount_type?: 'percentage' | 'fixed_amount';
  discount_value?: number;
  discount_reason?: string;
  tax_rate: number;
  installation_price?: number;
  maintenance_price?: number;
  hotline_price?: number;
  total_ht?: number;
  total_ttc?: number;
}

/**
 * Interface ExtendedQuote, qui étend Quote
 */
export interface ExtendedQuote extends Quote {
  formula?: Formula;
  interlocutors?: Array<{
    id: number;
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    position: string;
    validity_months?: number;
    engagement_duration?: number;
    Quotes_Interlocutors: {
      is_primary: boolean;
      quote_id: number;
      interlocutor_id: number;
    };
  }>;

  /* Champs de calcul supplémentaires éventuellement renvoyés par le backend. */
  calculated_price?: number;
  monthly_ht?: number;
  monthly_ttc?: number;
  yearly_ht?: number;
  yearly_ttc?: number;
  total_discount?: number;
  total_discount_ttc?: number;

  /* Equipements si on veut la liste sur l’ExtendedQuote */
  equipments?: Array<{
    id: string;
    name: string;
    price_ht: number;
    quantity: number;
    isFirstUnitFree: boolean;
    QuoteEquipment: {
      quantity: number;
      is_first_unit_free: boolean;
      unit_price_ht: number;
    };
  }>;

  company: {
    id: number;
    name: string;
    address: string;
    postal_code: string;
    city: string;
    phone?: string;
    email?: string;
  };
}

/**
 * Données initiales pour créer un devis côté frontend
 */
export interface InitialQuoteData {
  user_id?: number;
  company_id?: number;
  interlocutor_ids?: number[];
  
  status?: string;
  formula_id?: number;
  formula_type?: string;
  engagement_duration?: number;
  discount_type?: 'percentage' | 'fixed_amount';
  discount_value?: number;
  discount_reason?: string;
  installation_included?: boolean;
  maintenance_included?: boolean;
  hotline_included?: boolean;
  tax_rate?: number;
  calculated_price?: number;
  notes?: string;
  installation_one_time?: boolean;
  valid_until?: string;
  equipments?: QuoteEquipmentLine[];
}

export interface QuoteEquipmentLine {
  equipment: {
    id?: number;
    name: string;
    price_ht: number;
  };
  quantity: number;
  isFirstUnitFree: boolean;
}

export interface FormulaDetails {
  id: number;
  name: string;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
  options: Array<{
    id: number;
    name: string;
    price_ht: number;
  }>;
}

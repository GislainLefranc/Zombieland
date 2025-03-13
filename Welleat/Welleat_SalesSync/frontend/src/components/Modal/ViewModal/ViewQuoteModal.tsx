import React, { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import * as modalStyles from '../../../styles/Modals/Modal.css';
import * as summaryStyles from '../../../styles/Modals/QuoteSummary.css'; // Styles dédiés au résumé du devis
import ViewModal from './ViewModal';
import { useProfile } from '../../../hooks/useProfile';
import Decimal from 'decimal.js';

// --------------------------------------------------------------------------------
// Fonctions utilitaires et interfaces locales
// --------------------------------------------------------------------------------

/**
 * Convertit une valeur en nombre à l'aide de parseFloat.
 * Remplace la virgule par un point pour éviter des NaN.
 */
function toNumber(val: any): number {
  const numeric = parseFloat(String(val).replace(',', '.'));
  return isNaN(numeric) ? 0 : numeric;
}

/**
 * Convertit une valeur en instance Decimal pour une précision accrue.
 * Utilise decimal.js pour éviter les imprécisions de flottants.
 */
function toDecimal(val: any): Decimal {
  const str = String(val ?? '0').replace(',', '.');
  try {
    return new Decimal(str);
  } catch {
    return new Decimal(0);
  }
}

/**
 * Interface décrivant les détails d'une formule.
 * Elle inclut les coûts pour l'installation, la maintenance, la hotline et les options.
 */
interface FormulaDetails {
  id: number;
  name: string;
  installation: number;
  maintenance: number;
  hotline: number;
  options: Array<{
    id: number;
    name: string;
    price_ht: number;
  }>;
  installation_price: number;
  maintenance_price: number;
  hotline_price: number;
}

/**
 * Interface décrivant une ligne d'équipement dans le devis.
 * Chaque ligne contient les informations de l'équipement, la quantité et si la première unité est gratuite.
 */
interface QuoteEquipmentLine {
  equipment: {
    id: number;
    name: string;
    price_ht: number;
  };
  quantity: number;
  isFirstUnitFree: boolean;
}

/**
 * Interface pour les valeurs calculées du résumé du devis.
 * Ces valeurs incluent la remise appliquée, le coût final mensuel, le coût du premier mois et le coût global.
 */
interface QuoteSummaryValues {
  discountBase: number;
  computedDiscountValueHT: number;
  computedFinalCostHT: number;
  computedFinalCostTTC: number;
  computedFirstMonthCostHT: number;
  computedFirstMonthCostTTC: number;
  computedOverallCostHT: number;
  computedOverallCostTTC: number;
  equipmentTotal: number; // Total des équipements (calculé séparément)
}

/**
 * Calcule les valeurs résumées du devis à l'aide de decimal.js pour plus de précision.
 *
 * @param params.selectedFormula - La formule sélectionnée (ou null)
 * @param params.installationOneTime - Si l'installation est facturée une seule fois
 * @param params.discountPercentage - Pourcentage de remise (ex: 20)
 * @param params.engagementDuration - Durée d'engagement en mois
 * @param params.taxRate - Taux de TVA (ex: 20)
 * @param params.equipments - Liste des équipements du devis
 */
function calculateQuoteSummary(params: {
  selectedFormula: FormulaDetails | null;
  installationOneTime: boolean;
  discountPercentage: number;
  engagementDuration: number;
  taxRate: number;
  equipments: QuoteEquipmentLine[];
}): QuoteSummaryValues {
  const {
    selectedFormula,
    installationOneTime,
    discountPercentage,
    engagementDuration,
    taxRate,
    equipments,
  } = params;

  // 1) Conversion des taux et durées en instances Decimal
  const dTaxRate = new Decimal(taxRate || 20);
  const dDiscountPct = new Decimal(discountPercentage || 0);
  const dEngagement = new Decimal(engagementDuration || 1);

  // 2) Calcul de la base mensuelle de la formule (maintenance + hotline + options)
  let formulaCost = new Decimal(0);
  if (selectedFormula) {
    // Ajoute la maintenance et la hotline à la base
    formulaCost = formulaCost
      .plus(toDecimal(selectedFormula.maintenance_price))
      .plus(toDecimal(selectedFormula.hotline_price));
    
    // Si l'installation n'est pas facturée une seule fois, elle est ajoutée au coût mensuel
    if (!installationOneTime) {
      formulaCost = formulaCost.plus(toDecimal(selectedFormula.installation_price));
    }
    
    // Ajoute le coût de chaque option associée à la formule
    if (selectedFormula.options?.length > 0) {
      for (const opt of selectedFormula.options) {
        formulaCost = formulaCost.plus(toDecimal(opt.price_ht));
      }
    }
  }

  // 3) Calcul du total des équipements sélectionnés
  const computedTotalEquipments = equipments.reduce((total, eq) => {
    // Si la première unité est gratuite et que la quantité est supérieure à 1, soustrait 1 de la quantité
    const quantity = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
    return total.plus(toDecimal(eq.equipment.price_ht).times(quantity));
  }, new Decimal(0));

  // 4) Base de remise : somme du coût de la formule et des équipements
  const discountBase = formulaCost.plus(computedTotalEquipments);
  const computedDiscountValueHT = discountBase.times(dDiscountPct.div(100));

  // 5) Coût mensuel final après remise (HT et TTC)
  const computedFinalCostHT = discountBase.minus(computedDiscountValueHT);
  const computedFinalCostTTC = computedFinalCostHT.times(dTaxRate.div(100).plus(1));

  // 6) Calcul du coût total sur la durée de l'engagement
  let computedOverallCostHT = computedFinalCostHT.times(dEngagement);
  
  // 7) Ajout du coût d'installation (si facturé une seule fois) au premier mois et à l'engagement total
  let computedFirstMonthCostHT = computedFinalCostHT;
  if (installationOneTime && selectedFormula) {
    const installationPrice = toDecimal(selectedFormula.installation_price);
    computedOverallCostHT = computedOverallCostHT.plus(installationPrice);
    computedFirstMonthCostHT = computedFirstMonthCostHT.plus(installationPrice);
  }

  // 8) Calcul des coûts TTC pour le premier mois et l'engagement global
  const computedFirstMonthCostTTC = computedFirstMonthCostHT.times(dTaxRate.div(100).plus(1));
  const computedOverallCostTTC = computedOverallCostHT.times(dTaxRate.div(100).plus(1));

  return {
    discountBase: discountBase.toNumber(),
    computedDiscountValueHT: computedDiscountValueHT.toNumber(),
    computedFinalCostHT: computedFinalCostHT.toNumber(),
    computedFinalCostTTC: computedFinalCostTTC.toNumber(),
    computedFirstMonthCostHT: computedFirstMonthCostHT.toNumber(),
    computedFirstMonthCostTTC: computedFirstMonthCostTTC.toNumber(),
    computedOverallCostHT: computedOverallCostHT.toNumber(),
    computedOverallCostTTC: computedOverallCostTTC.toNumber(),
    equipmentTotal: computedTotalEquipments.toNumber()
  };
}

// --------------------------------------------------------------------------------
// Composant principal : ViewQuoteModal
// --------------------------------------------------------------------------------

/**
 * Composant de visualisation détaillée d'un devis.
 * Il assemble et affiche les données du devis (expéditeur, interlocuteurs, entreprise,
 * engagement, formule, équipements, totaux, etc.) dans une modal.
 */
const ViewQuoteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  quote: any; // À remplacer par un type précis (par exemple ExtendedQuote)
}> = ({ isOpen, onClose, quote }) => {
  const navigate = useNavigate();
  const { profileData } = useProfile();

  // Journalisation du devis reçu pour débogage
  useEffect(() => {
    console.log('[ViewQuoteModal] Devis reçu :', quote);
  }, [quote]);

  // useMemo pour construire et mémoriser les données d'affichage à partir du devis et du profil
  const quoteData = React.useMemo(() => {
    if (!quote || !profileData) return null;

    // 1) Mappage de la formule
    const formulaData: FormulaDetails | null = quote.formula
      ? {
          id: quote.formula.id,
          name: quote.formula.name,
          installation: toNumber(quote.formula.installation_price || quote.formula.installationPrice),
          maintenance: toNumber(quote.formula.maintenance_price || quote.formula.maintenancePrice),
          hotline: toNumber(quote.formula.hotline_price || quote.formula.hotlinePrice),
          options: (quote.formula.options || []).map((opt: any) => ({
            id: opt.id,
            name: opt.name,
            price_ht: toNumber(opt.price_ht || opt.priceHt),
          })),
          installation_price: toNumber(quote.formula.installation_price || quote.formula.installationPrice),
          maintenance_price: toNumber(quote.formula.maintenance_price || quote.formula.maintenancePrice),
          hotline_price: toNumber(quote.formula.hotline_price || quote.formula.hotlinePrice),
        }
      : null;

    // 2) Mappage des équipements du devis en corrigeant la gratuité de la première unité
    const equipmentsMapped: QuoteEquipmentLine[] = (quote.equipments || []).map((eq: any) => {
      const quoteEquipment = eq.QuoteEquipment || {};
      const isFirstUnitFree = Boolean(quoteEquipment.is_first_unit_free);
      return {
        equipment: {
          id: Number(eq.id),
          name: eq.name,
          price_ht: toNumber(
            quoteEquipment.unit_price_ht || eq.price_ht || eq.priceHt || 0
          ),
        },
        quantity: Number(quoteEquipment.quantity || eq.quantity || 0),
        isFirstUnitFree,
      };
    });

    // 3) Calcul des valeurs résumées du devis (remise, coûts finaux, etc.)
    const summaryValues = {
      discountBase: toNumber(quote.monthlyHt) + toNumber(quote.totalDiscount / quote.engagementDuration),
      computedDiscountValueHT: toNumber(quote.totalDiscount / quote.engagementDuration),
      computedFinalCostHT: toNumber(quote.monthlyHt),
      computedFinalCostTTC: toNumber(quote.monthlyTtc),
      computedFirstMonthCostHT: toNumber(quote.monthlyHt) + (quote.installationOneTime ? toNumber(quote.installationPrice) : 0),
      computedFirstMonthCostTTC: toNumber(quote.monthlyTtc) + (quote.installationOneTime ? toNumber(quote.installationPrice) * (1 + toNumber(quote.taxRate) / 100) : 0),
      computedOverallCostHT: toNumber(quote.totalHt),
      computedOverallCostTTC: toNumber(quote.totalTtc),
      equipmentTotal: equipmentsMapped.reduce((sum, eq) => sum + (toNumber(eq.equipment.price_ht) * eq.quantity), 0)
    };

    // Journalisation des valeurs importantes pour débogage
    console.log('Quote values:', {
      monthly_ht: quote.monthlyHt,
      monthly_ttc: quote.monthlyTtc,
      total_ht: quote.totalHt,
      total_ttc: quote.totalTtc,
      installation_price: quote.installationPrice,
      tax_rate: quote.taxRate,
      total_discount: quote.totalDiscount
    });

    // 4) Assemblage final des données du devis pour affichage dans la modal
    const data = {
      user: {
        lastName: profileData.nom || 'N/A',
        firstName: profileData.prenom || 'N/A',
        email: profileData.email || 'N/A',
        phone: profileData.phone || '',
        position: profileData.position || '',
      },
      interlocutors: (quote.interlocutors || []).map((it: any) => ({
        lastName: it.lastName || it.last_name || 'N/A',
        firstName: it.firstName || it.first_name || 'N/A',
        email: it.email || 'N/A',
        phone: it.phone || '',
        position: it.position || '',
        isPrimary: Boolean(it.Quotes_Interlocutors?.is_primary),
      })),
      company: {
        name: quote.company?.name || 'N/A',
        address: quote.company?.address || 'N/A',
        postal_code: quote.company?.postal_code || quote.company?.postalCode || 'N/A',
        city: quote.company?.city || 'N/A',
        phone: quote.company?.phone || 'N/A',
        email: quote.company?.email || 'N/A',
      },
      engagement: {
        duration: toNumber(quote.engagement_duration || quote.engagementDuration) || 0,
        validUntil: quote.valid_until || quote.validUntil
          ? new Date(quote.valid_until || quote.validUntil).toLocaleDateString('fr-FR')
          : 'N/A',
        discount: toNumber(quote.discount_value || quote.discountValue),
      },
      totals: {
        equipmentTotal: summaryValues.equipmentTotal,
        formulaTotal: formulaData
          ? toNumber(formulaData.installation_price) +
            toNumber(formulaData.maintenance_price) +
            toNumber(formulaData.hotline_price) +
            (formulaData.options
              ? formulaData.options.reduce((sum, opt) => sum + toNumber(opt.price_ht), 0)
              : 0)
          : 0,
      },
      formula: formulaData,
      equipments: equipmentsMapped,
      summaryValues: summaryValues,
      discount: toNumber(quote.discount_value),
      taxRate: toNumber(quote.tax_rate),
      installation_one_time: Boolean(quote.installationOneTime || quote.installation_one_time),
    };
    console.log('Quote installation one time:', quote.installationOneTime, quote.installation_one_time);
    console.log('Converted installation one time:', Boolean(quote.installationOneTime || quote.installation_one_time));
    return data;
  }, [quote, profileData]);

  if (!isOpen || !quoteData) return null;

  // Affiche la modal de visualisation via un portail (ReactDOM.createPortal)
  return ReactDOM.createPortal(
    <ViewModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Détails du Devis #${quote.id}`}
      onEdit={undefined} 
    >
      <div className={modalStyles.form}>
        {/* SECTION: Expéditeur */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>Coordonnée - Expéditeur</h3>
          <div className={modalStyles.infoGrid}>
            <p><strong>Nom :</strong> {quoteData.user.lastName}</p>
            <p><strong>Prénom :</strong> {quoteData.user.firstName}</p>
            <p><strong>Email :</strong> {quoteData.user.email}</p>
            {quoteData.user.phone && (
              <p><strong>Téléphone :</strong> {quoteData.user.phone}</p>
            )}
            {quoteData.user.position && (
              <p><strong>Poste :</strong> {quoteData.user.position}</p>
            )}
          </div>
        </div>

        {/* SECTION: Interlocuteurs */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>Destination – Interlocuteurs</h3>
          {quoteData.interlocutors.length > 0 ? (
            <div className={modalStyles.infoGrid}>
              {quoteData.interlocutors.map((interlocutor, index) => (
                <div key={index} className={modalStyles.interlocutorCard}>
                  <h4>
                    {interlocutor.isPrimary ? 'Interlocuteur principal' : 'Interlocuteur supplémentaire'}
                  </h4>
                  <p><strong>Nom :</strong> {interlocutor.lastName}</p>
                  <p><strong>Prénom :</strong> {interlocutor.firstName}</p>
                  <p><strong>Email :</strong> {interlocutor.email}</p>
                  {interlocutor.phone && (
                    <p><strong>Téléphone :</strong> {interlocutor.phone}</p>
                  )}
                  {interlocutor.position && (
                    <p><strong>Poste :</strong> {interlocutor.position}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={modalStyles.noData}>Aucun interlocuteur.</p>
          )}
        </div>

        {/* SECTION: Entreprise */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>Destination – Entreprise</h3>
          <div className={modalStyles.infoGrid}>
            <p className={modalStyles.info}>
              <strong>Nom :</strong> {quoteData.company.name}
            </p>
            <p className={modalStyles.info}>
              <strong>Adresse :</strong> {quoteData.company.address}
            </p>
            <p className={modalStyles.info}>
              <strong>Code postal :</strong> {quoteData.company.postal_code}
            </p>
            <p className={modalStyles.info}>
              <strong>Ville :</strong> {quoteData.company.city}
            </p>
          </div>
        </div>

        {/* SECTION: Engagement */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>Engagement</h3>
          <div className={modalStyles.infoGrid}>
            <p>
              <strong>Durée d'engagement :</strong> {quoteData.engagement.duration} mois
            </p>
            <p>
              <strong>Validité du devis :</strong> {quoteData.engagement.validUntil}
            </p>
            {quoteData.engagement.discount > 0 && (
              <>
                <p><strong>Remise :</strong> {quoteData.engagement.discount} %</p>
                <p>
                  <em>
                    La remise s'applique uniquement sur le tarif mensuel récurrent
                    pour l'ensemble de la durée d'engagement.
                  </em>
                </p>
              </>
            )}
          </div>
        </div>

        {/* SECTION: Formule */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>
            Formule {quoteData.formula ? `- ${quoteData.formula.name}` : ''}
          </h3>
          {quoteData.formula ? (
            <div className={modalStyles.summaryItem}>
              <h5>Formule Sélectionnée :</h5>
              <p><strong>Nom :</strong> {quoteData.formula.name}</p>
              <p>
                <strong>Installation :</strong>{' '}
                {toNumber(quoteData.formula.installation_price).toFixed(2)} € HT{' '}
                {quote.installation_one_time && (
                  <span style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                    (Facturée une seule fois, non incluse dans le tarif mensuel)
                  </span>
                )}
              </p>
              <p>
                <strong>Maintenance :</strong>{' '}
                {toNumber(quoteData.formula.maintenance_price).toFixed(2)} € HT
              </p>
              <p>
                <strong>Hotline :</strong>{' '}
                {toNumber(quoteData.formula.hotline_price).toFixed(2)} € HT
              </p>
              {quoteData.formula.options && quoteData.formula.options.length > 0 && (
                <div className={modalStyles.optionsGrid}>
                  <h5>Options :</h5>
                  <ul>
                    {quoteData.formula.options.map((op) => (
                      <li key={op.id}>
                        {op.name} : {toNumber(op.price_ht).toFixed(2)} € HT
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className={modalStyles.noData}>Aucune formule sélectionnée</p>
          )}
        </div>

        {/* SECTION: Équipements */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>Équipements</h3>
          {quoteData.equipments.length > 0 ? (
            quoteData.equipments.map((equip) => (
              <div key={equip.equipment.id} className={modalStyles.infoGrid}>
                <p>
                  <strong>{equip.equipment.name}</strong>
                </p>
                <p>
                  <strong>Prix unitaire :</strong>{' '}
                  {equip.equipment.price_ht.toFixed(2)} € HT
                </p>
                <p>
                  <strong>Quantité :</strong> {equip.quantity}
                </p>
                {equip.isFirstUnitFree && (
                  <p>
                    <em>
                      (Première unité gratuite, non incluse dans les calculs mensuels)
                    </em>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className={modalStyles.noData}>Aucun équipement sélectionné</p>
          )}
        </div>

        {/* SECTION: Totaux du Devis */}
        <div className={modalStyles.section}>
          <h3 className={modalStyles.sectionTitle}>Total du Devis</h3>
          <div className={modalStyles.summarySection}>
            {/* QuoteSummaryWrapper affiche le résumé complet calculé à partir des données du devis */}
            <QuoteSummaryWrapper
              quoteData={quoteData} // Transmission de toutes les données du devis au résumé
            />
          </div>
        </div>
      </div>
    </ViewModal>,
    document.body
  );
};

export default ViewQuoteModal;

// --------------------------------------------------------------------------------
// Composants locaux pour le résumé du devis (duplication locale)
// --------------------------------------------------------------------------------

interface QuoteSummaryProps {
  quoteData: any; // Ensemble des données du devis à afficher
}

/**
 * Convertit une valeur en nombre en remplaçant la virgule par un point.
 */
const localToNumber = (val: any): number =>
  parseFloat(String(val).replace(',', '.')) || 0;

/**
 * Formate une valeur numérique en chaîne avec 2 décimales.
 */
function formatPrice(value: number): string {
  return (Math.round(value * 100) / 100).toFixed(2);
}

/**
 * Composant affichant un résumé détaillé du devis.
 * Il détaille les coûts de la formule, des équipements, la remise et les totaux.
 */
const QuoteSummary: React.FC<QuoteSummaryProps> = ({ quoteData }) => {
  const {
    formula,
    equipments,
    summaryValues,
    engagement,
    discount,
    taxRate,
    installation_one_time
  } = quoteData;

  const installationOneTime = !!installation_one_time;
  const discountPercentage = discount;
  const engagementDuration = engagement.duration;
  const effectiveTaxRate = taxRate || 20;

  // Vérifie si au moins un équipement bénéficie de la gratuité de la première unité
  const hasFreeUnit = equipments.some(eq => eq.isFirstUnitFree);
  const equipmentHelpMessage = hasFreeUnit
    ? "Les équipements bénéficiant de la gratuité de la première unité sont facturés en conséquence."
    : "Aucune gratuité n'est appliquée sur les équipements sélectionnés.";

  // Détermine le titre du tarif mensuel en fonction du mode d'installation
  const finalMonthlyTitle = installationOneTime && toNumber(formula?.installation_price) > 0
    ? "Tarif mensuel final (hors installation)"
    : "Tarif mensuel final";

  // Message explicatif pour la première facturation
  const firstBillingMessage = installationOneTime && toNumber(formula?.installation_price) > 0
    ? "Le premier mois inclut le tarif mensuel final (après remise) ainsi que le coût unique d'installation."
    : "Le tarif mensuel final s'applique dès le premier mois.";

  // Message indiquant si le tarif mensuel inclut ou non l'installation
  const monthlyMessage = installationOneTime && toNumber(formula?.installation_price) > 0
    ? "Ce tarif mensuel récurrent n'inclut pas le coût d'installation."
    : "Ce tarif mensuel récurrent inclut le coût d'installation.";

  return (
    <section className={summaryStyles.modalSection}>
      <div className={summaryStyles.summarySection}>
        <h3 className={summaryStyles.sectionTitle}>Total du Devis</h3>

        {/* 1. Détails de la Formule */}
        {formula && (
          <div className={summaryStyles.summaryItem}>
            <h4>Formule Sélectionnée</h4>
            <p><strong>Nom :</strong> {formula.name}</p>
            <p>
              <strong>Installation :</strong> {formatPrice(localToNumber(formula.installation_price))} € HT{" "}
              {installationOneTime && <em>(Facturée une seule fois)</em>}
            </p>
            <p>
              <strong>Maintenance :</strong> {formatPrice(localToNumber(formula.maintenance_price))} € HT
            </p>
            <p>
              <strong>Hotline :</strong> {formatPrice(localToNumber(formula.hotline_price))} € HT
            </p>
            {formula.options && formula.options.length > 0 && (
              <>
                <h4>Options</h4>
                <ul>
                  {formula.options.map(op => (
                    <li key={op.id}>
                      {op.name} : {formatPrice(localToNumber(op.price_ht))} € HT
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total Options :</strong> {formatPrice(
                    formula.options.reduce((sum, op) => sum + localToNumber(op.price_ht), 0)
                  )} € HT
                </p>
              </>
            )}
            <p>
              <strong>Coût de base (Installation + Maintenance + Hotline) :</strong>{" "}
              {formatPrice(
                localToNumber(formula.installation_price) +
                localToNumber(formula.maintenance_price) +
                localToNumber(formula.hotline_price)
              )} € HT
            </p>
            <p className={summaryStyles.summaryTotal}>
              <strong>Total Formule (avec option) :</strong> {formatPrice(
                localToNumber(formula.installation_price) +
                localToNumber(formula.maintenance_price) +
                localToNumber(formula.hotline_price) +
                (formula.options
                  ? formula.options.reduce((sum, op) => sum + localToNumber(op.price_ht), 0)
                  : 0)
              )} € HT
            </p>
          </div>
        )}

        {/* 2. Détails des Équipements */}
        <div className={summaryStyles.summaryItem}>
          <h4>Équipements Sélectionnés</h4>
          {equipments.length > 0 ? (
            <ul>
              {equipments.map((eq, idx) => {
                const effectiveQuantity = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
                const total = localToNumber(eq.equipment.price_ht) * effectiveQuantity;
                return (
                  <li key={idx}>
                    {eq.equipment.name} x {eq.quantity}{" "}
                    <span className={summaryStyles.smallText}>
                      (Facturés : {effectiveQuantity})
                    </span>{" "}
                    : {formatPrice(total)} € HT
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Aucun équipement sélectionné.</p>
          )}
          <small className={summaryStyles.smallText}>
            Total Équipements (sans gratuité) : {formatPrice(
              equipments.reduce((sum, eq) => sum + eq.quantity * localToNumber(eq.equipment.price_ht), 0)
            )} € HT<br />
            Total Équipements (avec gratuité) : {formatPrice(
              equipments.reduce((sum, eq) => {
                const effQty = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
                return sum + effQty * localToNumber(eq.equipment.price_ht);
              }, 0)
            )} € HT
          </small>
          <p className={summaryStyles.summaryTotal}>
            <strong>Total mensuel pour les équipements :</strong> {formatPrice(summaryValues.equipmentTotal)} € HT
          </p>
          <small className={summaryStyles.smallText}>{equipmentHelpMessage}</small>
        </div>

        {/* 3. Détails de la Remise */}
        {discountPercentage > 0 && (
          <div className={summaryStyles.summaryItem}>
            <hr className={summaryStyles.summaryDivider} />
            <h4>Remise</h4>
            <p><strong>Pourcentage de réduction :</strong> {discountPercentage} %</p>
            <div className={summaryStyles.calculationDetail}>
              <p>
                <strong>Base de calcul mensuelle :</strong> {formatPrice(summaryValues.discountBase)} € HT
              </p>
              <p>
                Calcul de la remise mensuelle : {formatPrice(summaryValues.discountBase)} € HT × {(discountPercentage / 100).toFixed(2)}
              </p>
              <p>
                <strong>Remise mensuelle :</strong> {formatPrice(summaryValues.computedDiscountValueHT)} € HT
              </p>
              <p>
                <strong>Remise mensuelle TTC :</strong> {formatPrice(summaryValues.computedDiscountValueHT * (1 + effectiveTaxRate / 100))} € TTC
              </p>
            </div>
            <p className={summaryStyles.summaryTotal}>
              <strong>Remise totale sur l'engagement :</strong> - {formatPrice(summaryValues.computedDiscountValueHT * engagementDuration)} € HT
            </p>
            <small className={summaryStyles.smallText}>
              La remise de {discountPercentage}% s'applique mensuellement dès le premier mois.
            </small>
          </div>
        )}

        {/* 4. Détails des Tarifs et Facturation */}
        <div className={summaryStyles.summaryItem}>
          {discountPercentage > 0 && (
            <>
              <h4>Coût Final Mensuel (après remise)</h4>
              <p className={summaryStyles.summaryTotal}>
                <strong>Tarif mensuel final HT :</strong> {formatPrice(summaryValues.computedFinalCostHT)} €
              </p>
              <p className={summaryStyles.summaryTotal}>
                <strong>Tarif mensuel final TTC :</strong> {formatPrice(summaryValues.computedFinalCostTTC)} €
              </p>
              <hr className={summaryStyles.summaryDivider} />
            </>
          )}

          <div className={summaryStyles.summaryItem}>
            <h4>
              Première Facturation {installationOneTime ? "avec installation" : ""}
            </h4>
            <p className={summaryStyles.summaryTotal}>
              <strong>Tarif, pour le premier mois, HT :</strong> {formatPrice(summaryValues.computedFirstMonthCostHT)} €
            </p>
            <p className={summaryStyles.summaryTotal}>
              <strong>Tarif, pour le premier mois, TTC :</strong> {formatPrice(summaryValues.computedFirstMonthCostTTC)} €
            </p>
            <small className={summaryStyles.smallText}>{firstBillingMessage}</small>
          </div>

          <div className={summaryStyles.summaryItem}>
            <h4>{finalMonthlyTitle}</h4>
            <p className={summaryStyles.summaryTotal}>
              <strong>Mensuel final HT (30 jours) :</strong> {formatPrice(summaryValues.computedFinalCostHT)} €
            </p>
            <p className={summaryStyles.summaryTotal}>
              <strong>Mensuel final TTC (30 jours) :</strong> {formatPrice(summaryValues.computedFinalCostTTC)} €
            </p>
            <small className={summaryStyles.smallText}>
              Ce tarif mensuel récurrent {installationOneTime ? "n'inclut pas" : "inclut"} le coût d'installation.
            </small>
          </div>

          <div className={summaryStyles.highlightedTariff}>
            <h4>Tarif Total Suivant Engagement</h4>
            <p className={summaryStyles.summaryTotal}>
              <strong>Engagement HT ({engagementDuration} mois) :</strong> {formatPrice(summaryValues.computedOverallCostHT)} €
            </p>
            <p className={summaryStyles.summaryTotal}>
              <strong>Engagement TTC ({engagementDuration} mois) :</strong> {formatPrice(summaryValues.computedOverallCostTTC)} €
            </p>
            <small className={summaryStyles.smallText}>
              Calculé en multipliant le tarif mensuel final (hors installation) par {engagementDuration} mois, auquel on ajoute une seule fois le coût d'installation (si applicable).<br />
              (Les légères différences sont dues à des arrondis.)
            </small>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Wrapper pour le composant QuoteSummary.
 * Il encapsule l'appel de calculateQuoteSummary et transmet les valeurs calculées au composant.
 */
const QuoteSummaryWrapper: React.FC<QuoteSummaryProps> = ({ quoteData }) => {
  return (
    <QuoteSummary
      quoteData={quoteData}
    />
  );
};

export { QuoteSummaryWrapper };

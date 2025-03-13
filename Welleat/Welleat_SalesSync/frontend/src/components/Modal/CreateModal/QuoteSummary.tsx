//// Dossier : src/components/modals, Fichier : QuoteSummary.tsx
/* 
  Ce composant affiche un résumé détaillé du devis.
  Il inclut les informations sur la formule sélectionnée, les équipements,
  la remise appliquée et le calcul final des coûts (mensuels, premier mois, et global).
  Les fonctions utilitaires utilisent decimal.js pour une meilleure précision.
*/

import React from 'react';
import * as styles from '../../../styles/Modals/QuoteSummary.css';
import { FormulaDetails } from '../../../types/index';
import { QuoteEquipmentLine } from '../../../types/quotesTypes';
import { calculateQuoteSummary } from '../../../utils/calculateQuoteSummary';

// Helper pour convertir une valeur en nombre
const toNumber = (val: any): number => parseFloat(val) || 0;

// Formatage du prix avec deux décimales
const formatPrice = (value: number): string => {
  return (Math.round(value * 100) / 100).toFixed(2);
};

export interface QuoteSummaryProps {
  selectedFormula: FormulaDetails | null; // Formule sélectionnée
  installationOneTime: boolean; // Indique si l'installation est facturée une seule fois
  formulaTotalCost: number;    // Total de la formule incluant options et installation si applicable
  equipments: QuoteEquipmentLine[]; // Liste des équipements sélectionnés
  totalEquipments: number;     // Total mensuel des équipements (calculé séparément)
  discountPercentage: number;  // Pourcentage de réduction appliqué
  monthlyFormulaCost: number;  // Coût mensuel de la formule avant installation
  installationPrice: number;   // Coût d'installation
  engagementDuration: number;  // Durée de l'engagement en mois
  taxRate: number;             // Taux de TVA
  // Valeurs calculées via calculateQuoteSummary :
  discountBase: number;
  computedDiscountValueHT: number;
  computedFinalCostHT: number;
  computedFinalCostTTC: number;
  computedFirstMonthCostHT: number;
  computedFirstMonthCostTTC: number;
  computedOverallCostHT: number;
  computedOverallCostTTC: number;
}

const QuoteSummary: React.FC<QuoteSummaryProps> = ({
  selectedFormula,
  installationOneTime,
  formulaTotalCost,
  equipments,
  totalEquipments,
  discountPercentage,
  monthlyFormulaCost,
  installationPrice,
  engagementDuration,
  taxRate,
  discountBase,
  computedDiscountValueHT,
  computedFinalCostHT,
  computedFinalCostTTC,
  computedFirstMonthCostHT,
  computedFirstMonthCostTTC,
  computedOverallCostHT,
  computedOverallCostTTC,
}) => {
  // Titres et messages dynamiques en fonction de l'installation
  const finalMonthlyTitle = installationOneTime
    ? "Tarif mensuel final (hors installation)"
    : "Tarif mensuel final (avec installation)";
  const firstBillingMessage = installationOneTime
    ? "Le premier mois inclut le tarif mensuel final (après remise) ainsi que le coût unique d'installation."
    : "Le tarif mensuel final s'applique dès le premier mois.";

  // Vérifie si au moins un équipement bénéficie de la gratuité de la première unité
  const hasFreeUnit = equipments.some(eq => eq.isFirstUnitFree);
  const equipmentHelpMessage = hasFreeUnit
    ? "Les équipements bénéficiant de la gratuité de la première unité sont facturés en conséquence."
    : "Aucune gratuité n'est appliquée sur les équipements sélectionnés.";
  const effectiveTaxRate = taxRate || 20;

  return (
    <section className={styles.modalSection}>
      <div className={styles.summarySection}>
        <h3 className={styles.sectionTitle}>Total du Devis</h3>

        {/* 1. Formule */}
        {selectedFormula && (
          <div className={styles.summaryItem}>
            <h4>Formule Sélectionnée</h4>
            <p><strong>Nom :</strong> {selectedFormula.name}</p>
            <p>
              <strong>Installation :</strong> {formatPrice(toNumber(selectedFormula.installation_price))} € HT{" "}
              {installationOneTime && <em>(Facturée une seule fois)</em>}
            </p>
            <p><strong>Maintenance :</strong> {formatPrice(toNumber(selectedFormula.maintenance_price))} € HT</p>
            <p><strong>Hotline :</strong> {formatPrice(toNumber(selectedFormula.hotline_price))} € HT</p>
            {selectedFormula.options && selectedFormula.options.length > 0 && (
              <>
                <h4>Options</h4>
                <ul>
                  {selectedFormula.options.map(op => (
                    <li key={op.id}>
                      {op.name} : {formatPrice(toNumber(op.price_ht))} € HT
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Total Options :</strong> {formatPrice(
                    selectedFormula.options.reduce((sum, op) => sum + toNumber(op.price_ht), 0)
                  )} € HT
                </p>
              </>
            )}
            <p>
              <strong>Coût de base (Installation + Maintenance + Hotline) :</strong>{" "}
              {formatPrice(
                toNumber(selectedFormula.installation_price) +
                toNumber(selectedFormula.maintenance_price) +
                toNumber(selectedFormula.hotline_price)
              )} € HT
            </p>
            <p className={styles.summaryTotal}>
              <strong>Total Formule (avec option) :</strong> {formatPrice(formulaTotalCost)} € HT
            </p>
          </div>
        )}

        {/* 2. Équipements */}
        <div className={styles.summaryItem}>
          <h4>Équipements Sélectionnés</h4>
          {equipments.length > 0 ? (
            <ul>
              {equipments.map((eq, idx) => {
                const effectiveQuantity = eq.isFirstUnitFree ? Math.max(eq.quantity - 1, 0) : eq.quantity;
                return (
                  <li key={idx}>
                    {eq.equipment.name} x {eq.quantity}{" "}
                    <span className={styles.smallText}>
                      (Facturés : {effectiveQuantity})
                    </span>{" "}
                    : {formatPrice(toNumber(eq.equipment.price_ht) * effectiveQuantity)} € HT
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Aucun équipement sélectionné.</p>
          )}
          <small className={styles.smallText}>
            Total Équipements (sans gratuité) : {formatPrice(
              equipments.reduce((sum, eq) => sum + eq.quantity * toNumber(eq.equipment.price_ht), 0)
            )} € HT<br />
            Total Équipements (avec gratuité) : {formatPrice(
              equipments.reduce((sum, eq) => {
                const effQty = eq.isFirstUnitFree && eq.quantity > 1 ? (eq.quantity - 1) : eq.quantity;
                return sum + effQty * toNumber(eq.equipment.price_ht);
              }, 0)
            )} € HT
          </small>
          <p className={styles.summaryTotal}>
            <strong>Total mensuel pour les équipements :</strong> {formatPrice(
              equipments.reduce((sum, eq) => {
                const effQty = eq.isFirstUnitFree && eq.quantity > 1 ? (eq.quantity - 1) : eq.quantity;
                return sum + toNumber(eq.equipment.price_ht) * effQty;
              }, 0)
            )} € HT
          </p>
          <small className={styles.smallText}>{equipmentHelpMessage}</small>
        </div>

        {/* 3. Remise */}
        {discountPercentage > 0 && (
          <div className={styles.summaryItem}>
            <hr className={styles.summaryDivider} />
            <h4>Remise</h4>
            <p><strong>Pourcentage de réduction :</strong> {discountPercentage} %</p>
            <div className={styles.calculationDetail}>
              <p><strong>Base de calcul mensuelle :</strong> {formatPrice(discountBase)} € HT</p>
              <p>Calcul de la remise mensuelle : {formatPrice(discountBase)} € HT × {(discountPercentage / 100).toFixed(2)}</p>
              <p><strong>Remise mensuelle :</strong> {formatPrice(computedDiscountValueHT)} € HT</p>
              <p><strong>Remise mensuelle TTC :</strong> {formatPrice(computedDiscountValueHT * (1 + effectiveTaxRate / 100))} € TTC</p>
            </div>
            <p className={styles.summaryTotal}>
              <strong>Remise totale sur l'engagement :</strong> - {formatPrice(computedDiscountValueHT * engagementDuration)} € HT
            </p>
            <small className={styles.smallText}>
              La remise de {discountPercentage}% s'applique mensuellement dès le premier mois.
            </small>
          </div>
        )}

        {/* 4. Tarifs et Facturation */}
        <div className={styles.summaryItem}>
          {discountPercentage > 0 && (
            <>
              <h4>Coût Final Mensuel (après remise)</h4>
              <p className={styles.summaryTotal}>
                <strong>Tarif mensuel final HT :</strong> {formatPrice(computedFinalCostHT)} €
              </p>
              <p className={styles.summaryTotal}>
                <strong>Tarif mensuel final TTC :</strong> {formatPrice(computedFinalCostTTC)} €
              </p>
              <hr className={styles.summaryDivider} />
            </>
          )}

          <div className={styles.summaryItem}>
            <h4>
              Première Facturation {installationOneTime ? "avec installation" : ""}
            </h4>
            <p className={styles.summaryTotal}>
              <strong>Tarif, pour le premier mois, HT :</strong> {formatPrice(computedFirstMonthCostHT)} €
            </p>
            <p className={styles.summaryTotal}>
              <strong>Tarif, pour le premier mois, TTC :</strong> {formatPrice(computedFirstMonthCostTTC)} €
            </p>
            <small className={styles.smallText}>{firstBillingMessage}</small>
          </div>

          <div className={styles.summaryItem}>
            <h4>{finalMonthlyTitle}</h4>
            <p className={styles.summaryTotal}>
              <strong>Mensuel final HT (30 jours) :</strong> {formatPrice(computedFinalCostHT)} €
            </p>
            <p className={styles.summaryTotal}>
              <strong>Mensuel final TTC (30 jours) :</strong> {formatPrice(computedFinalCostTTC)} €
            </p>
            <small className={styles.smallText}>
              Ce tarif mensuel récurrent {installationOneTime ? "n'inclut pas" : "inclut"} le coût d'installation.
            </small>
          </div>

          <div className={styles.highlightedTariff}>
            <h4>Tarif Total Suivant Engagement</h4>
            <p className={styles.summaryTotal}>
              <strong>Engagement HT ({engagementDuration} mois) :</strong> {formatPrice(computedOverallCostHT)} €
            </p>
            <p className={styles.summaryTotal}>
              <strong>Engagement TTC ({engagementDuration} mois) :</strong> {formatPrice(computedOverallCostTTC)} €
            </p>
            <small className={styles.smallText}>
              Calculé en multipliant le tarif mensuel final (hors installation) par {engagementDuration} mois, auquel on ajoute une seule fois le coût d'installation (si applicable).
              <br />(Les légères différences sont dues à des arrondis.)
            </small>
          </div>
        </div>
      </div>
    </section>
  );
};

// Wrapper permettant d'appeler calculateQuoteSummary et de passer les valeurs calculées au composant QuoteSummary
interface QuoteSummaryPropsExtended extends QuoteSummaryProps {}

const QuoteSummaryWrapper: React.FC<QuoteSummaryPropsExtended> = (props) => {
  const summaryValues = calculateQuoteSummary({
    selectedFormula: props.selectedFormula,
    installationOneTime: props.installationOneTime,
    discountPercentage: props.discountPercentage,
    engagementDuration: props.engagementDuration,
    taxRate: props.taxRate,
    equipments: props.equipments,
  });
  return (
    <QuoteSummary
      {...props}
      totalEquipments={props.equipments.reduce((sum, eq) => {
        const effectiveQuantity = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
        return sum + toNumber(eq.equipment.price_ht) * effectiveQuantity;
      }, 0)}
      discountBase={summaryValues.discountBase}
      computedDiscountValueHT={summaryValues.computedDiscountValueHT}
      computedFinalCostHT={summaryValues.computedFinalCostHT}
      computedFinalCostTTC={summaryValues.computedFinalCostTTC}
      computedFirstMonthCostHT={summaryValues.computedFirstMonthCostHT}
      computedFirstMonthCostTTC={summaryValues.computedFirstMonthCostTTC}
      computedOverallCostHT={summaryValues.computedOverallCostHT}
      computedOverallCostTTC={summaryValues.computedOverallCostTTC}
    />
  );
};

export default QuoteSummaryWrapper;

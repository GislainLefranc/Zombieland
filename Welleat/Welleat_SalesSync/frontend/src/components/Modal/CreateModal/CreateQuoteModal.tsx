/*
Dossier : src/components/modals
Fichier : CreateQuoteModal.tsx
Description : Cette modal permet de créer un devis. Elle inclut la sélection d'interlocuteurs, d'entreprises,
             de formules, d'équipements et le calcul des totaux (en tenant compte de cas particuliers comme
             la gratuité de la première unité d'équipement et l'installation facturée une seule fois).

             Toutes les fonctions de calcul (calculateQuoteSummary, toDecimal, formatPrice, etc.)
             et le composant d'affichage du résumé (QuoteSummary) sont désormais inclus localement.
*/

import React, { useState, useEffect, FormEvent } from 'react';
import ReactDOM from 'react-dom';
import * as styles from '../../../styles/Modals/Modal.css';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../Button/Button';
import EquipmentSelector from '../../GenericTable/EquipmentSelector';
import { useProfile } from '../../../hooks/useProfile';
import { useAuth } from '../../../hooks/useAuth';
import Decimal from 'decimal.js';

// Types métier et interfaces
import { Interlocutor, Company } from '../../../types/index';
import { InitialQuoteData, QuoteEquipmentLine, FormulaDetails } from '../../../types/quotesTypes';

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: InitialQuoteData;
  onCreate: (data: any) => void;
}

/**
 * Composant principal : CreateQuoteModal
 * Permet de créer un devis, isolé des fichiers de calcul externes.
 */
const CreateQuoteModal: React.FC<CreateQuoteModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onCreate,
}) => {
  console.log('[CreateQuoteModal] initialData:', initialData);

  const { profileData } = useProfile();
  const { user } = useAuth();

  // Journalisation pour débogage
  useEffect(() => {
    console.log('[CreateQuoteModal] profileData:', profileData);
    console.log('[CreateQuoteModal] user:', user);
  }, [profileData, user]);

  // États pour la sélection d'interlocuteurs, d'entreprises, formule, équipements, etc.
  const [interlocuteurs, setInterlocuteurs] = useState<Interlocutor[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedInterlocuteurs, setSelectedInterlocuteurs] = useState<Interlocutor[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [userId, setUserId] = useState<number | ''>(initialData.user_id || (user ? user.id : ''));
  const [companyId, setCompanyId] = useState<number | ''>(initialData.company_id ?? '');
  const [status, setStatus] = useState<string>(initialData.status || 'projet');
  const [installationOneTime, setInstallationOneTime] = useState(initialData.installation_one_time ?? true);

  const [validite, setValidite] = useState<number>(1);
  const [engagementDuration, setEngagementDuration] = useState<number>(
    [6, 12, 24, 36].includes(initialData.engagement_duration)
      ? initialData.engagement_duration
      : 12
  );
  const [discountPercentage, setDiscountPercentage] = useState<number>(initialData.discount_value ?? 0);

  const [formulas, setFormulas] = useState<FormulaDetails[]>([]);
  const [selectedFormula, setSelectedFormula] = useState<FormulaDetails | null>(null);

  const [installationIncluded, setInstallationIncluded] = useState<boolean>(initialData.installation_included ?? true);
  const [maintenanceIncluded, setMaintenanceIncluded] = useState<boolean>(initialData.maintenance_included ?? true);
  const [hotlineIncluded, setHotlineIncluded] = useState<boolean>(initialData.hotline_included ?? true);
  const [taxRate, setTaxRate] = useState<number>(initialData.tax_rate || 20);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(initialData.calculated_price || 0);
  const [equipments, setEquipments] = useState<QuoteEquipmentLine[]>(initialData.equipments || []);
  const [notes, setNotes] = useState<string>(initialData.notes || '');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /**
   * Fonction pour réinitialiser la modal à ses valeurs par défaut.
   */
  const resetModal = () => {
    setSelectedInterlocuteurs([]);
    setSelectedCompany(null);
    setUserId(user ? user.id : '');
    setCompanyId('');
    setStatus('projet');
    setInstallationOneTime(true);
    setValidite(1);
    setEngagementDuration(6); // Valeur par défaut : 6 mois
    setDiscountPercentage(0);
    setSelectedFormula(null); // Aucune formule sélectionnée par défaut
    setInstallationIncluded(true);
    setMaintenanceIncluded(true);
    setHotlineIncluded(true);
    setTaxRate(20);
    setCalculatedPrice(0);
    setEquipments([]);
    setNotes('');

    // Réinitialisation forcée des sélecteurs et checkboxes après rendu
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        if (select.getAttribute('id') === 'engagementDuration') {
          select.value = '6';
        } else if (select.getAttribute('id') === 'formula') {
          // Pour le select de formule, la valeur vide correspond à "Aucune formule sélectionnée"
          select.value = '';
        } else {
          select.value = '';
        }
        select.selectedIndex = 0;
      });

      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        if (checkbox.id !== 'installationOneTime') {
          checkbox.checked = false;
        } else {
          checkbox.checked = true;
        }
      });
    }, 0);
  };

  // Réinitialisation de la modal à l'ouverture
  useEffect(() => {
    if (isOpen) {
      resetModal();
    }
  }, [isOpen, user]);

  // Chargement des entreprises et interlocuteurs
  useEffect(() => {
    if (!isOpen || !user) return;
    const loadData = async () => {
      try {
        const [companiesResponse, interlocuteursResponse] = await Promise.all([
          axiosInstance.get('/users/me/companies'),
          axiosInstance.get('/users/me/interlocutors')
        ]);

        // Récupération des entreprises
        const companiesData = Array.isArray(companiesResponse.data)
          ? companiesResponse.data
          : companiesResponse.data.data || [];
        setCompanies(companiesData);
        console.log('[CreateQuoteModal] Companies chargées:', companiesData);

        // Récupération des interlocuteurs
        const interlocuteursData = Array.isArray(interlocuteursResponse.data)
          ? interlocuteursResponse.data
          : interlocuteursResponse.data.data || [];
        console.log('[CreateQuoteModal] Interlocuteurs chargés:', interlocuteursData);

        // Sélection initiale d'un interlocuteur si initialData.interlocutor_id
        if (initialData.interlocutor_id) {
          const found = interlocuteursData.find(i => i.id === initialData.interlocutor_id);
          if (found) {
            setSelectedInterlocuteurs([found]);
            console.log('[CreateQuoteModal] Interlocuteur initial sélectionné:', found);
          } else {
            console.warn('[CreateQuoteModal] Aucun interlocuteur trouvé pour l\'ID:', initialData.interlocutor_id);
          }
        }
        setInterlocuteurs(interlocuteursData);
      } catch (error) {
        console.error('[CreateQuoteModal] Erreur chargement données:', error);
        toast.error("Erreur lors de la récupération des données");
      }
    };
    loadData();
  }, [isOpen, user, initialData.interlocutor_id]);

  // Chargement des formules (aucune formule n'est sélectionnée par défaut)
  useEffect(() => {
    if (!isOpen) return;
    const loadFormulas = async () => {
      try {
        const response = await axiosInstance.get('/formulas');
        const formulasData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        const mappedFormulas = formulasData.map((f: any) => ({
          id: f.id,
          name: f.name,
          description: f.description,
          installation_price: toNumber(f.installation_price || f.installationPrice),
          maintenance_price: toNumber(f.maintenance_price || f.maintenancePrice),
          hotline_price: toNumber(f.hotline_price || f.hotlinePrice),
          options: f.options || []
        }));
        setFormulas(mappedFormulas);
      } catch (error) {
        console.error('[CreateQuoteModal] Erreur chargement formules:', error);
        toast.error("Erreur lors du chargement des formules");
      }
    };
    loadFormulas();
  }, [isOpen]);

  // Calcul des totaux via la fonction locale calculateQuoteSummary
  const summaryValues = calculateQuoteSummary({
    selectedFormula,
    installationOneTime,
    discountPercentage,
    engagementDuration,
    taxRate,
    equipments,
  });

  // Mise à jour du prix calculé
  useEffect(() => {
    const totalInitTTC = summaryValues.computedFinalCostHT * (1 + taxRate / 100);
    console.log('[CreateQuoteModal] totalInitTTC:', totalInitTTC);
    setCalculatedPrice(totalInitTTC);
  }, [summaryValues, taxRate]);

  // Gestionnaires d'événements
  const handleInterlocuteurSelect = (id: number) => {
    const found = interlocuteurs.find((i) => i.id === id);
    if (found && !selectedInterlocuteurs.some((sel) => sel.id === found.id)) {
      setSelectedInterlocuteurs((prev) => [...prev, found]);
    }
  };

  const handleInterlocuteurRemove = (id: number) => {
    setSelectedInterlocuteurs((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCompanySelect = (id: number) => {
    const found = companies.find((c) => c.id === id) || null;
    setSelectedCompany(found);
    setCompanyId(id);
  };

  const handleCompanyRemove = () => {
    setSelectedCompany(null);
    setCompanyId('');
  };

  const handleFormulaSelect = async (formulaId: number) => {
    try {
      if (!formulaId) {
        setSelectedFormula(null);
        return;
      }
      const res = await axiosInstance.get(`/formulas/${formulaId}`);
      const f = res.data.data;
      const mappedFormula: FormulaDetails = {
        id: f.id,
        name: f.name,
        description: f.description,
        installation_price: toNumber(f.installation_price || f.installationPrice),
        maintenance_price: toNumber(f.maintenance_price || f.maintenancePrice),
        hotline_price: toNumber(f.hotline_price || f.hotlinePrice),
        options: (f.options || []).map((opt: any) => ({
          id: opt.id,
          name: opt.name,
          price_ht: toNumber(opt.price_ht || opt.priceHt),
        })),
      };
      setSelectedFormula(mappedFormula);
    } catch (error) {
      console.error('Erreur handleFormulaSelect:', error);
      toast.error('Erreur lors du chargement de la formule');
    }
  };

  /**
   * Soumission du formulaire de création de devis
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('[CreateQuoteModal] Soumission formulaire');

    // Vérification des champs obligatoires avec messages spécifiques
    const validations = [
      { condition: !!userId, message: "L'identifiant utilisateur est manquant" },
      { condition: selectedInterlocuteurs.length > 0, message: "Veuillez sélectionner au moins un interlocuteur" },
      { condition: !!companyId, message: "Veuillez sélectionner une entreprise" },
      { condition: !!selectedFormula?.id, message: "Veuillez sélectionner une formule" }
    ];

    for (const validation of validations) {
      if (!validation.condition) {
        toast.error(validation.message, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true
        });
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const validatedEquipments = equipments.map(eq => ({
        equipment_id: eq.equipment.id,
        quantity: Number(eq.quantity),
        is_first_unit_free: Boolean(eq.isFirstUnitFree),
        unit_price_ht: Number(eq.equipment.price_ht)
      }));

      const payload = {
        user_id: Number(userId),
        interlocutor_ids: selectedInterlocuteurs.map(i => i.id),
        company_id: Number(companyId),
        formula_id: selectedFormula?.id || null,
        installation_included: installationIncluded,
        installation_one_time: installationOneTime,
        installation_price: selectedFormula?.installation_price || 0,
        maintenance_price: selectedFormula?.maintenance_price || 0,
        hotline_price: selectedFormula?.hotline_price || 0,
        status: status,
        valid_until: new Date(new Date().setMonth(new Date().getMonth() + validite))
                        .toISOString()
                        .split('T')[0],
        engagement_duration: Number(engagementDuration),
        notes: notes,
        tax_rate: Number(taxRate),
        maintenance_included: maintenanceIncluded,
        hotline_included: hotlineIncluded,
        // Correction ici
        discount_type: discountPercentage > 0 ? 'percentage' : 'none',
        discount_value: discountPercentage || 0,
        discount_reason: discountPercentage > 0 ? 'Offre de lancement' : null,
        equipments: validatedEquipments,
      };
      console.log('[CreateQuoteModal] Payload final:', JSON.stringify(payload, null, 2));

      await onCreate(payload);
      onClose(); // Fermer d'abord la modal
      resetModal(); // Puis réinitialiser le formulaire
    } catch (error: any) {
      console.error('[CreateQuoteModal] Erreur:', error);
      toast.error(error.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ne pas afficher si la modal est fermée
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.content} onClick={(e) => e.stopPropagation()}>
        {/* En-tête avec fond vert et logo, ainsi que le titre */}
        <div className={styles.header}>
          <img
            src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png"
            alt="Logo Welleat"
            className={styles.logo}
          />
          <h4 className={styles.title}>
            Créer un Devis {initialData.quoteNumber ? `#${initialData.quoteNumber}` : ''}
          </h4>
        </div>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Fermer la modal">
          &times;
        </button>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ---------- Section Coordonnée ---------- */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <h3>Coordonnée</h3>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Expéditeur</label>
              {profileData ? (
                <div className={styles.userInfo}>
                  <p><strong>Nom :</strong> {profileData.nom || 'N/A'}</p>
                  <p><strong>Prénom :</strong> {profileData.prenom || 'N/A'}</p>
                  <p><strong>Email :</strong> {profileData.email || 'N/A'}</p>
                  <p><strong>Téléphone :</strong> {profileData.phone || 'N/A'}</p>
                  <p><strong>Poste :</strong> {profileData.position || 'N/A'}</p>
                </div>
              ) : (
                <p>Chargement du profil...</p>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Destination – Interlocuteurs</label>
              <select
                className={styles.select}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  if (id) handleInterlocuteurSelect(id);
                }}
                value=""
              >
                <option value="">Sélectionnez un interlocuteur</option>
                {interlocuteurs.map((i) => {
                  const firstName = i.first_name || i.firstName || '';
                  const lastName = i.last_name || i.lastName || '';
                  return (
                    <option key={i.id} value={i.id}>
                      {firstName} {lastName} – {i.email} – {i.phone || 'N/A'}
                    </option>
                  );
                })}
              </select>
              {selectedInterlocuteurs.length > 0 && (
                <div className={styles.selectedInterlocuteurs}>
                  {selectedInterlocuteurs.map((i) => (
                    <div key={i.id} className={styles.selectedInterlocuteur}>
                      <button
                        onClick={() => handleInterlocuteurRemove(i.id)}
                        className={styles.removeButton}
                        type="button"
                        aria-label={`Retirer interlocuteur ${i.first_name} ${i.last_name}`}
                      >
                        ×
                      </button>
                      <p><strong>Nom :</strong> {i.first_name} {i.last_name}</p>
                      <p><strong>Email :</strong> {i.email}</p>
                      <p><strong>Téléphone :</strong> {i.phone || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Destination – Entreprise</label>
              <select
                className={styles.select}
                value={companyId}
                onChange={(e) => handleCompanySelect(Number(e.target.value))}
              >
                <option value="">Sélectionnez une entreprise</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} – {c.address} – {c.city} {c.postalCode}
                  </option>
                ))}
              </select>
              {selectedCompany && (
                <div className={styles.userInfo}>
                  <button onClick={handleCompanyRemove} className={styles.removeButton} type="button">
                    ×
                  </button>
                  <p><strong>Nom :</strong> {selectedCompany.name}</p>
                  <p>
                    <strong>Adresse :</strong> {selectedCompany.address || 'N/A'}, {selectedCompany.city || 'N/A'} {selectedCompany.postalCode || ''}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Statut du Devis</label>
              <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="projet">Projet</option>
                <option value="accepté">Accepté</option>
                <option value="refusé">Refusé</option>
                <option value="en_cours">En cours</option>
                <option value="terminé">Terminé</option>
              </select>
            </div>
          </section>

          {/* ---------- Section Engagement ---------- */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <h3>Engagement</h3>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Durée d'engagement</label>
              <select className={styles.select} value={engagementDuration} onChange={(e) => setEngagementDuration(Number(e.target.value))}>
                <option value={6}>6 mois</option>
                <option value={12}>12 mois</option>
                <option value={24}>24 mois</option>
                <option value={36}>36 mois</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Pourcentage de réduction</label>
              <select className={styles.select} value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))}>
                <option value={0}>0 %</option>
                <option value={5}>5 %</option>
                <option value={10}>10 %</option>
                <option value={15}>15 %</option>
                <option value={20}>20 %</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Facturer l'installation une seule fois sur la durée d'engagement
              </label>
              <input
                type="checkbox"
                checked={installationOneTime}
                onChange={(e) => setInstallationOneTime(e.target.checked)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Validité du devis (en mois)</label>
              <select className={styles.select} value={validite} onChange={(e) => setValidite(Number(e.target.value))}>
                <option value={1}>1 mois</option>
                <option value={2}>2 mois</option>
                <option value={3}>3 mois</option>
              </select>
            </div>
          </section>

          {/* ---------- Section Formule ---------- */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <h3>Formule</h3>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Sélectionnez une formule</label>
              <select
                id="formula"
                className={styles.select}
                value={selectedFormula ? selectedFormula.id : ''}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  handleFormulaSelect(val);
                }}
              >
                <option value="">Aucune formule sélectionnée</option>
                {formulas.length > 0 ? (
                  formulas.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))
                ) : (
                  <option disabled>Chargement des formules...</option>
                )}
              </select>
            </div>
            {selectedFormula && (
              <div className={styles.formGroup} style={{ fontSize: '0.9rem', color: '#555' }}>
                <p><strong>Installation :</strong> {toNumber(selectedFormula.installation_price).toFixed(2)} € HT</p>
                <p><strong>Maintenance :</strong> {toNumber(selectedFormula.maintenance_price).toFixed(2)} € HT</p>
                <p><strong>Hotline :</strong> {toNumber(selectedFormula.hotline_price).toFixed(2)} € HT</p>
                {selectedFormula.options && selectedFormula.options.length > 0 && (
                  <>
                    <p style={{ marginTop: '0.5rem' }}>
                      <strong>Options de la formule :</strong>
                    </p>
                    <ul style={{ marginLeft: '1.2rem' }}>
                      {selectedFormula.options.map((op) => (
                        <li key={op.id}>
                          {op.name} ({toNumber(op.price_ht).toFixed(2)} € HT)
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </section>

          {/* ---------- Section Équipements ---------- */}
          <section className={styles.section}>
            <div className={styles.sectionTitle}>
              <h3>Équipements</h3>
            </div>
            <EquipmentSelector equipments={equipments} setEquipments={setEquipments} />
          </section>

          {/* ---------- Section Total du Devis (Résumé) ---------- */}
          <QuoteSummary
            selectedFormula={selectedFormula}
            installationOneTime={installationOneTime}
            formulaTotalCost={
              selectedFormula
                ? toNumber(selectedFormula.installation_price) +
                  toNumber(selectedFormula.maintenance_price) +
                  toNumber(selectedFormula.hotline_price) +
                  (selectedFormula.options
                    ? selectedFormula.options.reduce((sum, opt) => sum + toNumber(opt.price_ht), 0)
                    : 0)
                : 0
            }
            equipments={equipments}
            totalEquipments={equipments.reduce((acc, eqLine) => {
              const effectiveQuantity = eqLine.isFirstUnitFree ? Math.max(eqLine.quantity - 1, 0) : eqLine.quantity;
              return acc + toNumber(eqLine.equipment.price_ht) * effectiveQuantity;
            }, 0)}
            discountPercentage={discountPercentage}
            monthlyFormulaCost={calculateQuoteSummary({
              selectedFormula,
              installationOneTime,
              discountPercentage: 0,
              engagementDuration: 1,
              taxRate,
              equipments,
            }).discountBase}
            installationPrice={selectedFormula?.installation_price || 0}
            engagementDuration={engagementDuration}
            taxRate={taxRate}
            // Valeurs calculées (depuis summaryValues)
            discountBase={summaryValues.discountBase}
            computedDiscountValueHT={summaryValues.computedDiscountValueHT}
            computedFinalCostHT={summaryValues.computedFinalCostHT}
            computedFinalCostTTC={summaryValues.computedFinalCostTTC}
            computedFirstMonthCostHT={summaryValues.computedFirstMonthCostHT}
            computedFirstMonthCostTTC={summaryValues.computedFirstMonthCostTTC}
            computedOverallCostHT={summaryValues.computedOverallCostHT}
            computedOverallCostTTC={summaryValues.computedOverallCostTTC}
          />

          <div className={styles.buttons}>
            <Button variant="modalCancel" text="Annuler" onClick={onClose} type="button" />
            <Button
              variant="modalSend"
              text="Créer"
              type="submit"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateQuoteModal;

/* ============================================================================
   FONCTIONS ET COMPOSANTS LOCAUX (isolation du calcul) - version decimal.js
============================================================================ */

/**
 * 1) Fonction utilitaire pour convertir une valeur en Decimal
 *    (évite NaN et gère la virgule)
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
 * Fonction locale "toNumber" si vous voulez un simple parseFloat
 * (Mais ici on profite de decimal.js pour plus de précision.)
 */
function toNumber(val: any): number {
  const numeric = parseFloat(String(val).replace(',', '.'));
  return isNaN(numeric) ? 0 : numeric;
}

/**
 * 2) Interface décrivant les valeurs calculées pour le résumé
 */
interface CreateQuoteSummaryValues {
  discountBase: number;
  computedDiscountValueHT: number;
  computedFinalCostHT: number;
  computedFinalCostTTC: number;
  computedFirstMonthCostHT: number;
  computedFirstMonthCostTTC: number;
  computedOverallCostHT: number;
  computedOverallCostTTC: number;
}

/**
 * 3) Fonction pour calculer les valeurs du devis via decimal.js
 */
function calculateQuoteSummary(params: {
  selectedFormula: any;
  installationOneTime: boolean;
  discountPercentage: number;
  engagementDuration: number;
  taxRate: number;
  equipments: any[];
}): CreateQuoteSummaryValues {
  const {
    selectedFormula,
    installationOneTime,
    discountPercentage,
    engagementDuration,
    taxRate,
    equipments,
  } = params;

  const dTaxRate = new Decimal(taxRate || 20);
  const dDiscountPct = new Decimal(discountPercentage || 0);
  const dEngagement = new Decimal(engagementDuration || 1);

  let formulaCost = new Decimal(0);
  if (selectedFormula) {
    formulaCost = formulaCost
      .plus(toDecimal(selectedFormula.installation_price))
      .plus(toDecimal(selectedFormula.maintenance_price))
      .plus(toDecimal(selectedFormula.hotline_price));

    if (selectedFormula.options && selectedFormula.options.length > 0) {
      for (const opt of selectedFormula.options) {
        formulaCost = formulaCost.plus(toDecimal(opt.price_ht));
      }
    }
  }

  let recurringFormulaCost = formulaCost;
  if (installationOneTime && selectedFormula) {
    recurringFormulaCost = recurringFormulaCost.minus(
      toDecimal(selectedFormula.installation_price)
    );
  }

  const computedTotalEquipments = equipments.reduce((sum, eq) => {
    const unitPrice = toDecimal(eq.equipment?.price_ht || 0);
    const effQty =
      eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
    return sum.plus(unitPrice.times(effQty));
  }, new Decimal(0));

  const discountBase = recurringFormulaCost.plus(computedTotalEquipments);
  const computedDiscountValueHT = discountBase.times(dDiscountPct.div(100));

  const computedFinalCostHT = discountBase.minus(computedDiscountValueHT);
  const computedFinalCostTTC = computedFinalCostHT.times(dTaxRate.div(100).plus(1));

  let computedFirstMonthCostHT = computedFinalCostHT;
  if (installationOneTime && selectedFormula) {
    computedFirstMonthCostHT = computedFirstMonthCostHT.plus(
      toDecimal(selectedFormula.installation_price)
    );
  }
  const computedFirstMonthCostTTC = computedFirstMonthCostHT.times(dTaxRate.div(100).plus(1));

  let computedOverallCostHT = computedFinalCostHT.times(dEngagement);
  if (installationOneTime && selectedFormula) {
    computedOverallCostHT = computedOverallCostHT.plus(
      toDecimal(selectedFormula.installation_price)
    );
  }
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
  };
}

/**
 * 4) Composant local : QuoteSummary (si vous l'utilisez)
 */
function formatPrice(val: number): string {
  return (Math.round(val * 100) / 100).toFixed(2);
}

/**
 * Ex d'interface si vous utilisez un composant QuoteSummary
 */
interface QuoteSummaryProps {
  selectedFormula: any;
  installationOneTime: boolean;
  formulaTotalCost: number;
  equipments: any[];
  totalEquipments: number;
  discountPercentage: number;
  monthlyFormulaCost: number;
  installationPrice: number;
  engagementDuration: number;
  taxRate: number;

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
  const finalMonthlyTitle = installationOneTime
    ? "Tarif mensuel final (hors installation)"
    : "Tarif mensuel final (avec installation)";
  const firstBillingMessage = installationOneTime
    ? "Le premier mois inclut le tarif mensuel final (après remise) ainsi que le coût unique d'installation."
    : "Le tarif mensuel final s'applique dès le premier mois.";

  const hasFreeUnit = equipments.some(eq => eq.isFirstUnitFree);
  const equipmentHelpMessage = hasFreeUnit
    ? "Les équipements bénéficiant de la gratuité de la première unité sont facturés en conséquence."
    : "Aucune gratuité n'est appliquée sur les équipements sélectionnés.";
  const effectiveTaxRate = taxRate || 20;

  return (
    <section>
      <div className={styles.summarySection}>
        <h3 className={styles.sectionTitle}>Total du Devis</h3>

        {/* 1. Formule */}
        {selectedFormula && (
          <div className={styles.summaryItem}>
            <p>Formule Sélectionnée</p>
            <p><strong>Nom :</strong> {selectedFormula.name}</p>
            <p>
              <strong>Installation :</strong> {formatPrice(toNumber(selectedFormula.installation_price))} € HT{" "}
              {installationOneTime && <em>(Facturée une seule fois)</em>}
            </p>
            <p><strong>Maintenance :</strong> {formatPrice(toNumber(selectedFormula.maintenance_price))} € HT</p>
            <p><strong>Hotline :</strong> {formatPrice(toNumber(selectedFormula.hotline_price))} € HT</p>
            {selectedFormula.options && selectedFormula.options.length > 0 && (
              <>
                <p>Options</p>
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
            <p>
              <strong>Total Formule (avec option) :</strong> {formatPrice(formulaTotalCost)} € HT
            </p>
          </div>
        )}

        {/* 2. Équipements */}
        <div className={styles.summaryItem}>
          <p>Équipements Sélectionnés</p>
          {equipments.length > 0 ? (
            <ul>
              {equipments.map((eq, idx) => {
                const effectiveQuantity = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
                return (
                  <li key={idx}>
                    {eq.equipment.name} x {eq.quantity}{" "}
                    <span>
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
          <small>
            Total Équipements (sans gratuité) : {formatPrice(
              equipments.reduce((sum, eq) => sum + eq.quantity * toNumber(eq.equipment.price_ht), 0)
            )} € HT<br />
            Total Équipements (avec gratuité) : {formatPrice(
              equipments.reduce((sum, eq) => {
                const effQty = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
                return sum + effQty * toNumber(eq.equipment.price_ht);
              }, 0)
            )} € HT
          </small>
          <p>
            <strong>Total mensuel pour les équipements :</strong> {formatPrice(
              equipments.reduce((sum, eq) => {
                const effQty = eq.isFirstUnitFree && eq.quantity > 1 ? eq.quantity - 1 : eq.quantity;
                return sum + toNumber(eq.equipment.price_ht) * effQty;
              }, 0)
            )} € HT
          </p>
          <small>{equipmentHelpMessage}</small>
        </div>

        {/* 3. Remise */}
        {discountPercentage > 0 && (
          <div className={styles.summaryItem}>
            <hr/>
            <p>Remise</p>
            <p><strong>Pourcentage de réduction :</strong> {discountPercentage} %</p>
            <div>
              <p>
                <strong>Base de calcul mensuelle :</strong> {formatPrice(discountBase)} € HT
              </p>
              <p>
                Calcul de la remise mensuelle : {formatPrice(discountBase)} € HT ×{' '}
                {(discountPercentage / 100).toFixed(2)}
              </p>
              <p>
                <strong>Remise mensuelle :</strong> {formatPrice(computedDiscountValueHT)} € HT
              </p>
              <p>
                <strong>Remise mensuelle TTC :</strong>{' '}
                {formatPrice(computedDiscountValueHT * (1 + effectiveTaxRate / 100))} € TTC
              </p>
            </div>
            <p>
              <strong>Remise totale sur l'engagement :</strong> -{' '}
              {formatPrice(computedDiscountValueHT * engagementDuration)} € HT
            </p>
            <small>
              La remise de {discountPercentage}% s'applique mensuellement dès le premier mois.
            </small>
          </div>
        )}

        {/* 4. Tarifs et Facturation */}
        <div className={styles.summaryItem}>
          {discountPercentage > 0 && (
            <>
              <p>
                Coût Final Mensuel (après remise)
              </p>
              <p>
                <strong>Tarif mensuel final HT :</strong>{' '}
                {formatPrice(computedFinalCostHT)} €
              </p>
              <p>
                <strong>Tarif mensuel final TTC :</strong>{' '}
                {formatPrice(computedFinalCostTTC)} €
              </p>
              <hr/>
            </>
          )}

          <div className={styles.summaryItem}>
            <p>
              Première Facturation {installationOneTime ? 'avec installation' : ''}
            </p>
            <p>
              <strong>Tarif, pour le premier mois, HT :</strong>{' '}
              {formatPrice(computedFirstMonthCostHT)} €
            </p>
            <p>
              <strong>Tarif, pour le premier mois, TTC :</strong>{' '}
              {formatPrice(computedFirstMonthCostTTC)} €
            </p>
            <small>{firstBillingMessage}</small>
          </div>

          <div className={styles.summaryItem}>
            <p>{finalMonthlyTitle}</p>
            <p>
              <strong>Mensuel final HT (30 jours) :</strong>{' '}
              {formatPrice(computedFinalCostHT)} €
            </p>
            <p>
              <strong>Mensuel final TTC (30 jours) :</strong>{' '}
              {formatPrice(computedFinalCostTTC)} €
            </p>
            <small>
              Ce tarif mensuel récurrent{' '}
              {installationOneTime ? "n'inclut pas" : 'inclut'} le coût d'installation.
            </small>
          </div>

          <div>
            <p>Tarif Total Suivant Engagement</p>
            <p>
              <strong>Engagement HT ({engagementDuration} mois) :</strong>{' '}
              {formatPrice(computedOverallCostHT)} €
            </p>
            <p>
              <strong>Engagement TTC ({engagementDuration} mois) :</strong>{' '}
              {formatPrice(computedOverallCostTTC)} €
            </p>
            <small>
              Calculé en multipliant le tarif mensuel final (hors installation)
              par {engagementDuration} mois, auquel on ajoute une seule fois le
              coût d'installation (si applicable).
              <br />
              (Les légères différences sont dues à des arrondis.)
            </small>
          </div>
        </div>
      </div>
    </section>
  );
};

export { QuoteSummary };

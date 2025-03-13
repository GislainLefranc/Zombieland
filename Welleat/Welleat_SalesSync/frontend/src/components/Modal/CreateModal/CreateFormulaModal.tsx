//// Dossier : src/components/Modal/CreateModal, Fichier : CreateFormulaModal.tsx
// Cette modal permet de créer ou modifier une formule.
// Elle gère le formulaire, le chargement des options disponibles, le calcul des totaux et l'affichage du résumé.
// Le calcul s'effectue via decimal.js pour une précision optimale.

import React, { useState, useEffect, FormEvent, KeyboardEvent } from 'react';
import CreateModal from './CreateModal';
import * as modalStyles from '../../../styles/Modals/Modal.css';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../Button/Button';
import { FaTimes } from 'react-icons/fa';

const TAX_RATE = 0.2;

interface CreateFormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formula?: any | null;
}

const CreateFormulaModal: React.FC<CreateFormulaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  formula = null,
}) => {
  // États pour les champs du formulaire de formule
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [installationPrice, setInstallationPrice] = useState('');
  const [maintenancePrice, setMaintenancePrice] = useState('');
  const [hotlinePrice, setHotlinePrice] = useState('');
  const [availableOptions, setAvailableOptions] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fonction pour formater le prix avec deux décimales
  const formatPrice = (price: string | number): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  // Charger les options disponibles depuis le backend
  const fetchOptions = async () => {
    try {
      const response = await axiosInstance.get('/options');
      const optionsData = Array.isArray(response.data?.data)
        ? response.data.data
        : response.data || [];
      const formattedOptions = optionsData.map((option: any) => ({
        ...option,
        price_ht: Number(option.price_ht || option.priceHt) || 0,
        price_ttc: Number(option.price_ttc || option.priceTtc) || 0,
      }));
      setAvailableOptions(formattedOptions);
    } catch (error) {
      console.error('Failed to fetch options:', error);
      toast.error('Erreur lors de la récupération des options');
    }
  };

  // À l'ouverture de la modal, initialiser les champs et charger les options
  useEffect(() => {
    if (isOpen) {
      fetchOptions();
      if (formula) {
        setName(formula.name || '');
        setDescription(formula.description || '');
        setInstallationPrice((formula.installation_price || formula.installationPrice)?.toString() || '0');
        setMaintenancePrice((formula.maintenance_price || formula.maintenancePrice)?.toString() || '0');
        setHotlinePrice((formula.hotline_price || formula.hotlinePrice)?.toString() || '0');
        setSelectedOptions(
          (formula.options || []).map((opt: any) => ({
            ...opt,
            price_ht: Number(opt.price_ht || opt.priceHt) || 0,
            price_ttc: Number(opt.price_ttc || opt.priceTtc) || 0,
          }))
        );
      } else {
        setName('');
        setDescription('');
        setInstallationPrice('');
        setMaintenancePrice('');
        setHotlinePrice('');
        setSelectedOptions([]);
      }
    }
    // Gestion du resize pour déterminer si on est sur mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, formula]);

  // Fonctions pour soumettre le formulaire et gérer l'ajout/retrait d'options
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const totalHT =
        parseFloat(installationPrice) +
        parseFloat(maintenancePrice) +
        parseFloat(hotlinePrice) +
        selectedOptions.reduce((sum, opt) => sum + Number(opt.price_ht), 0);
  
      const payload = {
        name,
        description,
        installation_price: parseFloat(installationPrice) || 0,
        maintenance_price: parseFloat(maintenancePrice) || 0,
        hotline_price: parseFloat(hotlinePrice) || 0,
        price_ht: totalHT,
        price_ttc: parseFloat((totalHT * (1 + TAX_RATE)).toFixed(2)),
        option_ids: selectedOptions.map(opt => opt.id),
      };
  
      if (formula?.id) {
        await axiosInstance.put(`/formulas/${formula.id}`, payload);
        toast.success("Formule mise à jour avec succès");
      } else {
        await axiosInstance.post('/formulas', payload);
        toast.success("Formule créée avec succès");
      }
  
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error("Erreur lors de la sauvegarde de la formule");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion du dropdown pour sélectionner une option à ajouter
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const optionId = parseInt(e.target.value);
    const foundOption = availableOptions.find(opt => opt.id === optionId) || null;
    setSelectedOption(foundOption);
  };

  // Ajouter l'option sélectionnée à la liste des options choisies
  const handleAddOption = () => {
    if (selectedOption && !selectedOptions.some(o => o.id === selectedOption.id)) {
      setSelectedOptions([...selectedOptions, selectedOption]);
      setSelectedOption(null);
    }
  };

  // Retirer une option de la sélection
  const handleRemoveOption = (optionId: number) => {
    setSelectedOptions(selectedOptions.filter(opt => opt.id !== optionId));
  };

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={formula ? "Modifier la formule" : "Créer une formule"}
      actions={[
        { variant: 'cancel', text: 'Annuler', onClick: onClose, type: 'button' },
      ]}
    >
      <form onSubmit={handleSubmit} className={modalStyles.form}>
        {/* Champs de base pour la formule */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="formulaName" className={modalStyles.label}>
            Nom de la formule
          </label>
          <input 
            id="formulaName" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            placeholder="Entrez le nom de la formule" 
            className={modalStyles.input}
          />
        </div>
        <div className={modalStyles.formGroup}>
          <label htmlFor="description" className={modalStyles.label}>
            Description
          </label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Entrez la description" 
            className={modalStyles.textarea}
          />
        </div>
        {/* Champs pour les prix de base */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="installationPrice" className={modalStyles.label}>
            Prix d'installation (HT)
          </label>
          <input 
            id="installationPrice"
            type="number"
            value={installationPrice}
            onChange={(e) => setInstallationPrice(e.target.value)}
            placeholder="0"
            className={modalStyles.input}
            min="0"
            step="0.01"
          />
        </div>
        <div className={modalStyles.formGroup}>
          <label htmlFor="maintenancePrice" className={modalStyles.label}>
            Prix de maintenance (HT)
          </label>
          <input 
            id="maintenancePrice"
            type="number"
            value={maintenancePrice}
            onChange={(e) => setMaintenancePrice(e.target.value)}
            placeholder="0"
            className={modalStyles.input}
            min="0"
            step="0.01"
          />
        </div>
        <div className={modalStyles.formGroup}>
          <label htmlFor="hotlinePrice" className={modalStyles.label}>
            Prix Hotline (HT)
          </label>
          <input 
            id="hotlinePrice"
            type="number"
            value={hotlinePrice}
            onChange={(e) => setHotlinePrice(e.target.value)}
            placeholder="0"
            className={modalStyles.input}
            min="0"
            step="0.01"
          />
        </div>
        {/* Dropdown pour ajouter des options */}
        <div className={modalStyles.formGroup}>
          <label htmlFor="selectOption" className={modalStyles.label}>
            Sélectionner une option
          </label>
          <div className={modalStyles.selectWithButtonContainer}>
            <select 
              id="selectOption"
              value={selectedOption?.id || ''}
              onChange={handleOptionChange}
              className={modalStyles.select}
            >
              <option value="">Choisir une option</option>
              {availableOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name} - {formatPrice(option.price_ht)} € HT
                </option>
              ))}
            </select>
            <Button variant="add" text="Ajouter" onClick={handleAddOption} type="button" />
          </div>
        </div>
        {/* Liste des options sélectionnées */}
        <div className={modalStyles.selectedList}>
          {selectedOptions.map(option => (
            <div
              key={option.id}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}
            >
              <span>
                {option.name} - {formatPrice(option.price_ht)} € HT
              </span>
              <Button
                variant="danger"
                text={isMobile ? <FaTimes /> : "Retirer"}
                onClick={() => handleRemoveOption(option.id)}
                size="small"
                className={modalStyles.removeOptionButton} 
              />
            </div>
          ))}
        </div>
        {/* Section Résumé des Totaux */}
        <div className={modalStyles.totalSection}>
          <div>
            <strong>Prix total HT :</strong> {(
              parseFloat(installationPrice || "0") +
              parseFloat(maintenancePrice || "0") +
              parseFloat(hotlinePrice || "0") +
              selectedOptions.reduce((sum, opt) => sum + Number(opt.price_ht), 0)
            ).toFixed(2)} €
          </div>
          <div>
            <strong>Prix total TTC :</strong> {(
              (parseFloat(installationPrice || "0") +
              parseFloat(maintenancePrice || "0") +
              parseFloat(hotlinePrice || "0") +
              selectedOptions.reduce((sum, opt) => sum + Number(opt.price_ht), 0)) *
              (1 + TAX_RATE)
            ).toFixed(2)} €
          </div>
        </div>
        {/* Bouton de validation */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="submit" text={formula ? 'Enregistrer' : 'Créer'} type="submit" />
        </div>
      </form>
    </CreateModal>
  );
};

export default CreateFormulaModal;


import React, { useState, useEffect, FormEvent } from 'react';
import CreateModal from './CreateModal';
import * as modalStyles from '../../../styles/Modals/Modal.css';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import Button from '../../Button/Button';

// Définissez l'interface OptionCategory pour correspondre au modèle
export interface OptionCategory {
  id: number;
  name: string;
}

interface Option {
  id: number;
  name: string;
  description?: string;
  price_ht: number;
  category: OptionCategory;
}

interface CreateOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionCreated: () => void;
  option?: Option;
}

const TAX_RATE = 0.2;

const CreateOptionModal: React.FC<CreateOptionModalProps> = ({
  isOpen,
  onClose,
  onOptionCreated,
  option
}) => {
  // États du formulaire
  const [name, setName] = useState(option?.name || '');
  const [description, setDescription] = useState(option?.description || '');
  const [price, setPrice] = useState(option?.price_ht?.toString() || '');
  const [categoryId, setCategoryId] = useState<number>(
    option?.category?.id || 0 // On met 0 par défaut pour détecter l'absence de sélection
  );
  // Nouvel état pour stocker les catégories existantes (issues du backend)
  const [categories, setCategories] = useState<OptionCategory[]>([]);

  const [loading, setLoading] = useState(false);

  // Récupérer les catégories depuis le backend
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/options/categories');
      const data = response.data?.success ? response.data.data : response.data;
      if (Array.isArray(data)) {
        setCategories(data);
        // Si aucune sélection n'est faite, on peut par défaut choisir la première catégorie
        if (data.length > 0 && categoryId === 0) {
          setCategoryId(data[0].id);
        }
      } else {
        throw new Error("Format de réponse inattendu pour les catégories");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Erreur lors du chargement des catégories");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Réinitialisation des états lors de l'ouverture de la modal ou lors de la modification
  useEffect(() => {
    if (option) {
      setName(option.name || '');
      setDescription(option.description || '');
      setPrice(option.price_ht?.toString() || '');
      setCategoryId(option.category?.id || 0);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId(0);
    }
  }, [option]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice)) {
        toast.error('Prix invalide');
        setLoading(false);
        return;
      }

      // Construire le payload en incluant category_id correctement
      const payload = {
        name,
        description,
        price_ht: parsedPrice,
        category_id: categoryId
      };

      console.log("Payload envoyé:", payload);

      if (option?.id) {
        // Mise à jour
        await axiosInstance.put(`/options/${option.id}`, payload);
        toast.success('Option mise à jour avec succès');
      } else {
        // Création
        await axiosInstance.post('/options', payload);
        toast.success('Option créée avec succès');
      }

      onOptionCreated();
      onClose();
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error(error.response?.data?.error || "Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // Calcul du TTC
  const calculateTTC = (ht: number) => (ht * (1 + TAX_RATE)).toFixed(2);

  return (
    <CreateModal
      isOpen={isOpen}
      onClose={onClose}
      title={option ? "Modifier l'option" : "Créer une option"}
      actions={[
        {
          variant: 'submit',
          text: option ? 'Modifier' : 'Créer',
          onClick: handleSubmit,
          type: 'submit'
        },
        {
          variant: 'cancel',
          text: 'Annuler',
          onClick: onClose,
          type: 'button'
        }
      ]}
    >
      <form onSubmit={handleSubmit} className={modalStyles.form}>
        <div className={modalStyles.formGroup}>
          <label htmlFor="name" className={modalStyles.label}>
            Nom de l'option
          </label>
          <input
  id="name"
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
  placeholder="Entrez le nom de l'option"
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
            placeholder="Entrez la description de l'option"
            className={modalStyles.textarea}
            style={{ backgroundColor: 'white' }} 
            disabled={loading} 
          />
        </div>

        <div className={modalStyles.formGroup}>
          <label htmlFor="price" className={modalStyles.label}>
            Prix (HT)
          </label>
          <div>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="Entrez le prix HT"
              className={modalStyles.input}
              min="0"
              step="0.01"
            />
            {parseFloat(price) > 0 && (
              <div className={modalStyles.priceInfo}>
                TTC: {calculateTTC(parseFloat(price))} €
              </div>
            )}
          </div>
        </div>

        <div className={modalStyles.formGroup}>
          <label htmlFor="category" className={modalStyles.label}>
            Catégorie
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(parseInt(e.target.value))}
            required
            className={modalStyles.select}
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option value={0}>Aucune catégorie</option>
            )}
          </select>
        </div>
      </form>
    </CreateModal>
  );
};

export default CreateOptionModal;

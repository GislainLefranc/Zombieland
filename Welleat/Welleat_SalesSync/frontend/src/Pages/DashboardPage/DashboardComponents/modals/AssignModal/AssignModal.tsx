/**
 * Dossier : components/AssignModal
 * Fichier : AssignModal.tsx
 *
 * Ce fichier définit le composant React AssignModal qui gère l'assignation d'entités.
 * Le composant affiche une modale permettant de sélectionner des entreprises, interlocuteurs et utilisateurs,
 * et de les assigner à un utilisateur via une action d'assignation.
 */

import React, { useState, useMemo, useEffect } from 'react';
import * as styles from './AssignModal.css';
import { Tab, Tabs } from '../../Common/Tabs/Tabs';
import { FilterBar } from '../../Common/FilterBar/FilterBar';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../../api/axiosInstance';
import { BulkActionBar } from './components/BulkActionBar';
import useAssignModal from '../../../../../hooks/useAssignModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AssignModalProps,
  SelectedEntities,
  Filters,
} from '../../../../../types/index';
import { SelectionGridView } from './components/SelectionGridView';
import { UserAssignmentView } from './components/UserAssignmentView';
import { useNavigate } from 'react-router-dom';

const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  onClose,
  selectedItems,
  viewMode,
  onAssign,
  setError,
}) => {
  // État pour l'onglet actif ('selection' ou 'admin')
  const [activeTab, setActiveTab] = useState<'selection' | 'admin'>('selection');
  // État pour le mode d'affichage ('list' ou 'grid')
  const [currentView, setCurrentView] = useState<'list' | 'grid'>('list');
  // Récupération des données (entreprises, interlocuteurs, utilisateurs) et de leur état de chargement
  const { companies, interlocutors, users, loading, error } = useAssignModal();
  const navigate = useNavigate();

  // Initialisation de l'état des entités sélectionnées à partir des éléments sélectionnés passés en props
  const [selectedEntities, setSelectedEntities] = useState<SelectedEntities>({
    companies: new Set<number>(selectedItems.companies),
    interlocutors: new Set<number>(selectedItems.interlocutors),
    users: new Set<number>(selectedItems.users),
  });

  // État des filtres appliqués sur les données affichées
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'all',
    status: 'all',
    date: 'all',
  });

  // État pour l'utilisateur sélectionné lors de l'assignation
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);

  // Gestion de la sélection d'un utilisateur dans la vue d'assignation
  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId);
  };

  // Mise à jour de l'état des entités sélectionnées si selectedItems change
  useEffect(() => {
    setSelectedEntities({
      companies: new Set<number>(selectedItems.companies),
      interlocutors: new Set<number>(selectedItems.interlocutors),
      users: new Set<number>(selectedItems.users),
    });
  }, [selectedItems]);

  // Fonction pour gérer la sélection/désélection d'une entité dans une catégorie donnée
  const handleSelect = (category: keyof SelectedEntities, id: number) => {
    setSelectedEntities(prev => {
      const updatedSet = new Set(prev[category]);
      if (updatedSet.has(id)) {
        updatedSet.delete(id);
      } else {
        updatedSet.add(id);
      }
      return { ...prev, [category]: updatedSet };
    });
  };

  // Fonction d'assignation des entités sélectionnées
  const handleAssign = async () => {
    try {
      const data = {
        itemType: 'multiple',
        companies: Array.from(selectedEntities.companies),
        interlocutors: Array.from(selectedEntities.interlocutors),
        users: Array.from(selectedEntities.users),
        userId: selectedUserId || Array.from(selectedEntities.users)[0]
      };

      const response = await axiosInstance.post('/assign', data);

      if (response.status === 200 || response.status === 201) {
        // Affichage d'une notification de succès
        toast.success('Assignation réussie !', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        onClose();
        // Navigation vers la page de l'entreprise si une seule est sélectionnée
        if (data.companies.length === 1) {
          navigate(`/company/${data.companies[0]}`, { state: { refresh: true } });
        }
      } else {
        toast.error(response.data.message || 'Erreur lors de l\'assignation');
      }
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'assignation');
    }
  };

  // Vérifie si au moins une entité est sélectionnée
  const hasValidSelection = () => {
    return (
      selectedEntities.companies.size > 0 ||
      selectedEntities.interlocutors.size > 0 ||
      selectedEntities.users.size > 0
    );
  };

  // Effacer toutes les sélections
  const handleClearAll = () => {
    setSelectedEntities({
      companies: new Set<number>(),
      interlocutors: new Set<number>(),
      users: new Set<number>(),
    });
  };

  // Inverser la sélection des entités
  const handleInvertSelection = () => {
    setSelectedEntities(prev => ({
      companies: new Set<number>(
        companies.map(c => c.id).filter(id => !prev.companies.has(id))
      ),
      interlocutors: new Set<number>(
        interlocutors.map(i => i.id).filter(id => !prev.interlocutors.has(id))
      ),
      users: new Set<number>(
        users.map(u => u.id).filter(id => !prev.users.has(id))
      ),
    }));
  };

  // Fonction pour l'assignation automatique (logique à implémenter)
  const handleAutoAssign = () => {
    // Implémenter la logique d'assignation automatique
  };

  // Fonction de filtrage des données selon les filtres appliqués
  const applyFilters = (item: any, filters: Filters) => {
    const { search, type, status, date } = filters;
    if (search) {
      const searchableString = Object.values(item).join(' ').toLowerCase();
      if (!searchableString.includes(search.toLowerCase())) {
        return false;
      }
    }
    return true;
  };

  // Application des filtres sur les données via useMemo pour éviter les recalculs inutiles
  const filteredData = useMemo(
    () => ({
      companies: companies.filter(c => applyFilters(c, filters)),
      interlocutors: interlocutors.filter(i => applyFilters(i, filters)),
      users: users.filter(u => applyFilters(u, filters)),
    }),
    [companies, interlocutors, users, filters]
  );

  // Calcul du nombre total d'entités sélectionnées
  const getTotalSelectedCount = () => {
    return (
      selectedEntities.companies.size +
      selectedEntities.interlocutors.size +
      selectedEntities.users.size
    );
  };

  // Gestion de la sélection d'une entité selon sa catégorie
  const handleSelection = (category: keyof SelectedEntities, id: number) => {
    handleSelect(category, id);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.modalOverlay}
          onClick={onClose}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <img
                src="https://welleat.fr/wp-content/uploads/2024/11/Logo-300x300.png"
                alt="Logo Welleat"
                className={styles.modalLogo}
              />
              <h2 className={styles.modalTitle}>Assigner des Entités</h2>
            </div>

            <button
              className={styles.modalCloseBtn}
              onClick={onClose}
              aria-label="Fermer la modale"
            >
              &times;
            </button>

            <main className={styles.modalMain}>
              <Tabs
                value={activeTab}
                onChange={value => setActiveTab(value as 'selection' | 'admin')}
                className={styles.tabsContainer}
              >
                <Tab value="selection">Sélection</Tab>
                <Tab value="admin">Membres Welleat</Tab>
              </Tabs>

              <FilterBar filters={filters} onChange={setFilters} />

              {activeTab === 'selection' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      Établissements Assignés
                    </h3>
                  </div>
                  <div className={styles.columnsContainer}>
                    <div className={styles.column}>
                      <div className={styles.columnContent}>
                        {Array.from(selectedEntities.companies).map(id => {
                          const company = filteredData.companies.find(
                            c => c.id === id
                          );
                          return company ? (
                            <div className={styles.listItem} key={company.id}>
                              {company.name}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>
                      Interlocuteurs Directs
                    </h3>
                  </div>
                  <div className={styles.columnsContainer}>
                    <div className={styles.column}>
                      <div className={styles.columnContent}>
                        {Array.from(selectedEntities.interlocutors).map(id => {
                          const interlocutor = filteredData.interlocutors.find(
                            i => i.id === id
                          );
                          return interlocutor ? (
                            <div className={styles.listItem} key={interlocutor.id}>
                              {interlocutor.firstName} {interlocutor.lastName}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Membres Welleat</h3>
                  </div>
                  <div className={styles.columnsContainer}>
                    <div className={styles.column}>
                      <div className={styles.columnContent}>
                        {Array.from(selectedEntities.users).map(id => {
                          const user = filteredData.users.find(u => u.id === id);
                          return user ? (
                            <div className={styles.listItem} key={user.id}>
                              {user.firstName} {user.lastName}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>

                  <SelectionGridView
                    data={filteredData}
                    selected={selectedEntities}
                    onSelect={handleSelection}
                  />
                </div>
              )}

              {activeTab === 'admin' && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Membres Welleat</h3>
                  </div>
                  <UserAssignmentView
                    users={users}
                    onUserSelect={handleUserSelect}
                    selectedUserId={selectedUserId}
                  />
                </div>
              )}
            </main>

            <BulkActionBar
              selectedCount={getTotalSelectedCount()}
              onClearAll={handleClearAll}
              onInvertSelection={handleInvertSelection}
              onAutoAssign={handleAutoAssign}
            />

            <footer className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={onClose}>
                Annuler
              </button>
              <button
                className={styles.assignButton}
                onClick={handleAssign}
                disabled={!hasValidSelection()}
              >
                Valider
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignModal;

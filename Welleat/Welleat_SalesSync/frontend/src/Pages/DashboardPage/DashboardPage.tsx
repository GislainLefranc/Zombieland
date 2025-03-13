// Dossier: DashboardPage | Fichier: DashboardPage.tsx

import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  DashboardData,
  ViewMode,
  Company,
  Interlocutor,
  User,
} from '../../types';

import { useDeleteItems } from '../../hooks/useDeleteItems';
import { useAuth } from '../../hooks/useAuth';
import { useDebounce } from '../../hooks/useDebounce';
import axiosInstance from '../../api/axiosInstance';

import DashboardHeader from '../../components/DashboardSearchComponents/DashboardHeader';
import ButtonContainer from './DashboardComponents/ButtonContainer';
import CompaniesList from './DashboardComponents/lists/CompaniesList';
import InterlocutorsList from './DashboardComponents/lists/InterlocutorsList';
import IndependentInterlocutorsList from './DashboardComponents/lists/IndependentInterlocutorsList';
import UsersList from './DashboardComponents/lists/UsersList';
import Pagination from './DashboardComponents/Pagination';
import PendingMessage from './DashboardComponents/PendingMessage';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';

import ConfirmationModal from '../../components/Modal/ChoiceModal/ConfirmationModal';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import CancelAssignmentModal from '../../components/Modal/ChoiceModal/CancelAssignmentModal';
import InterlocutorDetailsModal from '../../components/Modal/ViewModal/ViewInterlocutorModal';
import CreateEntityModal from '../../components/Modal/CreateModal/CreateEntityModal';
import AssignModal from './DashboardComponents/modals/AssignModal/AssignModal';
import CreateUserModal from '../../components/Modal/CreateModal/CreateUserModal';

import { ModalContext } from '../../context/ModalContext';

import * as styles from './DashboardPage.css';

// Interface pour la simulation d'assignation
interface Simulation {
  costPerDish: number;
  dishesPerDay: number;
  wastePercentage: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // État des données du dashboard
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Hooks pour suppression d'éléments
  const { deleteItems, isDeleting } = useDeleteItems();

  // États de vue et de recherche
  const [viewMode, setViewMode] = useState<ViewMode>('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // États de sélection
  const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
  const [selectedInterlocutors, setSelectedInterlocutors] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // États de contrôle des modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAssignConfirmationModal, setShowAssignConfirmationModal] = useState(false);
  const [showCancelAssignmentModal, setShowCancelAssignmentModal] = useState(false);
  const [showCreateEntityModal, setShowCreateEntityModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);

  // Sélection en attente pour un interlocuteur
  const [pendingInterlocutorSelection, setPendingInterlocutorSelection] = useState(false);

  // État global de chargement
  const [loading, setLoading] = useState<boolean>(false);

  // Contexte pour les modales liées aux interlocuteurs
  const {
    isInterlocutorModalOpen,
    openInterlocutorModal,
    closeInterlocutorModal,
    selectedInterlocutor,
    isInterlocutorSelectionModalOpen,
    openInterlocutorSelectionModal,
    closeInterlocutorSelectionModal,
  } = useContext(ModalContext)!;

  // Vérification du rôle de l'utilisateur
  const isAdmin = user?.roleId === 1;
  const isSalesUser = user?.roleId === 2;

  // Application d'un délai pour la recherche
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Simulation en attente
  const [pendingSimulation, setPendingSimulation] = useState<Simulation | null>(null);
  const [isPendingAssignment, setIsPendingAssignment] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  /**
   * Chargement initial des données du dashboard
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingData(true);
        const response = await axiosInstance.get('/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Erreur lors du chargement du dashboard');
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboardData();
  }, []);

  /**
   * Gestion des états en fonction de la navigation
   */
  useEffect(() => {
    const state = location.state as {
      pendingInterlocutorSelection?: boolean;
      mode?: string;
      returnPath?: string;
      selectedInterlocutor?: Interlocutor;
    };

    if (state?.pendingInterlocutorSelection) {
      setPendingInterlocutorSelection(true);
      setViewMode('interlocutors');
      openInterlocutorSelectionModal();
    }

    // Vérifier une simulation en attente
    const simulation = localStorage.getItem('pendingSimulation');
    if (simulation) {
      setPendingSimulation(JSON.parse(simulation));
      setIsPendingAssignment(true);
    }

    // Nettoyer l'historique de la navigation
    if (location.state && Object.keys(location.state).length > 0) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, openInterlocutorSelectionModal]);

  /**
   * Sélection d'un interlocuteur et redirection vers la création d'établissement
   */
  const handleSelectInterlocutor = useCallback(
    (interlocutor: Interlocutor) => {
      // Vérifier si l'interlocuteur est déjà sélectionné
      const isAlreadySelected = selectedInterlocutors.some(
        selected => selected === interlocutor.id
      );

      if (isAlreadySelected) {
        toast.warning('Cet interlocuteur a déjà été ajouté.');
        return;
      }

      setSelectedInterlocutors(prev => [...prev, interlocutor.id]);
      navigate('/company/create', { state: { selectedInterlocutor: interlocutor } });
    },
    [selectedInterlocutors, navigate]
  );

  /**
   * Gestion du clic sur une ligne d'élément
   */
  const handleRowClick = useCallback(
    (item: Company | Interlocutor | User) => {
      // Si une sélection d'interlocuteur est en cours
      if (pendingInterlocutorSelection && viewMode === 'interlocutors') {
        handleSelectInterlocutor(item as Interlocutor);
        setPendingInterlocutorSelection(false);
        return;
      }

      // Si une assignation de simulation est en attente
      if (isPendingAssignment && viewMode === 'companies') {
        setSelectedCompany(item as Company);
        setShowAssignConfirmationModal(true);
        return;
      }

      // Navigation selon le type d'élément et le mode de vue
      if (viewMode === 'companies') {
        navigate(`/company/${item.id}`);
      } else if (viewMode === 'interlocutors' || viewMode === 'independentInterlocutors') {
        if ('email' in item) {
          openInterlocutorModal(item as Interlocutor);
        }
      } else if (viewMode === 'users') {
        navigate(`/membre-welleat/${item.id}`);
      }
    },
    [viewMode, navigate, openInterlocutorModal, isPendingAssignment, pendingInterlocutorSelection, handleSelectInterlocutor]
  );

  /**
   * Navigation vers la page d'un utilisateur
   */
  const handleUserRowClick = (userId: number) => {
    navigate(`/membre-welleat/${userId}`);
  };

  /**
   * Sélection/désélection d'une société
   */
  const handleSelectCompany = (id: number) => {
    setSelectedCompanies(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  /**
   * Sélection/désélection d'un utilisateur
   */
  const handleSelectUser = (id: number) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  /**
   * Vérification de la sélection avant suppression
   */
  const handleDeleteSelected = () => {
    const selectedCount =
      selectedCompanies.length +
      selectedInterlocutors.length +
      selectedUsers.length;
    if (selectedCount === 0) {
      toast.warn('Veuillez sélectionner au moins un élément à supprimer.');
      return;
    }
    setShowDeleteModal(true);
  };

  /**
   * Suppression des éléments sélectionnés
   */
  const handleDelete = async () => {
    try {
      setLoading(true);
      
      // Suppression des sociétés
      if (selectedCompanies.length > 0) {
        const promises = selectedCompanies.map(id =>
          axiosInstance.delete(`/companies/${id}`)
        );
        await Promise.all(promises);
        toast.success('Établissement(s) supprimé(s) avec succès');
        setShowDeleteModal(false);
        setSelectedCompanies([]);
        await fetchDashboardData();
      }
      
      // Suppression des interlocuteurs
      if (selectedInterlocutors.length > 0) {
        const promises = selectedInterlocutors.map(id =>
          axiosInstance.delete(`/interlocutors/${id}`)
        );
        await Promise.all(promises);
        toast.success('Interlocuteur(s) supprimé(s) avec succès');
        setShowDeleteModal(false);
        setSelectedInterlocutors([]);
        await fetchDashboardData();
      }
      
      // Suppression des utilisateurs
      if (selectedUsers.length > 0) {
        const promises = selectedUsers.map(id =>
          axiosInstance.delete(`/users/${id}`)
        );
        await Promise.all(promises);
        toast.success('Utilisateur(s) supprimé(s) avec succès');
        setShowDeleteModal(false);
        setSelectedUsers([]);
        await fetchDashboardData();
      }
  
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Une erreur s'est produite lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ouverture de la modale d'assignation si des éléments sont sélectionnés
   */
  const handleAssign = () => {
    const totalSelected =
      selectedCompanies.length +
      selectedInterlocutors.length +
      selectedUsers.length;
    if (totalSelected === 0) {
      toast.info('Aucun élément sélectionné.');
      return;
    }
    setShowAssignModal(true);
  };

  /**
   * Confirmation de l'assignation de simulation
   */
  const handleConfirmAssignment = async () => {
    if (!user?.id || !selectedCompany?.id || !pendingSimulation) {
      toast.error('Données requises manquantes');
      return;
    }
  
    try {
      setLoading(true);
  
      const payload = {
        userId: user.id,
        companyId: selectedCompany.id,
        costPerDish: parseFloat(pendingSimulation.costPerDish.toFixed(2)),
        dishesPerDay: parseInt(pendingSimulation.dishesPerDay.toString()),
        wastePercentage: parseFloat(pendingSimulation.wastePercentage.toFixed(2)),
        dailyProductionSavings: parseFloat(
          (pendingSimulation.costPerDish * pendingSimulation.dishesPerDay * 
          (pendingSimulation.wastePercentage / 100) * 0.45).toFixed(2)
        ),
        monthlyProductionSavings: parseFloat(
          (pendingSimulation.costPerDish * pendingSimulation.dishesPerDay * 
          (pendingSimulation.wastePercentage / 100) * 0.45 * 20).toFixed(2)
        ),
        dailyWasteSavings: parseFloat(
          (pendingSimulation.costPerDish * pendingSimulation.dishesPerDay * 
          (pendingSimulation.wastePercentage / 100)).toFixed(2)
        ),
        monthlyWasteSavings: parseFloat(
          (pendingSimulation.costPerDish * pendingSimulation.dishesPerDay * 
          (pendingSimulation.wastePercentage / 100) * 20).toFixed(2)
        ),
        status: 'projet',
        createdBy: user.id
      };
  
      const response = await axiosInstance.post('/simulations', payload);
  
      if (response.status === 201) {
        localStorage.removeItem('pendingSimulation');
        setSelectedCompany(null);
        setPendingSimulation(null);
        setIsPendingAssignment(false);
        toast.success('Simulation assignée avec succès!');
        await fetchDashboardData();
        setShowAssignConfirmationModal(false);
      }
    } catch (error: any) {
      console.error("Erreur lors de l'assignation:", error);
      toast.error(
        error.response?.data?.message ||
        "Erreur lors de l'assignation de la simulation"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Annulation de l'assignation de simulation
   */
  const handleConfirmCancelAssignment = () => {
    localStorage.removeItem('pendingSimulation');
    setIsPendingAssignment(false);
    setPendingSimulation(null);
    toast.info('Assignation de la simulation annulée');
    setShowCancelAssignmentModal(false);
  };

  /**
   * Récupération des données actualisées du dashboard
   */
  const fetchDashboardData = async () => {
    try {
      setLoadingData(true);
      const response = await axiosInstance.get('/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoadingData(false);
    }
  };

  /**
   * Filtrage des données en fonction du rôle de l'utilisateur
   */
  const filteredData = useMemo(() => {
    if (!dashboardData || !user)
      return {
        companies: [],
        interlocutors: [],
        independentInterlocutors: [],
        users: [],
      };

    if (user.roleId === 1) {
      // Pour l'admin
      return {
        ...dashboardData,
        independentInterlocutors: dashboardData.interlocutors.filter(i => i.isIndependent),
      };
    }

    if (user.roleId === 2) {
      // Pour l'utilisateur commercial
      return {
        companies: dashboardData.companies.filter(
          company =>
            company.createdBy === user.id ||
            company.assignedTo === user.id ||
            (company.users && company.users.some(u => u.id === user.id))
        ),
        interlocutors: dashboardData.interlocutors.filter(
          interlocutor => interlocutor.userId === user.id || !interlocutor.isIndependent
        ),
        independentInterlocutors: dashboardData.interlocutors.filter(
          interlocutor =>
            interlocutor.isIndependent &&
            (interlocutor.userId === user.id ||
              interlocutor.companies?.some(
                company => company.created_by === user.id || company.assigned_to === user.id
              ))
        ),
        users: [],
      };
    }

    return {
      companies: [],
      interlocutors: [],
      independentInterlocutors: [],
      users: [],
    };
  }, [dashboardData, user]);

  /**
   * Récupération des éléments à afficher selon le mode de vue et la recherche
   */
  const getDisplayedItems = () => {
    if (!user || !dashboardData) {
      return { currentPagedItems: [], totalPages: 0 };
    }

    let items: any[] = [];

    switch (viewMode) {
      case 'companies':
        items = filteredData.companies;
        break;
      case 'interlocutors':
        items = filteredData.interlocutors;
        break;
      case 'independentInterlocutors':
        items = filteredData.independentInterlocutors;
        break;
      case 'users':
        items = filteredData.users || [];
        break;
      default:
        items = [];
    }

    // Application du filtre de recherche sur certains champs
    const filtered = debouncedSearchTerm
      ? items.filter((item: any) => {
          const searchableFields = ['name', 'firstName', 'lastName', 'email', 'city', 'address'];
          return searchableFields.some(field => {
            const value = item[field];
            return value?.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
          });
        })
      : items;

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPagedItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    return { currentPagedItems, totalPages };
  };

  const { currentPagedItems, totalPages } = getDisplayedItems();

  /**
   * Rendu conditionnel des listes en fonction du mode de vue
   */
  const renderList = () => {
    switch (viewMode) {
      case 'companies':
        return (
          <CompaniesList
            items={currentPagedItems}
            selectedItems={selectedCompanies}
            setSelectedItems={setSelectedCompanies}
            onRowClick={handleRowClick}
          />
        );
      case 'interlocutors':
        return (
          <InterlocutorsList
            interlocutors={currentPagedItems}
            selectedItems={selectedInterlocutors}
            setSelectedItems={setSelectedInterlocutors}
            onRowClick={(interlocutor: Interlocutor) => handleRowClick(interlocutor)}
            onSelectItem={handleSelectInterlocutor}
          />
        );
      case 'independentInterlocutors':
        return (
          <IndependentInterlocutorsList
            interlocutors={currentPagedItems}
            selectedItems={selectedInterlocutors}
            setSelectedItems={setSelectedInterlocutors}
            onRowClick={handleRowClick}
            onSelectItem={handleSelectInterlocutor}
          />
        );
      case 'users':
        return (
          <UsersList
            items={currentPagedItems}
            selectedItems={selectedUsers}
            setSelectedItems={setSelectedUsers}
            onRowClick={(user: User) => handleUserRowClick(user.id)}
            onSelectItem={handleSelectUser}
          />
        );
      default:
        return null;
    }
  };

  /**
   * Affichage des interlocuteurs sélectionnés
   */
  const renderSelectedInterlocutors = () => (
    <div>
      {selectedInterlocutors.map((id, index) => (
        <div key={id || index}>
          <p>{id}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      {/* Affichage du détail d'un interlocuteur */}
      {isInterlocutorModalOpen && selectedInterlocutor && (
        <InterlocutorDetailsModal
          isOpen={isInterlocutorModalOpen}
          onClose={closeInterlocutorModal}
          interlocutor={selectedInterlocutor}
        />
      )}

      {/* En-tête avec la barre de recherche */}
      <DashboardHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={
          viewMode === 'companies'
            ? filteredData.companies.length
            : viewMode === 'independentInterlocutors'
              ? filteredData.independentInterlocutors.length
              : currentPagedItems.length
        }
      />

      {/* Message pour simulation en attente d'assignation */}
      {isPendingAssignment && !pendingInterlocutorSelection && (
        <PendingMessage
          message="La simulation est en attente d'assignation. Cliquez sur une ligne d'établissement pour lui assigner."
          buttonText="Annuler l'assignation" 
          onClick={() => setShowCancelAssignmentModal(true)}
        />
      )}

      {/* Message pour sélection d'un interlocuteur */}
      {pendingInterlocutorSelection && (
        <PendingMessage
          message="Sélectionnez un interlocuteur existant à associer à votre établissement."
          buttonText="Annuler"
          onClick={() => {
            setPendingInterlocutorSelection(false);
            localStorage.removeItem('pendingCompanyForm');
            navigate('/company/create');
            closeInterlocutorSelectionModal();
          }}
        />
      )}

      {/* Boutons d'action pour changement de vue et actions sur les éléments sélectionnés */}
      <ButtonContainer
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedItems={[
          ...selectedCompanies,
          ...selectedInterlocutors,
          ...selectedUsers,
        ]}
        isAdmin={isAdmin}
        onDeleteSelected={handleDeleteSelected}
        onAssign={handleAssign}
      />

      {/* Bouton de création d'un membre Welleat pour les admins */}
      {isAdmin && viewMode === 'users' && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setShowCreateUserModal(true)}
            style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Créer un membre Welleat
          </button>
        </div>
      )}

      {/* Affichage des interlocuteurs sélectionnés */}
      {selectedInterlocutors.length > 0 && (
        <div className={styles.selectedInterlocutorsContainer}>
          <h5>Appuyez sur le bouton assigner :</h5>
          {renderSelectedInterlocutors()}
        </div>
      )}

      {loading || loadingData || !user ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={styles.tableContainer}>{renderList()}</div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          />
        </>
      )}

      {showAssignConfirmationModal && selectedCompany && (
        <ConfirmationModal
          isOpen={showAssignConfirmationModal}
          onClose={() => setShowAssignConfirmationModal(false)}
          onConfirm={handleConfirmAssignment}
          companyName={selectedCompany.name}
          title="Confirmation d'assignation"
          message={`Voulez-vous assigner cette simulation à l'établissement "${selectedCompany.name}" ?`}
        />
      )}

      {showCancelAssignmentModal && (
        <CancelAssignmentModal
          isOpen={showCancelAssignmentModal}
          onClose={() => setShowCancelAssignmentModal(false)}
          onClose={handleConfirmCancelAssignment}
          title="Annuler l'assignation"
          message="Êtes-vous sûr de vouloir annuler l'assignation ?"
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          title="Confirmer la suppression"
          message={`Voulez-vous vraiment supprimer ${selectedCompanies.length} établissement(s) ?`}
          selectedCompanies={selectedCompanies}
          selectedInterlocutors={selectedInterlocutors}
          selectedUsers={selectedUsers}
          viewMode={viewMode}
          isDeleting={isDeleting}
        />
      )}

      {showAssignModal && (
        <AssignModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          selectedItems={{
            companies: new Set<number>(selectedCompanies),
            interlocutors: new Set<number>(selectedInterlocutors),
            users: new Set<number>(selectedUsers),
          }}
          viewMode={viewMode === 'independentInterlocutors' ? 'interlocutors' : viewMode}
          onAssign={async () => {
            try {
              // Logique d'assignation via API
              await axiosInstance.post('/assign', {
                companies: selectedCompanies,
                interlocutors: selectedInterlocutors,
                users: selectedUsers,
              });
              toast.success('Assignation réussie!');
              setShowAssignModal(false);
              setSelectedCompanies([]);
              setSelectedInterlocutors([]);
              setSelectedUsers([]);
              await fetchDashboardData();
            } catch (error) {
              console.error("Erreur lors de l'assignation:", error);
              toast.error("Erreur lors de l'assignation.");
            }
          }}
        />
      )}

      <CreateEntityModal
        isOpen={showCreateEntityModal}
        onClose={() => setShowCreateEntityModal(false)}
        viewMode={viewMode}
        title={`Créer un ${
          viewMode === 'companies'
            ? 'Établissement'
            : viewMode === 'users'
              ? 'Membre Welleat'
              : 'Interlocuteur'
        }`}
      />

      {showCreateUserModal && (
        <CreateUserModal
          isOpen={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onUserCreated={() => {
            fetchDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;

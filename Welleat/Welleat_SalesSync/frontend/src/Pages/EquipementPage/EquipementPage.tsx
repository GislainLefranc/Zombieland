// Dossier : src/Pages | Fichier : EquipementPage.tsx

import React, { useState, useEffect } from 'react';
import EquipementTable from '../../components/GenericTable/EquipementTable';
import { Equipment } from '../../types';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import Pagination from '../../components/DashboardSearchComponents/Pagination';
import DashboardHeader from '../../components/DashboardSearchComponents/DashboardHeader';
import Button from '../../components/Button/Button';
import CreateEquipmentModal from '../../components/Modal/CreateModal/CreateEquipmentModal';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import * as sharedStyles from '../../styles/PagesStyles/SharedPage.css';
import { parsePrice } from '../../hooks/useFormulas';
import { useNavigate } from 'react-router-dom';

const EquipementPage: React.FC = () => {
  // États locaux
  const [equipements, setEquipements] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Récupération des équipements
  const fetchEquipements = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/equipments');
      const rawEquipements = Array.isArray(response.data.data)
        ? response.data.data
        : response.data;
      const equipementsData: Equipment[] = rawEquipements.map((equipment: any) => {
        // Détermination du prix HT selon la clé présente
        const priceHTValue = equipment.price_ht || equipment.priceHt;
        const parsedPriceHT = parsePrice(priceHTValue) || 0;
        let parsedPrice = parsePrice(equipment.price || equipment.priceTtc);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
          parsedPrice = parseFloat((parsedPriceHT * 1.2).toFixed(2));
        }
        return {
          ...equipment,
          price: parsedPrice,
          price_ht: parsedPriceHT,
        };
      });
      setEquipements(equipementsData.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error("Erreur lors du chargement des équipements :", error);
      toast.error("Erreur lors du chargement des équipements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipements();
  }, []);

  // Gestion de l'ouverture et fermeture de la modale
  const handleOpenModal = (equipment?: Equipment) => {
    setSelectedEquipment(equipment || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEquipment(null);
    setIsModalOpen(false);
  };

  // Gestion de la suppression
  const handleDelete = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEquipment) return;
    try {
      await axiosInstance.delete(`/equipments/${selectedEquipment.id}`);
      toast.success('Équipement supprimé avec succès');
      fetchEquipements();
      setIsDeleteModalOpen(false);
      setSelectedEquipment(null);
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'équipement");
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedEquipment(null);
  };

  // Ajout d'un nouvel équipement
  const handleAddEquipment = () => {
    handleOpenModal();
  };

  // Filtrage des équipements selon la recherche
  const filteredEquipements = equipements.filter(equipment =>
    equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipment.category && equipment.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastEquipment = currentPage * itemsPerPage;
  const indexOfFirstEquipment = indexOfLastEquipment - itemsPerPage;
  const currentEquipements = filteredEquipements.slice(indexOfFirstEquipment, indexOfLastEquipment);
  const totalPages = Math.ceil(filteredEquipements.length / itemsPerPage);

  return (
    <div className={sharedStyles.mainContainer}>
      <DashboardHeader
        title="Équipements"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredEquipements.length}
      />
      <div className={sharedStyles.header}>
        <div className={sharedStyles.actionButtonsContainer}>
          <Button
            variant="add"
            text="Créer un Équipement"
            onClick={handleAddEquipment}
            type="button"
          />
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <Button
            variant="toggle"
            text="Gérer les catégories"
            onClick={() => navigate('/categories?type=equipment')}
            type="button"
          />
        </div>
      </div>
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <EquipementTable
            equipements={currentEquipements}
            loading={loading}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          />
        </>
      )}
      {isModalOpen && (
        <CreateEquipmentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={fetchEquipements}
          equipment={selectedEquipment}
        />
      )}
      {isDeleteModalOpen && selectedEquipment && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleConfirmDelete}
          onClose={handleCancelDelete}
          message={`Êtes-vous sûr de vouloir supprimer l'équipement "${selectedEquipment.name}" ?`}
        />
      )}
    </div>
  );
};

export default EquipementPage;

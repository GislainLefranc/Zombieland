/*
  Dossier : src/Pages
  Fichier : QuotePage.tsx
  Ce composant gère l'affichage, la création et la suppression des devis.
*/

import React, { useState, useEffect, useMemo } from 'react';
import QuoteTable from '../../components/GenericTable/QuoteTable';
import * as styles from './QuotePage.css';
import { addButton } from '../../styles/Buttons/Buttons.css';
import CreateQuoteModal from '../../components/Modal/CreateModal/CreateQuoteModal';
import QuoteDetailModal from '../../components/Modal/ViewModal/ViewQuoteModal';
import { Quote, InitialQuoteData } from '../../types/quotesTypes';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Pagination from '../../components/DashboardSearchComponents/Pagination';
import DashboardHeader from '../../components/DashboardSearchComponents/DashboardHeader';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import Button from '../../components/Button/Button';

const QuotePage: React.FC = () => {
  const initialQuoteData: InitialQuoteData = {
    user_id: 1,
    company_id: 5,
    interlocutor_ids: [1],
    status: 'projet',
    valid_until: new Date().toISOString().split('T')[0],
    engagement_duration: 12,
    formula_id: 1,
    installation_included: true,
    maintenance_included: true,
    hotline_included: true,
    notes: '',
    discount_type: 'percentage',
    discount_value: 10,
    discount_reason: 'Offre de lancement',
    tax_rate: 20,
    calculated_price: 0,
    equipments: []
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/quotes');
        if (response.data?.data) {
          setQuotes(response.data.data);
        } else {
          setQuotes(response.data.quotes || []);
        }
      } catch (error) {
        toast.error('Erreur lors du chargement des devis');
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateQuote = async (data: any) => {
    try {
      const quoteData = data;
      if (!quoteData.company_id || !quoteData.interlocutor_ids?.length) {
        toast.error('Entreprise et interlocuteur requis');
        return;
      }
      const formattedData = {
        user_id: Number(quoteData.user_id),
        company_id: Number(quoteData.company_id),
        interlocutor_ids: quoteData.interlocutor_ids.map(Number),
        formula_id: Number(quoteData.formula_id),
        installation_included: Boolean(quoteData.installation_included),
        installation_one_time: Boolean(quoteData.installation_one_time),
        installation_price: Number(quoteData.installation_price),
        maintenance_price: Number(quoteData.maintenance_price),
        hotline_price: Number(quoteData.hotline_price),
        status: quoteData.status,
        valid_until: quoteData.valid_until,
        validity_months: Number(quoteData.validity_months),
        engagement_duration: Number(quoteData.engagement_duration),
        notes: quoteData.notes,
        tax_rate: Number(quoteData.tax_rate),
        maintenance_included: Boolean(quoteData.maintenance_included),
        hotline_included: Boolean(quoteData.hotline_included),
        discount_type: quoteData.discount_type,
        discount_value: Number(quoteData.discount_value),
        discount_reason: quoteData.discount_reason,
        equipments: quoteData.equipments
      };
  
      const response = await axiosInstance.post('/quotes', formattedData);
  
      if (response.data?.success) {
        toast.success('Devis créé avec succès !');
        setIsModalOpen(false);
        setQuotes(prev => [...prev, response.data.data]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du devis');
    }
  };

  const handleDeleteClick = (quote: Quote) => {
    setQuoteToDelete(quote);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!quoteToDelete) return;
    setLoading(true);
    try {
      await axiosInstance.delete(`/quotes/${quoteToDelete.id}`);
      setQuotes(prev => prev.filter(q => q.id !== quoteToDelete.id));
      setShowDeleteModal(false);
      setQuoteToDelete(null);
      toast.success('Devis supprimé avec succès');
    } catch (error) {
      toast.error("Erreur lors de la suppression du devis");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setQuoteToDelete(null);
  };

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) =>
      Object.values(quote).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [quotes, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuotes = filteredQuotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQuotes.length / itemsPerPage);

  return (
    <div className={styles.dashboardContainer}>
      <DashboardHeader
        title="Devis"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        resultsCount={filteredQuotes.length}
      />

      <div className={styles.actionButtonsContainer}>
        <Button
          variant="add"
          text="Créer un devis"
          onClick={handleOpenModal}
          type="button"
          className={addButton}
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <QuoteTable
            quotes={currentQuotes}
            onDelete={handleDeleteClick}
            onRowClick={(quote) => setSelectedQuote(quote)}
            onSend={(quote) => {
              console.log('Envoyer le devis par email:', quote);
            }}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            onNext={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          />
        </>
      )}

      <CreateQuoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={initialQuoteData}
        onCreate={handleCreateQuote}
      />

      {showDeleteModal && quoteToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          message={`Voulez-vous vraiment supprimer le devis #${quoteToDelete.id} ?`}
          isDeleting={loading}
          selectedCompanies={[]}
          selectedInterlocutors={[]}
          selectedUsers={[]}
          viewMode="delete"
        />
      )}

      {selectedQuote && (
        <QuoteDetailModal
          isOpen={true}
          onClose={() => setSelectedQuote(null)}
          quote={selectedQuote}
        />
      )}
    </div>
  );
};

export default QuotePage;

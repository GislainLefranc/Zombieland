/*
  Dossier : src/Pages/CompanyPage
  Fichier : CompanyPage.tsx
*/
// Ce composant affiche la page d'un établissement. Il récupère et affiche les informations de l'établissement, ses interlocuteurs via un carousel, et les simulations associées.
// Il gère également la suppression d'interlocuteurs via une modal de confirmation.

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import * as styles from '../../styles/PagesStyles/CompanyEnterprisePages.css';
import { vars } from '../../styles/variables.css';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import { CompanyFormProvider } from '../../context/CompanyFormContext';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import StarIcon from '../../styles/icons/StarIcon';
import Button from '../../components/Button/Button';

// Définition des interfaces utilisées pour typer les données de l'établissement, des interlocuteurs, etc.
interface Interlocutor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  interlocutorType: string;
  comment?: string;
  isPrincipal?: boolean;
}

interface Functioning {
  id: number;
  typeOfFunctioning: string;
}

interface Simulation {
  id: number;
  createdAt: string;
  costPerDish: number;
  dishesPerDay: number;
  wastePercentage: number;
  dailySavings: number;
  dailyWasteSavings: number;
}

interface Company {
  id: number;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  comments: string;
  establishmentType: string;
  organizationType: string;
  numberOfCanteens: number;
  numberOfCentralKitchens: number;
  interlocutors: Interlocutor[];
  functionings: Functioning[];
}

/*
  Composant carousel pour les interlocuteurs.
  Il crée un tableau étendu en clonant le dernier élément au début et le premier à la fin,
  afin de permettre une boucle infinie. Lorsqu'un clone est affiché, l'index est réinitialisé sans transition.
*/
const InterlocutorsCarousel: React.FC<{
  interlocutors: Interlocutor[];
  onDelete: (interlocutor: Interlocutor) => void;
  onSetPrincipal: (interlocutor: Interlocutor) => void;
  allowPrincipalChange?: boolean;
}> = ({ interlocutors, onDelete, onSetPrincipal, allowPrincipalChange = false }) => {
  if (!interlocutors || interlocutors.length === 0) {
    return <p className={styles.info}>Aucun interlocuteur assigné.</p>;
  }
  
  // Création du tableau étendu avec un clone du dernier et du premier élément
  const extendedItems = useMemo(() => {
    const cloneLast = { ...interlocutors[interlocutors.length - 1] };
    const cloneFirst = { ...interlocutors[0] };
    return [cloneLast, ...interlocutors, cloneFirst];
  }, [interlocutors]);

  // L'index initial est fixé à 1 pour afficher le premier élément réel
  const [currentIndex, setCurrentIndex] = useState<number>(1);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const cardWidth = isMobile ? 300 : 320;
  const wrapperWidth = extendedItems.length * cardWidth;

  // Gestion du resize pour adapter la taille des cartes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex(prev => prev + 1);
    setTransitionEnabled(true);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => prev - 1);
    setTransitionEnabled(true);
  };

  // Réinitialise l'index si on se trouve sur un clone
  const handleTransitionEnd = () => {
    if (currentIndex === extendedItems.length - 1) {
      setTransitionEnabled(false);
      setCurrentIndex(1);
    }
    if (currentIndex === 0) {
      setTransitionEnabled(false);
      setCurrentIndex(extendedItems.length - 2);
    }
  };

  // Rétablit la transition après une réinitialisation rapide
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);

  // Gestion du swipe tactile pour mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const threshold = 50;
    if (distance > threshold) {
      handleNext();
    } else if (distance < -threshold) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // Retourne l'élément réel correspondant pour un clone
  const getDisplayedItem = (item: Interlocutor, index: number): Interlocutor => {
    if (index === 0) {
      return interlocutors[interlocutors.length - 1];
    }
    if (index === extendedItems.length - 1) {
      return interlocutors[0];
    }
    return item;
  };

  return (
    <div className={styles.carouselContainer}>
      {!isMobile && (
        <button
          className={`${styles.carouselButton} ${styles.leftButton}`}
          onClick={handlePrev}
          aria-label="Précédent"
        >
          ‹
        </button>
      )}
      <div
        className={styles.carouselWrapper}
        style={{
          width: `${wrapperWidth}px`,
          transform: `translateX(-${currentIndex * cardWidth}px)`,
          transition: transitionEnabled ? 'transform 0.3s ease-in-out' : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {extendedItems.map((item, index) => {
          const displayedItem = getDisplayedItem(item, index);
          return (
            <div key={`${displayedItem.id}-${index}`} className={styles.card}>
              <StarIcon
                isActive={displayedItem.isPrincipal}
                onClick={() => {}}
                disabled={true}
                title={displayedItem.isPrincipal ? 'Interlocuteur principal' : 'Non principal'}
              />
              <h6 className={styles.cardHeader}>
                {displayedItem.firstName} {displayedItem.lastName}
              </h6>
              <div className={styles.cardDetails}>
                <p>Email : {displayedItem.email}</p>
                {displayedItem.phone && <p>Téléphone : {displayedItem.phone}</p>}
                {displayedItem.position && <p>Poste : {displayedItem.position}</p>}
                {displayedItem.comment && <p>Commentaire : {displayedItem.comment}</p>}
                {displayedItem.isPrincipal && (
                  <p style={{ color: vars.colors.danger, fontWeight: 'bold' }}>
                    Rôle principal
                  </p>
                )}
              </div>
              <button
                onClick={() => onDelete(displayedItem)}
                className={styles.deleteButton}
                aria-label="Supprimer interlocuteur"
              >
                x
              </button>
            </div>
          );
        })}
      </div>
      {!isMobile && (
        <button
          className={`${styles.carouselButton} ${styles.rightButton}`}
          onClick={handleNext}
          aria-label="Suivant"
        >
          ›
        </button>
      )}
    </div>
  );
};

/*
  Composant principal CompanyPage :
  - Récupère l'ID de l'établissement via useParams.
  - Charge les données de l'établissement, y compris ses interlocuteurs et simulations.
  - Permet la suppression d'interlocuteurs et affiche un carousel pour leur présentation.
  - Gère également la navigation vers la page d'édition et l'affichage des modales.
*/
const CompanyPage: React.FC = () => {
  const { id: companyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [company, setCompany] = useState<Company | null>(null);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [interlocutorToDelete, setInterlocutorToDelete] = useState<Interlocutor | null>(null);

  // Fonction pour récupérer les données de l'établissement via l'API
  const fetchCompanyData = async () => {
    try {
      const companyResponse = await axiosInstance.get(`/companies/${companyId}`);
      const fetchedCompany: Company = {
        ...companyResponse.data,
        interlocutors: companyResponse.data.interlocutors.map((i: any) => {
          const isPrincipal =
            i.InterlocutorCompany?.isPrincipal ||
            i.InterlocutorCompany?.is_principal ||
            i.isPrincipal ||
            i.is_principal ||
            false;
          return {
            id: i.id,
            firstName: i.first_name || i.firstName || '',
            lastName: i.last_name || i.lastName || '',
            email: i.email,
            phone: i.phone,
            position: i.position,
            interlocutorType: i.interlocutor_type || i.interlocutorType || '',
            comment: i.comment,
            isPrincipal: isPrincipal,
          };
        }),
        functionings: companyResponse.data.functionings || [],
      };

      console.log("Données brutes de l'API:", companyResponse.data.interlocutors);
      console.log("Interlocuteurs mappés:", fetchedCompany.interlocutors);
      setCompany(fetchedCompany);

      // Récupération des simulations associées à l'établissement
      try {
        const simulationsResponse = await axiosInstance.get(`/simulations`, {
          params: { companyId },
        });
        if (simulationsResponse.data) {
          const fetchedSimulations: Simulation[] = simulationsResponse.data.map((sim: any) => ({
            ...sim,
            costPerDish: Number(sim.costPerDish) || 0,
            wastePercentage: Number(sim.wastePercentage) || 0,
            dailySavings: Number(sim.dailySavings) || 0,
            dailyWasteSavings: Number(sim.dailyWasteSavings) || 0,
          }));
          setSimulations(fetchedSimulations);
        }
      } catch (simError) {
        console.warn('Pas de simulations trouvées :', simError);
        toast.warn('Aucune simulation trouvée pour cette entreprise.');
        setSimulations([]);
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des données :", error);
      toast.error("Erreur lors de la récupération des données de l'établissement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [companyId]);

  // Rafraîchit les données si la route change pour forcer une mise à jour
  useEffect(() => {
    if (location.state?.refresh) {
      setLoading(true);
      fetchCompanyData();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refresh, navigate, location.pathname]);

  // Fonction pour supprimer un interlocuteur
  const deleteInterlocutor = async (interlocutorId: number) => {
    try {
      await axiosInstance.delete(`/interlocutors/${interlocutorId}`);
      if (company) {
        setCompany({
          ...company,
          interlocutors: company.interlocutors.filter(i => i.id !== interlocutorId),
        });
      }
      toast.success('Interlocuteur supprimé avec succès !');
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error('Une erreur est survenue lors de la suppression.');
    }
  };

  // Ouvre la modal de suppression pour un interlocuteur sélectionné
  const openDeleteModal = (interlocutor: Interlocutor) => {
    setInterlocutorToDelete(interlocutor);
    setIsDeleteModalOpen(true);
  };

  // Confirme la suppression de l'interlocuteur et ferme la modal
  const confirmDelete = () => {
    if (interlocutorToDelete) {
      deleteInterlocutor(interlocutorToDelete.id);
      setInterlocutorToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  // Ferme la modal de suppression sans supprimer
  const closeDeleteModal = () => {
    setInterlocutorToDelete(null);
    setIsDeleteModalOpen(false);
  };

  // Permet de naviguer vers la page d'édition de l'établissement
  const handleEdit = () => {
    if (company) {
      navigate(`/company/${company.id}/edit`);
    } else {
      toast.error("Informations de l'établissement indisponibles.");
    }
  };

  // Filtre les catégories en fonction du terme de recherche
  const filteredCategories = company?.interlocutors.filter(cat =>
    (cat.firstName || '').toLowerCase().includes('') // À adapter selon la logique, ici on peut filtrer sur un autre champ
  ) || [];

  return (
    <CompanyFormProvider>
      <GreenBackground>
        <div className={styles.mainContainer}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Section Informations de l'établissement */}
              <section className={styles.section}>
                <h5 className={styles.subsectionTitle}>{company?.name}</h5>
                <p>
                  <strong>Adresse :</strong> {company?.address}, {company?.city}, {company?.postalCode}
                </p>
                <p>
                  <strong>Type d'établissement :</strong> {company?.establishmentType}
                </p>
                <p>
                  <strong>Type d'organisation :</strong> {company?.organizationType}
                </p>
                <p>
                  <strong>Commentaires :</strong> {company?.comments || 'Aucun'}
                </p>
                <p>
                  <strong>Nombre de cantines :</strong> {company?.numberOfCanteens}
                </p>
                <p>
                  <strong>Nombre de cuisines centrales :</strong> {company?.numberOfCentralKitchens}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" text="Modifier" onClick={handleEdit} />
                </div>
              </section>

              {/* Section Interlocuteurs */}
              <section className={styles.section}>
                <h5 className={styles.subsectionTitle}>Interlocuteurs</h5>
                {company?.interlocutors.length ? (
                  <InterlocutorsCarousel
                    interlocutors={company.interlocutors}
                    onDelete={openDeleteModal}
                    onSetPrincipal={() => {}}
                    allowPrincipalChange={false}
                  />
                ) : (
                  <p>Aucun interlocuteur trouvé.</p>
                )}
              </section>

              {/* Section Simulations */}
              <section className={styles.simulationsSection}>
                <h5 className={styles.subsectionTitle}>Simulations</h5>
                {simulations.length > 0 ? (
                  <table className={styles.simulationsTable}>
                    <thead>
                      <tr>
                        <th className={styles.tableHeader}>ID</th>
                        <th className={styles.tableHeader}>Date</th>
                        <th className={styles.tableHeader}>Coût/plat (€)</th>
                        <th className={styles.tableHeader}>Plats/jour</th>
                        <th className={styles.tableHeader}>% Gaspillage</th>
                        <th className={styles.tableHeader}>Éco. Prod. (€)</th>
                        <th className={styles.tableHeader}>Éco. Gasp. (€)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simulations.map(simulation => (
                        <tr key={simulation.id} className={styles.tableRow}>
                          <td className={styles.tableCell}>{simulation.id}</td>
                          <td className={styles.tableCell}>
                            {new Date(simulation.createdAt).toLocaleDateString()}
                          </td>
                          <td className={styles.tableCell}>{simulation.costPerDish.toFixed(2)}</td>
                          <td className={styles.tableCell}>{simulation.dishesPerDay}</td>
                          <td className={styles.tableCell}>{simulation.wastePercentage.toFixed(2)}%</td>
                          <td className={styles.tableCell}>{simulation.dailySavings.toFixed(2)}</td>
                          <td className={styles.tableCell}>{simulation.dailyWasteSavings.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Aucune simulation disponible pour cet établissement.</p>
                )}
              </section>
            </>
          )}
        </div>

        {/* Modal de confirmation de suppression pour un interlocuteur */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          message={
            interlocutorToDelete && company
              ? `Voulez-vous supprimer l'interlocuteur "${interlocutorToDelete.firstName} ${interlocutorToDelete.lastName}" rattaché à l'établissement "${company.name}" ?`
              : undefined
          }
          count={1}
          itemType="interlocuteur"
          isDeleting={false}
        />
      </GreenBackground>
    </CompanyFormProvider>
  );
};

export default CompanyPage;

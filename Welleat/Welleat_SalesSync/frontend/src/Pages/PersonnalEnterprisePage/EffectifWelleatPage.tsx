/*
  Dossier : src/Pages/PersonnalEnterprisePage
  Fichier : EffectifWelleatPage.tsx
  Ce composant affiche les détails d'un utilisateur, ses établissements assignés et un carousel des interlocuteurs assignés.
*/

import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import * as styles from '../../styles/PagesStyles/CompanyEnterprisePages.css';
import { vars } from '../../styles/variables.css';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import { FaTimes } from 'react-icons/fa';
import DeleteConfirmationModal from '../../components/Modal/ChoiceModal/DeleteConfirmationModal';
import defaultProfile from '../../assets/images/defaultimage.jpg';
import { UserDetail, Interlocutor } from '../../types';
import { convertKeysToCamelCase } from '../../utils/snakeToCamel';
import AssignModal from '../DashboardPage/DashboardComponents/modals/AssignModal/AssignModal';

const InterlocutorsCarousel: React.FC<{
  interlocutors: Interlocutor[];
  onDelete: (interlocutor: Interlocutor) => void;
}> = ({ interlocutors, onDelete }) => {
  if (!interlocutors || interlocutors.length === 0) {
    return <p className={styles.info}>Aucun interlocuteur assigné.</p>;
  }
  
  // Création d'un tableau étendu en clonant le dernier élément au début et le premier à la fin
  const extendedItems = useMemo(() => {
    return [interlocutors[interlocutors.length - 1], ...interlocutors, interlocutors[0]];
  }, [interlocutors]);
  
  const [currentIndex, setCurrentIndex] = useState<number>(extendedItems.length > 0 ? 1 : 0);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
  const cardWidth = isMobile ? 300 : 320;
  const wrapperWidth = extendedItems.length * cardWidth;
  
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
  
  useEffect(() => {
    if (!transitionEnabled) {
      const timer = setTimeout(() => {
        setTransitionEnabled(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transitionEnabled]);
  
  // Gestion du swipe tactile
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
  
  // Récupération de l'élément affiché pour les clones
  const getDisplayedItem = (item: Interlocutor, index: number): Interlocutor => {
    if (index === 0) return interlocutors[interlocutors.length - 1];
    if (index === extendedItems.length - 1) return interlocutors[0];
    return item;
  };
  
  return (
    <div className={styles.carouselContainer}>
      <button
        className={`${styles.carouselButton} ${styles.leftButton}`}
        onClick={handlePrev}
        aria-label="Précédent"
      >
        ‹
      </button>
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
              <h6 className={styles.cardHeader}>
                {displayedItem.firstName || displayedItem.first_name} {displayedItem.lastName || displayedItem.last_name}
              </h6>
              <div className={styles.cardDetails}>
                <p>Email : {displayedItem.email}</p>
                {displayedItem.phone && <p>Téléphone : {displayedItem.phone}</p>}
                {displayedItem.position && <p>Poste : {displayedItem.position}</p>}
                {displayedItem.comment && <p>Commentaire : {displayedItem.comment}</p>}
              </div>
              <button
                onClick={() => onDelete(displayedItem)}
                className={styles.deleteButton}
                aria-label="Supprimer interlocuteur"
              >
                <FaTimes />
              </button>
            </div>
          );
        })}
      </div>
      <button
        className={`${styles.carouselButton} ${styles.rightButton}`}
        onClick={handleNext}
        aria-label="Suivant"
      >
        ›
      </button>
    </div>
  );
};

const EffectifWelleatPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [interlocutorToDelete, setInterlocutorToDelete] = useState<Interlocutor | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId) {
        console.error("Le paramètre userId est absent dans l'URL.");
        setLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get(`/users/${userId}/assignedData`);
        const transformedData = convertKeysToCamelCase({
          ...res.data,
          interlocutors: res.data.interlocutors?.map((i: any) => ({
            ...i,
            isPrincipal: i.Users_Interlocutors?.isPrincipal || false
          })) || []
        });
        setUserDetail(transformedData);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetail();
  }, [userId]);

  const deleteInterlocutor = async (interlocutorId: number) => {
    try {
      await axiosInstance.delete(`/interlocutors/${interlocutorId}`);
      if (userDetail) {
        setUserDetail({
          ...userDetail,
          interlocutors: userDetail.interlocutors.filter(i => i.id !== interlocutorId),
        });
      }
      toast.success('Interlocuteur supprimé avec succès');
    } catch (err) {
      console.error('Erreur lors de la suppression de l’interlocuteur:', err);
      toast.error("Erreur lors de la suppression de l'interlocuteur");
    }
  };

  const openDeleteModal = (i: Interlocutor) => {
    setInterlocutorToDelete(i);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (interlocutorToDelete) {
      deleteInterlocutor(interlocutorToDelete.id);
      setInterlocutorToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setInterlocutorToDelete(null);
  };

  if (loading) return <div>Chargement...</div>;
  if (!userDetail) return <div>Aucun détail utilisateur disponible</div>;

  return (
    <GreenBackground>
      <div className={styles.mainContainer}>
        <section className={styles.section}>
          <h5 className={styles.subsectionTitle}>
            {userDetail.firstName} {userDetail.lastName}
          </h5>
          <div className={styles.profilePhotoContainer}>
            <img src={defaultProfile} alt="Photo de profil" className={styles.profilePhoto} />
            <button
              className={styles.modifyPhotoButton}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = e => {
                  const file = (e.target as HTMLInputElement)?.files?.[0];
                  if (file)
                    toast.info('Fonction de téléchargement à implémenter');
                };
                input.click();
              }}
            >
              Modifier la photo
            </button>
          </div>
          <p>
            <strong>Email :</strong> {userDetail.email}
          </p>
          <p>
            <strong>Téléphone :</strong> {userDetail.phone || 'N/A'}
          </p>
          <p>
            <strong>Poste :</strong> {userDetail.position || 'N/A'}
          </p>
        </section>

        <section className={styles.section}>
          <h5 className={styles.subsectionTitle}>Établissements Assignés</h5>
          {userDetail.companies && userDetail.companies.length > 0 ? (
            <ul className={styles.companyList}>
              {userDetail.companies.map(c => (
                <li key={c.id} className={styles.companyItem}>
                  {c.name} - {c.address}, {c.city} {c.postalCode}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.info}>Aucun établissement assigné.</p>
          )}
        </section>

        <section className={styles.section}>
          <h5 className={styles.subsectionTitle}>Interlocuteurs Assignés</h5>
          {userDetail.interlocutors && userDetail.interlocutors.length > 0 ? (
            <InterlocutorsCarousel
              interlocutors={userDetail.interlocutors ?? []}
              onDelete={(interlocutor) => openDeleteModal(interlocutor)}
            />
          ) : (
            <p className={styles.info}>Aucun interlocuteur assigné.</p>
          )}
        </section>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        count={1}
        itemType="interlocuteur"
      />
    </GreenBackground>
  );
};

export default EffectifWelleatPage;

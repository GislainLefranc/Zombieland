// Dossier : src/components/DashboardComponents/modals/AssignModal/components
// Fichier : UserAssignmentView.tsx
// Ce composant permet d'afficher et de sélectionner un utilisateur (membre Welleat) pour une assignation.
// Il affiche une liste et, pour le membre sélectionné, ses informations détaillées sont affichées.

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../../../api/axiosInstance';
import * as styles from '../AssignModal.css';
import { SelectedEntities, User, UserDetail } from '../../../../../../types/index';
import { toast } from 'react-toastify';

interface UserAssignmentViewProps {
  users: User[];                         // Liste des utilisateurs disponibles
  onUserSelect: (userId: number) => void;  // Fonction appelée lorsqu'un utilisateur est sélectionné
  selectedUserId?: number;               // ID de l'utilisateur actuellement sélectionné
}

export const UserAssignmentView: React.FC<UserAssignmentViewProps> = ({
  users,
  onUserSelect,
  selectedUserId,
}) => {
  const [selectedUserData, setSelectedUserData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Récupère les données détaillées du membre sélectionné via l'API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!selectedUserId) {
        setSelectedUserData(null);
        return;
      }
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`/users/${selectedUserId}`);
        setSelectedUserData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Impossible de charger les données de l'utilisateur.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [selectedUserId]);

  return (
    <div className={styles.assignmentOverview}>
      <div className={styles.usersColumn}>
        <h5 className={styles.sectionHeader}>Membres Welleat</h5>
        <div className={styles.usersList}>
          {users?.map(user => (
            <div
              key={user.id}
              onClick={() => onUserSelect(user.id)}
            >
              {user.first_name} {user.last_name}
            </div>
          ))}
        </div>
        {/* Dropdown pour petits écrans */}
        <div className={styles.usersDropdown}>
          <select
            value={selectedUserId || ''}
            onChange={(e) => onUserSelect(Number(e.target.value))}
          >
            <option value="" disabled>
              Sélectionnez un membre Welleat
            </option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <div>Chargement...</div>}

      {!isLoading && selectedUserData && (
        <div className={styles.assignmentDetails}>
          <h5>
            {selectedUserData.firstName} {selectedUserData.lastName}
          </h5>
          <p>
            <strong>Email:</strong> {selectedUserData.email}
          </p>
          <p>
            <strong>Téléphone:</strong> {selectedUserData.phone || 'N/A'}
          </p>
          <p>
            <strong>Poste:</strong> {selectedUserData.position || 'N/A'}
          </p>

          <h5 className={styles.sectionHeader}>Établissements Assignés</h5>
          {selectedUserData.companies?.length ? (
            <ul className={styles.companyBlock}>
              {selectedUserData.companies.map(c => (
                <li key={c.id} className={styles.companyBlock}>
                  {c.name} - {c.address}, {c.city} {c.postalCode}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun établissement assigné.</p>
          )}

          <h5 className={styles.sectionHeader}>Interlocuteurs Directs</h5>
          {selectedUserData.interlocutors?.length ? (
            <ul className={styles.interlocutorsList}>
              {selectedUserData.interlocutors.map(i => (
                <li key={i.id} className={styles.interlocutorItem}>
                  <h5>
                    {i.firstName} {i.lastName}
                  </h5>
                  <p>
                    <strong>Email:</strong> {i.email}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {i.phone || 'N/A'}
                  </p>
                  <p>
                    <strong>Poste:</strong> {i.position || 'N/A'}
                  </p>
                  {i.comment && (
                    <p>
                      <strong>Commentaire:</strong> {i.comment}
                    </p>
                  )}
                  {i.isPrincipal && (
                    <p className={styles.principalBadge}>
                      Interlocuteur principal
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun interlocuteur direct.</p>
          )}
        </div>
      )}
    </div>
  );
};

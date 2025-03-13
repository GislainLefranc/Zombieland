// Dossier : src/components/DashboardComponents/lists
// Fichier : UsersList.tsx
// Ce composant affiche la liste des utilisateurs sous forme de tableau.
// Il récupère les données via une API, gère le chargement et les erreurs, et permet de naviguer vers le détail d'un utilisateur.

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../../api/axiosInstance';
import * as styles from '../styles/Lists.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
}

interface UsersListProps {
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

const UsersList: React.FC<UsersListProps> = ({
  selectedItems,
  setSelectedItems,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/users');
        setUsers(response.data);
      } catch (err: any) {
        console.error(err);
        setError('Erreur lors de la récupération des utilisateurs.');
        toast.error('Erreur lors de la récupération des utilisateurs.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Fonction de basculement de la sélection pour un utilisateur
  const toggleSelection = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Navigue vers la page de détail de l'utilisateur sélectionné
  const handleRowClick = (user: User) => {
    navigate(`/membre-welleat/${user.id}`);
  };

  if (loading) return <div>Chargement des utilisateurs...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.listContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.columnCheckbox}>Sélection</th>
            <th className={styles.tableHeaderCell}>Prénom</th>
            <th className={styles.tableHeaderCell}>Nom</th>
            <th className={styles.tableHeaderCell}>Email</th>
            <th className={styles.tableHeaderCell}>Téléphone</th>
            <th className={styles.tableHeaderCell}>Position</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr
              key={user.id}
              className={styles.tableRow}
              onClick={() => handleRowClick(user)}
              style={{ cursor: 'pointer' }}
            >
              <td className={styles.tableCell}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={selectedItems.includes(user.id)}
                  onChange={e => {
                    e.stopPropagation();
                    toggleSelection(user.id);
                  }}
                />
              </td>
              <td className={styles.tableCell}>{user.firstName}</td>
              <td className={styles.tableCell}>{user.lastName}</td>
              <td className={styles.tableCell}>{user.email}</td>
              <td className={styles.tableCell}>{user.phone || 'N/A'}</td>
              <td className={styles.tableCell}>{user.position || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;

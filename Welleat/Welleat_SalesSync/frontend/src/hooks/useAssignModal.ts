// Dossier : src/hooks, Fichier : useAssignModal.ts
// Ce hook personnalisé permet de récupérer les entreprises, interlocuteurs et utilisateurs
// pour le modal d'assignation. Les données récupérées sont converties en camelCase pour une meilleure cohérence.

import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Company, Interlocutor, User } from '../types/index';
import { convertKeysToCamelCase } from '../utils/snakeToCamel';

/**
 * Hook personnalisé pour gérer le modal d'assignation.
 * Récupère les entreprises, interlocuteurs et utilisateurs.
 */
const useAssignModal = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [interlocutors, setInterlocutors] = useState<Interlocutor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companiesRes, interlocutorsRes, usersRes] = await Promise.all([
          axiosInstance.get('/companies'),
          axiosInstance.get('/interlocutors'),
          axiosInstance.get('/users'),
        ]);

        // Conversion des données reçues en camelCase
        const companiesData = convertKeysToCamelCase(companiesRes.data);
        const interlocutorsData = convertKeysToCamelCase(interlocutorsRes.data);
        const usersData = convertKeysToCamelCase(usersRes.data);

        setCompanies(companiesData);
        setInterlocutors(interlocutorsData);
        setUsers(usersData);

        console.log('📄 Données dans useAssignModal:', {
          companies: companiesData,
          interlocutors: interlocutorsData,
          users: usersData,
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { companies, interlocutors, users, loading, error };
};

export default useAssignModal;

import { DashboardData, User } from '../types';

/**
 * Filtre les données du tableau de bord en fonction du rôle de l'utilisateur.
 * @param dashboardData - Données complètes du tableau de bord.
 * @param user - Utilisateur effectuant la requête.
 * @returns Les données filtrées en fonction du rôle.
 */
export const filterDashboardData = (dashboardData: DashboardData, user: User) => {
  if (user.roleId === 1) {
    // Administrateur
    return {
      companies: dashboardData.companies,
      interlocutors: dashboardData.interlocutors,
      independentInterlocutors: dashboardData.interlocutors.filter(i => i.isIndependent),
      users: dashboardData.users || [],
    };
  }

  if (user.roleId === 2) {
    // SalesUser
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
            (interlocutor.company &&
              (interlocutor.company.createdBy === user.id ||
                interlocutor.company.assignedTo === user.id)))
      ),
      users: [], // SalesUser ne voit pas les autres utilisateurs
    };
  }

  // Par défaut, retourner des listes vides
  return {
    companies: [],
    interlocutors: [],
    independentInterlocutors: [],
    users: [],
  };
};

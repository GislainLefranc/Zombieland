import React, { useState, useEffect, KeyboardEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// Définition des interfaces
interface UserFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role_id: number;
}

interface User extends UserFormData {
  id: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserFormData | User) => void | Promise<void>;
  user?: User | null;
  role: { id: number; name: string }[];
}

// Composant UserModal
const UserModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit, user, role }) => {
  // État pour les données du formulaire
  const [formData, setFormData] = useState<UserFormData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role_id: 2, // Rôle par défaut
  });

  // État pour les critères de validation du mot de passe
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  // Effet pour mettre à jour les données du formulaire en cas de modification de l'utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "", // Ne jamais pré-remplir le mot de passe
        role_id: user.role_id,
      });
    } else {
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role_id: 2,
      });
    }
  }, [user]);

  // Fonction pour valider les critères du mot de passe
  const validatePassword = (value: string) => {
    setPasswordCriteria({
      length: value.length >= 6,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      specialChar: /[@$!%*?&]/.test(value),
    });
  };

  // Gestion des changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role_id" ? Number(value) : value,
    }));

    // Valider le mot de passe si le champ modifié est "password"
    if (name === "password") {
      validatePassword(value);
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || (!user && !formData.password)) {
      alert("Les champs email et mot de passe sont requis.");
      return;
    }
    try {
      if (user) {
        onSubmit({ ...formData, id: user.id });
      } else {
        onSubmit(formData);
      }
      onClose(); // Fermer la modal après la soumission
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  // Gérer le clic en dehors de la modal pour la fermer
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Gérer la touche "Échap" pour fermer la modal
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  // Ne pas afficher la modal si `isOpen` est faux
  if (!isOpen) {
    return null;
  }

  // Rendu du composant
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="w-full max-w-md p-6 bg-white rounded-lg"
        onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
        onKeyUp={(e) => e.stopPropagation()} // Empêcher la propagation de l'événement clavier
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">
            {user ? "Modifier un utilisateur" : "Créer un nouvel utilisateur"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fermer"
          >
            <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prénom */}
          <div>
            <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-500"
              required
            />
          </div>
          {/* Nom */}
          <div>
            <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-500"
              required
            />
          </div>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-500"
              required
            />
          </div>
          {/* Mot de passe */}
          {!user && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-500"
                required
              />
              {/* Critères de validation */}
              <ul className="mt-2 text-sm">
                <li className={passwordCriteria.length ? "text-green-500" : "text-red-500"}>
                  {passwordCriteria.length ? "✔️" : "❌"} Au moins 6 caractères
                </li>
                <li className={passwordCriteria.uppercase ? "text-green-500" : "text-red-500"}>
                  {passwordCriteria.uppercase ? "✔️" : "❌"} Une lettre majuscule
                </li>
                <li className={passwordCriteria.lowercase ? "text-green-500" : "text-red-500"}>
                  {passwordCriteria.lowercase ? "✔️" : "❌"} Une lettre minuscule
                </li>
                <li className={passwordCriteria.number ? "text-green-500" : "text-red-500"}>
                  {passwordCriteria.number ? "✔️" : "❌"} Un chiffre
                </li>
                <li className={passwordCriteria.specialChar ? "text-green-500" : "text-red-500"}>
                  {passwordCriteria.specialChar ? "✔️" : "❌"} Un caractère spécial (@$!%*?&)
                </li>
              </ul>
            </div>
          )}
          {/* Rôle */}
          <div>
            <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring focus:ring-gray-500"
              required
            >
              <option value="0">Sélectionnez un rôle</option>
              {role.map((r) => (
                <option key={r.id} value={r.id}>
					{r.name}
                </option>
              ))}
            </select>
          </div>
          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              {user ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
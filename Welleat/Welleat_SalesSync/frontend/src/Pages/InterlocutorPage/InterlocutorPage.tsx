// Dossier : src/Pages/InterlocutorPage | Fichier : InterlocutorPage.jsx
// Ce composant présente un formulaire simplifié pour la création d'un interlocuteur.

import React, { useState } from 'react';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import Button from '../../components/Button/Button';
import '../CompanyForm/CompanyForm.css';

const InterlocutorPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    interlocutorType: '',
    comment: '',
  });

  // Mise à jour des champs du formulaire
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission du formulaire
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Interlocuteur soumis :', formData);
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    console.log('Création annulée');
  };

  return (
    <GreenBackground>
      <div className="company-form">
        <h2 className="form-title">Création d'un interlocuteur</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="lastName">Nom</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="buttons-container">
            <Button text="Sauvegarder" />
            <Button text="Annuler" onClick={handleCancel} />
          </div>
        </form>
      </div>
    </GreenBackground>
  );
};

export default InterlocutorPage;

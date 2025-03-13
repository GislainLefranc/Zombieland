//// Dossier : src/components, Fichier : InterlocutorCard.jsx

import React from 'react';

interface InterlocutorCardProps {
  interlocutor: {
    uniqueKey: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position?: string;
    comment?: string;
    isPrincipal: boolean;
  };
  onSetPrincipal: (uniqueKey: string) => void;
  onRemove: (uniqueKey: string) => void;
}

const InterlocutorCard: React.FC<InterlocutorCardProps> = ({
  interlocutor,
  onSetPrincipal,
  onRemove,
}) => {
  return (
    <div className="CompanyForm_interlocutorItem">
      <div>
        <strong>
          {interlocutor.firstName} {interlocutor.lastName}
        </strong>
        <p>Email: {interlocutor.email}</p>
        {interlocutor.phone && <p>Téléphone: {interlocutor.phone}</p>}
        {interlocutor.position && <p>Position: {interlocutor.position}</p>}
        {interlocutor.comment && <p>Commentaire: {interlocutor.comment}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Définir l'interlocuteur comme principal */}
        <span
          onClick={() => onSetPrincipal(interlocutor.uniqueKey)}
          style={{
            cursor: 'pointer',
            color: interlocutor.isPrincipal ? '#FFCF01' : '#808080',
            fontSize: '24px',
          }}
        >
          ★
        </span>
        {/* Bouton pour supprimer l'interlocuteur */}
        <button
          type="button"
          className="Buttons_dangerButton"
          onClick={() => onRemove(interlocutor.uniqueKey)}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default InterlocutorCard;

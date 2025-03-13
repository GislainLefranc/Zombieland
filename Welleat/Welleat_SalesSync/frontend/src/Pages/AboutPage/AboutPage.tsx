// Dossier : src/Pages, Fichier : AboutPage.tsx
// Ce composant affiche une page "À propos" en utilisant un fond vert personnalisé.
// Il présente les informations légales de l'entreprise ainsi que des liens pour télécharger divers documents.

import React from 'react';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import * as styles from './AboutPage.css';
import { toast } from 'react-toastify'; // Utilisé pour afficher des notifications toast
import ExtraitKbis from '../../assets/docs/Extrait Kbis Welleat.pdf';
import StatutsWelleat from '../../assets/docs/Statuts Welleat.pdf';

const AboutPage = () => {
  /**
   * Fonction qui gère le téléchargement d'un document.
   * Affiche un toast informatif, crée dynamiquement un lien <a> pour déclencher le téléchargement,
   * puis le retire du DOM.
   */
  const handleDownload = (
    e: React.MouseEvent<HTMLAnchorElement>,
    documentName: string,
    url: string
  ) => {
    e.preventDefault(); // Empêche l'action par défaut du lien
    toast.info(`Téléchargement de "${documentName}" en cours...`);

    // Crée un lien temporaire pour lancer le téléchargement
    const link = document.createElement('a');
    link.href = url;
    link.download = documentName; // Définit le nom du fichier téléchargé
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <GreenBackground>
      <div className={styles.aboutContent}>
        <h2 className={styles.aboutTitle}>À propos de Welleat</h2>
        <section className={styles.companyInfo}>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>
              Nom de l'entreprise :
            </strong>{' '}
            Welleat
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Adresse :</strong> 23 RUE DU PONT NEUF, 59240 DUNKERQUE, France
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Email :</strong>{' '}
            <a href="mailto:interlocutor@welleat.fr">interlocutor@welleat.fr</a>
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Téléphone :</strong>{' '}
            <a href="tel:+33787348434">07 87 34 84 34</a>
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Forme juridique :</strong>{' '}
            SAS (Société par Actions Simplifiée)
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>SIREN :</strong> 912 746 088
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>SIRET :</strong> 912 746 088 00018
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Activité principale :</strong>{' '}
            Édition de logiciels applicatifs
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Capital social :</strong>{' '}
            29 000,00 €
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Date de création :</strong>{' '}
            12/04/2022
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Effectif :</strong> 3 à 5 salariés (en 2022)
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Numéro TVA :</strong>{' '}
            FR56 912 746 088
          </p>
          <p className={styles.companyInfoParagraph}>
            <strong className={styles.companyInfoStrong}>Convention collective :</strong>{' '}
            IDCC 1486
          </p>
        </section>

        <section>
          <h2 className={styles.legalInfoTitle}>Téléchargements utiles</h2>
          <p>
            {/* Lien vers le justificatif d'immatriculation externe */}
            <a
              href="https://annuaire-entreprises.data.gouv.fr/justificatif-immatriculation-pdf/912746088"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.legalInfoLink}
            >
              Télécharger le justificatif d'immatriculation
            </a>
          </p>
          <p>
            {/* Lien pour télécharger l'extrait Kbis local */}
            <a
              href={ExtraitKbis}
              className={styles.legalInfoLink}
              onClick={(e) => handleDownload(e, "l'extrait Kbis", ExtraitKbis)}
            >
              Télécharger l'extrait Kbis
            </a>
          </p>
          <p>
            {/* Lien pour télécharger les statuts locaux */}
            <a
              href={StatutsWelleat}
              className={styles.legalInfoLink}
              onClick={(e) => handleDownload(e, 'les statuts', StatutsWelleat)}
            >
              Télécharger les statuts
            </a>
          </p>
          <p>
            {/* Lien vers l'organigramme de la société externe */}
            <a
              href="https://annuaire-entreprises.data.gouv.fr/justificatif-immatriculation-pdf/912746088"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.legalInfoLink}
            >
              Télécharger l'organigramme de la société
            </a>
          </p>
        </section>
      </div>
    </GreenBackground>
  );
};

export default AboutPage;

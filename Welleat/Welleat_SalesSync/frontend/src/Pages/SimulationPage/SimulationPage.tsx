// Dossier : src/Pages/SimulationPage
// Fichier : SimulationPage.tsx
// Ce composant permet de réaliser une simulation des économies grâce à la solution Welleat.
// Il gère le formulaire de saisie, le calcul des résultats, la sauvegarde locale et l'envoi par email.

import React, { useState, useContext, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  simulationTitle,
  simulationInputSection,
  simulationResultSection,
  simulationResultTitle,
  simulationInlineLogo,
  simulationResultGroup,
  simulationResultValue,
  simulationNote,
  simulationWelleaPerformance,
  simulationPerformanceTitle,
  simulationSolutionW,
  simulationButtonsContainer,
  simulationLogoWelleat,
  wideLabel,
  narrowInput,
  consentCheckbox,
} from './SimulationPage.css';
import GreenBackground from '../../components/GreenBackground/GreenBackground';
import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';
import { AuthContext } from '../../context/AuthContext';
import CompanyLogo from '../../assets/images/Logo_welleat.svg';
import { useSimulationForm, SimulationResults } from '../../hooks/useSimulationForm';
import InputField from '../../components/InputField/InputField';
import axiosInstance from '../../api/axiosInstance';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

// Chargement paresseux des modaux
const EstablishmentChoiceModal = lazy(() =>
  import('../../components/Modal/ChoiceModal/EstablishmentChoiceModal').then(module => ({
    default: module.default
  }))
);
const EmailModal = lazy(() => import('../../components/Modal/ChoiceModal/Mailing/EmailModal'));

const initialValues = {
  costPerDish: 2.8,
  dishesPerDay: 1000,
  wastePercentage: 24,
};

const SimulationPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { values, handleChange, calculateResults, setValues } = useSimulationForm(initialValues);

  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [consent, setConsent] = useState(false);

  // Calcul de la simulation et affichage des résultats
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setShowResults(true);
    toast.success('Le calcul a été effectué avec succès !');
  };

  // Sauvegarde de la simulation en local et ouverture du modal de choix d'établissement
  const handleSave = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour sauvegarder une simulation');
      return;
    }
    if (results) {
      const simulationData = {
        costPerDish: values.costPerDish,
        dishesPerDay: values.dishesPerDay,
        wastePercentage: values.wastePercentage,
        dailySavings: results.dailyProductionSavings,
        monthlySavings: results.monthlyProductionSavings,
        dailyWasteSavings: results.dailyWasteSavings,
        monthlyWasteSavings: results.monthlyWasteSavings,
        createdBy: user.id,
        assignedTo: user.id,
      };
      localStorage.setItem('pendingSimulation', JSON.stringify(simulationData));
      setIsModalOpen(true);
    }
  };

  // Redirection vers le dashboard après choix d'établissement existant
  const handleExistingEstablishment = () => {
    toast.success('Simulation sauvegardée avec succès !');
    navigate('/dashboard');
  };

  // Redirection vers la création d'un établissement
  const handleNewEstablishment = () => {
    toast.success('Simulation sauvegardée avec succès !');
    navigate('/company/create');
  };

  // Ajout d'une adresse email à la liste
  const handleAddEmail = () => {
    if (emailInput && /\S+@\S+\.\S+/.test(emailInput)) {
      if (!emails.includes(emailInput)) {
        setEmails([...emails, emailInput]);
        setEmailInput('');
      } else {
        toast.error('Cet email est déjà ajouté.');
      }
    } else {
      toast.error("L'adresse email n'est pas valide.");
    }
  };

  // Suppression d'une adresse email de la liste
  const handleRemoveEmail = (index: number) => {
    const updatedEmails = emails.filter((_, i) => i !== index);
    setEmails(updatedEmails);
  };

  // Envoi des emails avec les résultats de la simulation
  const handleSendEmails = async () => {
    if (!consent) {
      toast.error('Veuillez donner votre consentement pour envoyer des emails.');
      return;
    }
    if (emails.length === 0) {
      toast.error('Veuillez ajouter au moins une adresse email.');
      return;
    }
    if (!results) {
      toast.error('Aucune simulation disponible à envoyer.');
      return;
    }
    setIsSendingEmail(true);
    try {
      const response = await axiosInstance.post('/emails/send-simulation', {
        toEmails: emails,
        simulationData: { ...values, ...results },
      });
      if (response.status === 200) {
        toast.success('Emails envoyés avec succès !');
        setIsEmailModalOpen(false);
      } else {
        toast.error("Erreur lors de l'envoi des emails.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi des emails.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Réinitialisation du formulaire de simulation
  const handleReset = () => {
    setValues(initialValues);
    setShowResults(false);
    setResults(null);
    setEmails([]);
    setEmailInput('');
    setConsent(false);
  };

  return (
    <GreenBackground>
      <h2 className={simulationTitle}>Simulation des économies</h2>
      <form onSubmit={handleCalculate} className={simulationInputSection}>
        <InputField
          id="costPerDish"
          name="costPerDish"
          type="number"
          step="0.1"
          label="Coût de revient d’un plat (€) :"
          value={values.costPerDish}
          onChange={handleChange}
          variant="simulation"
          labelClass={wideLabel}
          inputClass={narrowInput}
        />
        <InputField
          id="dishesPerDay"
          name="dishesPerDay"
          type="number"
          label="Nombre de plats produits par jour :"
          value={values.dishesPerDay}
          onChange={handleChange}
          variant="simulation"
          labelClass={wideLabel}
          inputClass={narrowInput}
        />
        <InputField
          id="wastePercentage"
          name="wastePercentage"
          type="number"
          step="0.1"
          label="Pourcentage de gaspillage par plat (%) :"
          value={values.wastePercentage}
          onChange={handleChange}
          variant="simulation"
          labelClass={wideLabel}
          inputClass={narrowInput}
        />
        <Button
          variant="simulation"
          size="medium"
          text="Calculer"
          onClick={handleCalculate}
          type="submit"
        />
      </form>

      {showResults && results && (
        <div className={simulationResultSection}>
          <h2 className={simulationResultTitle}>
            Résultat attendu par la méthode&nbsp;
            <div className={simulationLogoWelleat}>
              <img
                src={CompanyLogo}
                alt="Logo Société"
                className={simulationInlineLogo}
              />
              <span>Welleat</span>
            </div>
          </h2>
          <div className={simulationResultGroup}>
            <p>
              Économies sur la production :{' '}
              <span className={simulationResultValue}>
                {results.dailyProductionSavings} €/jour, soit {results.monthlyProductionSavings} €/mois
              </span>
            </p>
            <p>
              Économies sur le gaspillage :{' '}
              <span className={simulationResultValue}>
                {results.dailyWasteSavings} €/jour, soit {results.monthlyWasteSavings} €/mois
              </span>
            </p>
            <p className={simulationNote}>(18 jours ouvrables par mois)</p>
          </div>
          <div className={simulationWelleaPerformance}>
            <h2 className={simulationPerformanceTitle}>
              Soit grâce à la solution&nbsp;
              <div className={simulationLogoWelleat}>
                <img
                  src={CompanyLogo}
                  alt="Logo Société"
                  className={simulationInlineLogo}
                />
                <span>Welleat</span>
              </div>
            </h2>
            <p className={simulationSolutionW}>
              14 % d’économie sur le coût de production d’un plat.
            </p>
            <p className={simulationSolutionW}>
              45 % de réduction du gaspillage alimentaire.
            </p>
            <div className={consentCheckbox}>
              <input
                type="checkbox"
                id="consent"
                checked={consent}
                onChange={() => setConsent(!consent)}
                required
              />
              <label htmlFor="consent">
                Avant d'envoyer la simulation à un tiers, avez-vous eu son approbation pour utiliser ses données ?
              </label>
            </div>
          </div>
          <div className={simulationButtonsContainer}>
            <Button
              variant="submit"
              size="medium"
              text="Sauvegarder la simulation"
              onClick={handleSave}
              type="button"
            />
            <Button
              variant="simulation"
              size="medium"
              text="Envoyer par email"
              onClick={() => setIsEmailModalOpen(true)}
              type="button"
            />
            <Button
              variant="danger"
              text="Réinitialiser"
              onClick={handleReset}
            />
          </div>
        </div>
      )}

      <Suspense fallback={<div>Chargement...</div>}>
        <EstablishmentChoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onExistingEstablishment={handleExistingEstablishment}
          onNewEstablishment={handleNewEstablishment}
          companies={[]} // Passer les compagnies si nécessaire
          onCompanySelect={() => {}} // À implémenter si besoin
          showCompanyForm={false}
          newCompanyData={{ name: '' }}
          handleCompanyChange={() => {}} // À implémenter si besoin
          handleCompanySubmit={() => {}} // À implémenter si besoin
        />

        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          emailInput={emailInput}
          setEmailInput={setEmailInput}
          handleAddEmail={handleAddEmail}
          emails={emails}
          handleRemoveEmail={handleRemoveEmail}
          handleSendEmails={handleSendEmails}
          isSendingEmail={isSendingEmail}
        />
      </Suspense>
    </GreenBackground>
  );
};

export default SimulationPage;

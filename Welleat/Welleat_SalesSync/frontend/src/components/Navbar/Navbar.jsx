//// Dossier : src/components/Modal, Fichier : Navbar.tsx
// Ce composant Navbar affiche le logo du site et les liens de navigation.
// Il intègre un menu hamburger pour les petits écrans.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SiteLogo from '../SiteLogo/SiteLogo';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Permet d'alterner l'état du menu hamburger
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Ferme le menu lorsque l'utilisateur clique sur un lien
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <SiteLogo />

      {/* Navbar pour écrans larges */}
      <nav className="navbar">
        <div className="navbarLinks">
          <ul>
            <li><Link to="/homepage">Accueil</Link></li>
            <li><Link to="/simulation">Simulation</Link></li>
            <li className="creationDropdown">
              <button className="creationButton">Création</button>
              <ul className="dropdownMenu">
                <li><Link to="/company/create">Créer un établissement</Link></li>
                <li>
                  <Link to="/interlocuteur/create/independent">
                    Créer un interlocuteur
                  </Link>
                </li>
              </ul>
            </li>
            <li><Link to="/devis">Devis</Link></li>
            <li><Link to="/equipements">Équipements</Link></li>
            <li><Link to="/formules">Formules</Link></li>
            <li><Link to="/dashboard">Tableau de bord</Link></li>
            <li><Link to="/profile">Mon profil</Link></li>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/logout">Se déconnecter</Link></li>
          </ul>
        </div>
      </nav>

      {/* Menu hamburger pour petits écrans */}
      <div className="hamburgerContainer" onClick={toggleMenu}>
        {!isOpen ? (
          <div className="hamburgerIcon">
            <Bars3Icon className="h-8 w-8 text-black" />
          </div>
        ) : (
          <div className="hamburgerIcon open">
            <XMarkIcon className="h-8 w-8 text-black" />
          </div>
        )}
      </div>

      {/* Menu déroulant du hamburger */}
      <div className={`hamburgerMenu ${isOpen ? 'open' : ''}`}>
        <div className="hamburgerContent">
          <h2 className="menuTitle">Menu</h2>
          <ul>
            <li><Link to="/homepage" onClick={closeMenu}>Accueil</Link></li>
            <li><Link to="/simulation" onClick={closeMenu}>Simulation</Link></li>
            <li><Link to="/company/create" onClick={closeMenu}>Créer un établissement</Link></li>
            <li><Link to="/interlocuteur/create/independent" onClick={closeMenu}>Créer un interlocuteur</Link></li>
            <li><Link to="/dashboard" onClick={closeMenu}>Tableau de bord</Link></li>
            <li><Link to="/devis" onClick={closeMenu}>Devis</Link></li>
            <li><Link to="/equipements" onClick={closeMenu}>Équipements</Link></li>
            <li><Link to="/formules" onClick={closeMenu}>Formules</Link></li>
            <li><Link to="/profile" onClick={closeMenu}>Mon profil</Link></li>
            <li><Link to="/about" onClick={closeMenu}>À propos</Link></li>
            <li><Link to="/logout" onClick={closeMenu}>Se déconnecter</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;

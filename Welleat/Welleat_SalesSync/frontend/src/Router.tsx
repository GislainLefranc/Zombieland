import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importations des pages
import LoginPage from './Pages/LoginPage/LoginPage';
import HomePage from './Pages/HomePage/HomePage';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import SimulationPage from './Pages/SimulationPage/SimulationPage';
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import CompanyPage from './Pages/CompanyPage/CompanyPage';
import CompanyCreatePage from './Pages/CompanyCreatePage/CompanyCreatePage';
import AboutPage from './Pages/AboutPage/AboutPage';
import QuotePage from './Pages/QuotePage/QuotePage'; 
import EquipementPage from './Pages/EquipementPage/EquipementPage'; 

import InterlocutorCreatePage from './Pages/InterlocutorCreatePage/InterlocutorCreatePage';
import IndependentInterlocutorCreatePage from './Pages/IndependentInterlocutorCreatePage/IndependentInterlocutorCreatePage';
import CompanyEditPage from './Pages/CompanyEditPage/CompanyEditPage';
import EffectifWelleatPage from './Pages/PersonnalEnterprisePage/EffectifWelleatPage';
import Error404Page from './Pages/ErrorPage/Error404Page';
import Error403Page from './Pages/ErrorPage/Error403Page';
import InterlocutorEditPage from './Pages/InterlocutorEditPage/InterlocutorEditPage';
import FormulaPage from './Pages/FormulaPage/FormulaPage';
import CategoryPage from './Pages/categoryPage/CategoryPage'; 

// Importations des pages de réinitialisation de mot de passe
import ResetPasswordPage from './Pages/ResetPasswordPage/ResetPasswordPage';
import LogoutPage from './Pages/LogoutPage/LogoutPage';

// Importations des composants
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LayoutWithNavbar from './styles/Layout/LayoutWithNavbar';

// Importations des contextes
import { CompanyFormProvider } from './context/CompanyFormContext';
import { IndependentInterlocutorProvider } from './context/IndependentInterlocutorContext';

const AppRouter: React.FC = () => (
  <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Routes>
      {/* Routes sans Navbar */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Routes protégées avec LayoutWithNavbar */}
      <Route element={<LayoutWithNavbar />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/simulation" element={<SimulationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/company/:id" element={<CompanyPage />} />

          {/* Routes nécessitant CompanyFormContext */}
          <Route
            path="/company/create"
            element={
              <CompanyFormProvider>
                <CompanyCreatePage />
              </CompanyFormProvider>
            }
          />
          <Route
            path="/company/:id/edit"
            element={
              <CompanyFormProvider>
                <CompanyEditPage />
              </CompanyFormProvider>
            }
          />

          {/* Routes nécessitant IndependentInterlocutorProvider */}
          <Route
            path="/interlocuteur/create"
            element={
              <CompanyFormProvider>
                <InterlocutorCreatePage />
              </CompanyFormProvider>
            }
          />
          <Route
            path="/interlocuteur/create/independent"
            element={
              <IndependentInterlocutorProvider>
                <IndependentInterlocutorCreatePage />
              </IndependentInterlocutorProvider>
            }
          />
          <Route
            path="/interlocuteur/:id/edit"
            element={
              <CompanyFormProvider>
                <InterlocutorEditPage />
              </CompanyFormProvider>
            }
          />

          {/* Nouvelles routes */}
          <Route path="/devis" element={<QuotePage />} />
          <Route path="/equipements" element={<EquipementPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/formules" element={<FormulaPage />} /> 
          
          {/* Route protégée et limitée aux admins (rôle 1) */}
          <Route
            path="/membre-welleat/:userId"
            element={
              <ProtectedRoute allowedRoles={[1]}>
                <EffectifWelleatPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Routes d'erreur */}
        <Route path="/403" element={<Error403Page />} />
        <Route path="*" element={<Error404Page />} />
      </Route>
    </Routes>
  </>
);

export default AppRouter;
// src/App.tsx

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import SupportLink from './components/SupportLink/SupportLink';
import AppRouter from './Router';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Importation des Context Providers
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import { IndependentInterlocutorProvider } from './context/IndependentInterlocutorContext';
import { CompanyFormProvider } from './context/CompanyFormContext';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <CompanyFormProvider>
        <IndependentInterlocutorProvider>
          <ModalProvider>
            <div>
              <AppRouter />
              <SupportLink />
            </div>
          </ModalProvider>
        </IndependentInterlocutorProvider>
      </CompanyFormProvider>
    </AuthProvider>
        </ErrorBoundary>
  );
};

export default App;

//// Dossier : src/components/ErrorBoundary, Fichier : ErrorBoundary.tsx

import React, { Component, ReactNode } from 'react';
import Error500Page from '../../Pages/ErrorPage/Error500Page';

interface ErrorBoundaryProps {
  children: ReactNode; // Contenu à afficher
  fallback?: ReactNode; // Affichage de secours en cas d'erreur
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void; // Callback en cas d'erreur
  resetOnChange?: any; // Variable permettant de réinitialiser l'erreur lors d'un changement
}

interface ErrorBoundaryState {
  hasError: boolean; // Indique si une erreur a été capturée
  error: Error | null; // Erreur capturée
  errorInfo: React.ErrorInfo | null; // Informations complémentaires sur l'erreur
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  // Mise à jour de l'état lors de la capture d'une erreur
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  // Capture des erreurs et mise à jour de l'état avec les informations
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error('ErrorBoundary a capturé une erreur:', {
      error,
      errorInfo,
      componentStack: errorInfo.componentStack
    });
  }

  // Réinitialisation de l'état si resetOnChange change
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (this.state.hasError && this.props.resetOnChange !== prevProps.resetOnChange) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    }
  }

  // Réinitialiser l'état d'erreur
  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  // Rafraîchir la page
  refreshPage = (): void => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }
      return (
        <Error500Page
          error={error}
          errorInfo={errorInfo}
          onReset={this.reset}
          onRefresh={this.refreshPage}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;

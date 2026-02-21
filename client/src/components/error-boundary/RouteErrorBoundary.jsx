import { ErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import {
  ErrorContainer,
  ErrorContent,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  ErrorActions,
  RetryButton,
  HomeButton,
} from './ErrorBoundary.styles';

/**
 * Get contextual content based on route type
 */
const getContextualContent = (routeType) => {
  const contentMap = {
    board: {
      title: 'Board Error',
      message: 'There was a problem loading the project board. Your data is safe, please try again.',
    },
    dashboard: {
      title: 'Dashboard Error',
      message: 'Unable to load your dashboard. Please refresh or try again later.',
    },
    settings: {
      title: 'Settings Error',
      message: 'There was a problem with the settings page. Your changes may not have been saved.',
    },
    projects: {
      title: 'Projects Error',
      message: 'Unable to load your projects. Please try again.',
    },
    invitations: {
      title: 'Invitations Error',
      message: 'There was a problem with the invitations page. Please try again.',
    },
    projectSettings: {
      title: 'Project Settings Error',
      message: 'Unable to load project settings. Please try again.',
    },
    default: {
      title: 'Something went wrong',
      message: 'We encountered an unexpected error. Please try again or return to the home page.',
    },
  };

  return contentMap[routeType] || contentMap.default;
};

/**
 * Error Fallback Component
 * Displays contextual error messages without exposing critical error details
 */
function ErrorFallback({ routeType, showGoBack = true, showHome = true, resetErrorBoundary }) {
  const content = getContextualContent(routeType);

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  return (
    <ErrorContainer>
      <ErrorContent>
        <ErrorIcon>
          <AlertTriangle size={48} strokeWidth={1.5} />
        </ErrorIcon>
        
        <ErrorTitle>{content.title}</ErrorTitle>
        
        <ErrorMessage>
          {content.message}
        </ErrorMessage>

        <ErrorActions>
          <RetryButton onClick={resetErrorBoundary}>
            <RefreshCw size={18} />
            Try Again
          </RetryButton>
          {showGoBack && (
            <HomeButton onClick={handleGoBack}>
              <ArrowLeft size={18} />
              Go Back
            </HomeButton>
          )}
          {showHome && (
            <HomeButton onClick={handleGoHome}>
              <Home size={18} />
              Dashboard
            </HomeButton>
          )}
        </ErrorActions>
      </ErrorContent>
    </ErrorContainer>
  );
}

/**
 * Route-specific Error Boundary
 * Provides contextual error messages based on the route type
 * Does not expose critical error details to users
 */
function RouteErrorBoundary({ 
  children, 
  routeType, 
  routeName,
  showGoBack = true, 
  showHome = true,
  onError 
}) {
  const handleError = (error, info) => {
    // Log the error to console for debugging (only in development)
    if (import.meta.env.DEV) {
      console.error(`Error in ${routeName || 'route'}:`, error, info);
    }
    
    // Call optional onError callback
    if (onError) {
      onError(error, info);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={(props) => (
        <ErrorFallback 
          routeType={routeType} 
          showGoBack={showGoBack} 
          showHome={showHome}
          {...props} 
        />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}

export default RouteErrorBoundary;

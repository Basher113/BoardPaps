import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router-dom';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import {
  ErrorContainer,
  MainContent,
  ErrorContent,
  ErrorCode,
  ErrorDivider,
  ErrorTitle,
  ErrorMessage,
  ErrorReference,
  CurrentPath,
  ErrorActions,
  PrimaryButton,
  SecondaryButton,
} from './ErrorPage.styles';

/**
 * Get error content based on error type/status
 */
const getErrorContent = (error) => {
  // Handle RouteErrorResponse (404, 500, etc.)
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        return {
          code: '404',
          title: 'Page Not Found',
          message: "The page you're looking for doesn't exist or has been moved to a different location.",
          reference: '#A0-404-BK',
        };
      case 401:
        return {
          code: '401',
          title: 'Unauthorized',
          message: "You need to sign in to access this page. Please authenticate and try again.",
          reference: '#A0-401-AU',
        };
      case 403:
        return {
          code: '403',
          title: 'Access Forbidden',
          message: "You don't have the necessary permissions to view this page.",
          reference: '#A0-403-FB',
        };
      case 500:
        return {
          code: '500',
          title: 'Server Error',
          message: "Something went wrong on our end. Our team has been notified and is working on a fix.",
          reference: '#A0-500-SE',
        };
      default:
        return {
          code: error.status.toString(),
          title: `Error ${error.status}`,
          message: error.statusText || 'An unexpected error occurred. Please try again.',
          reference: `#A0-${error.status}-ER`,
        };
    }
  }

  // Handle other errors (network, JavaScript errors, etc.)
  if (error instanceof Error) {
    return {
      code: 'ERR',
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again or return to the home page.',
      reference: '#A0-ERR-UK',
    };
  }

  // Default fallback
  return {
    code: 'ERR',
    title: 'Oops!',
    message: 'An unexpected error occurred. Please try again.',
    reference: '#A0-ERR-UK',
  };
};

/**
 * Generic Error Page Component
 * Used as errorElement in React Router to handle all routing errors
 * including 404, 401, 403, 500, and other errors
 */
function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  const content = getErrorContent(error);
  
  // Get current path for display
  const currentPath = window.location.pathname;
  
  // Check if it's a server error (5xx)
  const isServerError = isRouteErrorResponse(error) && error.status >= 500;
  
  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <ErrorContainer>
      <MainContent>
        <ErrorContent>
          <ErrorCode>{content.code}</ErrorCode>
          <ErrorDivider />
          
          <ErrorTitle>{content.title}</ErrorTitle>
          <ErrorMessage>{content.message}</ErrorMessage>
          
          <CurrentPath>
            <span>Path: </span>{currentPath}
          </CurrentPath>
          
          <ErrorReference>Error Reference: {content.reference}</ErrorReference>
          
          <ErrorActions>
            <PrimaryButton onClick={handleGoHome}>
              <Home size={16} />
              Go Home
            </PrimaryButton>
            <SecondaryButton onClick={handleGoBack}>
              <ArrowLeft size={16} />
              Go Back
            </SecondaryButton>
            {isServerError && (
              <SecondaryButton onClick={handleRefresh}>
                <RefreshCw size={16} />
                Refresh
              </SecondaryButton>
            )}
          </ErrorActions>
          
          {/* Show error details in development */}
          {import.meta.env.DEV && error instanceof Error && (
            <details style={{ marginTop: '2rem', textAlign: 'left', width: '100%' }}>
              <summary style={{ cursor: 'pointer', color: '#999', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Show error details (dev only)
              </summary>
              <pre style={{ 
                marginTop: '0.5rem', 
                padding: '1rem', 
                background: '#fafafa', 
                borderRadius: '6px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '200px',
                color: '#dc2626',
                border: '1px solid #e5e5e5'
              }}>
                {error.message}
                {'\n\n'}
                {error.stack}
              </pre>
            </details>
          )}
        </ErrorContent>
      </MainContent>
    </ErrorContainer>
  );
}

export default ErrorPage;

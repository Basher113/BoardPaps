import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import {
  ErrorContainer,
  ErrorContent,
  ErrorIcon,
  ErrorTitle,
  ErrorMessage,
  ErrorActions,
  RetryButton,
  HomeButton,
  ErrorDetails,
  ErrorDetailsToggle,
  ErrorDetailsContent,
} from './ErrorBoundary.styles';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails } = this.state;

      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon>
              <AlertTriangle size={48} strokeWidth={1.5} />
            </ErrorIcon>
            
            <ErrorTitle>Something went wrong</ErrorTitle>
            
            <ErrorMessage>
              We encountered an unexpected error. Please try again or return to the home page.
            </ErrorMessage>

            <ErrorActions>
              <RetryButton onClick={this.handleRetry}>
                <RefreshCw size={18} />
                Try Again
              </RetryButton>
              <HomeButton onClick={this.handleGoHome}>
                <Home size={18} />
                Go Home
              </HomeButton>
            </ErrorActions>

            <ErrorDetails>
              <ErrorDetailsToggle onClick={this.toggleDetails}>
                {showDetails ? 'Hide' : 'Show'} technical details
              </ErrorDetailsToggle>
              
              {showDetails && (
                <ErrorDetailsContent>
                  <p>
                    <strong>Error:</strong> {error?.toString()}
                  </p>
                  {errorInfo?.componentStack && (
                    <p>
                      <strong>Component Stack:</strong>
                      <pre>{errorInfo.componentStack}</pre>
                    </p>
                  )}
                </ErrorDetailsContent>
              )}
            </ErrorDetails>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

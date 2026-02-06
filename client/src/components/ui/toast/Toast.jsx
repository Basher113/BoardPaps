import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import {
  ToastContainer,
  ToastWrapper,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastMessage,
  ToastCloseButton
} from './Toast.styles';

const Toast = ({ toast, onRemove }) => {
  const { id, type, title, message, duration = 5000 } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  return (
    <ToastWrapper
      $type={type}
      role="alert"
      aria-live="polite"
    >
      <ToastIcon $type={type}>
        {getIcon()}
      </ToastIcon>
      <ToastContent>
        <ToastTitle>{title}</ToastTitle>
        {message && <ToastMessage>{message}</ToastMessage>}
      </ToastContent>
      <ToastCloseButton
        onClick={() => onRemove(id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </ToastCloseButton>
    </ToastWrapper>
  );
};

const ToastList = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <ToastContainer role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </ToastContainer>
  );
};

export default ToastList;

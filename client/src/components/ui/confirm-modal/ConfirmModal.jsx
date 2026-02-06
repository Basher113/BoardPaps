import { AlertTriangle } from 'lucide-react';
import Modal from '../modal/Modal';
import {
  ConfirmContent,
  ConfirmIcon,
  ConfirmMessage,
  ConfirmActions,
  ConfirmButton,
  CancelButton
} from './ConfirmModal.styles';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <ConfirmContent>
        <ConfirmIcon $variant={variant}>
          <AlertTriangle size={24} />
        </ConfirmIcon>
        <ConfirmMessage>{message}</ConfirmMessage>
        <ConfirmActions>
          <CancelButton
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label={cancelText}
          >
            {cancelText}
          </CancelButton>
          <ConfirmButton
            type="button"
            onClick={handleConfirm}
            $variant={variant}
            disabled={isLoading}
            aria-label={confirmText}
          >
            {isLoading ? 'Processing...' : confirmText}
          </ConfirmButton>
        </ConfirmActions>
      </ConfirmContent>
    </Modal>
  );
};

export default ConfirmModal;

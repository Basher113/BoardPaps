import { useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import {
  ModalOverlay,
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent
} from './Modal.styles';

const Modal = ({ isOpen, onClose, title, children }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle escape key press
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Focus trap and accessibility
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Focus the modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Add event listener for escape key
      document.addEventListener('keydown', handleKeyDown);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;
  
  return (
    <ModalOverlay
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <ModalBackdrop onClick={onClose} aria-hidden="true" />
      <ModalContainer
        ref={modalRef}
        tabIndex={-1}
      >
        <ModalHeader>
          <ModalTitle id="modal-title">{title}</ModalTitle>
          <ModalCloseButton 
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            <X size={20} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

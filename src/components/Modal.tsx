import React, { useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = '500px' 
}) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  // Close when clicking on overlay (outside the modal)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return createPortal(
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer style={{ maxWidth }}>
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

// Confirmation modal component that extends the base Modal
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Cancel',
  type = 'info'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ModalMessage>{message}</ModalMessage>
      <ModalActions>
        <CancelButton onClick={onClose}>
          {cancelText}
        </CancelButton>
        <ConfirmButton $type={type} onClick={() => { onConfirm(); onClose(); }}>
          {confirmText}
        </ConfirmButton>
      </ModalActions>
    </Modal>
  );
};

// Alert modal component for simple notifications
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  type = 'info'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ModalMessage>{message}</ModalMessage>
      <ModalActions justifyContent="center">
        <ConfirmButton $type={type} onClick={onClose}>
          {buttonText}
        </ConfirmButton>
      </ModalActions>
    </Modal>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  padding: 1rem;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  width: 100%;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.primary};
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
`;

const ModalMessage = styled.p`
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const ModalActions = styled.div<{ justifyContent?: string }>`
  display: flex;
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-end'};
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`;

const CancelButton = styled(Button)`
  background: ${({ theme }) => theme.hover};
  color: ${({ theme }) => theme.text};
  
  &:hover {
    background: ${({ theme }) => theme.border};
  }
`;

const ConfirmButton = styled(Button)<{ $type: string }>`
  background: ${({ theme, $type }) => 
    $type === 'success' ? theme.success :
    $type === 'warning' ? theme.warning :
    $type === 'danger' ? theme.error :
    theme.primary
  };
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

export default Modal; 
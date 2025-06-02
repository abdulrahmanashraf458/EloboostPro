import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

interface Booster {
  id: string;
  name: string;
  avatar: string;
  email: string;
  completedOrders: number;
}

interface DeleteBoosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (boosterId: string) => void;
  booster: Booster | null;
}

const DeleteBoosterModal: React.FC<DeleteBoosterModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  booster
}) => {
  const [confirmText, setConfirmText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen || !booster) return null;
  
  const confirmationRequired = booster.completedOrders > 0;
  const confirmationText = `delete-${booster.name.toLowerCase()}`;
  const isConfirmed = !confirmationRequired || confirmText === confirmationText;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(e.target.value);
  };
  
  const handleDelete = async () => {
    if (!isConfirmed) return;
    
    setIsProcessing(true);
    
    // Simulating a delay for the delete operation
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onDelete(booster.id);
      onClose();
    } catch (error) {
      console.error('Error deleting booster:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Delete Booster</h2>
          <CloseButton onClick={onClose} disabled={isProcessing}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <IconContainer>
            <TrashIcon />
          </IconContainer>
          
          <DeleteTitle>
            Are you sure you want to delete this booster?
          </DeleteTitle>
          
          <BoosterInfo>
            <BoosterAvatar src={booster.avatar} alt={booster.name} />
            <BoosterDetails>
              <BoosterName>{booster.name}</BoosterName>
              <BoosterEmail>{booster.email}</BoosterEmail>
              <CompletedOrders>
                Completed Orders: <strong>{booster.completedOrders}</strong>
              </CompletedOrders>
            </BoosterDetails>
          </BoosterInfo>
          
          <WarningBox>
            <WarningIcon />
            <WarningMessage>
              <strong>This action cannot be undone.</strong> This will permanently delete the booster's account, 
              remove their access to the platform, and delete all their personal data.
              
              {booster.completedOrders > 0 && (
                <OrdersWarning>
                  This booster has {booster.completedOrders} completed orders. Historical order data will 
                  be preserved, but the booster will no longer be associated with these orders.
                </OrdersWarning>
              )}
            </WarningMessage>
          </WarningBox>
          
          {confirmationRequired && (
            <ConfirmationContainer>
              <ConfirmationLabel>
                Please type <ConfirmText>{confirmationText}</ConfirmText> to confirm:
              </ConfirmationLabel>
              <ConfirmationInput 
                type="text"
                value={confirmText}
                onChange={handleInputChange}
                placeholder={`Type ${confirmationText} to confirm`}
                autoFocus
              />
            </ConfirmationContainer>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button 
            type="button" 
            onClick={onClose} 
            $secondary
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleDelete} 
            $danger
            disabled={!isConfirmed || isProcessing}
            $loading={isProcessing}
          >
            {isProcessing ? 'Deleting...' : 'Delete Booster'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
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
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #e74c3c;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.25rem;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #e74c3c11;
  margin-bottom: 0.5rem;
`;

const TrashIcon = styled(FaTrash)`
  font-size: 2rem;
  color: #e74c3c;
`;

const DeleteTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
  font-weight: 500;
`;

const BoosterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.hover};
  border: 1px solid ${({ theme }) => theme.border};
`;

const BoosterAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.border};
`;

const BoosterDetails = styled.div`
  flex: 1;
`;

const BoosterName = styled.h4`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
`;

const BoosterEmail = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
`;

const CompletedOrders = styled.div`
  font-size: 0.9rem;
  
  strong {
    color: ${({ theme }) => theme.primary};
  }
`;

const WarningBox = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #e74c3c11;
  border-left: 3px solid #e74c3c;
`;

const WarningIcon = styled(FaExclamationTriangle)`
  font-size: 1.5rem;
  color: #e74c3c;
  flex-shrink: 0;
  margin-top: 0.25rem;
`;

const WarningMessage = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  
  strong {
    color: #e74c3c;
  }
`;

const OrdersWarning = styled.p`
  margin: 0.75rem 0 0 0;
  padding-top: 0.75rem;
  border-top: 1px solid #e74c3c33;
`;

const ConfirmationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ConfirmationLabel = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
`;

const ConfirmText = styled.span`
  font-family: monospace;
  background-color: ${({ theme }) => theme.hover};
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-weight: bold;
`;

const ConfirmationInput = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e74c3c;
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  width: 100%;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #e74c3c33;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Button = styled.button<{ 
  $primary?: boolean; 
  $secondary?: boolean; 
  $danger?: boolean;
  $loading?: boolean;
}>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s ease;
  position: relative;
  
  background-color: ${({ $primary, $secondary, $danger, theme }) => 
    $primary ? theme.primary : 
    $danger ? '#e74c3c' : 
    'transparent'};
  color: ${({ $primary, $secondary, $danger, theme }) => 
    $primary || $danger ? 'white' : 
    theme.text};
  border-color: ${({ $primary, $secondary, $danger, theme }) => 
    $primary ? theme.primary : 
    $danger ? '#e74c3c' : 
    theme.border};
  
  &:hover:not(:disabled) {
    background-color: ${({ $primary, $secondary, $danger, theme }) => 
      $primary ? `${theme.primary}dd` : 
      $danger ? '#c0392b' : 
      theme.hover};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0);
  }
  
  ${({ $loading }) => $loading && `
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 1.25rem;
      height: 1.25rem;
      margin-top: -0.625rem;
      margin-left: -0.625rem;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: white;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
`;

export default DeleteBoosterModal; 
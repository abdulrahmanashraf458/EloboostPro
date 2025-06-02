import React from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import CheckoutFlow from './CheckoutFlow';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails: {
    gameType: 'lol' | 'valorant' | 'wild-rift';
    boostType: 'solo' | 'duo';
    service?: string;
    price: number;
    discount?: number;
    estimatedTime?: string;
    selectedOptions?: Array<{name: string, price: string}>;
    currentRank?: any;
    desiredRank?: any;
    server?: string;
    options?: any;
  };
  onComplete: (orderId: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, 
  onClose, 
  orderDetails,
  onComplete
}) => {
  if (!isOpen) return null;
  
  const handleComplete = (orderId: string) => {
    onComplete(orderId);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent clicks inside the modal from closing it
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Secure Checkout</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <CheckoutFlow 
            orderDetails={orderDetails}
            onComplete={handleComplete}
            onCancel={onClose}
          />
        </ModalContent>
      </ModalContainer>
    </ModalBackdrop>
  );
};

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 2rem 1rem;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 650px;
  overflow: hidden;
  margin: auto;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 4rem);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}22, ${({ theme }) => theme.secondary}22);
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => `${theme.text}11`};
  }
`;

const ModalContent = styled.div`
  padding: 0;
  overflow-y: auto;
`;

export default CheckoutModal; 
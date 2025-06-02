import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface Client {
  id: string;
  name: string;
}

interface DeleteClientModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onConfirm: (clientId: string) => void;
}

const DeleteClientModal: React.FC<DeleteClientModalProps> = ({ isOpen, client, onClose, onConfirm }) => {
  if (!isOpen || !client) return null;
  
  const handleConfirm = () => {
    onConfirm(client.id);
    onClose();
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <WarningIcon>
            <FaExclamationTriangle />
          </WarningIcon>
          <ModalTitle>Delete Client</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <WarningMessage>
            Are you sure you want to delete client <ClientName>{client.name}</ClientName>?
          </WarningMessage>
          <WarningText>
            This action cannot be undone. All data associated with this client will be permanently removed from our servers.
          </WarningText>
        </ModalBody>
        
        <ModalFooter>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
          <DeleteButton onClick={handleConfirm}>Delete Client</DeleteButton>
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
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background.default};
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  position: relative;
`;

const WarningIcon = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.danger};
  margin-right: 1rem;
  display: flex;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
  color: ${props => props.theme.colors.danger};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const WarningMessage = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const ClientName = styled.span`
  font-weight: 600;
`;

const WarningText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.lighter};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
`;

const CancelButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.border.light};
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    background-color: ${props => props.theme.colors.background.hover};
    color: ${props => props.theme.colors.text.primary};
  }
`;

const DeleteButton = styled(Button)`
  background-color: ${props => props.theme.colors.danger};
  border: none;
  color: white;
  
  &:hover {
    background-color: ${props => props.theme.colors.dangerDark};
  }
`;

export default DeleteClientModal; 
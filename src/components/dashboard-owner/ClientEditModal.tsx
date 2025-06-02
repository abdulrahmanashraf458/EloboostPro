import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGamepad, FaSave } from 'react-icons/fa';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: Date;
  orders: number;
  totalSpent: number;
  lastActive: Date;
  status: 'active' | 'inactive' | 'banned';
  // Optional fields
  address?: string;
  ipAddress?: string;
  lastOrder?: Date;
  preferredGame?: string;
  notes?: string;
  paymentMethod?: string;
  preferredBooster?: string;
}

interface ClientEditModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const ClientEditModal: React.FC<ClientEditModalProps> = ({ isOpen, client, onClose, onSave }) => {
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (client) {
      setEditedClient({ ...client });
    }
  }, [client]);
  
  if (!isOpen || !client || !editedClient) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedClient(prev => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!editedClient?.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!editedClient?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editedClient.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!editedClient?.phone?.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate() && editedClient) {
      onSave(editedClient);
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit Client</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>Basic Information</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="name">
                  <FaUser /> Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={editedClient.name}
                  onChange={handleChange}
                  $error={!!errors.name}
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">
                  <FaEnvelope /> Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={editedClient.email}
                  onChange={handleChange}
                  $error={!!errors.email}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">
                  <FaPhone /> Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={editedClient.phone}
                  onChange={handleChange}
                  $error={!!errors.phone}
                />
                {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address">
                  <FaMapMarkerAlt /> Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={editedClient.address || ''}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormSection>
            
            <FormSection>
              <SectionTitle>Additional Details</SectionTitle>
              
              <FormGroup>
                <Label htmlFor="preferredGame">
                  <FaGamepad /> Preferred Game
                </Label>
                <Input
                  id="preferredGame"
                  name="preferredGame"
                  value={editedClient.preferredGame || ''}
                  onChange={handleChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  name="status"
                  value={editedClient.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="banned">Banned</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="notes">Notes</Label>
                <TextArea
                  id="notes"
                  name="notes"
                  value={editedClient.notes || ''}
                  onChange={handleChange}
                  rows={4}
                />
              </FormGroup>
              
              {editedClient.preferredBooster && (
                <FormGroup>
                  <Label htmlFor="preferredBooster">Preferred Booster</Label>
                  <Input
                    id="preferredBooster"
                    name="preferredBooster"
                    value={editedClient.preferredBooster}
                    onChange={handleChange}
                  />
                </FormGroup>
              )}
            </FormSection>
            
            <ButtonsContainer>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <SaveButton type="submit">
                <FaSave /> Save Changes
              </SaveButton>
            </ButtonsContainer>
          </Form>
        </ModalBody>
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
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
`;

const CloseButton = styled.button`
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
  overflow-y: auto;
  max-height: 70vh;
`;

const Form = styled.form``;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.secondary};
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const Input = styled.input<{ $error?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.$error ? props.theme.colors.danger : props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.lighter};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? props.theme.colors.danger : props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.lighter};
  font-size: 0.9rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.lighter};
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

const SaveButton = styled(Button)`
  background-color: ${props => props.theme.colors.primary};
  border: none;
  color: white;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

export default ClientEditModal; 
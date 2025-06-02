import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaCheck, FaUserPlus, FaUserEdit, FaTrash } from 'react-icons/fa';

interface Booster {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinDate: Date;
  status: 'online' | 'offline' | 'away' | 'banned';
  completedOrders: number;
  rating: number;
  specialization: string[];
  permissions: {
    canAccessChat: boolean;
    canModifyOrders: boolean;
    canAccessClientDetails: boolean;
    isAdmin: boolean;
  };
  username?: string;
  password?: string;
}

interface BoosterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booster: Booster) => void;
  booster?: Booster | null;
  isEditing: boolean;
}

const defaultBooster: Booster = {
  id: '',
  name: '',
  avatar: 'https://i.pravatar.cc/150?u=default',
  email: '',
  phone: '',
  joinDate: new Date(),
  status: 'offline',
  completedOrders: 0,
  rating: 0,
  specialization: [],
  username: '',
  password: '',
  permissions: {
    canAccessChat: true,
    canModifyOrders: false,
    canAccessClientDetails: false,
    isAdmin: false,
  }
};

const specializations = [
  'Solo Boost',
  'Duo Boost',
  'Placement Matches',
  'Coaching',
  'Wild Rift',
  'Valorant',
  'League of Legends'
];

const BoosterFormModal: React.FC<BoosterFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  booster = null,
  isEditing
}) => {
  const [formData, setFormData] = useState<Booster>(defaultBooster);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  useEffect(() => {
    if (booster) {
      setFormData(booster);
      setAvatarPreview(booster.avatar);
    } else {
      setFormData(defaultBooster);
      setAvatarPreview(defaultBooster.avatar);
    }
    
    setStep(1);
    setErrors({});
  }, [booster, isOpen]);
  
  if (!isOpen) return null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name.startsWith('permissions.')) {
        const permKey = name.split('.')[1];
        setFormData({
          ...formData,
          permissions: {
            ...formData.permissions,
            [permKey]: checked
          }
        });
      } else {
        setFormData({
          ...formData,
          [name]: checked
        });
      }
    } else if (name === 'specialization') {
      // Handle multi-select for specializations
      const select = e.target as HTMLSelectElement;
      const options = select.selectedOptions;
      const values = Array.from(options).map(option => option.value);
      
      setFormData({
        ...formData,
        specialization: values
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to a server
      // For this demo, we'll just use a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setFormData({
          ...formData,
          avatar: result
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const validateStep = (currentStep: number): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (currentStep === 1) {
      // Validate basic info
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      }
      
      if (!isEditing) {
        if (!formData.username?.trim()) {
          newErrors.username = 'Username is required';
        }
        
        if (!formData.password?.trim()) {
          newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters';
        }
      }
    } else if (currentStep === 2) {
      // Validate specializations
      if (formData.specialization.length === 0) {
        newErrors.specialization = 'At least one specialization is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step === 1 ? 2 : 3);
    }
  };
  
  const handleBack = () => {
    setStep(step === 3 ? 2 : 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(step)) {
      // Generate a random ID if this is a new booster
      const finalBooster: Booster = {
        ...formData,
        id: formData.id || `booster_${Date.now()}`
      };
      
      onSave(finalBooster);
      onClose();
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>{isEditing ? 'Edit Booster' : 'Add New Booster'}</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <StepIndicator>
          <Step $active={step === 1} $completed={step > 1}>1. Basic Information</Step>
          <Step $active={step === 2} $completed={step > 2}>2. Specializations</Step>
          <Step $active={step === 3}>3. Permissions</Step>
        </StepIndicator>
        
        <ModalBody>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <FormSection>
                <FormGroup>
                  <FormLabel>Avatar</FormLabel>
                  <AvatarContainer>
                    <Avatar src={avatarPreview} alt="Booster avatar" />
                    <AvatarUpload>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleAvatarChange} 
                        style={{ display: 'none' }}
                        id="avatar-upload"
                      />
                      <UploadButton type="button" onClick={() => document.getElementById('avatar-upload')?.click()}>
                        Change Avatar
                      </UploadButton>
                    </AvatarUpload>
                  </AvatarContainer>
                </FormGroup>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Name</FormLabel>
                    <FormInput 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      $hasError={!!errors.name}
                    />
                    {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Email</FormLabel>
                    <FormInput 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      $hasError={!!errors.email}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Phone Number</FormLabel>
                    <FormInput 
                      type="text" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      $hasError={!!errors.phone}
                    />
                    {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                  </FormGroup>
                </FormRow>
                
                {!isEditing && (
                  <>
                    <FormRow>
                      <FormGroup>
                        <FormLabel>Username</FormLabel>
                        <FormInput 
                          type="text" 
                          name="username" 
                          value={formData.username} 
                          onChange={handleChange}
                          $hasError={!!errors.username}
                        />
                        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
                      </FormGroup>
                      
                      <FormGroup>
                        <FormLabel>Password</FormLabel>
                        <FormInput 
                          type="password" 
                          name="password" 
                          value={formData.password} 
                          onChange={handleChange}
                          $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                      </FormGroup>
                    </FormRow>
                    
                    <FormNote>
                      A welcome email will be sent to the booster with login instructions.
                    </FormNote>
                  </>
                )}
                
                <FormRow>
                  <FormGroup>
                    <FormLabel>Status</FormLabel>
                    <FormSelect 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange}
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="away">Away</option>
                      <option value="banned">Banned</option>
                    </FormSelect>
                  </FormGroup>
                </FormRow>
              </FormSection>
            )}
            
            {step === 2 && (
              <FormSection>
                <FormGroup>
                  <FormLabel>Specializations</FormLabel>
                  <FormSelect 
                    name="specialization" 
                    value={formData.specialization} 
                    onChange={handleChange}
                    multiple
                    size={7}
                    $hasError={!!errors.specialization}
                  >
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </FormSelect>
                  <FormNote>
                    Hold Ctrl (or Cmd on Mac) to select multiple specializations.
                  </FormNote>
                  {errors.specialization && <ErrorMessage>{errors.specialization}</ErrorMessage>}
                </FormGroup>
                
                {isEditing && (
                  <FormGroup>
                    <FormLabel>Current Statistics</FormLabel>
                    <StatsContainer>
                      <StatItem>
                        <StatLabel>Completed Orders:</StatLabel>
                        <StatValue>{formData.completedOrders}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Rating:</StatLabel>
                        <StatValue>{formData.rating.toFixed(1)}</StatValue>
                      </StatItem>
                      <StatItem>
                        <StatLabel>Join Date:</StatLabel>
                        <StatValue>
                          {new Date(formData.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </StatValue>
                      </StatItem>
                    </StatsContainer>
                  </FormGroup>
                )}
              </FormSection>
            )}
            
            {step === 3 && (
              <FormSection>
                <FormGroup>
                  <FormLabel>Permissions</FormLabel>
                  <PermissionsGrid>
                    <PermissionItem>
                      <PermissionCheckbox
                        type="checkbox"
                        name="permissions.canAccessChat"
                        checked={formData.permissions.canAccessChat}
                        onChange={handleChange}
                        id="perm-chat"
                      />
                      <PermissionLabel htmlFor="perm-chat">
                        <strong>Chat Access</strong>
                        <span>Booster can use the chat system with clients</span>
                      </PermissionLabel>
                    </PermissionItem>
                    
                    <PermissionItem>
                      <PermissionCheckbox
                        type="checkbox"
                        name="permissions.canModifyOrders"
                        checked={formData.permissions.canModifyOrders}
                        onChange={handleChange}
                        id="perm-orders"
                      />
                      <PermissionLabel htmlFor="perm-orders">
                        <strong>Order Modification</strong>
                        <span>Booster can update order status and details</span>
                      </PermissionLabel>
                    </PermissionItem>
                    
                    <PermissionItem>
                      <PermissionCheckbox
                        type="checkbox"
                        name="permissions.canAccessClientDetails"
                        checked={formData.permissions.canAccessClientDetails}
                        onChange={handleChange}
                        id="perm-client"
                      />
                      <PermissionLabel htmlFor="perm-client">
                        <strong>Client Details Access</strong>
                        <span>Booster can see detailed client information</span>
                      </PermissionLabel>
                    </PermissionItem>
                    
                    <PermissionItem>
                      <PermissionCheckbox
                        type="checkbox"
                        name="permissions.isAdmin"
                        checked={formData.permissions.isAdmin}
                        onChange={handleChange}
                        id="perm-admin"
                      />
                      <PermissionLabel htmlFor="perm-admin">
                        <strong>Admin Privileges</strong>
                        <span>Booster has all permissions and can manage other boosters</span>
                      </PermissionLabel>
                    </PermissionItem>
                  </PermissionsGrid>
                </FormGroup>
                
                <FormNote $warning={isEditing}>
                  {isEditing 
                    ? 'Warning: Changing permissions will take effect immediately.'
                    : 'New boosters will receive an email with login instructions.'}
                </FormNote>
              </FormSection>
            )}
          </form>
        </ModalBody>
        
        <ModalFooter>
          {step > 1 && (
            <Button type="button" onClick={handleBack} $secondary>
              Back
            </Button>
          )}
          
          <ButtonGroup>
            <Button type="button" onClick={onClose} $secondary>
              Cancel
            </Button>
            
            {step < 3 ? (
              <Button type="button" onClick={handleNext} $primary>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} $primary>
                {isEditing ? 'Save Changes' : 'Add Booster'}
              </Button>
            )}
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled components
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
  max-width: 800px;
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
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.cardBg};
  z-index: 10;
  
  h2 {
    margin: 0;
    font-size: 1.25rem;
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
`;

const StepIndicator = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  position: sticky;
  top: 57px; /* height of modal header */
  z-index: 5;
`;

const Step = styled.div<{ $active: boolean, $completed?: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active, $completed, theme }) => 
    $active ? theme.primary : 
    $completed ? theme.primary + '66' : 
    'transparent'};
  color: ${({ $active, $completed, theme }) => 
    $active ? theme.primary : 
    $completed ? theme.primary + 'cc' : 
    theme.text};
  font-weight: ${({ $active, $completed }) => 
    $active ? '600' : 
    $completed ? '500' : 
    '400'};
  flex: 1;
  text-align: center;
  transition: all 0.2s ease;
  
  @media (max-width: 576px) {
    font-size: 0.8rem;
    padding: 0.75rem 0.5rem;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const FormLabel = styled.label`
  font-weight: 500;
  font-size: 0.95rem;
`;

const FormInput = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ $hasError, theme }) => 
    $hasError ? '#e74c3c' : theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => 
      $hasError ? '#e74c3c' : theme.primary};
  }
`;

const FormSelect = styled.select<{ $hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ $hasError, theme }) => 
    $hasError ? '#e74c3c' : theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ $hasError, theme }) => 
      $hasError ? '#e74c3c' : theme.primary};
  }
  
  &[multiple] {
    min-height: 160px;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const FormNote = styled.div<{ $warning?: boolean }>`
  font-size: 0.9rem;
  color: ${({ $warning, theme }) => $warning ? '#e74c3c' : theme.text + 'aa'};
  font-style: italic;
  margin-top: ${({ $warning }) => $warning ? '0.75rem' : '0'};
  
  ${({ $warning }) => $warning && `
    background-color: #e74c3c11;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border-left: 3px solid #e74c3c;
  `}
`;

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.border};
`;

const AvatarUpload = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UploadButton = styled.button`
  background-color: ${({ theme }) => theme.hover};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text};
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary}22;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const PermissionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const PermissionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.hover};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary}11;
    border-color: ${({ theme }) => theme.primary}33;
  }
`;

const PermissionCheckbox = styled.input`
  margin-top: 0.25rem;
  transform: scale(1.2);
  accent-color: ${({ theme }) => theme.primary};
`;

const PermissionLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  cursor: pointer;
  
  strong {
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  span {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.text}aa;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: ${({ theme }) => theme.hover};
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.95rem;
`;

const StatLabel = styled.span`
  font-weight: 500;
`;

const StatValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  position: sticky;
  bottom: 0;
  z-index: 10;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean; $secondary?: boolean; $danger?: boolean; }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s ease;
  
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
  
  &:hover {
    background-color: ${({ $primary, $secondary, $danger, theme }) => 
      $primary ? `${theme.primary}dd` : 
      $danger ? '#c0392b' : 
      theme.hover};
    transform: translateY(-2px);
  }
`;

export default BoosterFormModal; 
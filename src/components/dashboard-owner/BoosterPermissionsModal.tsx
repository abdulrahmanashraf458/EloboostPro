import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaCheck, FaInfo, FaLock, FaLockOpen, FaShieldAlt } from 'react-icons/fa';

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
}

interface BoosterPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (boosterId: string, permissions: Booster['permissions']) => void;
  booster: Booster;
}

interface Permission {
  key: keyof Booster['permissions'];
  label: string;
  description: string;
  icon: React.ReactNode;
  warning?: string;
}

const permissionsList: Permission[] = [
  {
    key: 'canAccessChat',
    label: 'Chat Access',
    description: 'Booster can communicate with clients through the chat system.',
    icon: <FaInfo />
  },
  {
    key: 'canModifyOrders',
    label: 'Order Modification',
    description: 'Booster can update order status, add notes, and modify order details.',
    icon: <FaLockOpen />
  },
  {
    key: 'canAccessClientDetails',
    label: 'Client Details Access',
    description: 'Booster can view sensitive client information such as email, payment details, etc.',
    icon: <FaLock />,
    warning: 'This gives access to sensitive client data. Only grant to trusted boosters.'
  },
  {
    key: 'isAdmin',
    label: 'Admin Privileges',
    description: 'Full administrative access including managing other boosters and system settings.',
    icon: <FaShieldAlt />,
    warning: 'This is the highest level of access. Use with extreme caution.'
  }
];

const BoosterPermissionsModal: React.FC<BoosterPermissionsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  booster 
}) => {
  const [permissions, setPermissions] = useState<Booster['permissions']>({
    canAccessChat: false,
    canModifyOrders: false,
    canAccessClientDetails: false,
    isAdmin: false
  });
  
  const [isChanged, setIsChanged] = useState(false);
  
  useEffect(() => {
    if (booster && booster.permissions) {
      setPermissions({...booster.permissions});
      setIsChanged(false);
    }
  }, [booster, isOpen]);
  
  if (!isOpen) return null;
  
  const handleTogglePermission = (key: keyof Booster['permissions']) => {
    const newPermissions = {...permissions};
    
    // If turning on admin, also turn on all other permissions
    if (key === 'isAdmin' && !permissions.isAdmin) {
      newPermissions.isAdmin = true;
      newPermissions.canAccessChat = true;
      newPermissions.canModifyOrders = true;
      newPermissions.canAccessClientDetails = true;
    } 
    // If turning off a permission that admin requires, also turn off admin
    else if (key !== 'isAdmin' && permissions.isAdmin && permissions[key]) {
      newPermissions.isAdmin = false;
      newPermissions[key] = false;
    }
    // Normal toggle
    else {
      newPermissions[key] = !permissions[key];
    }
    
    setPermissions(newPermissions);
    setIsChanged(JSON.stringify(newPermissions) !== JSON.stringify(booster.permissions));
  };
  
  const handleSave = () => {
    onSave(booster.id, permissions);
    onClose();
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Manage Permissions</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <BoosterInfo>
            <BoosterAvatar src={booster.avatar} alt={booster.name} />
            <div>
              <BoosterName>{booster.name}</BoosterName>
              <BoosterEmail>{booster.email}</BoosterEmail>
              <StatusBadge $status={booster.status}>
                {booster.status.charAt(0).toUpperCase() + booster.status.slice(1)}
              </StatusBadge>
            </div>
          </BoosterInfo>
          
          <PermissionsTitle>Permission Settings</PermissionsTitle>
          
          <PermissionsList>
            {permissionsList.map((permission) => (
              <PermissionItem key={permission.key} $isActive={permissions[permission.key]}>
                <PermissionHeader>
                  <IconContainer $isActive={permissions[permission.key]}>
                    {permission.icon}
                  </IconContainer>
                  
                  <PermissionInfo>
                    <PermissionLabel>{permission.label}</PermissionLabel>
                    <PermissionDescription>{permission.description}</PermissionDescription>
                  </PermissionInfo>
                  
                  <ToggleSwitch 
                    $isActive={permissions[permission.key]}
                    onClick={() => handleTogglePermission(permission.key)}
                  >
                    <ToggleSlider $isActive={permissions[permission.key]} />
                  </ToggleSwitch>
                </PermissionHeader>
                
                {permission.warning && permissions[permission.key] && (
                  <WarningMessage>
                    {permission.warning}
                  </WarningMessage>
                )}
              </PermissionItem>
            ))}
          </PermissionsList>
          
          <SecurityNote>
            Permission changes are logged for security purposes and take effect immediately.
          </SecurityNote>
        </ModalBody>
        
        <ModalFooter>
          <Button type="button" onClick={onClose} $secondary>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave} 
            $primary 
            disabled={!isChanged}
          >
            Save Changes
          </Button>
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
  max-width: 600px;
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

const ModalBody = styled.div`
  padding: 24px;
`;

const BoosterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;
`;

const BoosterAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.border};
`;

const BoosterName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
`;

const BoosterEmail = styled.p`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${({ $status }) => 
    $status === 'online' ? '#27ae60' :
    $status === 'away' ? '#f39c12' :
    $status === 'banned' ? '#e74c3c' :
    '#95a5a6'}33;
  
  color: ${({ $status }) => 
    $status === 'online' ? '#27ae60' :
    $status === 'away' ? '#f39c12' :
    $status === 'banned' ? '#e74c3c' :
    '#95a5a6'};
`;

const PermissionsTitle = styled.h4`
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 500;
`;

const PermissionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PermissionItem = styled.div<{ $isActive: boolean }>`
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme.primary + '44' : theme.border};
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: ${({ $isActive, theme }) => 
    $isActive ? theme.primary + '0a' : theme.hover};
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ $isActive, theme }) => 
      $isActive ? theme.primary + '66' : theme.border + 'cc'};
  }
`;

const PermissionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
`;

const IconContainer = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $isActive, theme }) => 
    $isActive ? theme.primary + '22' : theme.hover};
  color: ${({ $isActive, theme }) => 
    $isActive ? theme.primary : theme.text + '99'};
  font-size: 1.1rem;
`;

const PermissionInfo = styled.div`
  flex: 1;
`;

const PermissionLabel = styled.h5`
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 500;
`;

const PermissionDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
`;

const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  width: 48px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ $isActive, theme }) => 
    $isActive ? theme.primary : theme.border};
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ToggleSlider = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $isActive }) => $isActive ? '26px' : '2px'};
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: white;
  transition: all 0.2s ease;
`;

const WarningMessage = styled.div`
  padding: 0.75rem 1rem;
  margin: 0 1rem 1rem 1rem;
  background-color: #e74c3c11;
  border-left: 3px solid #e74c3c;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  color: #e74c3c;
`;

const SecurityNote = styled.p`
  margin: 1.5rem 0 0 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}88;
  font-style: italic;
  text-align: center;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  position: sticky;
  bottom: 0;
  z-index: 10;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(0);
  }
`;

export default BoosterPermissionsModal; 
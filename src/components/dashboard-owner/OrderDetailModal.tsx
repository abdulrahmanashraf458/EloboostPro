import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaEdit, FaTrash, FaComment, FaClock, FaCheck, FaBan, FaPlay, FaPause, FaHistory } from 'react-icons/fa';
import OrderActivityLog from './OrderActivityLog';

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
  onDelete: (orderId: string) => void;
  onNavigateToChat: (orderId: string) => void;
}

interface Order {
  id: string;
  orderId: string;
  client: {
    id: string;
    name: string;
    avatar: string;
  };
  booster: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  service: string;
  currentRank: {
    tier: string;
    division: number;
  };
  desiredRank: {
    tier: string;
    division: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
  progress: number;
  estimatedTime: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  chatActivity: boolean;
  description?: string;
  clientNotes?: string;
  requirements?: string[];
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ 
  order, 
  isOpen, 
  onClose, 
  onStatusChange, 
  onDelete,
  onNavigateToChat
}) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details');
  
  useEffect(() => {
    if (order) {
      setCurrentProgress(order.progress);
    }
  }, [order]);
  
  if (!isOpen || !order) return null;
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentProgress(parseInt(e.target.value, 10));
  };
  
  const handleUpdateProgress = () => {
    // In a real app, this would update the progress in your database
    console.log(`Updated progress for order ${order.id} to ${currentProgress}%`);
    setIsEditing(false);
  };
  
  const handleStatusChange = (newStatus: string) => {
    onStatusChange(order.id, newStatus);
  };
  
  const handleDeleteOrder = () => {
    if (confirmDelete) {
      onDelete(order.id);
      setConfirmDelete(false);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'iron':
        return '#74777a';
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      case 'platinum':
        return '#00ffbf';
      case 'diamond':
        return '#b9f2ff';
      case 'master':
        return '#ff00ff';
      case 'grandmaster':
        return '#ff0000';
      case 'challenger':
        return '#ffb700';
      default:
        return '#95a5a6';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return '#f39c12'; // amber
      case 'in_progress':
        return '#3498db'; // blue
      case 'completed':
        return '#2ecc71'; // green
      case 'cancelled':
        return '#e74c3c'; // red
      case 'paused':
        return '#9b59b6'; // purple
      default:
        return '#95a5a6'; // gray
    }
  };
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Order Details: {order.orderId}</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalTabs>
          <ModalTab 
            $active={activeTab === 'details'} 
            onClick={() => setActiveTab('details')}
          >
            Order Details
          </ModalTab>
          <ModalTab 
            $active={activeTab === 'activity'} 
            onClick={() => setActiveTab('activity')}
          >
            <FaHistory /> Activity Log
          </ModalTab>
        </ModalTabs>
        
        {activeTab === 'details' ? (
          <ModalBody>
            <OrderInfoSection>
              <h3>Order Information</h3>
              <OrderInfoGrid>
                <InfoItem>
                  <InfoLabel>Service:</InfoLabel>
                  <InfoValue>{order.service}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Client:</InfoLabel>
                  <InfoValue>
                    <UserInfo>
                      <UserAvatar>
                        <img src={order.client.avatar} alt={order.client.name} />
                      </UserAvatar>
                      <span>{order.client.name}</span>
                    </UserInfo>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Booster:</InfoLabel>
                  <InfoValue>
                    <UserInfo>
                      <UserAvatar $status={order.booster.status}>
                        <img src={order.booster.avatar} alt={order.booster.name} />
                      </UserAvatar>
                      <span>{order.booster.name}</span>
                    </UserInfo>
                  </InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Created:</InfoLabel>
                  <InfoValue>{formatDate(order.createdAt)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Last Updated:</InfoLabel>
                  <InfoValue>{formatDate(order.updatedAt)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Price:</InfoLabel>
                  <InfoValue>${order.price.toFixed(2)}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Est. Completion:</InfoLabel>
                  <InfoValue>{order.estimatedTime}</InfoValue>
                </InfoItem>
                <InfoItem $fullWidth>
                  <InfoLabel>Status:</InfoLabel>
                  <InfoValue>
                    <StatusBadge $color={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </StatusBadge>
                  </InfoValue>
                </InfoItem>
              </OrderInfoGrid>
            </OrderInfoSection>
            
            <RankSection>
              <h3>Rank Progress</h3>
              <RankInfo>
                <RankBadge $color={getTierColor(order.currentRank.tier)}>
                  {order.currentRank.tier.charAt(0).toUpperCase() + order.currentRank.tier.slice(1)} {order.currentRank.division > 0 ? order.currentRank.division : ''}
                </RankBadge>
                <RankArrow>→</RankArrow>
                <RankBadge $color={getTierColor(order.desiredRank.tier)}>
                  {order.desiredRank.tier.charAt(0).toUpperCase() + order.desiredRank.tier.slice(1)} {order.desiredRank.division > 0 ? order.desiredRank.division : ''}
                </RankBadge>
              </RankInfo>
              
              <ProgressContainer>
                <ProgressBar>
                  <ProgressFill $progress={currentProgress} $color={getStatusColor(order.status)} />
                </ProgressBar>
                <ProgressInfo>
                  <ProgressPercentage>{currentProgress}% Complete</ProgressPercentage>
                  {isEditing ? (
                    <ProgressEditContainer>
                      <ProgressInput 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={currentProgress} 
                        onChange={handleProgressChange} 
                      />
                      <ProgressValueDisplay>{currentProgress}%</ProgressValueDisplay>
                      <ButtonGroup>
                        <Button $primary onClick={handleUpdateProgress}>Update</Button>
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                      </ButtonGroup>
                    </ProgressEditContainer>
                  ) : (
                    <EditButton onClick={() => setIsEditing(true)}>
                      <FaEdit /> Edit Progress
                    </EditButton>
                  )}
                </ProgressInfo>
              </ProgressContainer>
            </RankSection>
            
            {(order.description || order.clientNotes || order.requirements) && (
              <DetailSection>
                <h3>Additional Details</h3>
                {order.description && (
                  <DetailItem>
                    <DetailLabel>Description:</DetailLabel>
                    <DetailContent>{order.description}</DetailContent>
                  </DetailItem>
                )}
                {order.clientNotes && (
                  <DetailItem>
                    <DetailLabel>Client Notes:</DetailLabel>
                    <DetailContent>{order.clientNotes}</DetailContent>
                  </DetailItem>
                )}
                {order.requirements && (
                  <DetailItem>
                    <DetailLabel>Requirements:</DetailLabel>
                    <RequirementsList>
                      {order.requirements.map((req, index) => (
                        <RequirementItem key={index}>{req}</RequirementItem>
                      ))}
                    </RequirementsList>
                  </DetailItem>
                )}
              </DetailSection>
            )}
            
            <ActionSection>
              <h3>Order Actions</h3>
              <StatusActions>
                {order.status === 'pending' && (
                  <ActionButton $color="#3498db" onClick={() => handleStatusChange('in_progress')}>
                    <FaPlay /> Start Order
                  </ActionButton>
                )}
                
                {order.status === 'in_progress' && (
                  <ActionButton $color="#9b59b6" onClick={() => handleStatusChange('paused')}>
                    <FaPause /> Pause Order
                  </ActionButton>
                )}
                
                {order.status === 'paused' && (
                  <ActionButton $color="#3498db" onClick={() => handleStatusChange('in_progress')}>
                    <FaPlay /> Resume Order
                  </ActionButton>
                )}
                
                {['pending', 'in_progress', 'paused'].includes(order.status) && (
                  <ActionButton $color="#2ecc71" onClick={() => handleStatusChange('completed')}>
                    <FaCheck /> Mark Completed
                  </ActionButton>
                )}
                
                {['pending', 'in_progress', 'paused'].includes(order.status) && (
                  <ActionButton $color="#e74c3c" onClick={() => handleStatusChange('cancelled')}>
                    <FaBan /> Cancel Order
                  </ActionButton>
                )}
                
                <ActionButton $highlight onClick={() => onNavigateToChat(order.id)}>
                  <FaComment /> {order.chatActivity ? 'View New Messages' : 'Open Chat'}
                </ActionButton>
                
                {confirmDelete ? (
                  <DeleteConfirmation>
                    <p>Are you sure? This cannot be undone.</p>
                    <ButtonGroup>
                      <Button $danger onClick={handleDeleteOrder}>Yes, Delete</Button>
                      <Button onClick={handleCancelDelete}>Cancel</Button>
                    </ButtonGroup>
                  </DeleteConfirmation>
                ) : (
                  <ActionButton $danger onClick={handleDeleteOrder}>
                    <FaTrash /> Delete Order
                  </ActionButton>
                )}
              </StatusActions>
            </ActionSection>
          </ModalBody>
        ) : (
          <ModalBody>
            <OrderActivityLog orderId={order.id} height="600px" />
          </ModalBody>
        )}
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
  max-width: 900px;
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

const ModalTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  position: sticky;
  top: 57px; /* height of modal header */
  z-index: 5;
`;

const ModalTab = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ $active, theme }) => 
    $active ? theme.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? theme.primary : theme.text};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.primary};
  }
  
  svg {
    font-size: 0.875rem;
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
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const OrderInfoSection = styled.section`
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.125rem;
  }
`;

const OrderInfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  grid-column: ${({ $fullWidth }) => $fullWidth ? '1 / -1' : 'auto'};
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 4px;
`;

const InfoValue = styled.span`
  font-size: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserAvatar = styled.div<{ $status?: string }>`
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  ${({ $status }) => $status && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background-color: ${
        $status === 'online' ? '#2ecc71' :
        $status === 'away' ? '#f39c12' : '#95a5a6'
      };
      border: 2px solid white;
    }
  `}
`;

const RankSection = styled.section`
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.125rem;
  }
`;

const RankInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const RankArrow = styled.span`
  color: ${({ theme }) => theme.text}aa;
  font-size: 1.25rem;
`;

const RankBadge = styled.div<{ $color: string }>`
  background-color: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid ${({ $color }) => $color}44;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: ${({ theme }) => theme.body};
  border-radius: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number, $color: string }>`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  background-color: ${({ $color }) => $color};
  border-radius: 1rem;
  transition: width 0.3s ease;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressPercentage = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text}aa;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.primary}11;
  }
`;

const ProgressEditContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

const ProgressInput = styled.input`
  width: 100%;
  margin: 0;
  
  &::-webkit-slider-thumb {
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    cursor: pointer;
  }
`;

const ProgressValueDisplay = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

const Button = styled.button<{ $primary?: boolean; $danger?: boolean }>`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
  background-color: ${({ $primary, $danger, theme }) => 
    $primary ? theme.primary : 
    $danger ? '#e74c3c' : 
    'transparent'};
  color: ${({ $primary, $danger, theme }) => 
    $primary || $danger ? 'white' : 
    theme.text};
  border-color: ${({ $primary, $danger, theme }) => 
    $primary ? theme.primary : 
    $danger ? '#e74c3c' : 
    theme.border};
    
  &:hover {
    background-color: ${({ $primary, $danger, theme }) => 
      $primary ? `${theme.primary}dd` : 
      $danger ? '#c0392b' : 
      theme.hover};
  }
`;

const DetailSection = styled.section`
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.125rem;
  }
`;

const DetailItem = styled.div`
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 4px;
`;

const DetailContent = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.hover};
  padding: 12px;
  border-radius: 4px;
  white-space: pre-wrap;
`;

const RequirementsList = styled.ul`
  margin: 0;
  padding: 0 0 0 20px;
`;

const RequirementItem = styled.li`
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ActionSection = styled.section`
  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 1.125rem;
  }
`;

const StatusActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button<{ $color?: string; $highlight?: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  font-weight: 500;
  
  background-color: ${({ $color, $highlight, $danger, theme }) => 
    $color ? `${$color}22` : 
    $highlight ? `${theme.primary}22` : 
    $danger ? '#e74c3c22' : 
    theme.hover};
  color: ${({ $color, $highlight, $danger, theme }) => 
    $color ? $color : 
    $highlight ? theme.primary : 
    $danger ? '#e74c3c' : 
    theme.text};
  
  &:hover {
    background-color: ${({ $color, $highlight, $danger, theme }) => 
      $color ? `${$color}33` : 
      $highlight ? `${theme.primary}33` : 
      $danger ? '#e74c3c33' : 
      `${theme.hover}cc`};
    transform: translateY(-2px);
  }
  
  transition: all 0.2s ease;
`;

const DeleteConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #e74c3c11;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e74c3c33;
  
  p {
    margin: 0;
    color: #e74c3c;
    font-weight: 500;
  }
`;

const StatusBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-transform: capitalize;
`;

export default OrderDetailModal; 
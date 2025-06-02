import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaTimes, FaCalendarAlt, FaCheckCircle, FaClock, FaBan, FaExclamationCircle,
  FaUserEdit, FaShieldAlt, FaKey, FaSignInAlt, FaSignOutAlt, FaSort
} from 'react-icons/fa';

interface Booster {
  id: string;
  name: string;
  avatar: string;
  email: string;
  status: string;
}

interface BoosterActivity {
  id: string;
  boosterId: string;
  type: 'login' | 'logout' | 'permission_change' | 'order_accepted' | 'order_completed' | 'order_declined' | 'status_change' | 'failed_login';
  timestamp: Date;
  details: string;
  ipAddress?: string;
  device?: string;
  location?: string;
}

interface BoosterActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  booster: Booster | null;
}

// Mock activity data generator
const generateMockActivityData = (boosterId: string): BoosterActivity[] => {
  const now = new Date();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  const activities: BoosterActivity[] = [
    {
      id: `act_${Date.now()}_1`,
      boosterId,
      type: 'login',
      timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
      details: 'Logged in successfully',
      ipAddress: '192.168.1.1',
      device: 'Chrome on Windows',
      location: 'New York, USA'
    },
    {
      id: `act_${Date.now()}_2`,
      boosterId,
      type: 'order_accepted',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      details: 'Accepted order #ORD-12345'
    },
    {
      id: `act_${Date.now()}_3`,
      boosterId,
      type: 'order_completed',
      timestamp: new Date(now.getTime() - 1 * dayInMs), // 1 day ago
      details: 'Completed order #ORD-98765'
    },
    {
      id: `act_${Date.now()}_4`,
      boosterId,
      type: 'status_change',
      timestamp: new Date(now.getTime() - 2 * dayInMs), // 2 days ago
      details: 'Status changed from offline to online'
    },
    {
      id: `act_${Date.now()}_5`,
      boosterId,
      type: 'permission_change',
      timestamp: new Date(now.getTime() - 5 * dayInMs), // 5 days ago
      details: 'Permissions updated: Given access to client details'
    },
    {
      id: `act_${Date.now()}_6`,
      boosterId,
      type: 'login',
      timestamp: new Date(now.getTime() - 6 * dayInMs), // 6 days ago
      details: 'Logged in successfully',
      ipAddress: '192.168.1.5',
      device: 'Firefox on MacOS',
      location: 'Los Angeles, USA'
    },
    {
      id: `act_${Date.now()}_7`,
      boosterId,
      type: 'logout',
      timestamp: new Date(now.getTime() - 6 * dayInMs + 3 * 60 * 60 * 1000), // 6 days ago + 3 hours
      details: 'Logged out',
      ipAddress: '192.168.1.5',
      device: 'Firefox on MacOS'
    },
    {
      id: `act_${Date.now()}_8`,
      boosterId,
      type: 'order_declined',
      timestamp: new Date(now.getTime() - 7 * dayInMs), // 7 days ago
      details: 'Declined order #ORD-54321'
    },
    {
      id: `act_${Date.now()}_9`,
      boosterId,
      type: 'failed_login',
      timestamp: new Date(now.getTime() - 10 * dayInMs), // 10 days ago
      details: 'Failed login attempt',
      ipAddress: '203.0.113.1',
      device: 'Unknown device',
      location: 'Unknown location'
    }
  ];
  
  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const BoosterActivityModal: React.FC<BoosterActivityModalProps> = ({
  isOpen,
  onClose,
  booster
}) => {
  const [activities, setActivities] = useState<BoosterActivity[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    if (isOpen && booster) {
      setLoading(true);
      
      // Simulate API fetch with a timeout
      setTimeout(() => {
        const mockData = generateMockActivityData(booster.id);
        setActivities(mockData);
        setLoading(false);
      }, 800);
    }
  }, [isOpen, booster]);
  
  if (!isOpen || !booster) return null;
  
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };
  
  const getActivityIcon = (type: BoosterActivity['type']) => {
    switch (type) {
      case 'login':
        return <ActivityIcon as={FaSignInAlt} $type={type} />;
      case 'logout':
        return <ActivityIcon as={FaSignOutAlt} $type={type} />;
      case 'permission_change':
        return <ActivityIcon as={FaKey} $type={type} />;
      case 'order_accepted':
        return <ActivityIcon as={FaCheckCircle} $type={type} />;
      case 'order_completed':
        return <ActivityIcon as={FaCheckCircle} $type={type} />;
      case 'order_declined':
        return <ActivityIcon as={FaBan} $type={type} />;
      case 'status_change':
        return <ActivityIcon as={FaClock} $type={type} />;
      case 'failed_login':
        return <ActivityIcon as={FaExclamationCircle} $type={type} />;
      default:
        return <ActivityIcon as={FaCalendarAlt} $type={type} />;
    }
  };
  
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>Activity Log</h2>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
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
        
        <FilterBar>
          <FilterLabel>
            <FaSort /> Filter by:
          </FilterLabel>
          <FilterButton 
            $active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            All
          </FilterButton>
          <FilterButton 
            $active={filter === 'login' || filter === 'logout' || filter === 'failed_login'} 
            onClick={() => setFilter('login')}
          >
            Authentication
          </FilterButton>
          <FilterButton 
            $active={filter === 'order_accepted' || filter === 'order_completed' || filter === 'order_declined'} 
            onClick={() => setFilter('order_accepted')}
          >
            Orders
          </FilterButton>
          <FilterButton 
            $active={filter === 'permission_change'} 
            onClick={() => setFilter('permission_change')}
          >
            Permissions
          </FilterButton>
          <FilterButton 
            $active={filter === 'status_change'} 
            onClick={() => setFilter('status_change')}
          >
            Status
          </FilterButton>
        </FilterBar>
        
        <ModalBody>
          {loading ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Loading activity data...</LoadingText>
            </LoadingContainer>
          ) : filteredActivities.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon as={FaCalendarAlt} />
              <EmptyStateText>No activity records found</EmptyStateText>
              <EmptyStateSubtext>
                Try changing the filter or check back later
              </EmptyStateSubtext>
            </EmptyState>
          ) : (
            <Timeline>
              {filteredActivities.map((activity, index) => (
                <ActivityItem key={activity.id}>
                  <TimelineConnector $isFirst={index === 0} $isLast={index === filteredActivities.length - 1} />
                  
                  <IconCircle>
                    {getActivityIcon(activity.type)}
                  </IconCircle>
                  
                  <ActivityContent>
                    <ActivityHeader>
                      <ActivityTitle>
                        {activity.details}
                      </ActivityTitle>
                      <ActivityTime>
                        {formatDate(activity.timestamp)}
                      </ActivityTime>
                    </ActivityHeader>
                    
                    {(activity.ipAddress || activity.device || activity.location) && (
                      <ActivityDetails>
                        {activity.ipAddress && (
                          <DetailItem>
                            <DetailLabel>IP:</DetailLabel>
                            <DetailValue>{activity.ipAddress}</DetailValue>
                          </DetailItem>
                        )}
                        
                        {activity.device && (
                          <DetailItem>
                            <DetailLabel>Device:</DetailLabel>
                            <DetailValue>{activity.device}</DetailValue>
                          </DetailItem>
                        )}
                        
                        {activity.location && (
                          <DetailItem>
                            <DetailLabel>Location:</DetailLabel>
                            <DetailValue>{activity.location}</DetailValue>
                          </DetailItem>
                        )}
                      </ActivityDetails>
                    )}
                  </ActivityContent>
                </ActivityItem>
              ))}
            </Timeline>
          )}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
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
  max-width: 700px;
  max-height: 90vh;
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

const BoosterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  position: sticky;
  top: 0;
  z-index: 2;
`;

const BoosterAvatar = styled.img`
  width: 50px;
  height: 50px;
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

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.hover};
  overflow-x: auto;
  position: sticky;
  top: 85px; /* Height of the header plus booster info */
  z-index: 1;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 4px;
  }
`;

const FilterLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text}aa;
  white-space: nowrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background-color: ${({ $active, theme }) => 
    $active ? theme.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.text};
  border: 1px solid ${({ $active, theme }) => 
    $active ? theme.primary : theme.border};
  border-radius: 1rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background-color: ${({ $active, theme }) => 
      $active ? theme.primary : theme.hover};
    border-color: ${({ $active, theme }) => 
      $active ? theme.primary : theme.primary + '44'};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  max-height: calc(90vh - 200px);
  overflow-y: auto;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
`;

const ActivityItem = styled.div`
  display: flex;
  position: relative;
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TimelineConnector = styled.div<{ $isFirst: boolean, $isLast: boolean }>`
  position: absolute;
  top: ${({ $isFirst }) => $isFirst ? '24px' : '0'};
  bottom: ${({ $isLast }) => $isLast ? '24px' : '0'};
  left: 20px;
  width: 2px;
  background-color: ${({ theme }) => theme.border};
  z-index: 0;
`;

const IconCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.cardBg};
  border: 2px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
`;

const ActivityIcon = styled.svg<{ $type: BoosterActivity['type'] }>`
  font-size: 1rem;
  color: ${({ $type }) => 
    $type === 'login' || $type === 'order_accepted' || $type === 'order_completed' ? '#27ae60' :
    $type === 'logout' ? '#3498db' :
    $type === 'permission_change' ? '#9b59b6' :
    $type === 'status_change' ? '#f39c12' :
    $type === 'order_declined' || $type === 'failed_login' ? '#e74c3c' :
    '#7f8c8d'};
`;

const ActivityContent = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.hover};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  padding: 1rem;
`;

const ActivityHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ActivityTitle = styled.h4`
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
`;

const ActivityTime = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
  white-space: nowrap;
`;

const ActivityDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px dashed ${({ theme }) => theme.border};
  font-size: 0.85rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text}aa;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.text};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.primary};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${({ theme }) => theme.text}aa;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
`;

const EmptyStateIcon = styled.svg`
  font-size: 3rem;
  color: ${({ theme }) => theme.border};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 500;
`;

const EmptyStateSubtext = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    transform: translateY(-2px);
  }
`;

export default BoosterActivityModal; 
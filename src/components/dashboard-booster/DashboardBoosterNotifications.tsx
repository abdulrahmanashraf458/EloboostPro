import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaBell, 
  FaCheck, 
  FaCalendarAlt, 
  FaUsers, 
  FaExclamationTriangle,
  FaSearch,
  FaTrash,
  FaEye,
  FaClock
} from 'react-icons/fa';

// Star icon component
const StarIcon = () => (
  <svg 
    aria-hidden="true" 
    focusable="false" 
    data-prefix="fas" 
    data-icon="star" 
    role="img" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 576 512"
    style={{ width: '1em', height: '1em' }}
  >
    <path 
      fill="currentColor" 
      d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"
    ></path>
  </svg>
);

// Define notification interface
interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  type: string;
  date: Date;
}

const DashboardBoosterNotifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Generate mock notifications with correct date order
  useEffect(() => {
    const now = new Date();
    
    const mockData = [
      {
        id: 1,
        title: 'New Order Assignment',
        message: 'You have been assigned a new boosting order #ORD-123456',
        read: false,
        type: 'order',
        date: new Date(now.getTime() - 2 * 60 * 1000) // 2 minutes ago
      },
      {
        id: 2,
        title: 'Order Completed',
        message: 'Your order #XY123 has been marked as completed',
        read: false,
        type: 'order',
        date: new Date(now.getTime() - 60 * 60 * 1000) // 1 hour ago
      },
      {
        id: 3,
        title: 'New Message',
        message: 'Client has sent you a new message regarding order #ORD-456789',
        read: true,
        type: 'message',
        date: new Date(now.getTime() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        id: 4,
        title: 'Order Deadline Approaching',
        message: 'Order #ORD-345678 deadline is in 24 hours',
        read: false,
        type: 'alert',
        date: new Date(now.getTime() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        id: 5,
        title: 'Payment Received',
        message: 'You received a payment of $45 for completed order #ORD-789012',
        read: true,
        type: 'payment',
        date: new Date(now.getTime() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: 6,
        title: 'Order Cancelled',
        message: 'Order #ORD-901234 has been cancelled by the client',
        read: false,
        type: 'alert',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        id: 7,
        title: 'Account Update',
        message: 'Your account information has been updated successfully',
        read: true,
        type: 'system',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000) // 2 days and 2 hours ago
      },
      {
        id: 8,
        title: 'New Feature Available',
        message: 'Check out the new dashboard features that have been added',
        read: true,
        type: 'system',
        date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        id: 9,
        title: 'New Client Review',
        message: 'A client has left a 5-star review for your services',
        read: true,
        type: 'review',
        date: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        id: 10,
        title: 'Profile Verification',
        message: 'Your profile has been verified successfully',
        read: true,
        type: 'system',
        date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
      }
    ];
    
    // Simulate loading and sort by date (newest first)
    setTimeout(() => {
      setNotifications(mockData.sort((a, b) => b.date.getTime() - a.date.getTime()));
      setIsLoading(false);
    }, 800);
  }, []);

  // Change filter
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  // Clear read notifications
  const clearReadNotifications = () => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => !notification.read)
    );
  };

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      // Type filter
      if (filter !== 'all' && notification.type !== filter) {
        return false;
      }
      
      // Search filter
      if (searchTerm && 
          !notification.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !notification.message.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    // Ensure newest first
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  // Format relative time
  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  };

  // Get notification icon by type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <FaCalendarAlt />;
      case 'message':
        return <FaUsers />;
      case 'alert':
        return <FaExclamationTriangle />;
      case 'payment':
        return <FaCheck />;
      case 'review':
        return <StarIcon />;
      default:
        return <FaBell />;
    }
  };

  // Get notification color by type
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return '#4caf50'; // Green
      case 'message':
        return '#2196f3'; // Blue
      case 'alert':
        return '#ff9800'; // Orange
      case 'payment':
        return '#9c27b0'; // Purple
      case 'review':
        return '#ff5722'; // Deep Orange
      default:
        return '#607d8b'; // Blue Grey
    }
  };

  return (
    <PageContainer>
      <Header>
        <PageTitle>
          <FaBell /> Notifications
        </PageTitle>
        <ActionsContainer>
          <SearchBox>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchBox>
          <ActionButtons>
            <ActionButton onClick={markAllAsRead}>
              <FaEye /> Mark All Read
            </ActionButton>
            <ActionButton onClick={clearReadNotifications}>
              <FaTrash /> Clear Read
            </ActionButton>
          </ActionButtons>
        </ActionsContainer>
      </Header>

      <FilterBar>
        <FilterButton
          active={filter === 'all'}
          onClick={() => handleFilterChange('all')}
        >
          All
        </FilterButton>
        <FilterButton
          active={filter === 'order'}
          onClick={() => handleFilterChange('order')}
        >
          Orders
        </FilterButton>
        <FilterButton
          active={filter === 'message'}
          onClick={() => handleFilterChange('message')}
        >
          Messages
        </FilterButton>
        <FilterButton
          active={filter === 'alert'}
          onClick={() => handleFilterChange('alert')}
        >
          Alerts
        </FilterButton>
        <FilterButton
          active={filter === 'payment'}
          onClick={() => handleFilterChange('payment')}
        >
          Payments
        </FilterButton>
        <FilterButton
          active={filter === 'system'}
          onClick={() => handleFilterChange('system')}
        >
          System
        </FilterButton>
      </FilterBar>

      {isLoading ? (
        <LoadingContainer>
          <Spinner />
          <div>Loading notifications...</div>
        </LoadingContainer>
      ) : filteredNotifications.length === 0 ? (
        <EmptyContainer>
          <EmptyIcon>🔔</EmptyIcon>
          <div>No notifications found</div>
          {filter !== 'all' && <div>Try changing your filter</div>}
        </EmptyContainer>
      ) : (
        <NotificationsList>
          {filteredNotifications.map(notification => (
            <NotificationCard 
              key={notification.id} 
              unread={!notification.read}
              onClick={() => markAsRead(notification.id)}
            >
              <IconContainer color={getNotificationColor(notification.type)}>
                {getNotificationIcon(notification.type)}
              </IconContainer>
              <ContentContainer>
                <NotificationHeader>
                  <NotificationTitle>{notification.title}</NotificationTitle>
                  <NotificationTime>
                    <FaClock /> {formatRelativeTime(notification.date)}
                  </NotificationTime>
                </NotificationHeader>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationActions className="notification-actions">
                  <ActionIconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    title="Delete notification"
                  >
                    <FaTrash />
                  </ActionIconButton>
                  {!notification.read && (
                    <ActionIconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      title="Mark as read"
                    >
                      <FaEye />
                    </ActionIconButton>
                  )}
                </NotificationActions>
              </ContentContainer>
            </NotificationCard>
          ))}
        </NotificationsList>
      )}
    </PageContainer>
  );
};

const PageContainer = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: ${({ theme }) => theme.cardBg};
  padding: 20px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${({ theme }) => theme.text};
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 280px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textLight};
  font-size: 14px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.inputBg || theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.textLight};
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBg || theme.cardBg};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  svg {
    color: ${({ theme }) => theme.primary};
    font-size: 14px;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    box-shadow: ${({ theme }) => theme.shadow};
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
  background: ${({ theme }) => theme.cardBg};
  padding: 16px;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

interface FilterButtonProps {
  active: boolean;
}

const FilterButton = styled.button<FilterButtonProps>`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => props.active ? props.theme.primary : props.theme.inputBg || props.theme.cardBg};
  color: ${props => props.active ? '#fff' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? props.theme.primaryDark || '#d32f2f' : props.theme.hover};
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.textLight};
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 36px;
  height: 36px;
  border: 3px solid ${({ theme }) => `${theme.primary}20`};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.primary};
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadow};
  color: ${({ theme }) => theme.textLight};
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const EmptyIcon = styled.div`
  font-size: 36px;
  margin-bottom: 8px;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

interface NotificationCardProps {
  unread: boolean;
}

const NotificationCard = styled.div<NotificationCardProps>`
  display: flex;
  padding: 16px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: ${({ theme }) => theme.shadow};
  border-left: ${props => props.unread ? `4px solid ${props.theme.primary}` : 'none'};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow};
    
    .notification-actions {
      opacity: 1;
    }
  }
`;

interface IconContainerProps {
  color: string;
}

const IconContainer = styled.div<IconContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${props => `${props.color}15`};
  color: ${props => props.color};
  margin-right: 16px;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 20px;
`;

const ContentContainer = styled.div`
  flex: 1;
  position: relative;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
  }
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.text};
`;

const NotificationTime = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.textLight};
  background: ${({ theme }) => theme.hover};
  padding: 4px 10px;
  border-radius: 16px;
  white-space: nowrap;
  
  svg {
    font-size: 12px;
    color: ${({ theme }) => theme.textLight};
  }
`;

const NotificationMessage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textLight};
  line-height: 1.5;
  margin-bottom: 8px;
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  bottom: 0;
  right: 0;
  
  @media (max-width: 768px) {
    opacity: 1;
    position: static;
    justify-content: flex-end;
    margin-top: 8px;
  }
`;

const ActionIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.inputBg || theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textLight};
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    font-size: 14px;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.primary};
    transform: scale(1.05);
  }
`;

export default DashboardBoosterNotifications; 
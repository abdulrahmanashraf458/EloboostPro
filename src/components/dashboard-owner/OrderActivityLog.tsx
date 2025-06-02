import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaFilter, FaCheckCircle, FaBan, FaPlay, FaPause, FaExclamationCircle, FaComment, FaUser, FaEdit, FaInfoCircle } from 'react-icons/fa';

interface OrderActivity {
  id: string;
  orderId: string;
  timestamp: Date;
  type: 'status_change' | 'progress_update' | 'chat_message' | 'booster_change' | 'note_added' | 'client_update';
  user: {
    id: string;
    name: string;
    avatar: string;
    role: 'admin' | 'booster' | 'client' | 'system';
  };
  data: {
    from?: string;
    to?: string;
    previousProgress?: number;
    newProgress?: number;
    message?: string;
    note?: string;
  };
}

interface OrderActivityLogProps {
  orderId: string;
  height?: string;
}

const OrderActivityLog: React.FC<OrderActivityLogProps> = ({ orderId, height }) => {
  const [activities, setActivities] = useState<OrderActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  // Mock data for demonstration
  useEffect(() => {
    const mockActivities: OrderActivity[] = [
      {
        id: '1',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        type: 'status_change',
        user: {
          id: 'admin1',
          name: 'Admin',
          avatar: 'https://i.pravatar.cc/150?u=admin1',
          role: 'admin'
        },
        data: {
          from: 'pending',
          to: 'in_progress'
        }
      },
      {
        id: '2',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60), // 2 days ago + 1 hour
        type: 'booster_change',
        user: {
          id: 'admin1',
          name: 'Admin',
          avatar: 'https://i.pravatar.cc/150?u=admin1',
          role: 'admin'
        },
        data: {
          from: 'Unassigned',
          to: 'RankHero'
        }
      },
      {
        id: '3',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 2), // 2 days ago + 2 hours
        type: 'chat_message',
        user: {
          id: 'client1',
          name: 'JohnDoe',
          avatar: 'https://i.pravatar.cc/150?u=client1',
          role: 'client'
        },
        data: {
          message: 'Hello, when will you start working on my order?'
        }
      },
      {
        id: '4',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 2 + 1000 * 60 * 30), // 2 days ago + 2.5 hours
        type: 'chat_message',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          message: 'I will start today. What champions do you prefer?'
        }
      },
      {
        id: '5',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        type: 'progress_update',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          previousProgress: 0,
          newProgress: 15
        }
      },
      {
        id: '6',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 60 * 12), // 1 day ago + 12 hours
        type: 'progress_update',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          previousProgress: 15,
          newProgress: 30
        }
      },
      {
        id: '7',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        type: 'status_change',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          from: 'in_progress',
          to: 'paused'
        }
      },
      {
        id: '8',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12 + 1000 * 60 * 60), // 11 hours ago
        type: 'note_added',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          note: 'Taking a break due to server maintenance. Will resume in 8 hours.'
        }
      },
      {
        id: '9',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        type: 'status_change',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          from: 'paused',
          to: 'in_progress'
        }
      },
      {
        id: '10',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        type: 'progress_update',
        user: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          role: 'booster'
        },
        data: {
          previousProgress: 30,
          newProgress: 45
        }
      },
      {
        id: '11',
        orderId,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        type: 'chat_message',
        user: {
          id: 'client1',
          name: 'JohnDoe',
          avatar: 'https://i.pravatar.cc/150?u=client1',
          role: 'client'
        },
        data: {
          message: 'How much longer until we reach Gold?'
        }
      }
    ];
    
    setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 800);
  }, [orderId]);
  
  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'status_change':
        return <FaInfoCircle />;
      case 'progress_update':
        return <FaCheckCircle />;
      case 'chat_message':
        return <FaComment />;
      case 'booster_change':
        return <FaUser />;
      case 'note_added':
        return <FaEdit />;
      case 'client_update':
        return <FaExclamationCircle />;
      default:
        return <FaInfoCircle />;
    }
  };
  
  const getStatusChangeIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <FaFilter />;
      case 'in_progress':
        return <FaPlay />;
      case 'completed':
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaBan />;
      case 'paused':
        return <FaPause />;
      default:
        return <FaInfoCircle />;
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
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const ActivityContentDisplay = ({ activity }: { activity: OrderActivity }) => {
    switch(activity.type) {
      case 'status_change':
        return (
          <ActivityMessage>
            <ActionHighlight>
              {getStatusChangeIcon(activity.data.to || '')}
              <span>Status changed from </span>
              <StatusBadge $color={getStatusColor(activity.data.from || '')}>
                {activity.data.from?.replace('_', ' ')}
              </StatusBadge>
              <span> to </span>
              <StatusBadge $color={getStatusColor(activity.data.to || '')}>
                {activity.data.to?.replace('_', ' ')}
              </StatusBadge>
            </ActionHighlight>
          </ActivityMessage>
        );
      
      case 'progress_update':
        return (
          <ActivityMessage>
            <ActionHighlight>
              <span>Progress updated from </span>
              <ProgressValue>{activity.data.previousProgress}%</ProgressValue>
              <span> to </span>
              <ProgressValue $positive>{activity.data.newProgress}%</ProgressValue>
            </ActionHighlight>
          </ActivityMessage>
        );
      
      case 'chat_message':
        return (
          <ActivityMessage>
            <ChatMessage>{activity.data.message}</ChatMessage>
          </ActivityMessage>
        );
      
      case 'booster_change':
        return (
          <ActivityMessage>
            <ActionHighlight>
              <span>Booster changed from </span>
              <BoosterName>{activity.data.from}</BoosterName>
              <span> to </span>
              <BoosterName>{activity.data.to}</BoosterName>
            </ActionHighlight>
          </ActivityMessage>
        );
      
      case 'note_added':
        return (
          <ActivityMessage>
            <Note>{activity.data.note}</Note>
          </ActivityMessage>
        );
      
      case 'client_update':
        return (
          <ActivityMessage>
            <ActionHighlight>
              <span>Client made an update to the order</span>
            </ActionHighlight>
            {activity.data.message && (
              <ChatMessage>{activity.data.message}</ChatMessage>
            )}
          </ActivityMessage>
        );
      
      default:
        return <ActivityMessage>Unknown activity</ActivityMessage>;
    }
  };
  
  return (
    <Container $height={height}>
      <Header>
        <Title>Activity Log</Title>
        <FilterContainer>
          <FilterSelect 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="status_change">Status Changes</option>
            <option value="progress_update">Progress Updates</option>
            <option value="chat_message">Chat Messages</option>
            <option value="booster_change">Booster Changes</option>
            <option value="note_added">Notes</option>
          </FilterSelect>
        </FilterContainer>
      </Header>
      
      <ActivityList>
        {isLoading ? (
          <LoadingMessage>Loading activity log...</LoadingMessage>
        ) : filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <ActivityItem key={activity.id}>
              <ActivityTime>
                <TimeRelative>{formatDate(activity.timestamp)}</TimeRelative>
                <TimeExact>{formatTime(activity.timestamp)}</TimeExact>
              </ActivityTime>
              
              <ActivityDot $type={activity.type} />
              
              <ActivityContentWrapper>
                <ActivityHeader>
                  <UserInfo>
                    <UserAvatar $role={activity.user.role}>
                      <img src={activity.user.avatar} alt={activity.user.name} />
                    </UserAvatar>
                    <UserName>{activity.user.name}</UserName>
                    <UserRole $role={activity.user.role}>{activity.user.role}</UserRole>
                  </UserInfo>
                  <ActivityIcon>
                    {getActivityIcon(activity.type)}
                  </ActivityIcon>
                </ActivityHeader>
                
                <ActivityContentDisplay activity={activity} />
              </ActivityContentWrapper>
            </ActivityItem>
          ))
        ) : (
          <EmptyState>No activities found for this filter</EmptyState>
        )}
      </ActivityList>
    </Container>
  );
};

// Styled Components
const Container = styled.div<{ $height?: string }>`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: ${({ $height }) => $height || '400px'};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
`;

const FilterContainer = styled.div`
  min-width: 150px;
`;

const FilterSelect = styled.select`
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.875rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ActivityList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  position: relative;
`;

const ActivityTime = styled.div`
  min-width: 80px;
  padding-right: 1rem;
  text-align: right;
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}aa;
  padding-top: 0.25rem;
`;

const TimeRelative = styled.span`
  font-weight: 500;
`;

const TimeExact = styled.span`
  margin-top: 0.25rem;
`;

const ActivityDot = styled.div<{ $type: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $type }) => {
    switch($type) {
      case 'status_change':
        return '#3498db'; // blue
      case 'progress_update':
        return '#2ecc71'; // green
      case 'chat_message':
        return '#9b59b6'; // purple
      case 'booster_change':
        return '#f39c12'; // amber
      case 'note_added':
        return '#e67e22'; // orange
      case 'client_update':
        return '#e74c3c'; // red
      default:
        return '#95a5a6'; // gray
    }
  }};
  margin-right: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: calc(100% + 1rem);
    background-color: ${({ theme }) => theme.border};
  }
  
  &:last-child::before {
    display: none;
  }
`;

const ActivityContentWrapper = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.hover};
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserAvatar = styled.div<{ $role: string }>`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ $role }) => {
    switch($role) {
      case 'admin':
        return '#e74c3c'; // red
      case 'booster':
        return '#3498db'; // blue
      case 'client':
        return '#2ecc71'; // green
      default:
        return '#95a5a6'; // gray
    }
  }};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserName = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`;

const UserRole = styled.span<{ $role: string }>`
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  text-transform: capitalize;
  background-color: ${({ $role }) => {
    switch($role) {
      case 'admin':
        return '#e74c3c33'; // red with transparency
      case 'booster':
        return '#3498db33'; // blue with transparency
      case 'client':
        return '#2ecc7133'; // green with transparency
      default:
        return '#95a5a633'; // gray with transparency
    }
  }};
  color: ${({ $role }) => {
    switch($role) {
      case 'admin':
        return '#e74c3c'; // red
      case 'booster':
        return '#3498db'; // blue
      case 'client':
        return '#2ecc71'; // green
      default:
        return '#95a5a6'; // gray
    }
  }};
`;

const ActivityIcon = styled.div`
  color: ${({ theme }) => theme.text}aa;
  font-size: 1rem;
`;

const ActivityMessage = styled.div`
  font-size: 0.875rem;
  line-height: 1.4;
`;

const ActionHighlight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  svg {
    font-size: 0.875rem;
  }
`;

const StatusBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  background-color: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const ProgressValue = styled.span<{ $positive?: boolean }>`
  font-weight: 600;
  color: ${({ $positive, theme }) => $positive ? '#2ecc71' : theme.text};
`;

const ChatMessage = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-left: 3px solid ${({ theme }) => theme.primary};
`;

const BoosterName = styled.span`
  font-weight: 600;
  color: #3498db;
`;

const Note = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-left: 3px solid #e67e22;
  font-style: italic;
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.875rem;
`;

export default OrderActivityLog; 
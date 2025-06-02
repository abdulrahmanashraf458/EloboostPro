import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaChartLine, FaList, FaComments, FaExclamationTriangle, FaCheck, FaSpinner, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Mock data interfaces
interface DashboardStats {
  activeOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  activeBoosters: number;
  totalBoosters: number;
  activeClients: number;
  totalClients: number;
  activeChatSessions: number;
  flaggedChats: number;
}

const DashboardOwnerHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    activeOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    activeBoosters: 0,
    totalBoosters: 0,
    activeClients: 0,
    totalClients: 0,
    activeChatSessions: 0,
    flaggedChats: 0
  });
  
  const [loading, setLoading] = useState(true);
  
  // Mock data for charts
  const [recentActivity] = useState([
    {
      id: 1,
      type: 'order_completed',
      message: 'Order #ORD-1234 completed by RankHero',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: 2,
      type: 'booster_online',
      message: 'DuoKing is now online',
      timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
    },
    {
      id: 3,
      type: 'new_order',
      message: 'New order #ORD-5678 created',
      timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
    },
    {
      id: 4,
      type: 'client_message',
      message: 'New support message from client JaneSmith',
      timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1.5 hours ago
    },
    {
      id: 5,
      type: 'flagged_chat',
      message: 'Chat session for order #ORD-5678 has been flagged',
      timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
    }
  ]);
  
  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      // Simulate API call
      setLoading(true);
      
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set mock data
      setStats({
        activeOrders: 12,
        completedOrders: 48,
        pendingOrders: 5,
        totalRevenue: 4850,
        activeBoosters: 8,
        totalBoosters: 15,
        activeClients: 23,
        totalClients: 75,
        activeChatSessions: 7,
        flaggedChats: 2
      });
      
      setLoading(false);
    };
    
    loadData();
  }, []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day ago`;
  };
  
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'order_completed':
        return <ActivityIconWrapper $bgColor="#2ecc71"><FaCheck /></ActivityIconWrapper>;
      case 'booster_online':
        return <ActivityIconWrapper $bgColor="#3498db"><FaUsers /></ActivityIconWrapper>;
      case 'new_order':
        return <ActivityIconWrapper $bgColor="#9b59b6"><FaList /></ActivityIconWrapper>;
      case 'client_message':
        return <ActivityIconWrapper $bgColor="#f39c12"><FaComments /></ActivityIconWrapper>;
      case 'flagged_chat':
        return <ActivityIconWrapper $bgColor="#e74c3c"><FaExclamationTriangle /></ActivityIconWrapper>;
      default:
        return <ActivityIconWrapper $bgColor="#95a5a6"><FaClock /></ActivityIconWrapper>;
    }
  };
  
  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner className="spinner" />
        <LoadingText>Loading dashboard data...</LoadingText>
      </LoadingContainer>
    );
  }
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Owner Dashboard</PageTitle>
        <PageDescription>
          Overview of your boosting business operations
        </PageDescription>
      </PageHeader>
      
      <StatisticsSection>
        <SectionTitle>Quick Statistics</SectionTitle>
        
        <StatCards>
          <StatCard to="/owner/orders">
            <StatCardIcon $bgColor="#3498db">
              <FaList />
            </StatCardIcon>
            <StatCardContent>
              <StatCardTitle>Orders</StatCardTitle>
              <StatNumbers>
                <StatMainNumber>{stats.activeOrders}</StatMainNumber>
                <StatSecondaryText>Active</StatSecondaryText>
              </StatNumbers>
              <StatExtra>
                <StatExtraItem>
                  <span>{stats.completedOrders}</span>
                  <span>Completed</span>
                </StatExtraItem>
                <StatExtraItem>
                  <span>{stats.pendingOrders}</span>
                  <span>Pending</span>
                </StatExtraItem>
              </StatExtra>
            </StatCardContent>
          </StatCard>
          
          <StatCard to="/owner/boosters">
            <StatCardIcon $bgColor="#9b59b6">
              <FaUsers />
            </StatCardIcon>
            <StatCardContent>
              <StatCardTitle>Boosters</StatCardTitle>
              <StatNumbers>
                <StatMainNumber>{stats.activeBoosters}</StatMainNumber>
                <StatSecondaryText>Active</StatSecondaryText>
              </StatNumbers>
              <StatExtra>
                <StatExtraItem>
                  <span>{stats.totalBoosters}</span>
                  <span>Total</span>
                </StatExtraItem>
                <StatExtraItem>
                  <span>{((stats.activeBoosters / stats.totalBoosters) * 100).toFixed(0)}%</span>
                  <span>Availability</span>
                </StatExtraItem>
              </StatExtra>
            </StatCardContent>
          </StatCard>
          
          <StatCard to="/owner/clients">
            <StatCardIcon $bgColor="#2ecc71">
              <FaChartLine />
            </StatCardIcon>
            <StatCardContent>
              <StatCardTitle>Revenue</StatCardTitle>
              <StatNumbers>
                <StatMainNumber>{formatCurrency(stats.totalRevenue)}</StatMainNumber>
                <StatSecondaryText>This Month</StatSecondaryText>
              </StatNumbers>
              <StatExtra>
                <StatExtraItem>
                  <span>{stats.activeClients}</span>
                  <span>Active Clients</span>
                </StatExtraItem>
                <StatExtraItem>
                  <span>{stats.totalClients}</span>
                  <span>Total Clients</span>
                </StatExtraItem>
              </StatExtra>
            </StatCardContent>
          </StatCard>
          
          <StatCard to="/owner/livechat">
            <StatCardIcon $bgColor="#f39c12">
              <FaComments />
            </StatCardIcon>
            <StatCardContent>
              <StatCardTitle>Chat</StatCardTitle>
              <StatNumbers>
                <StatMainNumber>{stats.activeChatSessions}</StatMainNumber>
                <StatSecondaryText>Active Sessions</StatSecondaryText>
              </StatNumbers>
              <StatExtra>
                <StatExtraItem>
                  <span>{stats.flaggedChats}</span>
                  <span>Flagged</span>
                </StatExtraItem>
                <StatExtraItem>
                  <span>{stats.activeClients}</span>
                  <span>Clients Chatting</span>
                </StatExtraItem>
              </StatExtra>
            </StatCardContent>
          </StatCard>
        </StatCards>
      </StatisticsSection>
      
      <Section>
        <SectionTitle>Recent Activity</SectionTitle>
        <ActivityContainer>
          {recentActivity.map(activity => (
            <ActivityItem key={activity.id}>
              {getActivityIcon(activity.type)}
              <ActivityContent>
                <ActivityMessage>{activity.message}</ActivityMessage>
                <ActivityTime>{formatTimeAgo(activity.timestamp)} ({formatTime(activity.timestamp)})</ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))}
        </ActivityContainer>
      </Section>
      
      <QuickActionsSection>
        <SectionTitle>Quick Actions</SectionTitle>
        <ActionButtonsContainer>
          <ActionButton to="/owner/orders" $bgColor="#3498db">
            <ActionIcon>
              <FaList />
            </ActionIcon>
            <ActionText>Track Orders</ActionText>
          </ActionButton>
          
          <ActionButton to="/owner/boosters" $bgColor="#9b59b6">
            <ActionIcon>
              <FaUsers />
            </ActionIcon>
            <ActionText>Manage Boosters</ActionText>
          </ActionButton>
          
          <ActionButton to="/owner/livechat" $bgColor="#f39c12">
            <ActionIcon>
              <FaComments />
            </ActionIcon>
            <ActionText>Monitor Chats</ActionText>
          </ActionButton>
        </ActionButtonsContainer>
      </QuickActionsSection>
    </Container>
  );
};

const Container = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.text}aa;
`;

const StatisticsSection = styled.section`
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const StatCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled(Link)`
  display: flex;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatCardIcon = styled.div<{ $bgColor: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background-color: ${({ $bgColor }) => $bgColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1.25rem;
  flex-shrink: 0;
`;

const StatCardContent = styled.div`
  flex: 1;
`;

const StatCardTitle = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 0.5rem;
`;

const StatNumbers = styled.div`
  margin-bottom: 1rem;
`;

const StatMainNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatSecondaryText = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
`;

const StatExtra = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
`;

const StatExtraItem = styled.div`
  display: flex;
  flex-direction: column;
  
  span:first-child {
    font-weight: 600;
  }
  
  span:last-child {
    color: ${({ theme }) => theme.text}aa;
    font-size: 0.75rem;
  }
`;

const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ActivityIconWrapper = styled.div<{ $bgColor: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: ${({ $bgColor }) => $bgColor};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityMessage = styled.div`
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}aa;
`;

const QuickActionsSection = styled.section`
  margin-bottom: 2rem;
`;

const ActionButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled(Link)<{ $bgColor: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    
    svg {
      color: ${({ $bgColor }) => $bgColor};
    }
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
`;

const ActionText = styled.div`
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  .spinner {
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
    color: ${({ theme }) => theme.primary};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.text}aa;
`;

export default DashboardOwnerHome; 
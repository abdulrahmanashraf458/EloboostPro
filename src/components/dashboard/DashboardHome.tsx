import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaGamepad, FaTrophy, FaClock, FaChartLine, FaChevronRight, FaEye, FaComment } from 'react-icons/fa';
import { StatusProps } from '../../styles/StyledComponentTypes';

interface OrderSummary {
  id: string;
  game: string;
  service: string;
  from: string;
  to: string;
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  progress: number;
  createdAt: string;
  estimatedCompletion: string;
  booster?: {
    name: string;
    avatar: string;
    rating: number;
  };
}

interface OrderButtonProps {
  secondary?: boolean;
}

const DashboardHome: React.FC = () => {
  const [activeOrders, setActiveOrders] = useState<OrderSummary[]>([]);
  const [completedOrders, setCompletedOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch orders
    // For demo, simulate loading and set mock data
    const loadOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
      
      // Check if there's a current order in localStorage
      const localOrder = localStorage.getItem('currentOrder');
      
      // Mock data
      const mockActiveOrders = [];
      
      if (localOrder) {
        const parsedOrder = JSON.parse(localOrder);
        
        mockActiveOrders.push({
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          game: 'League of Legends',
          service: 'Solo Boost',
          from: `${parsedOrder.order.currentRank.tier.charAt(0).toUpperCase() + parsedOrder.order.currentRank.tier.slice(1)} ${parsedOrder.order.currentRank.division}`,
          to: `${parsedOrder.order.desiredRank.tier.charAt(0).toUpperCase() + parsedOrder.order.desiredRank.tier.slice(1)} ${parsedOrder.order.desiredRank.division}`,
          status: 'in_progress' as const,
          progress: 35,
          createdAt: new Date(parsedOrder.date).toLocaleDateString(),
          estimatedCompletion: parsedOrder.estimatedTime,
          booster: {
            name: 'RankHero',
            avatar: 'https://i.pravatar.cc/150?u=booster1',
            rating: 4.9
          }
        });
      }
      
      const mockCompletedOrders = [
        {
          id: 'ORD-5493',
          game: 'League of Legends',
          service: 'Duo Boost',
          from: 'Gold IV',
          to: 'Platinum II',
          status: 'completed' as const,
          progress: 100,
          createdAt: '2023-07-15',
          estimatedCompletion: 'Completed on July 20, 2023',
        }
      ];
      
      setActiveOrders(mockActiveOrders);
      setCompletedOrders(mockCompletedOrders);
      setIsLoading(false);
    };
    
    loadOrders();
  }, []);
  
  return (
    <Container>
      <WelcomeSection>
        <WelcomeTitle>Welcome to your Dashboard</WelcomeTitle>
        <WelcomeSubtitle>
          Monitor your boosting orders and check your progress
        </WelcomeSubtitle>
      </WelcomeSection>
      
      <StatCards>
        <StatCard>
          <StatIcon>
            <FaGamepad />
          </StatIcon>
          <StatContent>
            <StatValue>{activeOrders.length}</StatValue>
            <StatLabel>Active Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaTrophy />
          </StatIcon>
          <StatContent>
            <StatValue>{completedOrders.length}</StatValue>
            <StatLabel>Completed Orders</StatLabel>
          </StatContent>
        </StatCard>
      </StatCards>
      
      <SectionTitle>
        <span>Active Orders</span>
        <SectionAction to="/dashboard/orders">
          View All <FaChevronRight />
        </SectionAction>
      </SectionTitle>
      
      {isLoading ? (
        <LoadingIndicator>Loading your orders...</LoadingIndicator>
      ) : activeOrders.length > 0 ? (
        activeOrders.map(order => (
          <OrderCard key={order.id}>
            <OrderHeader>
              <OrderGame>
                {order.game} <OrderType>{order.service}</OrderType>
              </OrderGame>
              <OrderId>ID: {order.id}</OrderId>
            </OrderHeader>
            
            <OrderDetails>
              <OrderRanks>
                <span>From:</span> {order.from} <RankArrow>→</RankArrow> <span>To:</span> {order.to}
              </OrderRanks>
              
              <OrderBooster>
                <BoosterAvatar src={order.booster?.avatar} alt={order.booster?.name} />
                <BoosterInfo>
                  <BoosterName>
                    Booster: {order.booster?.name}
                  </BoosterName>
                  <BoosterRating>
                    Rating: {order.booster?.rating} / 5
                  </BoosterRating>
                </BoosterInfo>
              </OrderBooster>
            </OrderDetails>
            
            <OrderProgress>
              <ProgressLabel>
                <span>Progress:</span> {order.progress}%
              </ProgressLabel>
              <ProgressBar>
                <ProgressFill progress={order.progress} />
              </ProgressBar>
            </OrderProgress>
            
            <OrderFooter>
              <OrderStatus status={order.status}>
                {order.status === 'pending' && 'Pending Booster Assignment'}
                {order.status === 'in_progress' && 'In Progress'}
                {order.status === 'completed' && 'Completed'}
                {order.status === 'canceled' && 'Canceled'}
              </OrderStatus>
              <OrderTime>
                <div>Created: {order.createdAt}</div>
                <div>Estimated: {order.estimatedCompletion}</div>
              </OrderTime>
            </OrderFooter>
            
            <OrderActions>
              <OrderButton to={`/dashboard/chat`}>
                <FaComment style={{ marginRight: '0.5rem' }} /> Chat with Booster
              </OrderButton>
              <OrderButton to={`/dashboard/orders`} secondary>
                <FaEye style={{ marginRight: '0.5rem' }} /> View Details
              </OrderButton>
            </OrderActions>
          </OrderCard>
        ))
      ) : (
        <EmptyState>
          <EmptyStateMessage>You don't have any active orders</EmptyStateMessage>
          <EmptyStateAction to="/boosting-order">
            Start a New Boost
          </EmptyStateAction>
        </EmptyState>
      )}
      
      <SectionTitle>
        <span>Recently Completed</span>
      </SectionTitle>
      
      {isLoading ? (
        <LoadingIndicator>Loading completed orders...</LoadingIndicator>
      ) : completedOrders.length > 0 ? (
        <CompletedOrdersGrid>
          {completedOrders.map(order => (
            <CompletedOrderCard key={order.id}>
              <CompletedOrderGame>{order.game}</CompletedOrderGame>
              <CompletedOrderDetails>
                <CompletedOrderRanks>
                  {order.from} → {order.to}
                </CompletedOrderRanks>
                <CompletedOrderDate>
                  {order.estimatedCompletion}
                </CompletedOrderDate>
              </CompletedOrderDetails>
              <CompletedOrderId>{order.id}</CompletedOrderId>
            </CompletedOrderCard>
          ))}
        </CompletedOrdersGrid>
      ) : (
        <EmptyState>
          <EmptyStateMessage>No completed orders yet</EmptyStateMessage>
        </EmptyState>
      )}
    </Container>
  );
};

const Container = styled.div``;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  color: ${({ theme }) => theme.text}aa;
`;

const StatCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => `${theme.primary}22`};
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin: 2.5rem 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionAction = styled(Link)`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  
  svg {
    font-size: 0.75rem;
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(3px);
  }
`;

const LoadingIndicator = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const OrderGame = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;

const OrderType = styled.span`
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => `${theme.primary}22`};
  color: ${({ theme }) => theme.primary};
  margin-left: 0.75rem;
`;

const OrderId = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
`;

const OrderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const OrderRanks = styled.div`
  span {
    color: ${({ theme }) => theme.text}aa;
    font-size: 0.9rem;
  }
`;

const RankArrow = styled.span`
  margin: 0 0.5rem;
  color: ${({ theme }) => theme.primary};
`;

const OrderBooster = styled.div`
  display: flex;
  align-items: center;
`;

const BoosterAvatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.75rem;
  border: 2px solid ${({ theme }) => theme.primary};
`;

const BoosterInfo = styled.div``;

const BoosterName = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const BoosterRating = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
`;

const OrderProgress = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  span {
    color: ${({ theme }) => theme.text}aa;
  }
`;

const ProgressBar = styled.div`
  height: 0.5rem;
  background: ${({ theme }) => theme.border};
  border-radius: 0.25rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background: ${({ theme }) => theme.primary};
  border-radius: 0.25rem;
  transition: width 0.5s ease;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const OrderStatus = styled.div<StatusProps>`
  padding: 0.35rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
  
  background: ${({ status, theme }) => 
    status === 'completed' ? `${theme.success}22` :
    status === 'in_progress' ? `${theme.primary}22` : 
    status === 'pending' ? `${theme.warning}22` : 
    `${theme.error}22`};
  
  color: ${({ status, theme }) => 
    status === 'completed' ? theme.success :
    status === 'in_progress' ? theme.primary : 
    status === 'pending' ? theme.warning : 
    theme.error};
`;

const OrderTime = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
  
  div {
    margin-bottom: 0.25rem;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const OrderButton = styled(Link)<OrderButtonProps>`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  text-align: center;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  background: ${({ secondary, theme }) => 
    secondary ? 'transparent' : theme.primary};
  color: ${({ secondary, theme }) => 
    secondary ? theme.text : 'white'};
  border: 1px solid ${({ secondary, theme }) => 
    secondary ? theme.border : theme.primary};
  
  &:hover {
    transform: translateY(-3px);
    background: ${({ secondary, theme }) => 
      secondary ? theme.hover : theme.buttonHover};
    border-color: ${({ secondary, theme }) => 
      secondary ? theme.primary : theme.buttonHover};
    color: ${({ secondary, theme }) => 
      secondary ? theme.primary : 'white'};
  }
  
  @media (max-width: 640px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    width: 100%;
  }
`;

const EmptyState = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 3rem 2rem;
  text-align: center;
`;

const EmptyStateMessage = styled.div`
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 1.5rem;
`;

const EmptyStateAction = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
    transform: translateY(-3px);
  }
`;

const CompletedOrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const CompletedOrderCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

const CompletedOrderGame = styled.div`
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const CompletedOrderDetails = styled.div`
  margin-bottom: 0.75rem;
`;

const CompletedOrderRanks = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const CompletedOrderDate = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
`;

const CompletedOrderId = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export default DashboardHome;
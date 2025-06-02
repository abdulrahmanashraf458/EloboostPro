import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaUsers, FaChartLine, FaTasks, FaCheck, FaClock, FaTrophy,
  FaExclamationTriangle, FaCalendarAlt, FaMoneyBillWave
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const DashboardBoosterHome: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Mock data
  const activeOrders = [
    { id: 'ORD-123456', game: 'League of Legends', type: 'Solo Boost', from: 'Silver II', to: 'Gold IV', client: 'Anonymous', deadline: '2 days', progress: 35 },
    { id: 'ORD-789012', game: 'Valorant', type: 'Rank Boost', from: 'Bronze III', to: 'Silver II', client: 'Anonymous', deadline: '5 days', progress: 20 },
  ];
  
  // Statistics data
  const statsData = {
    completedOrders: 24,
    activeOrders: 2,
    pendingOrders: 1,
    totalEarnings: 560,
    clientRating: 4.8,
    completionRate: 98,
  };

  return (
    <Container>
      <Header>
        <PageTitle>Booster Dashboard</PageTitle>
      </Header>
      
      <StatsGrid>
        <StatCard>
          <StatIcon>
            <FaCheck />
          </StatIcon>
          <StatContent>
            <StatValue>{statsData.completedOrders}</StatValue>
            <StatLabel>Completed Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaTasks />
          </StatIcon>
          <StatContent>
            <StatValue>{statsData.activeOrders}</StatValue>
            <StatLabel>Active Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaClock />
          </StatIcon>
          <StatContent>
            <StatValue>{statsData.pendingOrders}</StatValue>
            <StatLabel>Pending Orders</StatLabel>
          </StatContent>
        </StatCard>
        
        <StatCard>
          <StatIcon>
            <FaMoneyBillWave />
          </StatIcon>
          <StatContent>
            <StatValue>${statsData.totalEarnings}</StatValue>
            <StatLabel>Total Earnings</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>
      
      <ActiveOrdersSection>
        <SectionTitle>Active Orders</SectionTitle>
        <OrdersTable>
          <OrdersTableHead>
            <OrdersTableRow>
              <OrdersTableHeader>Order ID</OrdersTableHeader>
              <OrdersTableHeader>Game</OrdersTableHeader>
              <OrdersTableHeader>Type</OrdersTableHeader>
              <OrdersTableHeader>From</OrdersTableHeader>
              <OrdersTableHeader>To</OrdersTableHeader>
              <OrdersTableHeader>Deadline</OrdersTableHeader>
              <OrdersTableHeader>Progress</OrdersTableHeader>
            </OrdersTableRow>
          </OrdersTableHead>
          <OrdersTableBody>
            {activeOrders.map(order => (
              <OrdersTableRow key={order.id}>
                <OrdersTableData>
                  <OrderLink href={`/booster/orders/${order.id}`}>
                    {order.id}
                  </OrderLink>
                </OrdersTableData>
                <OrdersTableData>{order.game}</OrdersTableData>
                <OrdersTableData>{order.type}</OrdersTableData>
                <OrdersTableData>{order.from}</OrdersTableData>
                <OrdersTableData>{order.to}</OrdersTableData>
                <OrdersTableData>{order.deadline}</OrdersTableData>
                <OrdersTableData>
                  <ProgressBarWrapper>
                    <ProgressBar style={{ width: `${order.progress}%` }} />
                    <ProgressText>{order.progress}%</ProgressText>
                  </ProgressBarWrapper>
                </OrdersTableData>
              </OrdersTableRow>
            ))}
            {activeOrders.length === 0 && (
              <OrdersTableRow>
                <OrdersTableData colSpan={7}>
                  <NoOrdersMessage>No active orders at the moment.</NoOrdersMessage>
                </OrdersTableData>
              </OrdersTableRow>
            )}
          </OrdersTableBody>
        </OrdersTable>
      </ActiveOrdersSection>
    </Container>
  );
};

const Container = styled(motion.div)`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => `${theme.primary}22`};
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
    margin-right: 0.75rem;
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ActiveOrdersSection = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const OrdersTableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const OrdersTableBody = styled.tbody``;

const OrdersTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const OrdersTableHeader = styled.th`
  text-align: left;
  padding: 1rem 0.5rem;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
  font-weight: 600;
  
  @media (max-width: 992px) {
    display: none;
    
    &:first-child, &:last-child {
      display: table-cell;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }
`;

const OrdersTableData = styled.td`
  padding: 1rem 0.5rem;
  
  @media (max-width: 992px) {
    display: none;
    
    &:first-child, &:last-child {
      display: table-cell;
    }
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
    font-size: 0.9rem;
  }
`;

const OrderLink = styled.a`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.border};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.primary};
  border-radius: 4px;
`;

const ProgressText = styled.span`
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const NoOrdersMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.text}aa;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
`;

export default DashboardBoosterHome; 
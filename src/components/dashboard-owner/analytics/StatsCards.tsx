import React from 'react';
import styled from 'styled-components';
import { 
  FaUsers, FaMoneyBillWave, FaChartLine, FaCheckCircle, 
  FaArrowUp, FaArrowDown 
} from 'react-icons/fa';
import { Skeleton } from '../../../components/ui/Skeleton';

interface StatsCardsProps {
  isLoading: boolean;
  timeRange: 'day' | 'week' | 'month' | 'year';
}

const StatsCards: React.FC<StatsCardsProps> = ({ isLoading, timeRange }) => {
  // Mock stats data
  const statsData = {
    day: {
      activeUsers: { value: 428, change: 8.3, direction: 'up' },
      revenue: { value: 1850, change: 5.2, direction: 'up' },
      orders: { value: 47, change: 12.6, direction: 'up' },
      conversionRate: { value: 32.5, change: -2.1, direction: 'down' }
    },
    week: {
      activeUsers: { value: 862, change: 10.5, direction: 'up' },
      revenue: { value: 8500, change: 7.8, direction: 'up' },
      orders: { value: 214, change: 9.3, direction: 'up' },
      conversionRate: { value: 34.1, change: 1.2, direction: 'up' }
    },
    month: {
      activeUsers: { value: 2480, change: 15.2, direction: 'up' },
      revenue: { value: 35600, change: 12.4, direction: 'up' },
      orders: { value: 892, change: 8.7, direction: 'up' },
      conversionRate: { value: 36.2, change: 3.5, direction: 'up' }
    },
    year: {
      activeUsers: { value: 12750, change: 28.4, direction: 'up' },
      revenue: { value: 428000, change: 32.2, direction: 'up' },
      orders: { value: 10845, change: 23.8, direction: 'up' },
      conversionRate: { value: 35.6, change: 5.2, direction: 'up' }
    }
  };
  
  const currentStats = statsData[timeRange];
  
  return (
    <Container>
      {/* Active Users Card */}
      <StatCard>
        {isLoading ? (
          <StatCardLoading />
        ) : (
          <>
            <StatIconWrapper className="users">
              <FaUsers />
            </StatIconWrapper>
            <StatContent>
              <StatTitle>Active Users</StatTitle>
              <StatValue>{currentStats.activeUsers.value.toLocaleString()}</StatValue>
              <StatTrend direction={currentStats.activeUsers.direction as 'up' | 'down'}>
                {currentStats.activeUsers.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{Math.abs(currentStats.activeUsers.change).toFixed(1)}%</span>
              </StatTrend>
            </StatContent>
            <SparklineBackground className="users">
              <SparklineForeground width={85} className="users" />
            </SparklineBackground>
          </>
        )}
      </StatCard>
      
      {/* Revenue Card */}
      <StatCard>
        {isLoading ? (
          <StatCardLoading />
        ) : (
          <>
            <StatIconWrapper className="revenue">
              <FaMoneyBillWave />
            </StatIconWrapper>
            <StatContent>
              <StatTitle>Revenue</StatTitle>
              <StatValue>${currentStats.revenue.value.toLocaleString()}</StatValue>
              <StatTrend direction={currentStats.revenue.direction as 'up' | 'down'}>
                {currentStats.revenue.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{Math.abs(currentStats.revenue.change).toFixed(1)}%</span>
              </StatTrend>
            </StatContent>
            <SparklineBackground className="revenue">
              <SparklineForeground width={75} className="revenue" />
            </SparklineBackground>
          </>
        )}
      </StatCard>
      
      {/* Orders Card */}
      <StatCard>
        {isLoading ? (
          <StatCardLoading />
        ) : (
          <>
            <StatIconWrapper className="orders">
              <FaChartLine />
            </StatIconWrapper>
            <StatContent>
              <StatTitle>New Orders</StatTitle>
              <StatValue>{currentStats.orders.value.toLocaleString()}</StatValue>
              <StatTrend direction={currentStats.orders.direction as 'up' | 'down'}>
                {currentStats.orders.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{Math.abs(currentStats.orders.change).toFixed(1)}%</span>
              </StatTrend>
            </StatContent>
            <SparklineBackground className="orders">
              <SparklineForeground width={90} className="orders" />
            </SparklineBackground>
          </>
        )}
      </StatCard>
      
      {/* Conversion Rate Card */}
      <StatCard>
        {isLoading ? (
          <StatCardLoading />
        ) : (
          <>
            <StatIconWrapper className="conversion">
              <FaCheckCircle />
            </StatIconWrapper>
            <StatContent>
              <StatTitle>Conversion Rate</StatTitle>
              <StatValue>{currentStats.conversionRate.value.toLocaleString()}%</StatValue>
              <StatTrend direction={currentStats.conversionRate.direction as 'up' | 'down'}>
                {currentStats.conversionRate.direction === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                <span>{Math.abs(currentStats.conversionRate.change).toFixed(1)}%</span>
              </StatTrend>
            </StatContent>
            <SparklineBackground className="conversion">
              <SparklineForeground width={65} className="conversion" />
            </SparklineBackground>
          </>
        )}
      </StatCard>
    </Container>
  );
};

// Stats card loading component
const StatCardLoading: React.FC = () => (
  <>
    <StatIconWrapper className="loading">
      <Skeleton width="100%" height="100%" borderRadius="12px" />
    </StatIconWrapper>
    <StatContent>
      <Skeleton width="80px" height="20px" />
      <Skeleton width="100px" height="36px" margin="0.5rem 0" />
      <Skeleton width="60px" height="20px" />
    </StatContent>
  </>
);

// Styles
const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1400px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.border};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const StatIconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  
  &.users {
    background: rgba(139, 92, 246, 0.1);
    color: #8B5CF6;
  }
  
  &.revenue {
    background: rgba(79, 209, 197, 0.1);
    color: #4FD1C5;
  }
  
  &.orders {
    background: rgba(246, 173, 85, 0.1);
    color: #F6AD55;
  }
  
  &.conversion {
    background: rgba(72, 187, 120, 0.1);
    color: #48BB78;
  }
  
  &.loading {
    background: transparent;
  }
`;

const StatContent = styled.div`
  flex: 1;
  z-index: 2;
`;

const StatTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatTrend = styled.div<{ direction: 'up' | 'down' }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ direction }) => (direction === 'up' ? '#48BB78' : '#F56565')};
  
  svg {
    margin-right: 0.25rem;
    font-size: 0.875rem;
  }
`;

const SparklineBackground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  opacity: 0.1;
  
  &.users {
    background-color: #8B5CF6;
  }
  
  &.revenue {
    background-color: #4FD1C5;
  }
  
  &.orders {
    background-color: #F6AD55;
  }
  
  &.conversion {
    background-color: #48BB78;
  }
`;

const SparklineForeground = styled.div<{ width: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${({ width }) => width}%;
  height: 40px;
  
  &.users {
    background: linear-gradient(to right, transparent, #8B5CF6);
  }
  
  &.revenue {
    background: linear-gradient(to right, transparent, #4FD1C5);
  }
  
  &.orders {
    background: linear-gradient(to right, transparent, #F6AD55);
  }
  
  &.conversion {
    background: linear-gradient(to right, transparent, #48BB78);
  }
`;

export default StatsCards; 
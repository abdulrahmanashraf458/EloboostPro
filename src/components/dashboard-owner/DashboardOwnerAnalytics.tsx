import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaUsers, FaMoneyBillWave, FaChartLine, FaCheckCircle, 
  FaExchangeAlt, FaCalendarAlt, FaArrowUp, FaArrowDown,
  FaEllipsisH, FaUsersCog, FaTrophy, FaMedal, FaGamepad, FaCrown, FaLevelUpAlt,
  FaSmile, FaChartPie
} from 'react-icons/fa';
import { motion } from 'framer-motion';

// Import from the index file
import {
  AnalyticsHeader,
  StatsCards,
  RevenueChart,
  OrdersOverviewChart,
  ConversionChart,
  GameDistributionChart,
  BoosterPerformanceTable,
  CustomerSatisfactionChart
} from './analytics';

const DashboardOwnerAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('month');
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // Update time range
  const handleTimeRangeChange = (range: 'day' | 'week' | 'month') => {
    setIsLoading(true);
    setTimeRange(range);
    
    // Simulate loading new data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  // Handle refresh data
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate loading fresh data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Here you would fetch new data from API
    console.log('Refreshing data for timeRange:', timeRange);
  };

  return (
    <Container>
      {/* Page header with controls */}
      <AnalyticsHeader 
        timeRange={timeRange} 
        onTimeRangeChange={handleTimeRangeChange} 
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      
      {/* Stats cards */}
      <StatsCards isLoading={isLoading} timeRange={timeRange} />
      
      {/* Main charts */}
      <MainChartsGrid>
        <RevenueChart isLoading={isLoading} timeRange={timeRange} />
        <OrdersOverviewChart isLoading={isLoading} timeRange={timeRange} />
      </MainChartsGrid>
      
      {/* Secondary charts */}
      <SecondaryChartsGrid>
        <CombinedMetricsSection isLoading={isLoading} timeRange={timeRange} />
        <ServiceDistributionSection isLoading={isLoading} />
      </SecondaryChartsGrid>
      
      {/* Booster performance table */}
      <BoosterPerformanceTable isLoading={isLoading} />
    </Container>
  );
};

// Combined Metrics Section (Conversion Rate + Customer Satisfaction)
const CombinedMetricsSection: React.FC<{isLoading: boolean, timeRange: string}> = ({ isLoading, timeRange }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Performance Metrics</ChartTitle>
      </ChartHeader>
      
      <ChartContent>
        {isLoading ? (
          <LoadingIndicator>Loading metrics data...</LoadingIndicator>
        ) : (
          <MetricsContainer>
            <MetricSection>
              <MetricTitle>
                <MetricIcon><FaExchangeAlt /></MetricIcon>
                <span>Conversion Rate</span>
              </MetricTitle>
              <MetricValue>32.5%</MetricValue>
              <MetricTrend $positive={true}>
                <FaArrowUp /> 4.2% from last {timeRange}
              </MetricTrend>
              
              <MetricsProgressContainer>
                <MetricProgressLabel>
                  <span>Current</span>
                  <span>32.5%</span>
                </MetricProgressLabel>
                <MetricProgressBar $percentage={32.5} $color="#4c6ef5" />
                
                <MetricProgressLabel>
                  <span>Target</span>
                  <span>40%</span>
                </MetricProgressLabel>
                <MetricProgressBar $percentage={40} $color="#4c6ef5" $isDashed={true} />
              </MetricsProgressContainer>
            </MetricSection>
            
            <MetricDivider />
            
            <MetricSection>
              <MetricTitle>
                <MetricIcon><FaSmile /></MetricIcon>
                <span>Customer Satisfaction</span>
              </MetricTitle>
              <MetricValue>4.7<MetricSmall>/5</MetricSmall></MetricValue>
              <MetricTrend $positive={true}>
                <FaArrowUp /> 0.3 from last {timeRange}
              </MetricTrend>
              
              <SatisfactionRatings>
                <RatingItem>
                  <RatingLabel>5★</RatingLabel>
                  <RatingBar $percentage={72} $color="#2ecc71" />
                  <RatingPercentage>72%</RatingPercentage>
                </RatingItem>
                <RatingItem>
                  <RatingLabel>4★</RatingLabel>
                  <RatingBar $percentage={21} $color="#3498db" />
                  <RatingPercentage>21%</RatingPercentage>
                </RatingItem>
                <RatingItem>
                  <RatingLabel>3★</RatingLabel>
                  <RatingBar $percentage={5} $color="#f39c12" />
                  <RatingPercentage>5%</RatingPercentage>
                </RatingItem>
                <RatingItem>
                  <RatingLabel>2★</RatingLabel>
                  <RatingBar $percentage={2} $color="#e67e22" />
                  <RatingPercentage>2%</RatingPercentage>
                </RatingItem>
                <RatingItem>
                  <RatingLabel>1★</RatingLabel>
                  <RatingBar $percentage={0} $color="#e74c3c" />
                  <RatingPercentage>0%</RatingPercentage>
                </RatingItem>
              </SatisfactionRatings>
            </MetricSection>
          </MetricsContainer>
        )}
      </ChartContent>
    </ChartContainer>
  );
};

// Service Distribution Component to replace Game Distribution
const ServiceDistributionSection: React.FC<{isLoading: boolean}> = ({ isLoading }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>League of Legends Service Distribution</ChartTitle>
      </ChartHeader>
      
      <ChartContent>
        {isLoading ? (
          <LoadingIndicator>Loading...</LoadingIndicator>
        ) : (
          <ServicesList>
            <ServiceItem>
              <ServiceIcon><FaTrophy /></ServiceIcon>
              <ServiceDetails>
                <ServiceName>Division Boosting</ServiceName>
                <ServicePercentage>42%</ServicePercentage>
              </ServiceDetails>
              <ServiceProgressBar percentage={42} />
            </ServiceItem>
            
            <ServiceItem>
              <ServiceIcon><FaMedal /></ServiceIcon>
              <ServiceDetails>
                <ServiceName>Placement Matches</ServiceName>
                <ServicePercentage>18%</ServicePercentage>
              </ServiceDetails>
              <ServiceProgressBar percentage={18} />
            </ServiceItem>
            
            <ServiceItem>
              <ServiceIcon><FaTrophy /></ServiceIcon>
              <ServiceDetails>
                <ServiceName>Ranked Net Wins</ServiceName>
                <ServicePercentage>15%</ServicePercentage>
              </ServiceDetails>
              <ServiceProgressBar percentage={15} />
            </ServiceItem>
            
            <ServiceItem>
              <ServiceIcon><FaGamepad /></ServiceIcon>
              <ServiceDetails>
                <ServiceName>Normal Games</ServiceName>
                <ServicePercentage>10%</ServicePercentage>
              </ServiceDetails>
              <ServiceProgressBar percentage={10} />
            </ServiceItem>
            
            <ServiceItem>
              <ServiceIcon><FaCrown /></ServiceIcon>
              <ServiceDetails>
                <ServiceName>Champion Mastery</ServiceName>
                <ServicePercentage>8%</ServicePercentage>
              </ServiceDetails>
              <ServiceProgressBar percentage={8} />
            </ServiceItem>
            
            <ServiceItem>
              <ServiceIcon><FaLevelUpAlt /></ServiceIcon>
              <ServiceDetails>
                <ServiceName>Account Leveling</ServiceName>
                <ServicePercentage>7%</ServicePercentage>
              </ServiceDetails>
              <ServiceProgressBar percentage={7} />
            </ServiceItem>
          </ServicesList>
        )}
      </ChartContent>
    </ChartContainer>
  );
};

// Styles
const Container = styled(motion.div)`
  padding: 0;
  width: 100%;
`;

const MainChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const SecondaryChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

// Common Styles
const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.textLight};
  font-style: italic;
`;

// Chart Container Styles
const ChartContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border}66;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const ChartContent = styled.div`
  padding: 1.5rem;
  min-height: 250px;
`;

// Combined Metrics Styles
const MetricsContainer = styled.div`
  display: flex;
  min-height: 300px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MetricSection = styled.div`
  flex: 1;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const MetricDivider = styled.div`
  width: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 0 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    height: 1px;
    margin: 1.5rem 0;
  }
`;

const MetricTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textLight};
`;

const MetricIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
`;

const MetricSmall = styled.span`
  font-size: 1rem;
  margin-left: 0.25rem;
  opacity: 0.7;
`;

const MetricTrend = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: ${({ $positive, theme }) => $positive ? theme.success : theme.danger};
  margin-bottom: 1.5rem;
`;

const MetricsProgressContainer = styled.div`
  margin-top: auto;
`;

const MetricProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.textLight};
`;

const MetricProgressBar = styled.div<{ $percentage: number; $color: string; $isDashed?: boolean }>`
  height: 6px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 3px;
  position: relative;
  margin-bottom: 1rem;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $percentage }) => `${$percentage}%`};
    background-color: ${({ $color }) => $color};
    border-radius: 3px;
    ${({ $isDashed, $color }) => $isDashed && `
      background: repeating-linear-gradient(
        to right,
        ${$color},
        ${$color} 5px,
        transparent 5px,
        transparent 8px
      );
    `}
  }
`;

// Satisfaction Rating Styles
const SatisfactionRatings = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RatingItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RatingLabel = styled.div`
  width: 30px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const RatingBar = styled.div<{ $percentage: number; $color: string }>`
  flex: 1;
  height: 6px;
  background-color: ${({ theme }) => theme.background};
  border-radius: 3px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ $percentage }) => `${$percentage}%`};
    background-color: ${({ $color }) => $color};
    border-radius: 3px;
  }
`;

const RatingPercentage = styled.div`
  width: 35px;
  font-size: 0.8rem;
  text-align: right;
`;

// Service Distribution Styles
const ServicesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const ServiceIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}20`};
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
`;

const ServiceDetails = styled.div`
  flex: 1;
`;

const ServiceName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const ServicePercentage = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const ServiceProgressBar = styled.div<{ percentage: number }>`
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: ${({ theme }) => `${theme.border}`};
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ percentage }) => `${percentage}%`};
    background-color: ${({ theme }) => theme.primary};
    border-radius: 2px;
  }
`;

export default DashboardOwnerAnalytics; 
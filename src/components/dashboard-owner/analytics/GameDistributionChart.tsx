import React from 'react';
import styled from 'styled-components';
import { Skeleton } from '../../../components/ui/Skeleton';
import { FaTrophy, FaMedal, FaGamepad, FaCrown, FaLevelUpAlt, FaUsers } from 'react-icons/fa';
import { GiCrossedSwords } from 'react-icons/gi';

interface GameDistributionChartProps {
  isLoading: boolean;
}

const GameDistributionChart: React.FC<GameDistributionChartProps> = ({ isLoading }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>League of Legends Service Distribution</ChartTitle>
      </ChartHeader>
      
      <ChartContent>
        {isLoading ? (
          <Skeleton height="200px" />
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

export default GameDistributionChart; 
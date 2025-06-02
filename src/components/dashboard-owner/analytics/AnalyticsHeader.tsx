import React from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaChartLine, FaDownload, FaRedoAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface AnalyticsHeaderProps {
  timeRange: 'day' | 'week' | 'month';
  onTimeRangeChange: (range: 'day' | 'week' | 'month') => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({ 
  timeRange, 
  onTimeRangeChange,
  isLoading,
  onRefresh
}) => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <TitleSection>
          <IconWrapper>
            <FaChartLine />
          </IconWrapper>
          <div>
            <Title>Analytics Dashboard</Title>
            <Subtitle>Monitor League of Legends boosting service performance and trends</Subtitle>
          </div>
        </TitleSection>
        
        <HeaderActions>
          <TimeRangeSelector>
            <TimeRangeTitle>
              <FaCalendarAlt />
              <span>Time Range:</span>
            </TimeRangeTitle>
            <TimeRangeOptions>
              <TimeOption 
                onClick={() => onTimeRangeChange('day')} 
                $active={timeRange === 'day'}
                disabled={isLoading}
              >
                Day
              </TimeOption>
              <TimeOption 
                onClick={() => onTimeRangeChange('week')} 
                $active={timeRange === 'week'}
                disabled={isLoading}
              >
                Week
              </TimeOption>
              <TimeOption 
                onClick={() => onTimeRangeChange('month')} 
                $active={timeRange === 'month'}
                disabled={isLoading}
              >
                Month
              </TimeOption>
            </TimeRangeOptions>
          </TimeRangeSelector>
          
          <ActionButtons>
            <ActionButton title="Export Report">
              <FaDownload />
              <span>Export</span>
            </ActionButton>
            <ActionButton 
              title="Refresh Data" 
              $isLoading={isLoading}
              onClick={onRefresh}
              disabled={isLoading}
            >
              <motion.div
                animate={{ rotate: isLoading ? 360 : 0 }}
                transition={{ repeat: isLoading ? Infinity : 0, duration: 1 }}
              >
                <FaRedoAlt />
              </motion.div>
              <span>Refresh</span>
            </ActionButton>
          </ActionButtons>
        </HeaderActions>
      </HeaderContent>
      
      <DateInfoBar>
        <DateInfo>
          {getFormattedDateRange(timeRange)}
        </DateInfo>
      </DateInfoBar>
    </HeaderContainer>
  );
};

// Helper function to get formatted date range
const getFormattedDateRange = (timeRange: 'day' | 'week' | 'month'): string => {
  const now = new Date();
  
  // Complete formatter with time
  const formatter = new Intl.DateTimeFormat('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Always return just the current date with time, regardless of timeRange
  return formatter.format(now);
};

// Styles
const HeaderContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.textLight};
  margin: 0.25rem 0 0 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const TimeRangeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.textLight};
  font-weight: 500;
  
  svg {
    font-size: 0.9rem;
  }
`;

const TimeRangeOptions = styled.div`
  display: flex;
  background: ${({ theme }) => theme.background}66;
  border-radius: 0.75rem;
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const TimeOption = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.text};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${({ $active, theme }) => $active ? theme.primary : theme.hover};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ActionButton = styled.button<{ $isLoading?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ $isLoading, theme }) => $isLoading ? `${theme.primary}11` : theme.cardBg};
  color: ${({ $isLoading, theme }) => $isLoading ? theme.primary : theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const DateInfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: ${({ theme }) => theme.shadow};
`;

const DateInfo = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    margin-right: 0.75rem;
  }
`;

export default AnalyticsHeader; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChartBar, FaChartArea } from 'react-icons/fa';
import { Skeleton } from '../../../components/ui/Skeleton';

interface RevenueChartProps {
  isLoading: boolean;
  timeRange: 'day' | 'week' | 'month' | 'year';
}

const RevenueChart: React.FC<RevenueChartProps> = ({ isLoading, timeRange }) => {
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar');
  
  // Mock data based on time range
  const data = {
    day: [1200, 1850, 2100, 1750, 1900, 2300, 2650],
    week: [11400, 12500, 10800, 13200, 15600, 14800, 16200, 17500],
    month: [28500, 32700, 29800, 36500, 42000, 38500, 44200, 47500, 45000, 48800, 52500, 58000],
    year: [340000, 385000, 410000, 398000, 425000, 456000, 480000, 510000, 495000, 520000, 580000, 630000]
  };
  
  const currentData = data[timeRange];
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get appropriate chart labels based on time range
  const getLabels = () => {
    switch (timeRange) {
      case 'day':
        return ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
      case 'week':
        return days;
      case 'month':
        // Days of month
        return Array.from({ length: currentData.length }, (_, i) => (i + 1).toString());
      case 'year':
        return months;
    }
  };
  
  const labels = getLabels();
  
  // Calculate maximum value for the chart
  const maxValue = Math.max(...currentData);
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Revenue Analysis</ChartTitle>
        <ChartControls>
          <ChartTypeToggle>
            <ChartTypeButton
              $active={chartType === 'bar'}
              onClick={() => setChartType('bar')}
            >
              <FaChartBar />
            </ChartTypeButton>
            <ChartTypeButton
              $active={chartType === 'area'}
              onClick={() => setChartType('area')}
            >
              <FaChartArea />
            </ChartTypeButton>
          </ChartTypeToggle>
        </ChartControls>
      </ChartHeader>
      
      <ChartContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ChartCanvas>
            {chartType === 'bar' ? (
              // Bar chart
              <BarChart>
                {currentData.map((value, index) => (
                  <BarGroup key={index}>
                    <BarContainer>
                      <Bar
                        initial={{ height: 0 }}
                        animate={{ height: `${(value / maxValue) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                      />
                    </BarContainer>
                    <BarLabel>{labels[index]}</BarLabel>
                  </BarGroup>
                ))}
              </BarChart>
            ) : (
              // Area chart
              <AreaChart>
                <AreaPath>
                  <svg width="100%" height="100%" viewBox={`0 0 ${currentData.length * 40} 100`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`
                        M 0 ${100 - (currentData[0] / maxValue) * 100}
                        ${currentData.map((value, i) => `L ${i * 40} ${100 - (value / maxValue) * 100}`).join(' ')}
                        L ${(currentData.length - 1) * 40} 100
                        L 0 100
                        Z
                      `}
                      fill="url(#areaGradient)"
                    />
                    <path
                      d={`
                        M 0 ${100 - (currentData[0] / maxValue) * 100}
                        ${currentData.map((value, i) => `L ${i * 40} ${100 - (value / maxValue) * 100}`).join(' ')}
                      `}
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      fill="none"
                    />
                    {currentData.map((value, i) => (
                      <circle
                        key={i}
                        cx={i * 40}
                        cy={100 - (value / maxValue) * 100}
                        r="4"
                        fill="#8B5CF6"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>
                </AreaPath>
                <AreaLabels>
                  {labels.map((label, index) => (
                    <AreaLabel key={index}>{label}</AreaLabel>
                  ))}
                </AreaLabels>
              </AreaChart>
            )}
            
            {/* Y-axis values */}
            <ChartYAxis>
              <YAxisLabel>${Math.round(maxValue).toLocaleString()}</YAxisLabel>
              <YAxisLabel>${Math.round(maxValue * 0.75).toLocaleString()}</YAxisLabel>
              <YAxisLabel>${Math.round(maxValue * 0.5).toLocaleString()}</YAxisLabel>
              <YAxisLabel>${Math.round(maxValue * 0.25).toLocaleString()}</YAxisLabel>
              <YAxisLabel>$0</YAxisLabel>
            </ChartYAxis>
          </ChartCanvas>
        )}
      </ChartContent>
      
      <ChartFooter>
        <ChartSummary>
          <SummaryTitle>Total Revenue</SummaryTitle>
          <SummaryValue>${(currentData.reduce((a, b) => a + b, 0)).toLocaleString()}</SummaryValue>
        </ChartSummary>
        
        <ChartSummary>
          <SummaryTitle>Average Revenue</SummaryTitle>
          <SummaryValue>${Math.round(currentData.reduce((a, b) => a + b, 0) / currentData.length).toLocaleString()}</SummaryValue>
        </ChartSummary>
      </ChartFooter>
    </ChartContainer>
  );
};

// Loading component
const ChartSkeleton = () => (
  <SkeletonContainer>
    <Skeleton height="250px" />
  </SkeletonContainer>
);

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

const ChartControls = styled.div`
  display: flex;
  align-items: center;
`;

const ChartTypeToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.background}66;
  border-radius: 0.5rem;
  padding: 0.25rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ChartTypeButton = styled.button<{ $active: boolean }>`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, theme }) => $active ? theme.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? 'white' : theme.text};
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ $active, theme }) => $active ? theme.primary : theme.hover};
  }
`;

const ChartContent = styled.div`
  padding: 1.5rem;
  height: 300px;
  position: relative;
`;

const SkeletonContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const ChartCanvas = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  position: relative;
`;

const ChartYAxis = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 0.5rem;
  z-index: 10;
`;

const YAxisLabel = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.textLight};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    right: -0.5rem;
    top: 50%;
    width: 20rem;
    height: 1px;
    background: ${({ theme }) => theme.border}33;
    z-index: -1;
  }
`;

const BarChart = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding-left: 3rem;
`;

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
`;

const BarContainer = styled.div`
  display: flex;
  align-items: flex-end;
  height: calc(100% - 2rem);
  width: 100%;
  justify-content: center;
`;

const Bar = styled(motion.div)`
  width: 70%;
  max-width: 2rem;
  background: linear-gradient(to top, #8B5CF6, #6366F1);
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 4px 6px rgba(99, 102, 241, 0.2);
  
  &:hover {
    background: linear-gradient(to top, #8B5CF6, #A78BFA);
  }
`;

const BarLabel = styled.div`
  text-align: center;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.textLight};
  margin-top: 0.5rem;
  width: 100%;
`;

const AreaChart = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 3rem;
  display: flex;
  flex-direction: column;
`;

const AreaPath = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
`;

const AreaLabels = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  height: 1.5rem;
`;

const AreaLabel = styled.div`
  text-align: center;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.textLight};
  flex: 1;
`;

const ChartFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border}66;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ChartSummary = styled.div`
  text-align: center;
  flex: 1;
  
  &:first-child {
    border-right: 1px solid ${({ theme }) => theme.border}66;
  }
  
  @media (max-width: 576px) {
    &:first-child {
      border-right: none;
      border-bottom: 1px solid ${({ theme }) => theme.border}66;
      padding-bottom: 1rem;
    }
  }
`;

const SummaryTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textLight};
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(to right, #8B5CF6, #4FD1C5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export default RevenueChart; 
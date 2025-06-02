import React from 'react';
import styled from 'styled-components';
import { Skeleton } from '../../../components/ui/Skeleton';

interface ConversionChartProps {
  isLoading: boolean;
  timeRange: 'day' | 'week' | 'month' | 'year';
}

const ConversionChart: React.FC<ConversionChartProps> = ({ isLoading, timeRange }) => {
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Conversion Rate</ChartTitle>
      </ChartHeader>
      
      <ChartContent>
        {isLoading ? (
          <Skeleton height="200px" />
        ) : (
          <div>
            {/* Here will be the conversion rate chart content */}
            <MockChart>
              <MockText>Conversion Rate: 35.8%</MockText>
            </MockChart>
          </div>
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
  height: 250px;
`;

const MockChart = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background}33;
  border-radius: 0.5rem;
`;

const MockText = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

export default ConversionChart; 
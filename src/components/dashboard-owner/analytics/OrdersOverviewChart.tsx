import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPizzaSlice, FaTrophy, FaGraduationCap, FaGamepad, FaCrown, FaLevelUpAlt, FaMedal, FaUsers } from 'react-icons/fa';
import { Skeleton } from '../../../components/ui/Skeleton';

interface OrdersOverviewChartProps {
  isLoading: boolean;
  timeRange: 'day' | 'week' | 'month';
}

// Different colors for the pie chart
const pieColors = [
  { main: '#8B5CF6', light: '#A78BFA', dark: '#6D28D9' }, // Purple
  { main: '#4FD1C5', light: '#76E4DA', dark: '#2C7A7B' }, // Turquoise
  { main: '#F59E0B', light: '#FBBF24', dark: '#B45309' }, // Orange
  { main: '#EC4899', light: '#F9A8D4', dark: '#BE185D' }, // Pink
  { main: '#10B981', light: '#34D399', dark: '#047857' }, // Green
  { main: '#3B82F6', light: '#60A5FA', dark: '#1E40AF' }, // Blue
];

const OrdersOverviewChart: React.FC<OrdersOverviewChartProps> = ({ isLoading, timeRange }) => {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  
  // Data based on time range - now focusing only on League of Legends service types
  const data = {
    day: [
      { name: 'Division Boosting', value: 25, percentage: 42, icon: <FaTrophy /> },
      { name: 'Placement Matches', value: 11, percentage: 18, icon: <FaMedal /> },
      { name: 'Ranked Net Wins', value: 9, percentage: 15, icon: <FaTrophy /> },
      { name: 'Normal Games', value: 6, percentage: 10, icon: <FaGamepad /> },
      { name: 'Champion Mastery', value: 5, percentage: 8, icon: <FaCrown /> },
      { name: 'Account Leveling', value: 4, percentage: 7, icon: <FaLevelUpAlt /> }
    ],
    week: [
      { name: 'Division Boosting', value: 127, percentage: 42, icon: <FaTrophy /> },
      { name: 'Placement Matches', value: 55, percentage: 18, icon: <FaMedal /> },
      { name: 'Ranked Net Wins', value: 46, percentage: 15, icon: <FaTrophy /> },
      { name: 'Normal Games', value: 30, percentage: 10, icon: <FaGamepad /> },
      { name: 'Champion Mastery', value: 24, percentage: 8, icon: <FaCrown /> },
      { name: 'Account Leveling', value: 21, percentage: 7, icon: <FaLevelUpAlt /> }
    ],
    month: [
      { name: 'Division Boosting', value: 365, percentage: 42, icon: <FaTrophy /> },
      { name: 'Placement Matches', value: 157, percentage: 18, icon: <FaMedal /> },
      { name: 'Ranked Net Wins', value: 131, percentage: 15, icon: <FaTrophy /> },
      { name: 'Normal Games', value: 87, percentage: 10, icon: <FaGamepad /> },
      { name: 'Champion Mastery', value: 70, percentage: 8, icon: <FaCrown /> },
      { name: 'Account Leveling', value: 60, percentage: 7, icon: <FaLevelUpAlt /> }
    ]
  };
  
  const currentData = data[timeRange];
  const totalOrders = 870; // Fixed total as provided by user
  
  // Calculate rotation angles for pie chart
  const calculateRotation = (index: number): number => {
    let rotation = 0;
    for (let i = 0; i < index; i++) {
      rotation += currentData[i].percentage * 3.6; // Convert percentage to degrees (360 / 100 = 3.6)
    }
    return rotation;
  };
  
  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Orders Overview</ChartTitle>
      </ChartHeader>
      
      <ChartContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : (
          <ChartLayout>
            <PieChartContainer>
              <PieChart>
                {currentData.map((item, index) => (
                  <PieSegment
                    key={index}
                    $percentage={item.percentage}
                    $rotation={calculateRotation(index)}
                    $color={pieColors[index % pieColors.length].main}
                    $isHovered={hoveredSegment === index}
                    onMouseEnter={() => setHoveredSegment(index)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  />
                ))}
                <PieCenter>
                  <PieTotal>{totalOrders}</PieTotal>
                  <PieLabel>Total Orders</PieLabel>
                </PieCenter>
              </PieChart>
            </PieChartContainer>
            
            <LegendContainer>
              {currentData.map((item, index) => (
                <LegendItem 
                  key={index}
                  $isHovered={hoveredSegment === index}
                  onMouseEnter={() => setHoveredSegment(index)}
                  onMouseLeave={() => setHoveredSegment(null)}
                >
                  <LegendColor $color={pieColors[index % pieColors.length].main} />
                  <LegendInfo>
                    <LegendName>{item.name}</LegendName>
                    <LegendValue>
                      <span>{item.value}</span>
                      <LegendPercentage>{item.percentage}%</LegendPercentage>
                    </LegendValue>
                  </LegendInfo>
                </LegendItem>
              ))}
            </LegendContainer>
          </ChartLayout>
        )}
      </ChartContent>
      
      <ChartFooter>
        <ServiceCard>
          <ServiceIcon $color={pieColors[0].light} $bgColor={pieColors[0].dark}>
            <FaTrophy />
          </ServiceIcon>
          <ServiceInfo>
            <ServiceTitle>Boosting</ServiceTitle>
            <ServiceValue>566 <small>orders</small></ServiceValue>
          </ServiceInfo>
          <ServicePercentage $color={pieColors[0].main}>65%</ServicePercentage>
        </ServiceCard>
        
        <ServiceCard>
          <ServiceIcon $color={pieColors[1].light} $bgColor={pieColors[1].dark}>
            <FaGraduationCap />
          </ServiceIcon>
          <ServiceInfo>
            <ServiceTitle>Coaching</ServiceTitle>
            <ServiceValue>305 <small>orders</small></ServiceValue>
          </ServiceInfo>
          <ServicePercentage $color={pieColors[1].main}>35%</ServicePercentage>
        </ServiceCard>
      </ChartFooter>
    </ChartContainer>
  );
};

// Loading component
const ChartSkeleton = () => (
  <SkeletonContainer>
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Skeleton width="200px" height="200px" borderRadius="50%" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
        <Skeleton height="2rem" />
      </div>
    </div>
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

const ChartContent = styled.div`
  padding: 1.25rem;
  flex: 1;
`;

const SkeletonContainer = styled.div`
  padding: 1rem;
`;

const ChartLayout = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PieChartContainer = styled.div`
  flex-shrink: 0;
  margin-right: 0.5rem;
`;

const PieChart = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin-bottom: 1rem;
`;

const PieSegment = styled.div<{ 
  $percentage: number; 
  $rotation: number; 
  $color: string;
  $isHovered: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: transform 0.2s ease;
  transform: ${({ $isHovered }) => $isHovered ? 'scale(1.05)' : 'scale(1)'} rotate(${({ $rotation }) => $rotation}deg);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ $color }) => $color};
    clip-path: polygon(
      50% 50%,
      50% 0%,
      ${({ $percentage }) => {
        const degrees = $percentage * 3.6; // 3.6 = 360 / 100
        if (degrees <= 90) {
          const x = 50 + 50 * Math.tan(degrees * Math.PI / 180);
          return `${x}% 0%`;
        } else if (degrees <= 180) {
          return '100% 0%, 100% ${50 - 50 * Math.tan((180 - degrees) * Math.PI / 180)}%';
        } else if (degrees <= 270) {
          return '100% 0%, 100% 100%, ${50 + 50 * Math.tan((degrees - 180) * Math.PI / 180)}% 100%';
        } else {
          return '100% 0%, 100% 100%, 0% 100%, 0% ${50 - 50 * Math.tan((360 - degrees) * Math.PI / 180)}%';
        }
      }}
    );
  }
`;

const PieCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const PieTotal = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
  line-height: 1;
  margin-bottom: 0.1rem;
`;

const PieLabel = styled.div`
  font-size: 0.65rem;
  color: ${({ theme }) => theme.textLight};
  white-space: nowrap;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  flex: 1;
  padding-top: 0.25rem;
`;

const LegendItem = styled.div<{ $isHovered: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  background-color: ${({ $isHovered, theme }) => $isHovered ? theme.hover : 'transparent'};
  cursor: pointer;
`;

const LegendColor = styled.div<{ $color: string }>`
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.2rem;
  background-color: ${({ $color }) => $color};
`;

const LegendInfo = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LegendName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const LegendValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.textLight};
`;

const LegendPercentage = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  min-width: 2.5rem;
  text-align: right;
`;

const ChartFooter = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.border}66;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const ServiceCard = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.background}33;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ServiceIcon = styled.div<{ $color: string; $bgColor: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ $bgColor }) => $bgColor};
  color: ${({ $color }) => $color};
  font-size: 1.2rem;
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ServiceValue = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  
  small {
    font-weight: 400;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.textLight};
  }
`;

const ServicePercentage = styled.div<{ $color: string }>`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ $color }) => $color};
`;

export default OrdersOverviewChart; 
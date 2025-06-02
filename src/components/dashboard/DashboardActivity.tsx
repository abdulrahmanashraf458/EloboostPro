import React from 'react';
import styled from 'styled-components';

interface BoosterActivityData {
  name: string;
  status: string;
  activity: string;
  time: string;
}

interface DashboardActivityProps {
  activityData: BoosterActivityData;
}

const DashboardActivity: React.FC<DashboardActivityProps> = ({ activityData }) => {
  if (!activityData) return null;
  
  return (
    <BoosterActivity>
      <BoosterStatus status={activityData.status} />
      <BoosterInfo>
        <BoosterName>{activityData.name}</BoosterName>
        <BoosterLastActivity>
          {activityData.activity} <TimeAgo>{activityData.time}</TimeAgo>
        </BoosterLastActivity>
      </BoosterInfo>
    </BoosterActivity>
  );
};

const BoosterActivity = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const BoosterStatus = styled.div<{ status: string }>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: ${({ status, theme }) => 
    status === 'online' ? theme.success : 
    status === 'away' ? theme.warning : theme.text}aa;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    border: 1px solid ${({ status, theme }) => 
      status === 'online' ? theme.success : 
      status === 'away' ? theme.warning : theme.text}55;
  }
`;

const BoosterInfo = styled.div`
  flex: 1;
`;

const BoosterName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const BoosterLastActivity = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
`;

const TimeAgo = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}77;
`;

export default DashboardActivity; 
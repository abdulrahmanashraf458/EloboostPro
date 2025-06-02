import React from 'react';
import styled from 'styled-components';
import { Skeleton } from '../../../components/ui/Skeleton';

interface BoosterPerformanceTableProps {
  isLoading: boolean;
}

const BoosterPerformanceTable: React.FC<BoosterPerformanceTableProps> = ({ isLoading }) => {
  // Mock booster data
  const boosters = [
    {
      id: 1,
      name: 'RankHero',
      ordersCompleted: 124,
      revenue: 9850,
      satisfaction: 98,
      status: 'active'
    },
    {
      id: 2,
      name: 'DiamondPro',
      ordersCompleted: 98,
      revenue: 8200,
      satisfaction: 96,
      status: 'active'
    },
    {
      id: 3,
      name: 'EloKing',
      ordersCompleted: 87,
      revenue: 7350,
      satisfaction: 94,
      status: 'away'
    },
    {
      id: 4,
      name: 'ChallengeCrusher',
      ordersCompleted: 76,
      revenue: 6420,
      satisfaction: 92,
      status: 'active'
    },
    {
      id: 5,
      name: 'GrandMaster42',
      ordersCompleted: 65,
      revenue: 5200,
      satisfaction: 91,
      status: 'inactive'
    }
  ];
  
  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>Top Booster Performance</TableTitle>
      </TableHeader>
      
      <TableContent>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <StyledTable>
            <thead>
              <tr>
                <th>Booster</th>
                <th>Completed Orders</th>
                <th>Revenue</th>
                <th>Customer Satisfaction</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {boosters.map(booster => (
                <tr key={booster.id}>
                  <td>
                    <BoosterInfo>
                      <BoosterAvatar>
                        {booster.name.substring(0, 2)}
                      </BoosterAvatar>
                      <BoosterName>{booster.name}</BoosterName>
                    </BoosterInfo>
                  </td>
                  <td>{booster.ordersCompleted}</td>
                  <td>${booster.revenue}</td>
                  <td>
                    <SatisfactionContainer>
                      <SatisfactionBar>
                        <SatisfactionFill width={booster.satisfaction} />
                      </SatisfactionBar>
                      <SatisfactionText>{booster.satisfaction}%</SatisfactionText>
                    </SatisfactionContainer>
                  </td>
                  <td>
                    <StatusBadge $status={booster.status as 'active' | 'away' | 'inactive'}>
                      {booster.status === 'active' ? 'Active' : 
                       booster.status === 'away' ? 'Away' : 'Inactive'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        )}
      </TableContent>
    </TableContainer>
  );
};

// Loading skeleton component
const TableSkeleton = () => (
  <SkeletonContainer>
    <Skeleton height="2.5rem" margin="0 0 1rem 0" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} height="3rem" margin="0.5rem 0" />
    ))}
  </SkeletonContainer>
);

// Styles
const TableContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border}66;
`;

const TableTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const TableContent = styled.div`
  padding: 0 1.5rem 1.5rem;
  overflow-x: auto;
`;

const SkeletonContainer = styled.div`
  padding: 1rem 0;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: right;
  }
  
  th {
    color: ${({ theme }) => theme.textLight};
    font-weight: 600;
    font-size: 0.875rem;
    border-bottom: 1px solid ${({ theme }) => theme.border}66;
  }
  
  tbody tr {
    border-bottom: 1px solid ${({ theme }) => theme.border}33;
    transition: background 0.2s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: ${({ theme }) => theme.hover};
    }
  }
`;

const BoosterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BoosterAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: linear-gradient(135deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const BoosterName = styled.div`
  font-weight: 600;
`;

const SatisfactionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SatisfactionBar = styled.div`
  width: 80px;
  height: 0.5rem;
  background: ${({ theme }) => theme.border}66;
  border-radius: 0.25rem;
  overflow: hidden;
`;

const SatisfactionFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: linear-gradient(to right, #4FD1C5, #38B2AC);
  border-radius: 0.25rem;
`;

const SatisfactionText = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const StatusBadge = styled.div<{ $status: 'active' | 'away' | 'inactive' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${({ $status }) => {
    switch ($status) {
      case 'active':
        return `
          background: rgba(72, 187, 120, 0.1);
          color: #48BB78;
        `;
      case 'away':
        return `
          background: rgba(246, 173, 85, 0.1);
          color: #F6AD55;
        `;
      case 'inactive':
        return `
          background: rgba(160, 174, 192, 0.1);
          color: #A0AEC0;
        `;
    }
  }}
`;

export default BoosterPerformanceTable; 
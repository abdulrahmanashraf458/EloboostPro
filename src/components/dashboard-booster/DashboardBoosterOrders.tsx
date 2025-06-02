import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTasks, FaFilter, FaSearch, FaEye, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DashboardBoosterOrders: React.FC = () => {
  const [orders, setOrders] = useState([
    { 
      id: 'ORD-123456', 
      game: 'League of Legends', 
      type: 'Solo Boost', 
      from: 'Silver II', 
      to: 'Gold IV', 
      client: 'Anonymous', 
      deadline: '2 days', 
      progress: 35,
      status: 'In Progress'
    },
    { 
      id: 'ORD-789012', 
      game: 'Valorant', 
      type: 'Rank Boost', 
      from: 'Bronze III', 
      to: 'Silver II', 
      client: 'Anonymous', 
      deadline: '5 days', 
      progress: 20,
      status: 'In Progress'
    },
    { 
      id: 'ORD-345678', 
      game: 'League of Legends', 
      type: 'Duo Boost', 
      from: 'Gold III', 
      to: 'Platinum IV', 
      client: 'Anonymous', 
      deadline: '7 days', 
      progress: 15,
      status: 'Pending'
    },
    { 
      id: 'ORD-901234', 
      game: 'Wild Rift', 
      type: 'Placement Matches', 
      from: 'Unranked', 
      to: '10 Games', 
      client: 'Anonymous', 
      deadline: '4 days', 
      progress: 60,
      status: 'In Progress'
    },
  ]);
  
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filterStatus !== 'all' && order.status.toLowerCase() !== filterStatus) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.game.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.type.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader>
        <PageTitle>
          <FaTasks /> Active Orders
        </PageTitle>
        <SearchFilterContainer>
          <SearchBox>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchBox>
          <FilterButtons>
            <FilterButton 
              $active={filterStatus === 'all'} 
              onClick={() => handleStatusFilter('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              $active={filterStatus === 'in progress'} 
              onClick={() => handleStatusFilter('in progress')}
            >
              In Progress
            </FilterButton>
            <FilterButton 
              $active={filterStatus === 'pending'} 
              onClick={() => handleStatusFilter('pending')}
            >
              Pending
            </FilterButton>
          </FilterButtons>
        </SearchFilterContainer>
      </PageHeader>
      
      <OrdersTable>
        <OrdersTableHead>
          <OrdersTableRow>
            <OrdersTableHeader>Order ID</OrdersTableHeader>
            <OrdersTableHeader>Game</OrdersTableHeader>
            <OrdersTableHeader>Type</OrdersTableHeader>
            <OrdersTableHeader>From</OrdersTableHeader>
            <OrdersTableHeader>To</OrdersTableHeader>
            <OrdersTableHeader>Status</OrdersTableHeader>
            <OrdersTableHeader>Deadline</OrdersTableHeader>
            <OrdersTableHeader>Progress</OrdersTableHeader>
            <OrdersTableHeader>Actions</OrdersTableHeader>
          </OrdersTableRow>
        </OrdersTableHead>
        <OrdersTableBody>
          {isLoading ? (
            <OrdersTableRow>
              <OrdersTableDataLoading colSpan={9}>
                <FaSpinner className="spinning" /> Loading orders...
              </OrdersTableDataLoading>
            </OrdersTableRow>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrdersTableRow key={order.id}>
                <OrdersTableData>
                  <OrderId>{order.id}</OrderId>
                </OrdersTableData>
                <OrdersTableData>{order.game}</OrdersTableData>
                <OrdersTableData>{order.type}</OrdersTableData>
                <OrdersTableData>{order.from}</OrdersTableData>
                <OrdersTableData>{order.to}</OrdersTableData>
                <OrdersTableData>
                  <StatusBadge $status={order.status.toLowerCase()}>
                    {order.status}
                  </StatusBadge>
                </OrdersTableData>
                <OrdersTableData>{order.deadline}</OrdersTableData>
                <OrdersTableData>
                  <ProgressBarWrapper>
                    <ProgressBar style={{ width: `${order.progress}%` }} />
                    <ProgressText>{order.progress}%</ProgressText>
                  </ProgressBarWrapper>
                </OrdersTableData>
                <OrdersTableData>
                  <ActionButton as={Link} to={`/booster/orders/${order.id}`}>
                    <FaEye /> View
                  </ActionButton>
                </OrdersTableData>
              </OrdersTableRow>
            ))
          ) : (
            <OrdersTableRow>
              <OrdersTableDataEmpty colSpan={9}>
                No orders matching your filters
              </OrdersTableDataEmpty>
            </OrdersTableRow>
          )}
        </OrdersTableBody>
      </OrdersTable>
    </Container>
  );
};

const Container = styled(motion.div)`
  width: 100%;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (min-width: 768px) {
    margin: 0;
  }
`;

const SearchFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchBox = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 768px) {
    width: 250px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textLight};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg || theme.cardBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme, $active }) => $active ? theme.primary : theme.border};
  background: ${({ theme, $active }) => $active ? `${theme.primary}22` : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme, $active }) => $active ? `${theme.primary}33` : theme.hover};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const OrdersTableHead = styled.thead`
  background: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const OrdersTableBody = styled.tbody``;

const OrdersTableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const OrdersTableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
  font-weight: 600;
  
  @media (max-width: 992px) {
    &:nth-child(5),
    &:nth-child(7) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(7) {
      display: none;
    }
  }
`;

const OrdersTableData = styled.td`
  padding: 1rem;
  
  @media (max-width: 992px) {
    &:nth-child(5),
    &:nth-child(7) {
      display: none;
    }
  }
  
  @media (max-width: 768px) {
    &:nth-child(3),
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(7) {
      display: none;
    }
  }
`;

const OrdersTableDataLoading = styled.td`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
  
  .spinning {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const OrdersTableDataEmpty = styled.td`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ theme, $status }) => 
    $status === 'completed' ? `${theme.success}22` :
    $status === 'in progress' ? `${theme.primary}22` :
    $status === 'pending' ? `${theme.warning}22` :
    `${theme.error}22`
  };
  color: ${({ theme, $status }) => 
    $status === 'completed' ? theme.success :
    $status === 'in progress' ? theme.primary :
    $status === 'pending' ? theme.warning :
    theme.error
  };
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

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => `${theme.primary}22`};
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    background: ${({ theme }) => `${theme.primary}33`};
  }
`;

export default DashboardBoosterOrders; 
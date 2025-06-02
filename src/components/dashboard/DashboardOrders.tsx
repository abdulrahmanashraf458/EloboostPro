import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaEllipsisV, FaCheckCircle, FaSpinner, FaClock, FaDownload } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { FiFilter, FiClock, FiCheckCircle, FiXCircle, FiPauseCircle, FiEye, FiMessageSquare, FiDownload } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ButtonProps, SelectionProps, StatusProps } from '../../styles/StyledComponentTypes';

// Define order type
interface Order {
  id: string;
  game: 'League of Legends' | 'Valorant' | 'Wild Rift';
  type: 'Solo Boost' | 'Duo Boost' | 'Placement Matches' | 'Coaching';
  currentRank?: string;
  targetRank?: string;
  matches?: number;
  price: number;
  status: 'active' | 'completed' | 'cancelled' | 'paused';
  progress: number;
  booster?: string;
  startDate: string;
  estimatedCompletion?: string;
  completionDate?: string;
}

const DashboardOrders: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Mock data - in a real app this would come from an API
  const orders: Order[] = [
    {
      id: 'ORD-1234',
      game: 'League of Legends',
      type: 'Solo Boost',
      currentRank: 'Silver II',
      targetRank: 'Gold IV',
      price: 45.99,
      status: 'active',
      progress: 65,
      booster: 'ProBooster123',
      startDate: '2023-08-12',
      estimatedCompletion: '2023-08-17'
    },
    {
      id: 'ORD-2345',
      game: 'Valorant',
      type: 'Duo Boost',
      currentRank: 'Bronze III',
      targetRank: 'Silver I',
      price: 38.50,
      status: 'completed',
      progress: 100,
      booster: 'ValorantMaster',
      startDate: '2023-07-28',
      completionDate: '2023-08-02'
    },
    {
      id: 'ORD-3456',
      game: 'League of Legends',
      type: 'Placement Matches',
      matches: 10,
      price: 65.75,
      status: 'active',
      progress: 30,
      booster: 'RankPusher',
      startDate: '2023-08-14',
      estimatedCompletion: '2023-08-20'
    },
    {
      id: 'ORD-4567',
      game: 'Wild Rift',
      type: 'Coaching',
      price: 25.00,
      status: 'cancelled',
      progress: 0,
      startDate: '2023-08-05'
    },
    {
      id: 'ORD-5678',
      game: 'Valorant',
      type: 'Solo Boost',
      currentRank: 'Gold II',
      targetRank: 'Platinum III',
      price: 89.99,
      status: 'completed',
      progress: 100,
      booster: 'AimGod',
      startDate: '2023-07-15',
      completionDate: '2023-07-25'
    },
    {
      id: 'ORD-6789',
      game: 'League of Legends',
      type: 'Solo Boost',
      currentRank: 'Platinum IV',
      targetRank: 'Diamond IV',
      price: 129.99,
      status: 'paused',
      progress: 45,
      booster: 'ChallengerSmurf',
      startDate: '2023-08-01',
      estimatedCompletion: 'On Hold'
    }
  ];
  
  // Filter orders based on active tab, search query and game filter
  useEffect(() => {
    let result = orders;
    
    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter(order => order.status === activeTab);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        order => 
          order.id.toLowerCase().includes(query) ||
          order.game.toLowerCase().includes(query) ||
          order.type.toLowerCase().includes(query) ||
          (order.booster && order.booster.toLowerCase().includes(query))
      );
    }
    
    // Filter by game
    if (selectedGame) {
      result = result.filter(order => order.game === selectedGame);
    }
    
    setFilteredOrders(result);
  }, [activeTab, searchQuery, selectedGame, orders]);
  
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'active':
        return 'var(--success)';
      case 'completed':
        return 'var(--primary)';
      case 'cancelled':
        return 'var(--error)';
      case 'paused':
        return 'var(--warning)';
      default:
        return 'var(--text)';
    }
  };
  
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'active':
        return <FaSpinner />;
      case 'completed':
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaCheckCircle />;
      case 'paused':
        return <FaClock />;
      default:
        return null;
    }
  };
  
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  return (
    <OrdersContainer>
      <OrdersHeader>
        <SectionTitle>My Orders</SectionTitle>
        <HeaderActions>
          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
          </SearchContainer>
          
          <FilterButton onClick={handleFilterToggle}>
            <FaFilter />
            <span>Filter</span>
          </FilterButton>
        </HeaderActions>
      </OrdersHeader>
      
      {isFilterOpen && (
        <FilterContainer>
          <FilterTitle>Filter By Game</FilterTitle>
          <FilterOptions>
            <FilterOption 
              isActive={selectedGame === null}
              onClick={() => setSelectedGame(null)}
            >
              All Games
            </FilterOption>
            <FilterOption 
              isActive={selectedGame === 'League of Legends'}
              onClick={() => setSelectedGame('League of Legends')}
            >
              League of Legends
            </FilterOption>
            <FilterOption 
              isActive={selectedGame === 'Valorant'}
              onClick={() => setSelectedGame('Valorant')}
            >
              Valorant
            </FilterOption>
            <FilterOption 
              isActive={selectedGame === 'Wild Rift'}
              onClick={() => setSelectedGame('Wild Rift')}
            >
              Wild Rift
            </FilterOption>
          </FilterOptions>
        </FilterContainer>
      )}
      
      <TabsContainer>
        <Tab 
          isActive={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </Tab>
        <Tab 
          isActive={activeTab === 'active'} 
          onClick={() => setActiveTab('active')}
        >
          Active
        </Tab>
        <Tab 
          isActive={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </Tab>
        <Tab 
          isActive={activeTab === 'cancelled'} 
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </Tab>
      </TabsContainer>
      
      <OrdersCount>
        Showing {filteredOrders.length} orders
      </OrdersCount>
      
      <OrdersList>
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id}>
              <OrderCardHeader>
                <OrderId>{order.id}</OrderId>
                <OrderStatus color={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </OrderStatus>
              </OrderCardHeader>
              
              <OrderDetails>
                <OrderDetail>
                  <OrderDetailLabel>Game:</OrderDetailLabel>
                  <OrderDetailValue>{order.game}</OrderDetailValue>
                </OrderDetail>
                <OrderDetail>
                  <OrderDetailLabel>Type:</OrderDetailLabel>
                  <OrderDetailValue>{order.type}</OrderDetailValue>
                </OrderDetail>
                {order.currentRank && order.targetRank && (
                  <OrderDetail>
                    <OrderDetailLabel>Boost:</OrderDetailLabel>
                    <OrderDetailValue>{order.currentRank} → {order.targetRank}</OrderDetailValue>
                  </OrderDetail>
                )}
                {order.matches && (
                  <OrderDetail>
                    <OrderDetailLabel>Matches:</OrderDetailLabel>
                    <OrderDetailValue>{order.matches}</OrderDetailValue>
                  </OrderDetail>
                )}
                <OrderDetail>
                  <OrderDetailLabel>Price:</OrderDetailLabel>
                  <OrderDetailValue>${order.price.toFixed(2)}</OrderDetailValue>
                </OrderDetail>
                <OrderDetail>
                  <OrderDetailLabel>Start Date:</OrderDetailLabel>
                  <OrderDetailValue>{new Date(order.startDate).toLocaleDateString()}</OrderDetailValue>
                </OrderDetail>
                {order.completionDate ? (
                  <OrderDetail>
                    <OrderDetailLabel>Completed:</OrderDetailLabel>
                    <OrderDetailValue>{new Date(order.completionDate).toLocaleDateString()}</OrderDetailValue>
                  </OrderDetail>
                ) : order.estimatedCompletion && (
                  <OrderDetail>
                    <OrderDetailLabel>Est. Completion:</OrderDetailLabel>
                    <OrderDetailValue>{order.estimatedCompletion === 'On Hold' ? 'On Hold' : new Date(order.estimatedCompletion).toLocaleDateString()}</OrderDetailValue>
                  </OrderDetail>
                )}
                {order.booster && (
                  <OrderDetail>
                    <OrderDetailLabel>Booster:</OrderDetailLabel>
                    <OrderDetailValue>{order.booster}</OrderDetailValue>
                  </OrderDetail>
                )}
              </OrderDetails>
              
              {order.progress > 0 && order.status !== 'cancelled' && (
                <OrderProgress>
                  <ProgressBar>
                    <ProgressFill width={order.progress} status={order.status} />
                  </ProgressBar>
                  <ProgressText>{order.progress}% Complete</ProgressText>
                </OrderProgress>
              )}
              
              <OrderCardFooter>
                <ActionButton>
                  <FaDownload /> Invoice
                </ActionButton>
                <ActionButton primary>
                  Contact Support
                </ActionButton>
              </OrderCardFooter>
            </OrderCard>
          ))
        ) : (
          <EmptyStateMessage>
            No orders found. Try adjusting your filters or search query.
          </EmptyStateMessage>
        )}
      </OrdersList>
    </OrdersContainer>
  );
};

const OrdersContainer = styled.div`
  padding: 1rem 0;
`;

const OrdersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text}aa;
  pointer-events: none;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const FilterContainer = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: ${({ theme }) => theme.text};
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const FilterOption = styled.button<SelectionProps>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background: ${({ isActive, theme }) => isActive ? theme.primary : theme.body};
  color: ${({ isActive, theme }) => isActive ? 'white' : theme.text};
  border: 1px solid ${({ isActive, theme }) => isActive ? theme.primary : theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ isActive, theme }) => isActive ? theme.primary : theme.hover};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 576px) {
    gap: 0.5rem;
    padding-bottom: 0.25rem;
    white-space: nowrap;
  }
`;

const Tab = styled.button<SelectionProps>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ isActive, theme }) => isActive ? theme.primary : 'transparent'};
  color: ${({ isActive, theme }) => isActive ? theme.primary : theme.text};
  font-weight: ${({ isActive }) => isActive ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 576px) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
`;

const OrdersCount = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 1rem;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadow};
    transform: translateY(-2px);
  }
  
  @media (max-width: 576px) {
    margin-bottom: 1rem;
  }
`;

const OrderCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const OrderStatus = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ color }) => color};
  
  svg {
    font-size: 1rem;
  }
`;

const OrderDetails = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.5rem;
    padding: 0.75rem;
  }
`;

const OrderDetail = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (max-width: 576px) {
    font-size: 0.9rem;
  }
`;

const OrderDetailLabel = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
  margin-bottom: 0.25rem;
  
  @media (max-width: 576px) {
    font-size: 0.75rem;
  }
`;

const OrderDetailValue = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const OrderProgress = styled.div`
  padding: 0 1rem 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.border};
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ width: number; status: string }>`
  height: 100%;
  width: ${({ width }) => `${width}%`};
  background-color: ${({ status }) => 
    status === 'completed' 
      ? 'var(--primary)' 
      : status === 'paused' 
        ? 'var(--warning)' 
        : 'var(--success)'
  };
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
  text-align: right;
`;

const OrderCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 576px) {
    flex-direction: column;
    padding: 0.75rem;
  }
`;

const ActionButton = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 0.5rem;
  background: ${({ primary, theme }) => primary ? theme.primary : 'transparent'};
  color: ${({ primary, theme }) => primary ? 'white' : theme.text};
  border: 1px solid ${({ primary, theme }) => primary ? theme.primary : theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ primary, theme }) => primary ? theme.buttonHover : theme.hover};
  }
  
  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.text}aa;
  font-size: 1rem;
`;

export default DashboardOrders; 
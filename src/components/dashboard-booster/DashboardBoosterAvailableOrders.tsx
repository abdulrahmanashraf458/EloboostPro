import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaListAlt, FaSearch, FaFilter, FaHandPointer, FaStar, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { useModalContext } from '../../contexts/ModalContext';

const DashboardBoosterAvailableOrders: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableOrders, setAvailableOrders] = useState([
    {
      id: 'ORD-567890',
      game: 'League of Legends',
      type: 'Solo Boost',
      from: 'Bronze I',
      to: 'Silver III',
      payment: 35,
      estimatedTime: '3-4 days',
      difficulty: 'Easy',
      priority: 'Normal',
      dateCreated: '2023-06-10',
    },
    {
      id: 'ORD-678901',
      game: 'Valorant',
      type: 'Duo Boost',
      from: 'Silver II',
      to: 'Gold I',
      payment: 55,
      estimatedTime: '4-5 days',
      difficulty: 'Medium',
      priority: 'High',
      dateCreated: '2023-06-11',
    },
    {
      id: 'ORD-789012',
      game: 'Wild Rift',
      type: 'Rank Boost',
      from: 'Gold IV',
      to: 'Platinum IV',
      payment: 70,
      estimatedTime: '5-7 days',
      difficulty: 'Hard',
      priority: 'Normal',
      dateCreated: '2023-06-12',
    },
    {
      id: 'ORD-890123',
      game: 'League of Legends',
      type: 'Placement Matches',
      from: 'Unranked',
      to: '10 Games',
      payment: 60,
      estimatedTime: '2-3 days',
      difficulty: 'Medium',
      priority: 'Urgent',
      dateCreated: '2023-06-12',
    },
    {
      id: 'ORD-901234',
      game: 'Valorant',
      type: 'Rank Boost',
      from: 'Platinum I',
      to: 'Diamond III',
      payment: 120,
      estimatedTime: '7-10 days',
      difficulty: 'Very Hard',
      priority: 'High',
      dateCreated: '2023-06-13',
    },
  ]);

  const [filter, setFilter] = useState({
    game: 'all',
    difficulty: 'all',
    priority: 'all',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Use the global modal context
  const { showConfirm, showAlert } = useModalContext();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle filter changes
  const handleFilterChange = (field: keyof typeof filter, value: string) => {
    setFilter({
      ...filter,
      [field]: value,
    });
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Handle claiming an order
  const handleClaimOrder = (orderId: string) => {
    showConfirm(
      'Claim Order',
      `Are you sure you want to claim order ${orderId}?`,
      () => {
        // In a real app, this would make an API call to claim the order
        // For now, we'll just remove it from available orders
        setAvailableOrders((prevOrders) => 
          prevOrders.filter((order) => order.id !== orderId)
        );
        
        // Show success message
        showAlert(
          'Success',
          `Successfully claimed order ${orderId}!`,
          'success'
        );
      },
      'info',
      'Claim',
      'Cancel'
    );
  };

  // Filter and sort orders
  const filteredOrders = availableOrders.filter((order) => {
    // Filter by game
    if (filter.game !== 'all' && order.game !== filter.game) {
      return false;
    }

    // Filter by difficulty
    if (filter.difficulty !== 'all' && order.difficulty !== filter.difficulty) {
      return false;
    }

    // Filter by priority
    if (filter.priority !== 'all' && order.priority !== filter.priority) {
      return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.game.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !order.type.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a];
    const bValue = b[sortBy as keyof typeof b];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortOrder === 'asc' ? comparison : -comparison;
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#4caf50';
      case 'Medium':
        return '#ff9800';
      case 'Hard':
        return '#f44336';
      case 'Very Hard':
        return '#9c27b0';
      default:
        return '#4caf50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '#f44336';
      case 'High':
        return '#ff9800';
      case 'Normal':
        return '#2196f3';
      default:
        return '#2196f3';
    }
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <PageHeader>
        <PageTitle>
          <FaListAlt /> Available Orders
        </PageTitle>
      </PageHeader>

      {isLoading ? (
        <LoadingMessage>Loading available orders...</LoadingMessage>
      ) : sortedOrders.length === 0 ? (
        <NoOrdersMessage>
          No available orders match your filters. Try adjusting your search criteria.
        </NoOrdersMessage>
      ) : (
        <OrdersGrid>
          {sortedOrders.map((order) => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderId>{order.id}</OrderId>
                <OrderGame>{order.game}</OrderGame>
              </OrderHeader>
              <OrderContent>
                <OrderDetail>
                  <OrderDetailLabel>Type:</OrderDetailLabel>
                  <OrderDetailValue>{order.type}</OrderDetailValue>
                </OrderDetail>
                <OrderDetail>
                  <OrderDetailLabel>Boost:</OrderDetailLabel>
                  <OrderDetailValue>
                    {order.from} → {order.to}
                  </OrderDetailValue>
                </OrderDetail>
                <OrderDetail>
                  <OrderDetailLabel>Payment:</OrderDetailLabel>
                  <OrderDetailValue>
                    <FaMoneyBillWave style={{ marginRight: '5px', color: '#4caf50' }} />
                    ${order.payment}
                  </OrderDetailValue>
                </OrderDetail>
                <OrderDetail>
                  <OrderDetailLabel>Est. Time:</OrderDetailLabel>
                  <OrderDetailValue>
                    <FaClock style={{ marginRight: '5px', color: '#2196f3' }} />
                    {order.estimatedTime}
                  </OrderDetailValue>
                </OrderDetail>
                <OrderTags>
                  <OrderTag $bgColor={getDifficultyColor(order.difficulty)}>
                    <FaStar style={{ marginRight: '5px' }} />
                    {order.difficulty}
                  </OrderTag>
                  <OrderTag $bgColor={getPriorityColor(order.priority)}>
                    {order.priority}
                  </OrderTag>
                </OrderTags>
              </OrderContent>
              <OrderFooter>
                <ClaimButton onClick={() => handleClaimOrder(order.id)}>
                  <FaHandPointer /> Claim Order
                </ClaimButton>
              </OrderFooter>
            </OrderCard>
          ))}
        </OrdersGrid>
      )}
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
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textLight};
`;

const FilterSelect = styled.select`
  padding: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg || theme.cardBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textLight};
`;

const NoOrdersMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textLight};
`;

const OrdersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const OrderCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadow};
  }
`;

const OrderHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OrderId = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const OrderGame = styled.div`
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  background: ${({ theme }) => `${theme.primary}22`};
  border-radius: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const OrderContent = styled.div`
  padding: 1rem;
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  
  &:last-of-type {
    margin-bottom: 1rem;
  }
`;

const OrderDetailLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
`;

const OrderDetailValue = styled.span`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const OrderTags = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
`;

const OrderTag = styled.div<{ $bgColor: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ $bgColor }) => `${$bgColor}22`};
  color: ${({ $bgColor }) => $bgColor};
`;

const OrderFooter = styled.div`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: center;
`;

const ClaimButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover || theme.primary}dd;
  }
`;

export default DashboardBoosterAvailableOrders; 
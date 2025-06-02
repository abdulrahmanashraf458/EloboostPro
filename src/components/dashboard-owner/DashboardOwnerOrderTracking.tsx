import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaClock, FaCheck, FaTimes, FaComment, FaPause } from 'react-icons/fa';
import OrderDetailModal from './OrderDetailModal';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  orderId: string;
  client: {
    id: string;
    name: string;
    avatar: string;
  };
  booster: {
    id: string;
    name: string;
    avatar: string;
    status: 'online' | 'offline' | 'away';
  };
  service: string;
  currentRank: {
    tier: string;
    division: number;
  };
  desiredRank: {
    tier: string;
    division: number;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'paused';
  progress: number;
  estimatedTime: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  chatActivity: boolean;
  description: string;
  clientNotes: string;
  requirements: string[];
}

const DashboardOwnerOrderTracking: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chatActivityFilter, setChatActivityFilter] = useState<boolean | null>(null);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  
  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderId: 'ORD-1234',
        client: {
          id: 'client1',
          name: 'JohnDoe',
          avatar: 'https://i.pravatar.cc/150?u=client1',
        },
        booster: {
          id: 'booster1',
          name: 'RankHero',
          avatar: 'https://i.pravatar.cc/150?u=booster1',
          status: 'online',
        },
        service: 'Rank Boost',
        currentRank: {
          tier: 'silver',
          division: 3,
        },
        desiredRank: {
          tier: 'gold',
          division: 4,
        },
        status: 'in_progress',
        progress: 45,
        estimatedTime: '2 days',
        price: 50.00,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        chatActivity: true,
        description: 'League of Legends rank boost from Silver III to Gold IV. Player prefers safe play style.',
        clientNotes: 'I want to reach Gold before the season ends. Please use champions in my pool.',
        requirements: [
          'Use champions in client pool when possible',
          'Play safe to avoid reports',
          'Maximum 3 games per day',
          'Avoid chatting in game'
        ]
      },
      {
        id: '2',
        orderId: 'ORD-5678',
        client: {
          id: 'client2',
          name: 'JaneSmith',
          avatar: 'https://i.pravatar.cc/150?u=client2',
        },
        booster: {
          id: 'booster2',
          name: 'DuoKing',
          avatar: 'https://i.pravatar.cc/150?u=booster2',
          status: 'away',
        },
        service: 'Placement Matches',
        currentRank: {
          tier: 'unranked',
          division: 0,
        },
        desiredRank: {
          tier: 'platinum',
          division: 4,
        },
        status: 'pending',
        progress: 0,
        estimatedTime: '3 days',
        price: 75.00,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        chatActivity: false,
        description: 'Complete 10 placement matches in League of Legends with at least 7 wins.',
        clientNotes: 'I prefer winning over playing specific champions. Get me the best possible placement.',
        requirements: [
          'Focus on winning, champion choice is flexible',
          'Play during off-peak hours for better matchmaking',
          'Complete within 3 days'
        ]
      },
      {
        id: '3',
        orderId: 'ORD-9012',
        client: {
          id: 'client3',
          name: 'AlexTaylor',
          avatar: 'https://i.pravatar.cc/150?u=client3',
        },
        booster: {
          id: 'booster3',
          name: 'EliteBoost',
          avatar: 'https://i.pravatar.cc/150?u=booster3',
          status: 'online',
        },
        service: 'Duo Boost',
        currentRank: {
          tier: 'gold',
          division: 2,
        },
        desiredRank: {
          tier: 'platinum',
          division: 3,
        },
        status: 'completed',
        progress: 100,
        estimatedTime: '4 days',
        price: 120.00,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        chatActivity: false,
        description: 'Duo boost from Gold II to Platinum III. Client will play alongside the booster.',
        clientNotes: 'I main support and can play Lulu, Nami, Janna, and Thresh. I would like to duo with an ADC.',
        requirements: [
          'Schedule duo sessions in advance',
          'Voice chat preferred but not mandatory',
          'Be patient with mistakes',
          'Focus on improvement and communication'
        ]
      },
      {
        id: '4',
        orderId: 'ORD-3456',
        client: {
          id: 'client4',
          name: 'SamJohnson',
          avatar: 'https://i.pravatar.cc/150?u=client4',
        },
        booster: {
          id: 'booster4',
          name: 'VictoryStreak',
          avatar: 'https://i.pravatar.cc/150?u=booster4',
          status: 'offline',
        },
        service: 'Valorant Rank Boost',
        currentRank: {
          tier: 'bronze',
          division: 1,
        },
        desiredRank: {
          tier: 'silver',
          division: 3,
        },
        status: 'paused',
        progress: 35,
        estimatedTime: '5 days',
        price: 65.00,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        chatActivity: true,
        description: 'Valorant rank boost from Bronze I to Silver III. Looking for consistent performance.',
        clientNotes: 'Account has all agents unlocked. Please play any agent that gives the best chance of winning.',
        requirements: [
          'Win at least 60% of games',
          'No more than 5 games per day',
          'Preferably play during evening hours'
        ]
      },
      {
        id: '5',
        orderId: 'ORD-7890',
        client: {
          id: 'client5',
          name: 'EmilyWilson',
          avatar: 'https://i.pravatar.cc/150?u=client5',
        },
        booster: {
          id: 'booster5',
          name: 'LegendaryCarry',
          avatar: 'https://i.pravatar.cc/150?u=booster5',
          status: 'offline',
        },
        service: 'Wild Rift Boost',
        currentRank: {
          tier: 'diamond',
          division: 4,
        },
        desiredRank: {
          tier: 'master',
          division: 0,
        },
        status: 'cancelled',
        progress: 10,
        estimatedTime: '7 days',
        price: 200.00,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
        chatActivity: false,
        description: 'Wild Rift rank boost from Diamond IV to Master. High difficulty, high priority.',
        clientNotes: 'Account has been stuck in Diamond for months. Looking for a skilled player to push it to Master rank.',
        requirements: [
          'Guarantees to reach Master rank',
          'Must play on mobile, not emulator',
          'Maintain at least 55% win rate',
          'Complete within two weeks maximum'
        ]
      }
    ];
    
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);
  
  // Filter orders based on search and filter criteria
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(query) ||
        order.client.name.toLowerCase().includes(query) ||
        order.booster.name.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply chat activity filter
    if (chatActivityFilter !== null) {
      filtered = filtered.filter(order => order.chatActivity === chatActivityFilter);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, chatActivityFilter]);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMonitoring) return;
    
    const interval = setInterval(() => {
      // Simulate a booster coming online/offline
      const randomIndex = Math.floor(Math.random() * orders.length);
      const updatedOrders = [...orders];
      
      if (updatedOrders[randomIndex]) {
        const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        updatedOrders[randomIndex] = {
          ...updatedOrders[randomIndex],
          booster: {
            ...updatedOrders[randomIndex].booster,
            status: randomStatus
          },
          updatedAt: new Date()
        };
        
        setOrders(updatedOrders);
      }
    }, 15000); // Update every 15 seconds
    
    return () => clearInterval(interval);
  }, [orders, isLiveMonitoring]);
  
  const toggleLiveMonitoring = () => {
    setIsLiveMonitoring(!isLiveMonitoring);
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return '#f39c12'; // amber
      case 'in_progress':
        return '#3498db'; // blue
      case 'completed':
        return '#2ecc71'; // green
      case 'cancelled':
        return '#e74c3c'; // red
      case 'paused':
        return '#f39c12'; // amber
      default:
        return '#95a5a6'; // gray
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <FaClock />;
      case 'in_progress':
        return <FaFilter />;
      case 'completed':
        return <FaCheck />;
      case 'cancelled':
        return <FaTimes />;
      case 'paused':
        return <FaPause />;
      default:
        return null;
    }
  };
  
  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'iron':
        return '#74777a';
      case 'bronze':
        return '#cd7f32';
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      case 'platinum':
        return '#00ffbf';
      case 'diamond':
        return '#b9f2ff';
      case 'master':
        return '#ff00ff';
      case 'grandmaster':
        return '#ff0000';
      case 'challenger':
        return '#ffb700';
      default:
        return '#95a5a6';
    }
  };
  
  const viewOrderDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };
  
  const editOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  };
  
  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
    setFilteredOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };
  
  const viewChat = (orderId: string) => {
    navigate(`/owner/chat/${orderId}`);
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'paused',
          updatedAt: new Date()
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Apply filters to the updated orders
    let filtered = [...updatedOrders];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderId.toLowerCase().includes(query) ||
        order.client.name.toLowerCase().includes(query) ||
        order.booster.name.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply chat activity filter
    if (chatActivityFilter !== null) {
      filtered = filtered.filter(order => order.chatActivity === chatActivityFilter);
    }
    
    setFilteredOrders(filtered);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Order Tracking</PageTitle>
        <PageDescription>
          Monitor and manage all orders, boosters, and clients in real-time
        </PageDescription>
      </PageHeader>
      
      <ControlsRow>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text"
            placeholder="Search by order ID, client or booster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <FiltersContainer>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>
          
          <FilterSelect
            value={chatActivityFilter === null ? 'all' : chatActivityFilter ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value;
              setChatActivityFilter(
                value === 'all' ? null : 
                value === 'active' ? true : false
              );
            }}
          >
            <option value="all">All Chat Activity</option>
            <option value="active">Active Chats</option>
            <option value="inactive">No Chat Activity</option>
          </FilterSelect>
          
          <ToggleButton 
            $active={isLiveMonitoring}
            onClick={toggleLiveMonitoring}
            title={isLiveMonitoring ? 'Disable live monitoring' : 'Enable live monitoring'}
          >
            {isLiveMonitoring ? 'Live Monitoring: ON' : 'Live Monitoring: OFF'}
          </ToggleButton>
        </FiltersContainer>
      </ControlsRow>
      
      <OrdersTable>
        <TableHeader>
          <HeaderCell width="10%">Order ID</HeaderCell>
          <HeaderCell width="15%">Client / Booster</HeaderCell>
          <HeaderCell width="15%">Service</HeaderCell>
          <HeaderCell width="20%">Rank Progress</HeaderCell>
          <HeaderCell width="10%">Status</HeaderCell>
          <HeaderCell width="15%">Updated</HeaderCell>
          <HeaderCell width="15%">Actions</HeaderCell>
        </TableHeader>
        
        <TableBody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell data-label="Order ID">{order.orderId}</TableCell>
                
                <TableCell data-label="Client / Booster">
                  <ClientBoosterCell>
                    <div>
                      <UserAvatar>
                        <img src={order.client.avatar} alt={order.client.name} />
                      </UserAvatar>
                      <UserName>{order.client.name}</UserName>
                    </div>
                    
                    <ClientBoosterDivider>/</ClientBoosterDivider>
                    
                    <div>
                      <UserAvatar $status={order.booster.status}>
                        <img src={order.booster.avatar} alt={order.booster.name} />
                      </UserAvatar>
                      <UserName>{order.booster.name}</UserName>
                    </div>
                  </ClientBoosterCell>
                </TableCell>
                
                <TableCell data-label="Service">{order.service}</TableCell>
                
                <TableCell data-label="Rank Progress">
                  <RankProgressCell>
                    <RankInfo>
                      <RankBadge $color={getTierColor(order.currentRank.tier)}>
                        {order.currentRank.tier.charAt(0).toUpperCase() + order.currentRank.tier.slice(1)} {order.currentRank.division > 0 ? order.currentRank.division : ''}
                      </RankBadge>
                      <span>→</span>
                      <RankBadge $color={getTierColor(order.desiredRank.tier)}>
                        {order.desiredRank.tier.charAt(0).toUpperCase() + order.desiredRank.tier.slice(1)} {order.desiredRank.division > 0 ? order.desiredRank.division : ''}
                      </RankBadge>
                    </RankInfo>
                    <ProgressBar>
                      <ProgressFill $progress={order.progress} $color={getStatusColor(order.status)} />
                    </ProgressBar>
                    <ProgressText>{order.progress}% Complete</ProgressText>
                  </RankProgressCell>
                </TableCell>
                
                <TableCell data-label="Status">
                  <StatusBadge $color={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span>{order.status.replace('_', ' ')}</span>
                  </StatusBadge>
                </TableCell>
                
                <TableCell data-label="Updated">{formatDate(order.updatedAt)}</TableCell>
                
                <TableCell data-label="Actions">
                  <ActionsCell>
                    <ActionButton onClick={() => viewOrderDetails(order.id)} title="View details">
                      <FaEye />
                    </ActionButton>
                    
                    <ActionButton onClick={() => viewChat(order.id)} title="View chat" $highlight={order.chatActivity}>
                      <FaComment />
                    </ActionButton>
                  </ActionsCell>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <EmptyState>
              <EmptyMessage>No orders found matching your criteria</EmptyMessage>
            </EmptyState>
          )}
        </TableBody>
      </OrdersTable>
      
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
        onDelete={deleteOrder}
        onNavigateToChat={viewChat}
      />
    </Container>
  );
};

const Container = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.text}aa;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text}aa;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ $active, theme }) => $active ? theme.primary : theme.border};
  background-color: ${({ $active, theme }) => $active ? `${theme.primary}22` : theme.cardBg};
  color: ${({ $active, theme }) => $active ? theme.primary : theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background-color: ${({ theme }) => `${theme.primary}11`};
  }
`;

const OrdersTable = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  padding: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-weight: 600;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const HeaderCell = styled.div<{ width: string }>`
  flex: ${({ width }) => `0 0 ${width}`};
  padding: 0.5rem;
  
  @media (max-width: 992px) {
    flex: 1;
  }
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const TableCell = styled.div`
  flex: 1;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.25rem 0;
    
    &::before {
      content: attr(data-label);
      font-weight: 600;
      margin-bottom: 0.25rem;
    }
  }
`;

const ClientBoosterCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const ClientBoosterDivider = styled.span`
  color: ${({ theme }) => theme.text}aa;
`;

const UserAvatar = styled.div<{ $status?: string }>`
  position: relative;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  ${({ $status }) => $status && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background-color: ${
        $status === 'online' ? '#2ecc71' :
        $status === 'away' ? '#f39c12' : '#95a5a6'
      };
      border: 2px solid white;
    }
  `}
`;

const UserName = styled.span`
  font-size: 0.9rem;
`;

const RankProgressCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const RankInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    color: ${({ theme }) => theme.text}aa;
  }
`;

const RankBadge = styled.div<{ $color: string }>`
  background-color: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid ${({ $color }) => $color}44;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 0.5rem;
  background-color: ${({ theme }) => theme.body};
  border-radius: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number, $color: string }>`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  background-color: ${({ $color }) => $color};
  border-radius: 1rem;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
`;

const StatusBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
  
  svg {
    font-size: 0.75rem;
  }
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $highlight?: boolean; $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  background-color: ${({ $highlight, $danger, theme }) => 
    $highlight ? `${theme.primary}22` : 
    $danger ? '#e74c3c11' : 
    theme.hover};
  color: ${({ $highlight, $danger, theme }) => 
    $highlight ? theme.primary : 
    $danger ? '#e74c3c' : 
    theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $highlight, $danger, theme }) => 
      $highlight ? `${theme.primary}33` : 
      $danger ? '#e74c3c22' : 
      `${theme.hover}cc`};
    transform: translateY(-2px);
  }
  
  span {
    margin-left: 0.5rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 0;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
  font-size: 1rem;
`;

export default DashboardOwnerOrderTracking; 
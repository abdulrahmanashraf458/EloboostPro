import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaSearch, FaEye, FaEdit, FaTrash, FaFilter, FaUser, FaEnvelope, FaPhoneAlt, FaBan, FaUnlock, FaSort, FaReceipt, FaClock, FaCalendarAlt, FaPlus, FaDownload, FaUserPlus, FaTimes } from 'react-icons/fa';
import ClientDetailModal from './ClientDetailModal';
import ClientEditModal from './ClientEditModal';
import DeleteClientModal from './DeleteClientModal';

// Enhanced Client interface with additional fields
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: Date;
  orders: number;
  totalSpent: number;
  lastActive: Date;
  status: 'active' | 'inactive' | 'banned';
  // New fields
  address?: string;
  ipAddress?: string;
  lastOrder?: Date;
  preferredGame?: string;
  notes?: string;
  paymentMethod?: string;
  preferredBooster?: string;
}

// Helper function for status colors
const getStatusColor = (status: string) => {
  switch(status) {
    case 'active':
      return '#2ecc71'; // green
    case 'inactive':
      return '#f39c12'; // amber
    case 'banned':
      return '#e74c3c'; // red
    default:
      return '#95a5a6'; // gray
  }
};

// Animation Keyframes
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInFromRight = keyframes`
  from { 
    transform: translateX(20px);
    opacity: 0;
  }
  to { 
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInFromBottom = keyframes`
  from { 
    transform: translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const DashboardOwnerClientManagement: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('lastActive');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Mock data for demonstration - keeps the same data but adds new fields
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockClients: Client[] = [
        {
          id: 'C1001',
          name: 'John Doe',
          email: 'johndoe@example.com',
          phone: '+1 (555) 123-4567',
          avatar: 'https://i.pravatar.cc/150?u=user1',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
          orders: 5,
          totalSpent: 450.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          status: 'active',
          address: '123 Main St, New York, NY',
          ipAddress: '192.168.1.1',
          lastOrder: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          preferredGame: 'League of Legends',
          paymentMethod: 'Credit Card',
          preferredBooster: 'DuoKing'
        },
        {
          id: 'C1002',
          name: 'Jane Smith',
          email: 'janesmith@example.com',
          phone: '+1 (555) 987-6543',
          avatar: 'https://i.pravatar.cc/150?u=user2',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45), // 45 days ago
          orders: 2,
          totalSpent: 180.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
          status: 'active',
        },
        {
          id: 'C1003',
          name: 'Robert Williams',
          email: 'rwilliams@example.com',
          phone: '+1 (555) 345-6789',
          avatar: 'https://i.pravatar.cc/150?u=user3',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), // 120 days ago
          orders: 1,
          totalSpent: 90.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          status: 'inactive',
        },
        {
          id: 'C1004',
          name: 'Maria Garcia',
          email: 'mgarcia@example.com',
          phone: '+1 (555) 567-8901',
          avatar: 'https://i.pravatar.cc/150?u=user4',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
          orders: 3,
          totalSpent: 275.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
          status: 'active',
        },
        {
          id: 'C1005',
          name: 'David Lee',
          email: 'dlee@example.com',
          phone: '+1 (555) 789-0123',
          avatar: 'https://i.pravatar.cc/150?u=user5',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
          orders: 0,
          totalSpent: 0.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
          status: 'inactive',
        },
        {
          id: 'C1006',
          name: 'Sarah Johnson',
          email: 'sjohnson@example.com',
          phone: '+1 (555) 234-5678',
          avatar: 'https://i.pravatar.cc/150?u=user6',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
          orders: 1,
          totalSpent: 120.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          status: 'active',
        },
        {
          id: 'C1007',
          name: 'Michael Brown',
          email: 'mbrown@example.com',
          phone: '+1 (555) 456-7890',
          avatar: 'https://i.pravatar.cc/150?u=user7',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 75), // 75 days ago
          orders: 4,
          totalSpent: 320.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 48), // 48 hours ago
          status: 'active',
        },
        {
          id: 'C1008',
          name: 'Thomas Wilson',
          email: 'twilson@example.com',
          phone: '+1 (555) 678-9012',
          avatar: 'https://i.pravatar.cc/150?u=user8',
          joinDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
          orders: 0,
          totalSpent: 0.00,
          lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
          status: 'banned',
        }
      ];
      
      setClients(mockClients);
      setFilteredClients(mockClients);
      setIsLoading(false);
    };
    
    fetchClients();
  }, []);
  
  // Filter clients based on search and filter criteria
  useEffect(() => {
    let filtered = [...clients];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.id.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'joinDate':
          comparison = a.joinDate.getTime() - b.joinDate.getTime();
          break;
        case 'lastActive':
          comparison = a.lastActive.getTime() - b.lastActive.getTime();
          break;
        case 'orders':
          comparison = a.orders - b.orders;
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        default:
          comparison = a.lastActive.getTime() - b.lastActive.getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredClients(filtered);
  }, [clients, searchQuery, statusFilter, sortField, sortDirection]);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} months ago`;
  };
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const viewClientDetails = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setShowDetailModal(true);
    }
  };
  
  const editClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setShowEditModal(true);
    }
  };
  
  const toggleClientStatus = (clientId: string) => {
    setClients(prevClients => 
      prevClients.map(client => {
        if (client.id === clientId) {
          const newStatus = client.status === 'banned' ? 'active' : 'banned';
          return { ...client, status: newStatus };
        }
        return client;
      })
    );
  };
  
  const deleteClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setShowDeleteModal(true);
    }
  };
  
  const handleDeleteConfirm = (clientId: string) => {
    setClients(prevClients => prevClients.filter(c => c.id !== clientId));
    setShowDeleteModal(false);
  };
  
  const handleSaveClient = (updatedClient: Client) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setShowEditModal(false);
  };
  
  return (
    <Container>
      <PageHeader>
        <HeaderContent>
          <HeaderLeft>
            <PageTitle>Client Management</PageTitle>
            <PageDescription>
              Manage all client accounts and view client activity
            </PageDescription>
          </HeaderLeft>
          <HeaderRight>
            <ActionSecondaryButton>
              <FaDownload /> Export Data
            </ActionSecondaryButton>
          </HeaderRight>
        </HeaderContent>
      </PageHeader>
      
      <ControlPanel>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search by name, email, or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ClearSearchButton onClick={() => setSearchQuery('')}>
              <FaTimes />
            </ClearSearchButton>
          )}
        </SearchContainer>
        
        <FiltersSection>
          <FilterLabel>Filter by:</FilterLabel>
          <FilterWrapper>
            <FilterIcon>
              <FaFilter />
            </FilterIcon>
            <FilterSelect
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </FilterSelect>
          </FilterWrapper>
        </FiltersSection>
      </ControlPanel>
      
      <ResultsBar>
        <ResultsSummary>
          Showing <ResultsCount>{filteredClients.length}</ResultsCount> of <ResultsCount>{clients.length}</ResultsCount> clients
        </ResultsSummary>
        <ResultsActions>
          <ResultsViewToggle>
            {/* Toggle between list/grid view if implemented */}
          </ResultsViewToggle>
        </ResultsActions>
      </ResultsBar>
      
      {isLoading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <LoadingMessage>Loading clients...</LoadingMessage>
        </LoadingContainer>
      ) : (
        <>
          {/* Desktop View */}
          <DesktopView>
            {filteredClients.length > 0 ? (
              <ClientsTable>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell onClick={() => handleSort('name')}>
                      <HeaderContent>
                        <span>Client Name</span>
                        <SortIndicator active={sortField === 'name'} direction={sortDirection}>
                          <FaSort />
                        </SortIndicator>
                      </HeaderContent>
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('joinDate')}>
                      <HeaderContent>
                        <span>Join Date</span>
                        <SortIndicator active={sortField === 'joinDate'} direction={sortDirection}>
                          <FaSort />
                        </SortIndicator>
                      </HeaderContent>
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('orders')}>
                      <HeaderContent>
                        <span>Orders</span>
                        <SortIndicator active={sortField === 'orders'} direction={sortDirection}>
                          <FaSort />
                        </SortIndicator>
                      </HeaderContent>
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('totalSpent')}>
                      <HeaderContent>
                        <span>Total Spent</span>
                        <SortIndicator active={sortField === 'totalSpent'} direction={sortDirection}>
                          <FaSort />
                        </SortIndicator>
                      </HeaderContent>
                    </TableHeaderCell>
                    <TableHeaderCell onClick={() => handleSort('lastActive')}>
                      <HeaderContent>
                        <span>Last Active</span>
                        <SortIndicator active={sortField === 'lastActive'} direction={sortDirection}>
                          <FaSort />
                        </SortIndicator>
                      </HeaderContent>
                    </TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map(client => (
                    <TableRow key={client.id} onClick={() => viewClientDetails(client.id)}>
                      <ClientCell>
                        <ClientAvatarImg>
                          <img src={client.avatar} alt={client.name} />
                        </ClientAvatarImg>
                        <ClientInfoContainer>
                          <ClientNameText>{client.name}</ClientNameText>
                          <ClientDetails>
                            <ClientEmail><FaEnvelope /> {client.email}</ClientEmail>
                            <ClientPhone><FaPhoneAlt /> {client.phone}</ClientPhone>
                          </ClientDetails>
                        </ClientInfoContainer>
                      </ClientCell>
                      <TableCell>{formatDate(client.joinDate)}</TableCell>
                      <TableCell>
                        <OrderCount $hasOrders={client.orders > 0}>
                          {client.orders}
                        </OrderCount>
                      </TableCell>
                      <TableCell>{formatCurrency(client.totalSpent)}</TableCell>
                      <TableCell>{formatTimeAgo(client.lastActive)}</TableCell>
                      <TableCell>
                        <ClientStatusBadge $status={client.status}>
                          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                        </ClientStatusBadge>
                      </TableCell>
                      <ActionCell onClick={(e) => e.stopPropagation()}>
                        <ActionButtons>
                          <ActionButton 
                            title="View Details" 
                            onClick={() => viewClientDetails(client.id)}
                            $primary
                          >
                            <FaEye />
                          </ActionButton>
                          <ActionButton 
                            title="Edit Client" 
                            onClick={() => editClient(client.id)}
                            $info
                          >
                            <FaEdit />
                          </ActionButton>
                          <ActionButton 
                            title={client.status === 'banned' ? 'Unban Client' : 'Ban Client'}
                            onClick={() => toggleClientStatus(client.id)}
                            $warning={client.status !== 'banned'}
                            $success={client.status === 'banned'}
                          >
                            {client.status === 'banned' ? <FaUnlock /> : <FaBan />}
                          </ActionButton>
                          <ActionButton 
                            title="Delete Client" 
                            onClick={() => deleteClient(client.id)}
                            $danger
                          >
                            <FaTrash />
                          </ActionButton>
                        </ActionButtons>
                      </ActionCell>
                    </TableRow>
                  ))}
                </TableBody>
              </ClientsTable>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <FaFilter />
                </EmptyStateIcon>
                <EmptyStateTitle>No clients found</EmptyStateTitle>
                <EmptyStateText>No clients match your search criteria</EmptyStateText>
                <EmptyStateAction onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}>
                  Clear Filters
                </EmptyStateAction>
              </EmptyState>
            )}
          </DesktopView>
          
          {/* Mobile View */}
          <MobileView>
            {filteredClients.length > 0 ? (
              <ClientCardList>
                {filteredClients.map(client => (
                  <ClientCard key={client.id} onClick={() => viewClientDetails(client.id)}>
                    <CardHeader $status={client.status}>
                      <CardHeaderContent>
                        <MobileClientAvatar>
                          <img src={client.avatar} alt={client.name} />
                        </MobileClientAvatar>
                        <MobileClientInfo>
                          <MobileClientName>{client.name}</MobileClientName>
                          <ClientStatusBadge $status={client.status}>
                            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                          </ClientStatusBadge>
                        </MobileClientInfo>
                      </CardHeaderContent>
                    </CardHeader>
                    
                    <CardBody>
                      <CardSection>
                        <SectionLabel>Contact</SectionLabel>
                        <ContactInfoCell>
                          <ContactItem><FaEnvelope /> {client.email}</ContactItem>
                          <ContactItem><FaPhoneAlt /> {client.phone}</ContactItem>
                        </ContactInfoCell>
                      </CardSection>
                      
                      <CardRow>
                        <CardColumn>
                          <SectionLabel>Join Date</SectionLabel>
                          <SectionValue><FaCalendarAlt /> {formatDate(client.joinDate)}</SectionValue>
                        </CardColumn>
                        <CardColumn>
                          <SectionLabel>Last Active</SectionLabel>
                          <SectionValue><FaClock /> {formatTimeAgo(client.lastActive)}</SectionValue>
                        </CardColumn>
                      </CardRow>
                      
                      <CardRow>
                        <CardColumn>
                          <SectionLabel>Orders</SectionLabel>
                          <OrderCount $hasOrders={client.orders > 0}>
                            <FaReceipt /> {client.orders}
                          </OrderCount>
                        </CardColumn>
                        <CardColumn>
                          <SectionLabel>Total Spent</SectionLabel>
                          <SpentAmount>{formatCurrency(client.totalSpent)}</SpentAmount>
                        </CardColumn>
                      </CardRow>
                    </CardBody>
                    
                    <CardFooter onClick={(e) => e.stopPropagation()}>
                      <ActionButton $primary onClick={() => viewClientDetails(client.id)} title="View Details">
                        <FaEye />
                      </ActionButton>
                      <ActionButton $info onClick={() => editClient(client.id)} title="Edit Client">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton 
                        onClick={() => toggleClientStatus(client.id)}
                        title={client.status === 'banned' ? 'Unban Client' : 'Ban Client'}
                        $warning={client.status !== 'banned'}
                        $success={client.status === 'banned'}
                      >
                        {client.status === 'banned' ? <FaUnlock /> : <FaBan />}
                      </ActionButton>
                      <ActionButton 
                        onClick={() => deleteClient(client.id)}
                        title="Delete Client"
                        $danger
                      >
                        <FaTrash />
                      </ActionButton>
                    </CardFooter>
                  </ClientCard>
                ))}
              </ClientCardList>
            ) : (
              <EmptyState>
                <EmptyStateIcon>
                  <FaFilter />
                </EmptyStateIcon>
                <EmptyStateTitle>No clients found</EmptyStateTitle>
                <EmptyStateText>No clients match your search criteria</EmptyStateText>
                <EmptyStateAction onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}>
                  Clear Filters
                </EmptyStateAction>
              </EmptyState>
            )}
          </MobileView>
          
          {/* Modals */}
          <ClientDetailModal 
            isOpen={showDetailModal}
            client={selectedClient}
            onClose={() => setShowDetailModal(false)}
          />
          
          <ClientEditModal 
            isOpen={showEditModal}
            client={selectedClient}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveClient}
          />
          
          <DeleteClientModal 
            isOpen={showDeleteModal}
            client={selectedClient}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteConfirm}
          />
        </>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 0.75rem 0 1.5rem 0;
  max-width: 100%;
  margin: 0;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const PageHeader = styled.header`
  margin: 0 1rem 1.5rem 0;
  background-color: ${props => props.theme.colors.background.default};
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  animation: ${slideInFromBottom} 0.5s ease-out;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text.primary};
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 3px;
  }
`;

const PageDescription = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.95rem;
  max-width: 600px;
`;

const ControlPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 0 1rem 1.5rem 0;
  background-color: ${props => props.theme.colors.background.default};
  border-radius: 20px;
  padding: 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 16px;
  padding: 0 1rem;
  flex: 1;
  height: 50px;
  border: 1px solid ${props => props.theme.colors.border.light};
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  padding: 0.75rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.primary};
  width: 100%;
  
  &:focus {
    outline: none;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.text.placeholder};
  }
`;

const FiltersSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
  font-weight: 500;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 16px;
  padding: 0 1rem;
  height: 48px;
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const FilterIcon = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
`;

const FilterSelect = styled.select`
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text.primary};
  padding-right: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`;

const ResultsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 1rem 1rem 0;
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 16px;
  padding: 0.75rem 1rem;
`;

const ResultsSummary = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const ResultsCount = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ResultsActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ResultsViewToggle = styled.div`
  // Toggle button styles would go here
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  margin-right: 1rem;
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 3px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingMessage = styled.div`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  margin-right: 1rem;
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 20px;
  color: ${props => props.theme.colors.text.secondary};
  animation: ${fadeIn} 0.5s ease-out;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  
  > svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0.5rem 0;
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
`;

const EmptyStateIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.text.secondary}40;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
`;

const EmptyStateAction = styled.button`
  margin-top: 1rem;
  background-color: transparent;
  border: 1px solid ${props => props.theme.colors.border.light};
  color: ${props => props.theme.colors.primary};
  border-radius: 6px;
  padding: 0.6rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const DesktopView = styled.div`
  display: block;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ClientsTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.colors.background.default};
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.hover};
  }
`;

const TableBody = styled.tbody`
  > tr {
    opacity: 0;
    animation: ${slideInFromRight} 0.3s ease forwards;
    
    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;
      }
    }
  }
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${props => props.theme.colors.border.light};
  }
  
  transition: background-color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.hover};
    transform: translateX(3px);
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.95rem;
  color: ${props => props.theme.colors.text.primary};
  transition: all 0.2s ease;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: calc(0.05s * var(--index, 0));
`;

const ClientCell = styled(TableCell)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ClientAvatarImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ClientInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClientNameText = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ClientDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ClientEmail = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ClientPhone = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const OrderCount = styled.div<{ $hasOrders: boolean }>`
  color: ${props => props.$hasOrders ? props.theme.colors.text.primary : props.theme.colors.text.secondary};
  font-weight: ${props => props.$hasOrders ? '500' : '400'};
`;

const ClientStatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background-color: ${props => {
    const color = getStatusColor(props.$status);
    return `${color}20`; // 20% opacity
  }};
  color: ${props => getStatusColor(props.$status)};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px ${props => {
      const color = getStatusColor(props.$status);
      return `${color}40`; // 40% opacity
    }};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ 
  $danger?: boolean; 
  $warning?: boolean; 
  $success?: boolean;
  $info?: boolean;
  $primary?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    if (props.$primary) return `${props.theme.colors.primary}15`;
    if (props.$danger) return `${props.theme.colors.danger}15`;
    if (props.$warning) return `${props.theme.colors.warning}15`;
    if (props.$success) return `${props.theme.colors.success}15`;
    if (props.$info) return `${props.theme.colors.info}15`;
    return props.theme.colors.background.lighter;
  }};
  color: ${props => {
    if (props.$primary) return props.theme.colors.primary;
    if (props.$danger) return props.theme.colors.danger;
    if (props.$warning) return props.theme.colors.warning;
    if (props.$success) return props.theme.colors.success;
    if (props.$info) return props.theme.colors.info;
    return props.theme.colors.text.primary;
  }};
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: ${props => {
      if (props.$primary) return `${props.theme.colors.primary}25`;
      if (props.$danger) return `${props.theme.colors.danger}25`;
      if (props.$warning) return `${props.theme.colors.warning}25`;
      if (props.$success) return `${props.theme.colors.success}25`;
      if (props.$info) return `${props.theme.colors.info}25`;
      return props.theme.colors.background.hover;
    }};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
`;

const MobileView = styled.div`
  display: none;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const ClientCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  > div {
    opacity: 0;
    animation: ${slideInFromBottom} 0.4s ease forwards;
    
    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.07}s;
      }
    }
  }
`;

const ClientCard = styled.div`
  background-color: ${props => props.theme.colors.background.default};
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div<{ $status: string }>`
  padding: 1rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${props => getStatusColor(props.$status)};
  }
`;

const CardHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MobileClientAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MobileClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MobileClientName = styled.div`
  font-weight: 500;
  font-size: 1rem;
`;

const CardBody = styled.div`
  padding: 0 1rem 1rem;
`;

const CardSection = styled.div`
  margin-bottom: 1rem;
`;

const SectionLabel = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const SectionValue = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const CardRow = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const CardColumn = styled.div`
  flex: 1;
`;

const ContactInfoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.colors.text.secondary};
  
  > svg {
    color: ${props => props.theme.colors.primary};
  }
`;

const SpentAmount = styled.div`
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  padding: 0.75rem;
  border-top: 1px solid ${props => props.theme.colors.border.light};
  gap: 0.5rem;
`;

const SortIndicator = styled.span<{ active: boolean; direction: 'asc' | 'desc' }>`
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  opacity: ${props => props.active ? 1 : 0.5};
  transform: ${props => props.direction === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease, opacity 0.2s ease;
  display: flex;
  align-items: center;
`;

const ActionCell = styled(TableCell)`
  padding: 0.5rem;
`;

const ActionSecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary}dd;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.secondary}40;
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
`;

const ClearSearchButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  padding: 0;
  margin: 0;
  font: inherit;
  outline: inherit;
`;

export default DashboardOwnerClientManagement; 
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaChevronDown, FaEye, FaEdit, FaBan, FaExchangeAlt } from 'react-icons/fa';

interface Order {
  id: string;
  customerId: string;
  customerName: string;
  boosterName: string;
  orderDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  service: string;
  amount: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
}

const DashboardOwnerOrderManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('orderDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Simulate fetching orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        const mockOrders: Order[] = [
          {
            id: 'ORD-1001',
            customerId: 'CUST-001',
            customerName: 'John Doe',
            boosterName: 'Alex Smith',
            orderDate: '2023-09-15T10:30:00Z',
            status: 'completed',
            service: 'Rank Boosting',
            amount: 120.00,
            paymentStatus: 'paid',
          },
          {
            id: 'ORD-1002',
            customerId: 'CUST-002',
            customerName: 'Jane Smith',
            boosterName: 'Michael Johnson',
            orderDate: '2023-09-18T14:20:00Z',
            status: 'in-progress',
            service: 'Placement Matches',
            amount: 75.50,
            paymentStatus: 'paid',
          },
          {
            id: 'ORD-1003',
            customerId: 'CUST-003',
            customerName: 'Robert Brown',
            boosterName: 'Pending Assignment',
            orderDate: '2023-09-20T09:15:00Z',
            status: 'pending',
            service: 'Duo Boosting',
            amount: 200.00,
            paymentStatus: 'pending',
          },
          {
            id: 'ORD-1004',
            customerId: 'CUST-004',
            customerName: 'Emily Johnson',
            boosterName: 'William Davis',
            orderDate: '2023-09-10T16:45:00Z',
            status: 'cancelled',
            service: 'Rank Boosting',
            amount: 95.00,
            paymentStatus: 'refunded',
          },
          {
            id: 'ORD-1005',
            customerId: 'CUST-005',
            customerName: 'David Wilson',
            boosterName: 'James Miller',
            orderDate: '2023-09-22T11:10:00Z',
            status: 'in-progress',
            service: 'Coaching',
            amount: 150.00,
            paymentStatus: 'paid',
          },
        ];
        
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...orders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Apply payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        order =>
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.boosterName.toLowerCase().includes(query) ||
          order.service.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'orderDate':
          comparison = new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'customerName':
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredOrders(filtered);
  }, [orders, statusFilter, paymentFilter, searchQuery, sortField, sortDirection]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge $status="pending">Pending</Badge>;
      case 'in-progress':
        return <Badge $status="in-progress">In Progress</Badge>;
      case 'completed':
        return <Badge $status="completed">Completed</Badge>;
      case 'cancelled':
        return <Badge $status="cancelled">Cancelled</Badge>;
      default:
        return <Badge $status="unknown">Unknown</Badge>;
    }
  };

  const getPaymentBadge = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return <Badge $status="paid">Paid</Badge>;
      case 'pending':
        return <Badge $status="pending-payment">Pending</Badge>;
      case 'refunded':
        return <Badge $status="refunded">Refunded</Badge>;
      default:
        return <Badge $status="unknown">Unknown</Badge>;
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleViewDetails = (orderId: string) => {
    console.log(`Viewing details for order ${orderId}`);
  };

  const handleCancelOrder = (orderId: string) => {
    console.log(`Cancelled order ${orderId}`);
  };

  const handleRefundOrder = (orderId: string) => {
    console.log(`Refunded order ${orderId}`);
  };

  const handleReassignBooster = (orderId: string) => {
    console.log(`Reassigning booster for order ${orderId}`);
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading orders...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>Order Management</PageTitle>
        <PageDescription>
          Manage and track all customer orders
        </PageDescription>
      </PageHeader>
      
      {/* Filters and Search */}
      <FiltersContainer>
        <FilterGroup>
          <Select 
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
          
          <Select 
            value={paymentFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPaymentFilter(e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </Select>
        </FilterGroup>
        
        <SearchContainer>
          <SearchInput
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
          <SearchIconWrapper>
            <FaSearch />
          </SearchIconWrapper>
        </SearchContainer>
      </FiltersContainer>

      {/* Orders Count */}
      <ResultsInfo>
        Showing {filteredOrders.length} of {orders.length} orders
      </ResultsInfo>
      
      {/* Orders Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader onClick={() => handleSort('id')}>
                Order ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHeader>
              <TableHeader onClick={() => handleSort('customerName')}>
                Customer {sortField === 'customerName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHeader>
              <TableHeader>Booster</TableHeader>
              <TableHeader onClick={() => handleSort('orderDate')}>
                Date {sortField === 'orderDate' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHeader>
              <TableHeader onClick={() => handleSort('status')}>
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHeader>
              <TableHeader>Service</TableHeader>
              <TableHeader onClick={() => handleSort('amount')}>
                Amount {sortField === 'amount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </TableHeader>
              <TableHeader>Payment</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.boosterName}</TableCell>
                  <TableCell>{formatDate(order.orderDate)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{order.service}</TableCell>
                  <TableCell>${order.amount.toFixed(2)}</TableCell>
                  <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                  <TableCell>
                    <ActionsContainer>
                      <ActionButton onClick={() => handleViewDetails(order.id)} title="View Details">
                        <FaEye />
                      </ActionButton>
                      {order.status !== 'cancelled' && (
                        <ActionButton onClick={() => handleCancelOrder(order.id)} title="Cancel Order" $danger>
                          <FaBan />
                        </ActionButton>
                      )}
                      {order.paymentStatus === 'paid' && order.status !== 'completed' && (
                        <ActionButton onClick={() => handleRefundOrder(order.id)} title="Refund Order" $warning>
                          <FaEdit />
                        </ActionButton>
                      )}
                      {(order.status === 'pending' || order.status === 'in-progress') && (
                        <ActionButton onClick={() => handleReassignBooster(order.id)} title="Reassign Booster">
                          <FaExchangeAlt />
                        </ActionButton>
                      )}
                    </ActionsContainer>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyRow>
                <EmptyMessage>No orders found matching your criteria</EmptyMessage>
              </EmptyRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

const Container = styled.div`
  padding: 1.5rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.textLight};
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Select = styled.select`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  padding-right: 2.5rem;
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 0.75rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.textLight};
  pointer-events: none;
`;

const ResultsInfo = styled.div`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.875rem;
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.background};
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
`;

const Badge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ $status, theme }) => {
    switch ($status) {
      case 'pending':
        return `
          background-color: ${theme.warning}15;
          color: ${theme.warning};
        `;
      case 'pending-payment':
        return `
          background-color: ${theme.warning}15;
          color: ${theme.warning};
        `;
      case 'in-progress':
        return `
          background-color: ${theme.primary}15;
          color: ${theme.primary};
        `;
      case 'completed':
        return `
          background-color: ${theme.success}15;
          color: ${theme.success};
        `;
      case 'cancelled':
      case 'refunded':
        return `
          background-color: #e74c3c15;
          color: #e74c3c;
        `;
      default:
        return `
          background-color: ${theme.textLight}15;
          color: ${theme.textLight};
        `;
    }
  }}
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $danger?: boolean; $warning?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  border: none;
  background-color: ${({ $danger, $warning, theme }) => 
    $danger ? '#e74c3c15' : 
    $warning ? `${theme.warning}15` :
    `${theme.primary}15`};
  color: ${({ $danger, $warning, theme }) => 
    $danger ? '#e74c3c' : 
    $warning ? theme.warning :
    theme.primary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${({ $danger, $warning, theme }) => 
      $danger ? '#e74c3c25' : 
      $warning ? `${theme.warning}25` :
      `${theme.primary}25`};
  }
`;

const EmptyRow = styled.tr`
  height: 200px;
`;

const EmptyMessage = styled.td`
  text-align: center;
  padding: 3rem 1rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 1rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
`;

const Spinner = styled.div`
  border: 3px solid ${({ theme }) => theme.border};
  border-top: 3px solid ${({ theme }) => theme.primary};
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.textLight};
`;

export default DashboardOwnerOrderManagement; 
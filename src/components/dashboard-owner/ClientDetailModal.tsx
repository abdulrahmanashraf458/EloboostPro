import React, { useState } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaNetworkWired, FaCalendarAlt, 
  FaGamepad, FaMoneyBillWave, FaCreditCard, FaUserCheck, FaTimes, FaReceipt, 
  FaInfoCircle, FaClipboardList, FaHistory } from 'react-icons/fa';

interface OrderItem {
  id: string;
  date: Date;
  service: string;
  amount: number;
  status: 'completed' | 'in-progress' | 'cancelled';
}

interface ActivityItem {
  id: string;
  date: Date;
  type: 'login' | 'order' | 'payment' | 'support' | 'profile_update';
  description: string;
}

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
  // Optional fields
  address?: string;
  ipAddress?: string;
  lastOrder?: Date;
  preferredGame?: string;
  notes?: string;
  paymentMethod?: string;
  preferredBooster?: string;
}

interface ClientDetailModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
}

// Helper functions
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

// Mock data generators
const generateMockOrders = (clientId: string, count: number): OrderItem[] => {
  const statuses: ('completed' | 'in-progress' | 'cancelled')[] = ['completed', 'in-progress', 'cancelled'];
  const services = ['Boosting Session', 'Coaching Session', 'Game Account Leveling', 'Duo Queue'];
  
  return Array.from({ length: count }).map((_, index) => ({
    id: `ORDER${clientId.substring(1)}${index + 1}`,
    date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90),
    service: services[Math.floor(Math.random() * services.length)],
    amount: 25 + Math.floor(Math.random() * 200),
    status: statuses[Math.floor(Math.random() * (index === 0 ? 2 : 3))] // First order more likely to be completed
  }));
};

const generateMockActivities = (clientId: string, count: number): ActivityItem[] => {
  const types: ('login' | 'order' | 'payment' | 'support' | 'profile_update')[] = 
    ['login', 'order', 'payment', 'support', 'profile_update'];
  
  const descriptions = {
    login: ['Logged in from usual device', 'Logged in from new device', 'Logged in from unusual location'],
    order: ['Placed new order', 'Cancelled order', 'Modified order details'],
    payment: ['Made payment', 'Updated payment method', 'Requested refund'],
    support: ['Contacted support', 'Opened support ticket', 'Resolved support issue'],
    profile_update: ['Updated profile details', 'Changed password', 'Updated notification preferences']
  };
  
  return Array.from({ length: count }).map((_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    return {
      id: `ACT${clientId.substring(1)}${index + 1}`,
      date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30),
      type,
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)]
    };
  });
};

const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ isOpen, client, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'notes' | 'activity'>('overview');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  React.useEffect(() => {
    if (client) {
      // Generate mock data when a client is selected
      setOrders(generateMockOrders(client.id, client.orders));
      setActivities(generateMockActivities(client.id, 5 + Math.floor(Math.random() * 10)));
    }
  }, [client]);
  
  if (!isOpen || !client) return null;
  
  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ClientAvatar>
            <img src={client.avatar} alt={client.name} />
          </ClientAvatar>
          <div>
            <ClientName>{client.name}</ClientName>
            <ClientStatus $status={client.status}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </ClientStatus>
          </div>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <TabsContainer>
          <TabButton 
            $active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            <FaInfoCircle /> Overview
          </TabButton>
          <TabButton 
            $active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            <FaReceipt /> Orders ({client.orders})
          </TabButton>
          <TabButton 
            $active={activeTab === 'notes'} 
            onClick={() => setActiveTab('notes')}
          >
            <FaClipboardList /> Notes
          </TabButton>
          <TabButton 
            $active={activeTab === 'activity'} 
            onClick={() => setActiveTab('activity')}
          >
            <FaHistory /> Activity
          </TabButton>
        </TabsContainer>
        
        <ModalBody>
          {activeTab === 'overview' && (
            <OverviewTab>
              <Section>
                <SectionTitle>Contact Information</SectionTitle>
                <InfoRow>
                  <InfoLabel><FaUser /> Name</InfoLabel>
                  <InfoValue>{client.name}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel><FaEnvelope /> Email</InfoLabel>
                  <InfoValue>{client.email}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel><FaPhone /> Phone</InfoLabel>
                  <InfoValue>{client.phone}</InfoValue>
                </InfoRow>
                {client.address && (
                  <InfoRow>
                    <InfoLabel><FaMapMarkerAlt /> Address</InfoLabel>
                    <InfoValue>{client.address}</InfoValue>
                  </InfoRow>
                )}
              </Section>
              
              <Section>
                <SectionTitle>Order Information</SectionTitle>
                <InfoRow>
                  <InfoLabel><FaReceipt /> Total Orders</InfoLabel>
                  <InfoValue>{client.orders}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel><FaMoneyBillWave /> Total Spent</InfoLabel>
                  <InfoValue>{formatCurrency(client.totalSpent)}</InfoValue>
                </InfoRow>
                {client.lastOrder && (
                  <InfoRow>
                    <InfoLabel><FaCalendarAlt /> Last Order</InfoLabel>
                    <InfoValue>{formatDate(client.lastOrder)}</InfoValue>
                  </InfoRow>
                )}
                {client.preferredGame && (
                  <InfoRow>
                    <InfoLabel><FaGamepad /> Preferred Game</InfoLabel>
                    <InfoValue>{client.preferredGame}</InfoValue>
                  </InfoRow>
                )}
              </Section>
              
              <Section>
                <SectionTitle>Account Information</SectionTitle>
                <InfoRow>
                  <InfoLabel><FaCalendarAlt /> Joined</InfoLabel>
                  <InfoValue>{formatDate(client.joinDate)}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel><FaCalendarAlt /> Last Active</InfoLabel>
                  <InfoValue>{formatTimeAgo(client.lastActive)}</InfoValue>
                </InfoRow>
                {client.ipAddress && (
                  <InfoRow>
                    <InfoLabel><FaNetworkWired /> IP Address</InfoLabel>
                    <InfoValue>{client.ipAddress}</InfoValue>
                  </InfoRow>
                )}
                {client.paymentMethod && (
                  <InfoRow>
                    <InfoLabel><FaCreditCard /> Payment Method</InfoLabel>
                    <InfoValue>{client.paymentMethod}</InfoValue>
                  </InfoRow>
                )}
                {client.preferredBooster && (
                  <InfoRow>
                    <InfoLabel><FaUserCheck /> Preferred Booster</InfoLabel>
                    <InfoValue>{client.preferredBooster}</InfoValue>
                  </InfoRow>
                )}
              </Section>
            </OverviewTab>
          )}
          
          {activeTab === 'orders' && (
            <OrdersTab>
              {orders.length > 0 ? (
                <OrdersList>
                  {orders.map(order => (
                    <OrderItem key={order.id}>
                      <OrderHeader>
                        <OrderId>{order.id}</OrderId>
                        <OrderStatus $status={order.status}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </OrderStatus>
                      </OrderHeader>
                      <OrderBody>
                        <OrderDetail>
                          <OrderLabel>Date</OrderLabel>
                          <OrderValue>{formatDate(order.date)}</OrderValue>
                        </OrderDetail>
                        <OrderDetail>
                          <OrderLabel>Service</OrderLabel>
                          <OrderValue>{order.service}</OrderValue>
                        </OrderDetail>
                        <OrderDetail>
                          <OrderLabel>Amount</OrderLabel>
                          <OrderValue>{formatCurrency(order.amount)}</OrderValue>
                        </OrderDetail>
                      </OrderBody>
                    </OrderItem>
                  ))}
                </OrdersList>
              ) : (
                <EmptyState>
                  No orders found for this client
                </EmptyState>
              )}
            </OrdersTab>
          )}
          
          {activeTab === 'notes' && (
            <NotesTab>
              <NotesArea
                placeholder="Add notes about this client..."
                defaultValue={client.notes || ''}
              />
              <SaveNotesButton>Save Notes</SaveNotesButton>
            </NotesTab>
          )}
          
          {activeTab === 'activity' && (
            <ActivityTab>
              <ActivityTimeline>
                {activities.sort((a, b) => b.date.getTime() - a.date.getTime()).map(activity => (
                  <ActivityItem key={activity.id}>
                    <ActivityIconWrapper $type={activity.type}>
                      {activity.type === 'login' && <FaUser />}
                      {activity.type === 'order' && <FaReceipt />}
                      {activity.type === 'payment' && <FaMoneyBillWave />}
                      {activity.type === 'support' && <FaInfoCircle />}
                      {activity.type === 'profile_update' && <FaUserCheck />}
                    </ActivityIconWrapper>
                    <ActivityContent>
                      <ActivityDescription>{activity.description}</ActivityDescription>
                      <ActivityTime>{formatTimeAgo(activity.date)}</ActivityTime>
                    </ActivityContent>
                  </ActivityItem>
                ))}
              </ActivityTimeline>
            </ActivityTab>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.colors.background.default};
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  position: relative;
`;

const ClientAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ClientName = styled.h2`
  font-size: 1.5rem;
  margin: 0 0 0.25rem;
  font-weight: 600;
`;

const ClientStatus = styled.div<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => {
    switch(props.$status) {
      case 'active':
        return 'rgba(46, 204, 113, 0.2)';
      case 'inactive':
        return 'rgba(243, 156, 18, 0.2)';
      case 'banned':
        return 'rgba(231, 76, 60, 0.2)';
      default:
        return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'active':
        return '#2ecc71';
      case 'inactive':
        return '#f39c12';
      case 'banned':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: ${props => props.theme.colors.text.secondary};
  
  &:hover {
    color: ${props => props.theme.colors.text.primary};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.lighter};
  
  @media (max-width: 600px) {
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.secondary};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.background.hover};
    color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
`;

// Overview Tab
const OverviewTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const InfoLabel = styled.div`
  flex: 0 0 30%;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
  
  @media (max-width: 600px) {
    margin-bottom: 0.25rem;
  }
`;

const InfoValue = styled.div`
  flex: 0 0 70%;
  font-size: 0.9rem;
`;

// Orders Tab
const OrdersTab = styled.div``;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.background.default};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
`;

const OrderId = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

const OrderStatus = styled.div<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background-color: ${props => {
    switch(props.$status) {
      case 'completed':
        return 'rgba(46, 204, 113, 0.2)';
      case 'in-progress':
        return 'rgba(52, 152, 219, 0.2)';
      case 'cancelled':
        return 'rgba(231, 76, 60, 0.2)';
      default:
        return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'completed':
        return '#2ecc71';
      case 'in-progress':
        return '#3498db';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }};
`;

const OrderBody = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const OrderDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const OrderLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

const OrderValue = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  background-color: ${props => props.theme.colors.background.lighter};
  border-radius: 8px;
`;

// Notes Tab
const NotesTab = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NotesArea = styled.textarea`
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border.light};
  background-color: ${props => props.theme.colors.background.lighter};
  min-height: 200px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SaveNotesButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  align-self: flex-end;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

// Activity Tab
const ActivityTab = styled.div``;

const ActivityTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ActivityItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const ActivityIconWrapper = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch(props.$type) {
      case 'login':
        return 'rgba(52, 152, 219, 0.2)';
      case 'order':
        return 'rgba(46, 204, 113, 0.2)';
      case 'payment':
        return 'rgba(241, 196, 15, 0.2)';
      case 'support':
        return 'rgba(155, 89, 182, 0.2)';
      case 'profile_update':
        return 'rgba(230, 126, 34, 0.2)';
      default:
        return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.$type) {
      case 'login':
        return '#3498db';
      case 'order':
        return '#2ecc71';
      case 'payment':
        return '#f1c40f';
      case 'support':
        return '#9b59b6';
      case 'profile_update':
        return '#e67e22';
      default:
        return '#95a5a6';
    }
  }};
  flex-shrink: 0;
`;

const ActivityContent = styled.div`
  flex-grow: 1;
`;

const ActivityDescription = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.text.secondary};
`;

export default ClientDetailModal; 
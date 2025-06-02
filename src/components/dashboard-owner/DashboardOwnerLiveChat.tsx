import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaSearch, FaFilter, FaComment, FaUser, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

interface Message {
  id: string;
  sender: 'client' | 'booster';
  text: string;
  timestamp: Date;
  orderId: string;
}

interface ChatSession {
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
    status: 'online' | 'offline';
  };
  lastActivity: Date;
  hasUnreadMessages: boolean;
  hasFlag: boolean;
  messages: Message[];
}

const FlagIndicator = styled.div`
  color: #e74c3c;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  animation: pulse-red 2s infinite;
  
  @keyframes pulse-red {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    opacity: 0.3;
    font-size: 2.5rem;
  }
`;

const DashboardOwnerLiveChat: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [flaggedFilter, setFlaggedFilter] = useState<boolean | null>(null);
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Check for mobile view
  useEffect(() => {
    const checkMobileView = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);
      if (isMobile && selectedSession) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    
    // Initial check
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobileView);
  }, [selectedSession]);
  
  // Mock data for demonstration
  useEffect(() => {
    const mockSessions: ChatSession[] = [
      {
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
        lastActivity: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        hasUnreadMessages: true,
        hasFlag: false,
        messages: [
          {
            id: '1',
            sender: 'client',
            text: 'Hey, how is the boosting going?',
            timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
            orderId: 'ORD-1234'
          },
          {
            id: '2',
            sender: 'booster',
            text: 'Going well! I won the last game, now at 45 LP.',
            timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
            orderId: 'ORD-1234'
          },
          {
            id: '3',
            sender: 'client',
            text: 'Great! How many more games do you think it will take?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
            orderId: 'ORD-1234'
          }
        ]
      },
      {
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
          status: 'offline',
        },
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        hasUnreadMessages: false,
        hasFlag: true,
        messages: [
          {
            id: '4',
            sender: 'booster',
            text: 'Hi, I will be your booster for this order.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            orderId: 'ORD-5678'
          },
          {
            id: '5',
            sender: 'client',
            text: 'When will you start boosting?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
            orderId: 'ORD-5678'
          },
          {
            id: '6',
            sender: 'booster',
            text: 'I can start immediately. I might need your account details first.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            orderId: 'ORD-5678'
          }
        ]
      }
    ];
    
    setChatSessions(mockSessions);
    setFilteredSessions(mockSessions);
    setSelectedSession(mockSessions[0]); // Select first session by default
  }, []);
  
  // Filter chat sessions based on search and filter criteria
  useEffect(() => {
    let filtered = [...chatSessions];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.orderId.toLowerCase().includes(query) ||
        session.client.name.toLowerCase().includes(query) ||
        session.booster.name.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.booster.status === statusFilter);
    }
    
    // Apply flagged filter
    if (flaggedFilter !== null) {
      filtered = filtered.filter(session => session.hasFlag === flaggedFilter);
    }
    
    setFilteredSessions(filtered);
  }, [chatSessions, searchQuery, statusFilter, flaggedFilter]);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveMonitoring) return;
    
    const interval = setInterval(() => {
      const randomSessionIndex = Math.floor(Math.random() * chatSessions.length);
      const updatedSessions = [...chatSessions];
      
      if (updatedSessions[randomSessionIndex]) {
        // Add a new message to a random session
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          sender: Math.random() > 0.5 ? 'client' : 'booster',
          text: `Simulated message at ${new Date().toLocaleTimeString()}`,
          timestamp: new Date(),
          orderId: updatedSessions[randomSessionIndex].orderId
        };
        
        updatedSessions[randomSessionIndex] = {
          ...updatedSessions[randomSessionIndex],
          messages: [...updatedSessions[randomSessionIndex].messages, newMessage],
          lastActivity: new Date(),
          hasUnreadMessages: true
        };
        
        setChatSessions(updatedSessions);
        
        // If this is the selected session, scroll to bottom
        if (selectedSession?.orderId === updatedSessions[randomSessionIndex].orderId) {
          setTimeout(() => {
            if (chatContainerRef.current) {
              chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
            }
          }, 100);
        }
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [chatSessions, selectedSession, isLiveMonitoring]);
  
  useEffect(() => {
    // Scroll to bottom when selecting a new chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [selectedSession]);
  
  const toggleLiveMonitoring = () => {
    setIsLiveMonitoring(!isLiveMonitoring);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;
    
    if (diffInHours < 24) {
      return formatTime(date);
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };
  
  const handleSelectSession = (session: ChatSession) => {
    setSelectedSession(session);
    if (isMobileView) {
      setShowSidebar(false);
    }
  };
  
  const handleBackToList = () => {
    setShowSidebar(true);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Live Chat Monitor</PageTitle>
        <PageDescription>
          Monitor conversations between boosters and clients in real-time
        </PageDescription>
      </PageHeader>
      
      <ChatContainer>
        <ChatSidebar $visible={!isMobileView || (isMobileView && showSidebar)}>
          <SidebarHeader>
            <SearchContainer>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput 
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchContainer>
            
            <FiltersContainer>
              <SimpleFilterContainer>
                <SimpleFilterButton 
                  $active={statusFilter === 'all'} 
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </SimpleFilterButton>
                <SimpleFilterButton 
                  $active={statusFilter === 'online'} 
                  onClick={() => setStatusFilter('online')}
                >
                  Online
                </SimpleFilterButton>
                <SimpleFilterButton 
                  $active={statusFilter === 'offline'} 
                  onClick={() => setStatusFilter('offline')}
                >
                  Offline
                </SimpleFilterButton>
              </SimpleFilterContainer>
              
              <LiveMonitorIndicator>
                <LiveDot />
                Live Monitoring: ON
              </LiveMonitorIndicator>
            </FiltersContainer>
          </SidebarHeader>
          
          <ConversationsList>
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <ConversationItem 
                  key={session.orderId}
                  $active={selectedSession?.orderId === session.orderId}
                  $hasUnread={session.hasUnreadMessages}
                  onClick={() => handleSelectSession(session)}
                >
                  <ConversationAvatar>
                    <img src={session.client.avatar} alt={session.client.name} />
                  </ConversationAvatar>
                  
                  <ConversationInfo>
                    <ConversationHeader>
                      <ConversationTitle>
                        {session.client.name} (Client) / {session.booster.name} (Booster)
                      </ConversationTitle>
                      <ConversationTime>
                        {formatDate(session.lastActivity)}
                      </ConversationTime>
                    </ConversationHeader>
                    
                    <ConversationPreview>
                      <OrderId>{session.orderId}</OrderId>
                      <BoosterStatus $status={session.booster.status}>
                        {session.booster.status.toUpperCase()}
                      </BoosterStatus>
                      {session.hasFlag && (
                        <FlagIndicator>
                          <FaExclamationTriangle />
                        </FlagIndicator>
                      )}
                    </ConversationPreview>
                  </ConversationInfo>
                </ConversationItem>
              ))
            ) : (
              <EmptyState>No conversations found</EmptyState>
            )}
          </ConversationsList>
        </ChatSidebar>
        
        <ChatMain $visible={!isMobileView || (isMobileView && !showSidebar)}>
          {selectedSession ? (
            <>
              <ChatHeader>
                {isMobileView && (
                  <BackButton onClick={handleBackToList}>
                    <FaArrowLeft />
                  </BackButton>
                )}
                <ChatHeaderInfo>
                  <ParticipantCard>
                    <ParticipantAvatar>
                      <img src={selectedSession.client.avatar} alt={selectedSession.client.name} />
                    </ParticipantAvatar>
                    <ParticipantDetails>
                      <ParticipantName>{selectedSession.client.name} (Client)</ParticipantName>
                      <OrderIdLabel>{selectedSession.orderId}</OrderIdLabel>
                    </ParticipantDetails>
                  </ParticipantCard>
                  
                  <ParticipantsConnection>
                    <ConnectionLine />
                  </ParticipantsConnection>
                  
                  <ParticipantCard>
                    <ParticipantAvatar>
                      <img src={selectedSession.booster.avatar} alt={selectedSession.booster.name} />
                      <BoosterStatusIndicator $status={selectedSession.booster.status} />
                    </ParticipantAvatar>
                    <ParticipantDetails>
                      <ParticipantName>{selectedSession.booster.name} (Booster)</ParticipantName>
                      <ParticipantStatusLabel $status={selectedSession.booster.status}>
                        {selectedSession.booster.status.toUpperCase()}
                      </ParticipantStatusLabel>
                    </ParticipantDetails>
                  </ParticipantCard>
                </ChatHeaderInfo>
                
                <ChatControls>
                  <ControlButton 
                    $warning={!selectedSession.hasFlag} 
                    title={selectedSession.hasFlag ? 'Remove flag' : 'Flag conversation'}
                  >
                    <FaExclamationTriangle />
                  </ControlButton>
                </ChatControls>
              </ChatHeader>
              
              <ChatMessagesContainer ref={chatContainerRef}>
                {selectedSession.messages.map(message => (
                  <MessageBubble key={message.id} $sender={message.sender}>
                    <MessageAvatar>
                      <img 
                        src={message.sender === 'client' 
                          ? selectedSession.client.avatar 
                          : selectedSession.booster.avatar
                        } 
                        alt={message.sender}
                      />
                    </MessageAvatar>
                    
                    <MessageContent $sender={message.sender}>
                      <MessageSender $sender={message.sender}>
                        {message.sender === 'client' 
                          ? `${selectedSession.client.name} (Client)` 
                          : `${selectedSession.booster.name} (Booster)`
                        }
                      </MessageSender>
                      <MessageText>{message.text}</MessageText>
                      <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                    </MessageContent>
                  </MessageBubble>
                ))}
              </ChatMessagesContainer>
              
              <ChatActions>
                <InterventionMessage>
                  As an admin, you can only monitor the conversation.
                </InterventionMessage>
              </ChatActions>
            </>
          ) : (
            <NoChatSelected>
              <FaComment size={48} opacity={0.3} />
              <p>Select a conversation to view</p>
            </NoChatSelected>
          )}
        </ChatMain>
      </ChatContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border}33;
  padding-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.primary};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.text}aa;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  height: 75vh;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    height: 85vh;
    flex-direction: column;
    position: relative;
    border-radius: 0.75rem;
  }
`;

const ChatSidebar = styled.div<{ $visible: boolean }>`
  width: 340px;
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.cardBg};

  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: ${({ $visible }) => $visible ? 'flex' : 'none'};
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  }
`;

const ChatMain = styled.div<{ $visible: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.cardBg};
  
  @media (max-width: 768px) {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    display: ${({ $visible }) => $visible ? 'flex' : 'none'};
  }
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.background}55;
  border: none;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text};
  margin-right: 0.75rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    margin-right: 0;
    padding: 0.5rem;
  }
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
  
  &:active {
    background: ${({ theme }) => theme.primary}22;
  }
`;

const SidebarHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.cardBg};
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
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
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SimpleFilterContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const SimpleFilterButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.6rem 0.5rem;
  background-color: ${({ $active, theme }) => $active ? theme.primary : theme.cardBg};
  color: ${({ $active, theme }) => $active ? 'white' : theme.text};
  border: none;
  cursor: pointer;
  font-weight: ${({ $active }) => $active ? 'bold' : 'normal'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $active, theme }) => $active ? theme.primary : theme.hover};
  }
  
  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.border};
  }
`;

const LiveMonitorIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${({ theme }) => `${theme.primary}22`};
  color: ${({ theme }) => theme.primary};
  border-radius: 0.5rem;
  font-weight: 500;
`;

const LiveDot = styled.div`
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background-color: #2ecc71;
  box-shadow: 0 0 5px rgba(46, 204, 113, 0.5);
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.7);
    }
    70% {
      box-shadow: 0 0 0 5px rgba(46, 204, 113, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(46, 204, 113, 0);
    }
  }
`;

const RoleLabel = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.primary};
`;

const Separator = styled.span`
  margin: 0 0.3rem;
  color: ${({ theme }) => theme.text}aa;
`;

const ClientLabel = styled.div`
  display: none;
`;

const BoosterStatus = styled.div<{ $status: string }>`
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: bold;
  background-color: ${({ $status }) => $status === 'online' ? '#2ecc7133' : '#e74c3c33'};
  color: ${({ $status }) => $status === 'online' ? '#2ecc71' : '#e74c3c'};
`;

const BoosterStatusIndicator = styled.div<{ $status: string }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.cardBg};
  background-color: ${({ $status }) => $status === 'online' ? '#2ecc71' : '#e74c3c'};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const ParticipantStatusLabel = styled.div<{ $status: string }>`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${({ $status }) => $status === 'online' ? '#2ecc71' : '#e74c3c'};
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const ParticipantCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border}33;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    margin: 0;
    min-width: 40%;
    max-width: 45%;
  }
`;

const ParticipantRole = styled.div<{ $isClient?: boolean, $isBooster?: boolean }>`
  display: none;
`;

const MessageRoleIndicator = styled.div<{ $sender: string }>`
  display: none;
`;

const MessageContent = styled.div<{ $sender: string }>`
  background-color: ${({ $sender }) => 
    $sender === 'client' ? '#3498db11' : '#9b59b611'};
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ $sender }) => 
    $sender === 'client' ? '#3498db22' : '#9b59b622'};
    
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    width: 100%;
  }
`;

const MessageSender = styled.div<{ $sender: string }>`
  font-weight: 600;
  font-size: 0.85rem;
  color: ${({ $sender }) => $sender === 'client' ? '#3498db' : '#9b59b6'};
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 0.2rem;
  }
`;

const MessageText = styled.div`
  margin-bottom: 0.4rem;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.3;
  }
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.text}aa;
  text-align: right;
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const ChatActions = styled.div`
  padding: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.cardBg};
`;

const InterventionMessage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
  font-style: italic;
  background-color: ${({ theme }) => theme.background}55;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '•';
    color: ${({ theme }) => theme.primary};
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`;

const NoChatSelected = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text}aa;
  gap: 1rem;
  background-color: ${({ theme }) => theme.background}33;
  
  svg {
    opacity: 0.2;
  }
`;

const ParticipantsConnection = styled.div`
  margin: 0 1rem;
  height: 2px;
  width: 2rem;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const ConnectionLine = styled.div`
  height: 2px;
  width: 100%;
  background-color: ${({ theme }) => theme.border};
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    flex-wrap: wrap;
  }
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: space-between;
    margin-left: 0.5rem;
  }
`;

const ParticipantAvatar = styled.div`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 0.75rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 1.8rem;
    height: 1.8rem;
    margin-right: 0.5rem;
  }
`;

const ParticipantDetails = styled.div`
  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
  }
`;

const ParticipantName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.1rem;
  }
`;

const OrderIdLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}aa;
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const ChatControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ControlButton = styled.button<{ $warning?: boolean, $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${({ $warning, $danger, theme }) => 
    $warning ? '#f39c1211' : 
    $danger ? '#e74c3c11' : 
    theme.hover};
  color: ${({ $warning, $danger, theme }) => 
    $warning ? '#f39c12' : 
    $danger ? '#e74c3c' : 
    theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $warning, $danger, theme }) => 
      $warning ? '#f39c1222' : 
      $danger ? '#e74c3c22' : 
      `${theme.hover}cc`};
  }
`;

const ChatMessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: ${({ theme }) => theme.background}33;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 1rem;
  }
`;

const MessageBubble = styled.div<{ $sender: string }>`
  display: flex;
  gap: 0.75rem;
  max-width: 85%;
  align-self: ${({ $sender }) => $sender === 'client' ? 'flex-start' : 'flex-end'};
  
  @media (max-width: 768px) {
    max-width: 90%;
    gap: 0.5rem;
  }
`;

const MessageAvatar = styled.div`
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    border-radius: 0.5rem;
  }
`;

const ConversationItem = styled.div<{ $active: boolean, $hasUnread: boolean }>`
  display: flex;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border}33;
  cursor: pointer;
  background-color: ${({ $active, theme }) => $active ? `${theme.primary}11` : theme.cardBg};
  transition: all 0.2s ease;
  position: relative;
  
  ${({ $hasUnread, theme }) => $hasUnread && `
    border-left: 4px solid ${theme.primary};
  `}
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  &:active {
    background-color: ${({ theme }) => `${theme.primary}22`};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const ConversationAvatar = styled.div`
  position: relative;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1rem;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.6rem;
    margin-right: 0.75rem;
  }
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    overflow: hidden;
  }
`;

const ConversationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    margin-bottom: 0.25rem;
  }
`;

const ConversationTitle = styled.div`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    max-width: 100%;
  }
`;

const ConversationTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}aa;
  white-space: nowrap;
  margin-left: 0.5rem;
  background: ${({ theme }) => theme.background}55;
  padding: 0.2rem 0.5rem;
  border-radius: 0.25rem;
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.15rem 0.35rem;
  }
`;

const ConversationPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}bb;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-top: 0.1rem;
  }
`;

const OrderId = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.primary};
  padding: 0.2rem 0.5rem;
  background: ${({ theme }) => theme.primary}11;
  border-radius: 0.25rem;
  font-weight: 500;
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.background}33;
  
  @media (max-width: 768px) {
    height: calc(100% - 8rem);
  }
`;

export default DashboardOwnerLiveChat; 
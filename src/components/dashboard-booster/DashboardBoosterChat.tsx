import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaPaperPlane, FaSearch, FaEllipsisV, FaArrowLeft, FaUser } from 'react-icons/fa';
import { FiSmile, FiPaperclip, FiUser } from 'react-icons/fi';

interface Message {
  id: number;
  sender: 'booster' | 'client';
  text: string;
  timestamp: Date;
  read: boolean;
}

interface ClientInfo {
  id: string;
  orderId: string;
  game: string;
  orderType: string;
  startRank: string;
  targetRank: string;
  avatar?: string; // Optional, clients are anonymous
}

const DashboardBoosterChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientInfo | null>(null);
  const [isClientTyping, setIsClientTyping] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileClients, setShowMobileClients] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Mock clients data
  const clients: ClientInfo[] = [
    {
      id: 'client1',
      orderId: 'ORD-123456',
      game: 'League of Legends',
      orderType: 'Solo Boost',
      startRank: 'Silver II',
      targetRank: 'Gold IV'
    },
    {
      id: 'client2',
      orderId: 'ORD-789012',
      game: 'Valorant',
      orderType: 'Rank Boost',
      startRank: 'Bronze III',
      targetRank: 'Silver II'
    }
  ];
  
  // Check for mobile view on resize
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobileView();
    
    // Add resize listener
    window.addEventListener('resize', checkMobileView);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);
  
  // Initialize demo messages
  useEffect(() => {
    if (clients.length > 0 && messages.length === 0) {
      // Set the first client as selected
      setSelectedClient(clients[0]);
      
      // Demo messages
      const demoMessages: Message[] = [
        {
          id: 1,
          sender: 'client',
          text: `Hello, I'm wondering about the progress on my order. How is it going?`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: true
        },
        {
          id: 2,
          sender: 'booster',
          text: `Hi there! I've started working on your order. I've completed 3 games so far and won 2 of them. Your account is now at 35 LP in ${clients[0].startRank}.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9), // 1.9 hours ago
          read: true
        },
        {
          id: 3,
          sender: 'client',
          text: `That's great! How long do you think it will take to reach ${clients[0].targetRank}?`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8), // 1.8 hours ago
          read: true
        },
        {
          id: 4,
          sender: 'booster',
          text: `Based on the current progress, I should be able to complete it within 2-3 days. I'll try to play more games today to speed up the process.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
          read: true
        }
      ];
      
      setMessages(demoMessages);
      
      // Simulate client typing
      const typingTimer = setTimeout(() => {
        setIsClientTyping(true);
        
        // After a delay, add a new message
        const messageTimer = setTimeout(() => {
          setIsClientTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: 5,
              sender: 'client',
              text: 'Thanks for the update! Do you have any specific champions you prefer to play for faster climbing?',
              timestamp: new Date(),
              read: false
            }
          ]);
        }, 3000);
        
        return () => clearTimeout(messageTimer);
      }, 5000);
      
      return () => clearTimeout(typingTimer);
    }
  }, [clients]); // Only depend on clients, not messages
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Add new message
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'booster',
      text: messageInput.trim(),
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simulate client typing and response
    setTimeout(() => {
      setIsClientTyping(true);
      
      // After a delay, add a new message
      setTimeout(() => {
        setIsClientTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 2,
            sender: 'client',
            text: 'I see, thanks for explaining. Looking forward to the next update!',
            timestamp: new Date(),
            read: false
          }
        ]);
      }, 4000);
    }, 2000);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSelectClient = (client: ClientInfo) => {
    setSelectedClient(client);
    if (isMobileView) {
      setShowMobileClients(false);
    }
  };
  
  const handleBackToClients = () => {
    setShowMobileClients(true);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Client Chat</PageTitle>
        <PageDescription>
          Communicate with clients while keeping their identity anonymous
        </PageDescription>
      </PageHeader>
      
      <MonitoringBanner>
        <WarningIcon>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#f03e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12" stroke="#f03e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16H12.01" stroke="#f03e3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </WarningIcon>
        <WarningContent>
          <WarningTitle>⚠️ IMPORTANT: ALL CHATS ARE MONITORED</WarningTitle>
          <WarningMessage>
            All conversations are being recorded and monitored by admins. Attempting to share personal contact information or steal clients will result in immediate termination.
          </WarningMessage>
        </WarningContent>
      </MonitoringBanner>
      
      <ChatContainer>
        <ClientsPanel $visible={!isMobileView || (isMobileView && showMobileClients)}>
          <ClientsPanelHeader>
            <h3>Your Clients</h3>
            <SearchWrapper>
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
              <SearchInput placeholder="Search clients..." />
            </SearchWrapper>
          </ClientsPanelHeader>
          
          <ClientsList>
            {clients.map(client => (
              <ClientItem 
                key={client.id} 
                $active={selectedClient?.id === client.id}
                onClick={() => handleSelectClient(client)}
              >
                <ClientAvatar>
                  <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Anonymous Client" />
                </ClientAvatar>
                <ClientInfoWrapper>
                  <ClientOrderId>{client.orderId}</ClientOrderId>
                  <ClientDetails>
                    {client.game} • {client.orderType}
                  </ClientDetails>
                  <ClientRankProgress>
                    {client.startRank} → {client.targetRank}
                  </ClientRankProgress>
                </ClientInfoWrapper>
              </ClientItem>
            ))}
            
            {clients.length === 0 && (
              <EmptyClientsList>
                No clients associated with your orders yet.
              </EmptyClientsList>
            )}
          </ClientsList>
        </ClientsPanel>
        
        <ChatPanel $visible={!isMobileView || (isMobileView && !showMobileClients)}>
          {selectedClient ? (
            <>
              <ChatHeader>
                {isMobileView && (
                  <BackButton onClick={handleBackToClients}>
                    <FaArrowLeft />
                  </BackButton>
                )}
                <ChatHeaderInfo>
                  <ClientAvatar>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Anonymous Client" />
                  </ClientAvatar>
                  <div>
                    <ClientOrderId>{selectedClient.orderId}</ClientOrderId>
                    <ClientDetails>
                      {selectedClient.game} • {selectedClient.orderType}
                    </ClientDetails>
                  </div>
                </ChatHeaderInfo>
                <ChatHeaderActions>
                  <ChatAction>
                    <FaEllipsisV />
                  </ChatAction>
                </ChatHeaderActions>
              </ChatHeader>
              
              <MessagesContainer>
                <AnonymousNotice>
                  <AnonymousNoticeIcon>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Anonymous Client" width="24" height="24" />
                  </AnonymousNoticeIcon>
                  <AnonymousNoticeText>
                    The client is anonymous. Please maintain professionalism and focus on order details only.
                  </AnonymousNoticeText>
                </AnonymousNotice>
                
                {messages.map(message => (
                  <MessageBubble key={message.id} $sender={message.sender}>
                    <MessageContent $sender={message.sender}>
                      <MessageText>{message.text}</MessageText>
                      <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                    </MessageContent>
                  </MessageBubble>
                ))}
                
                {isClientTyping && (
                  <MessageBubble $sender="client">
                    <MessageContent $sender="client">
                      <TypingIndicator>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                      </TypingIndicator>
                    </MessageContent>
                  </MessageBubble>
                )}
                
                <div ref={messagesEndRef} />
              </MessagesContainer>
              
              <ChatInputContainer>
                <ChatInputWrapper>
                  <ChatInput
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <ChatInputActions>
                    <ChatInputAction>
                      <FiPaperclip />
                    </ChatInputAction>
                    <ChatInputAction>
                      <FiSmile />
                    </ChatInputAction>
                  </ChatInputActions>
                </ChatInputWrapper>
                <SendButton onClick={handleSendMessage}>
                  <FaPaperPlane />
                </SendButton>
              </ChatInputContainer>
            </>
          ) : (
            <NoChatSelected>
              <div>Select a client to start chatting</div>
            </NoChatSelected>
          )}
        </ChatPanel>
      </ChatContainer>
    </Container>
  );
};

const Container = styled.div`
  @media (max-width: 768px) {
    padding: 0;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  
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

const MonitoringBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(to right, rgba(255, 69, 58, 0.08), rgba(255, 69, 58, 0.03));
  border-left: 4px solid #ff453a;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    gap: 0.75rem;
  }
`;

const WarningIcon = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
  }
`;

const WarningContent = styled.div`
  flex: 1;
`;

const WarningTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #ff453a;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

const WarningMessage = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text};
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const ChatContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.5rem;
  height: 70vh;
  min-height: 500px;
  
  @media (max-width: 992px) {
    grid-template-columns: 250px 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 768px) {
    display: block;
    height: 80vh;
    position: relative;
    border-radius: 0;
  }
`;

const ClientsPanel = styled.div<{ $visible: boolean }>`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
    border-radius: 0;
  }
`;

const ClientsPanelHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    h3 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
  }
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1rem 0.6rem 2.5rem;
    font-size: 0.9rem;
  }
`;

const ClientsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const ClientItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  background: ${({ $active, theme }) => $active ? `${theme.primary}11` : 'transparent'};
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const ClientAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.inputBg};
  margin-right: 1rem;
  flex-shrink: 0;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 0.75rem;
  }
`;

const ClientInfoWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const ClientOrderId = styled.div`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const ClientDetails = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
  margin: 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ClientRankProgress = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const EmptyClientsList = styled.div`
  padding: 2rem 1.25rem;
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const ChatPanel = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  
  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 0;
    display: ${({ $visible }) => ($visible ? 'flex' : 'none')};
    z-index: 5;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  padding: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChatHeaderInfo = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ChatHeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ChatAction = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.body};
  
  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const AnonymousNotice = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.info}11;
  border: 1px dashed ${({ theme }) => theme.info}55;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    margin-bottom: 0.75rem;
  }
`;

const AnonymousNoticeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.info}22;
  color: ${({ theme }) => theme.info};
  margin-right: 0.75rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.8rem;
  }
`;

const AnonymousNoticeText = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.info};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const MessageBubble = styled.div<{ $sender: string }>`
  display: flex;
  ${({ $sender }) => $sender === 'booster' ? 'flex-direction: row-reverse;' : ''}
  align-items: flex-end;
  gap: 0.75rem;
  max-width: 85%;
  align-self: ${({ $sender }) => $sender === 'booster' ? 'flex-end' : 'flex-start'};
  
  @media (max-width: 768px) {
    max-width: 90%;
    gap: 0.5rem;
  }
`;

const MessageContent = styled.div<{ $sender: string }>`
  background: ${({ $sender, theme }) => 
    $sender === 'booster' ? theme.primary : theme.cardBg};
  color: ${({ $sender, theme }) => 
    $sender === 'booster' ? 'white' : theme.text};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  ${({ $sender }) => $sender === 'booster' ? 'border-bottom-right-radius: 0.25rem;' : 'border-bottom-left-radius: 0.25rem;'}
  position: relative;
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.9rem;
    font-size: 0.95rem;
  }
`;

const MessageText = styled.div`
  font-size: 0.95rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const MessageTime = styled.div`
  font-size: 0.7rem;
  opacity: 0.7;
  text-align: right;
  margin-top: 0.25rem;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    background: ${({ theme }) => theme.text}77;
    border-radius: 50%;
    animation: typing 1.5s infinite ease-in-out;
  }
  
  .dot:nth-child(1) {
    animation-delay: 0s;
  }
  
  .dot:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  .dot:nth-child(3) {
    animation-delay: 0.4s;
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-6px);
    }
  }
  
  @media (max-width: 768px) {
    .dot {
      width: 0.4rem;
      height: 0.4rem;
    }
  }
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
`;

const ChatInputWrapper = styled.div`
  flex: 1;
  position: relative;
`;

const ChatInput = styled.input`
  width: 100%;
  padding: 0.75rem 4rem 0.75rem 1rem;
  border-radius: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 3.5rem 0.6rem 0.9rem;
    font-size: 0.9rem;
  }
`;

const ChatInputActions = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    right: 0.5rem;
    gap: 0.3rem;
  }
`;

const ChatInputAction = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text}aa;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SendButton = styled.button`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

const NoChatSelected = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text}aa;
  font-size: 1.1rem;
  padding: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1.5rem;
  }
`;

export default DashboardBoosterChat; 
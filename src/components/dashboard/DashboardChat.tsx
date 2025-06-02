import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaUser, FaEllipsisV, FaArrowLeft } from 'react-icons/fa';
import { FiPaperclip, FiSmile, FiSend } from 'react-icons/fi';

interface Message {
  id: number;
  sender: 'user' | 'booster';
  text: string;
  timestamp: Date;
  read: boolean;
}

interface BoosterInfo {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

const DashboardChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedBooster, setSelectedBooster] = useState<BoosterInfo | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showMobileContacts, setShowMobileContacts] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
  // Get the saved order from localStorage if available
  const localOrder = localStorage.getItem('currentOrder');
  const parsedOrder = localOrder ? JSON.parse(localOrder) : null;
  
  // Mock boosters data
  const boosters: BoosterInfo[] = [
    {
      id: 'booster1',
      name: 'Booster #1',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4128/4128176.png',
      status: 'online'
    },
    {
      id: 'booster2',
      name: 'Booster #2',
      avatar: 'https://cdn-icons-png.flaticon.com/512/4128/4128176.png',
      status: 'away',
      lastActive: '30 minutes ago'
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
    if (parsedOrder && messages.length === 0) {
      // Set the first booster as selected
      setSelectedBooster(boosters[0]);
      
      // Demo messages for the order
      const demoMessages: Message[] = [
        {
          id: 1,
          sender: 'booster',
          text: `Hey there! I'm your booster assigned to order ORD-1234. I'll be helping you climb from ${parsedOrder.order.currentRank.tier.charAt(0).toUpperCase() + parsedOrder.order.currentRank.tier.slice(1)} ${parsedOrder.order.currentRank.division} to ${parsedOrder.order.desiredRank.tier.charAt(0).toUpperCase() + parsedOrder.order.desiredRank.tier.slice(1)} ${parsedOrder.order.desiredRank.division}. I'll start working on it right away!`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          read: true
        },
        {
          id: 2,
          sender: 'user',
          text: 'Great! Thanks for the update. How long do you think it will take?',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9), // 1.9 hours ago
          read: true
        },
        {
          id: 3,
          sender: 'booster',
          text: `Based on my experience, I should be able to complete it within ${parsedOrder.estimatedTime}. I'll keep you updated with my progress.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8), // 1.8 hours ago
          read: true
        },
        {
          id: 4,
          sender: 'booster',
          text: "I just completed my first game on your account and it was a win! I'll continue playing to progress with your order.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
          read: true
        }
      ];
      
      setMessages(demoMessages);
      
      // Simulate booster typing
      const typingTimer = setTimeout(() => {
        setIsTyping(true);
        
        // After a delay, add a new message
        const messageTimer = setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: 5,
              sender: 'booster',
              text: 'I just won another game! We\'re making good progress. Currently your account is at 35 LP.',
              timestamp: new Date(),
              read: false
            }
          ]);
        }, 3000);
        
        return () => clearTimeout(messageTimer);
      }, 5000);
      
      return () => clearTimeout(typingTimer);
    }
  }, [parsedOrder, messages.length, boosters]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Add new message
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: messageInput.trim(),
      timestamp: new Date(),
      read: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simulate booster typing and response
    setTimeout(() => {
      setIsTyping(true);
      
      // After a delay, add a new message
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 2,
            sender: 'booster',
            text: 'Thanks for your message! I\'ll continue working on your order to get you to your desired rank as quickly as possible.',
            timestamp: new Date(),
            read: false
          }
        ]);
      }, 3000);
    }, 1500);
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleSelectBooster = (booster: BoosterInfo) => {
    setSelectedBooster(booster);
    if (isMobileView) {
      setShowMobileContacts(false);
    }
  };
  
  const handleBackToContacts = () => {
    setShowMobileContacts(true);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Chat with Booster</PageTitle>
        <PageDescription>
          Communicate with your booster in real-time
        </PageDescription>
      </PageHeader>
      
      <ChatContainer>
        <BoostersPanel $visible={!isMobileView || (isMobileView && showMobileContacts)}>
          <BoostersPanelHeader>
            <h3>Your Boosters</h3>
          </BoostersPanelHeader>
          
          <BoostersList>
            {boosters.map(booster => (
              <BoosterItem 
                key={booster.id} 
                $active={selectedBooster?.id === booster.id}
                onClick={() => handleSelectBooster(booster)}
              >
                <BoosterAvatar>
                  <img src={booster.avatar} alt="Booster" />
                </BoosterAvatar>
                <BoosterInfoWrapper>
                  <BoosterName>{booster.name}</BoosterName>
                  <BoosterStatusText>
                    <span style={{ 
                      display: 'inline-block', 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      background: booster.status === 'online' ? '#2ecc71' : 
                                  booster.status === 'away' ? '#f39c12' : '#95a5a6',
                      marginRight: '4px'
                    }}></span>
                    {booster.status === 'online' ? 'Online' : 
                     booster.status === 'away' ? `Away (${booster.lastActive})` : 
                     `Offline (${booster.lastActive})`}
                  </BoosterStatusText>
                </BoosterInfoWrapper>
              </BoosterItem>
            ))}
            
            {boosters.length === 0 && (
              <EmptyBoostersList>
                No boosters assigned to your orders yet.
              </EmptyBoostersList>
            )}
          </BoostersList>
          
          <BoosterPanelFooter>
            <ContactSupport>
              <FaUser />
              <span>Contact Support</span>
            </ContactSupport>
          </BoosterPanelFooter>
        </BoostersPanel>
        
        <ChatPanel $visible={!isMobileView || (isMobileView && !showMobileContacts)}>
          {selectedBooster ? (
            <>
              <ChatHeader>
                {isMobileView && (
                  <BackButton onClick={handleBackToContacts}>
                    <FaArrowLeft />
                  </BackButton>
                )}
                <ChatHeaderInfo>
                  <BoosterAvatar>
                    <img src={selectedBooster.avatar} alt="Booster" />
                  </BoosterAvatar>
                  <div>
                    <BoosterName>{selectedBooster.name}</BoosterName>
                    <BoosterStatusText>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: selectedBooster.status === 'online' ? '#2ecc71' : 
                                    selectedBooster.status === 'away' ? '#f39c12' : '#95a5a6',
                        marginRight: '4px'
                      }}></span>
                      {selectedBooster.status === 'online' ? 'Online' : 
                      selectedBooster.status === 'away' ? `Away (${selectedBooster.lastActive})` : 
                      `Offline (${selectedBooster.lastActive})`}
                    </BoosterStatusText>
                  </div>
                </ChatHeaderInfo>
                <ChatHeaderActions>
                  <ChatAction>
                    <FaEllipsisV />
                  </ChatAction>
                </ChatHeaderActions>
              </ChatHeader>
              
              <MessagesContainer>
                {messages.map(message => (
                  <MessageBubble key={message.id} $sender={message.sender}>
                    {message.sender === 'booster' && (
                      <MessageAvatar>
                        <img src={selectedBooster.avatar} alt="Booster" />
                      </MessageAvatar>
                    )}
                    <MessageContent $sender={message.sender}>
                      <MessageText>{message.text}</MessageText>
                      <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                    </MessageContent>
                  </MessageBubble>
                ))}
                
                {isTyping && (
                  <MessageBubble $sender="booster">
                    <MessageAvatar>
                      <img src={selectedBooster.avatar} alt="Booster" />
                    </MessageAvatar>
                    <MessageContent $sender="booster">
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
                  <FiSend />
                </SendButton>
              </ChatInputContainer>
            </>
          ) : (
            <NoChatSelected>
              <div>Select a booster to start chatting</div>
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

const BoostersPanel = styled.div<{ $visible: boolean }>`
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

const BoostersPanelHeader = styled.div`
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    
    h3 {
      font-size: 1rem;
    }
  }
`;

const BoostersList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
  
  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }
`;

const BoosterItem = styled.div<{ $active: boolean }>`
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

const BoosterAvatar = styled.div`
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 1rem;
  flex-shrink: 0;
  
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

const BoosterInfoWrapper = styled.div`
  flex: 1;
  overflow: hidden;
`;

const BoosterName = styled.div`
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const BoosterStatusText = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const BoosterPanelFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

const ContactSupport = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const EmptyBoostersList = styled.div`
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

const MessageBubble = styled.div<{ $sender: string }>`
  display: flex;
  ${({ $sender }) => $sender === 'user' ? 'flex-direction: row-reverse;' : ''}
  align-items: flex-end;
  gap: 0.75rem;
  max-width: 85%;
  align-self: ${({ $sender }) => $sender === 'user' ? 'flex-end' : 'flex-start'};
  
  @media (max-width: 768px) {
    max-width: 90%;
    gap: 0.5rem;
  }
`;

const MessageAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
  }
`;

const MessageContent = styled.div<{ $sender: string }>`
  background: ${({ $sender, theme }) => 
    $sender === 'user' ? theme.primary : theme.cardBg};
  color: ${({ $sender, theme }) => 
    $sender === 'user' ? 'white' : theme.text};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  ${({ $sender }) => $sender === 'user' ? 'border-bottom-right-radius: 0.25rem;' : 'border-bottom-left-radius: 0.25rem;'}
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

export default DashboardChat; 
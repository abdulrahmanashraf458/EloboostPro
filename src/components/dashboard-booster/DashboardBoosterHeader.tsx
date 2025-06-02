import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaBars, FaMoon, FaSun, FaHome, FaBell, FaUser, FaTasks, FaCalendarCheck, FaStar } from 'react-icons/fa';
import { useLocation, Link } from 'react-router-dom';

interface DashboardBoosterHeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

type NotificationType = 'order' | 'message' | 'update';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  time: string;
  read: boolean;
}

const DashboardBoosterHeader: React.FC<DashboardBoosterHeaderProps> = ({ 
  toggleSidebar, 
  toggleTheme,
  darkMode
}) => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'order',
      message: 'New order available: LOL Boosting',
      time: '5 min ago',
      read: false
    },
    {
      id: 2,
      type: 'message',
      message: 'Message from Admin: Your last order was completed successfully!',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'update',
      message: 'System update: New dashboard features available',
      time: '1 day ago',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(notif => !notif.read).length;

  useEffect(() => {
    // Update page title based on location
    const path = location.pathname;
    if (path.includes('/booster/dashboard')) {
      setPageTitle('Dashboard');
    } else if (path.includes('/booster/orders')) {
      setPageTitle('Orders');
    } else if (path.includes('/booster/available-orders')) {
      setPageTitle('Available Orders');
    } else if (path.includes('/booster/profile')) {
      setPageTitle('Profile');
    } else if (path.includes('/booster/earnings')) {
      setPageTitle('Earnings');
    } else if (path.includes('/booster/settings')) {
      setPageTitle('Settings');
    }
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return <FaTasks className="notification-icon order" />;
      case 'message':
        return <FaCalendarCheck className="notification-icon message" />;
      case 'update':
        return <FaStar className="notification-icon update" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={toggleSidebar}>
          <FaBars />
        </MenuButton>
        <HeaderTitle>{pageTitle}</HeaderTitle>
      </HeaderLeft>
      
      <HeaderRight>
        <HomeButton to="/">
          <FaHome />
          <HomeButtonText>Home</HomeButtonText>
        </HomeButton>
        
        <HeaderIconWrapper>
          <ThemeToggle onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </ThemeToggle>
        </HeaderIconWrapper>
        
        <HeaderIconWrapper ref={notificationRef}>
          <NotificationButton 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            $hasUnread={unreadCount > 0}
          >
            <FaBell />
            {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
          </NotificationButton>
          
          {notificationsOpen && (
            <NotificationsDropdown>
              <NotificationHeader>
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <MarkAllRead onClick={markAllAsRead}>
                    Mark all as read
                  </MarkAllRead>
                )}
              </NotificationHeader>
              
              {notifications.length > 0 ? (
                <NotificationList>
                  {notifications.map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      $read={notification.read}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <NotificationIconContainer>
                        {getNotificationIcon(notification.type)}
                      </NotificationIconContainer>
                      <NotificationContent>
                        <NotificationMessage>{notification.message}</NotificationMessage>
                        <NotificationTime>{notification.time}</NotificationTime>
                      </NotificationContent>
                    </NotificationItem>
                  ))}
                </NotificationList>
              ) : (
                <EmptyNotifications>
                  No notifications
                </EmptyNotifications>
              )}
            </NotificationsDropdown>
          )}
        </HeaderIconWrapper>
        
        <HeaderIconWrapper ref={userMenuRef}>
          <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <FaUser />
          </UserButton>
          
          {userMenuOpen && (
            <UserDropdown>
              <UserInfo>
                <UserAvatar>
                  <FaUser />
                </UserAvatar>
                <div>
                  <UserName>John Booster</UserName>
                  <UserRole>Elite Booster</UserRole>
                </div>
              </UserInfo>
              
              <UserMenuDivider />
              
              <UserMenuItem to="/booster/profile">
                Profile
              </UserMenuItem>
              <UserMenuItem to="/booster/settings">
                Settings
              </UserMenuItem>
              <UserMenuItem to="/auth/logout">
                Logout
              </UserMenuItem>
            </UserDropdown>
          )}
        </HeaderIconWrapper>
      </HeaderRight>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: calc(100% - var(--sidebar-width, 0px));
  height: 70px;
  margin-left: var(--sidebar-width, 0px);
  transition: width 0.2s ease, margin-left 0.2s ease;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    width: 100%;
    margin-left: 0;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HomeButton = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  margin-right: 15px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 576px) {
    margin-right: 10px;
  }
`;

const HomeButtonText = styled.span`
  margin-left: 5px;
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const HeaderIconWrapper = styled.div`
  position: relative;
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const NotificationButton = styled.button<{ $hasUnread: boolean }>`
  background: none;
  border: none;
  color: ${({ $hasUnread, theme }) => $hasUnread ? 'var(--accent-color)' : theme.text};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #e74c3c;
  color: white;
  font-size: 0.7rem;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const NotificationsDropdown = styled.div`
  position: absolute;
  top: 45px;
  right: -10px;
  width: 320px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  
  @media (max-width: 576px) {
    width: 280px;
    right: -70px;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  h4 {
    margin: 0;
    font-weight: 600;
  }
`;

const MarkAllRead = styled.button`
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NotificationList = styled.div`
  max-height: 350px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ $read: boolean }>`
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ $read, theme }) => 
    $read ? theme.cardBg : theme.hover};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationIconContainer = styled.div`
  margin-right: 12px;
  display: flex;
  align-items: flex-start;
  padding-top: 3px;
  
  .notification-icon {
    font-size: 1rem;
    
    &.order {
      color: #3498db;
    }
    
    &.message {
      color: #2ecc71;
    }
    
    &.update {
      color: #f39c12;
    }
  }
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationMessage = styled.p`
  margin: 0 0 5px 0;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight};
`;

const EmptyNotifications = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.textLight};
`;

const UserButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  width: 220px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  
  @media (max-width: 576px) {
    right: -20px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--accent-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight};
`;

const UserMenuDivider = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const UserMenuItem = styled(Link)`
  display: block;
  padding: 12px 15px;
  text-decoration: none;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

export default DashboardBoosterHeader; 
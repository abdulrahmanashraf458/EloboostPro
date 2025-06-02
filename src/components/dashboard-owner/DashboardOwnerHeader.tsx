import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaRegBell, FaMoon, FaSun, FaUserCircle, FaCog, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleTheme: () => void;
  darkMode: boolean;
}

const DashboardOwnerHeader: React.FC<HeaderProps> = ({ 
  toggleSidebar, 
  toggleTheme, 
  darkMode 
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      message: 'New order #1234 has been created',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'booster',
      message: 'Booster RankHero is now online',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 3,
      type: 'chat',
      message: 'New support message from client',
      time: '30 minutes ago',
      read: true
    }
  ]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    // Navigate to home page
    window.location.href = '/';
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar}>
          <FaBars />
        </MenuButton>
        <HeaderTitle>Owner Dashboard</HeaderTitle>
      </LeftSection>
      
      <RightSection>
        <HomeButton to="/" title="Go to Home Page">
          <FaHome />
        </HomeButton>
        
        <ThemeToggle onClick={toggleTheme} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </ThemeToggle>
        
        <NotificationsWrapper ref={notificationsRef}>
          <NotificationsButton 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <FaRegBell />
            {notifications.some(n => !n.read) && <NotificationBadge />}
          </NotificationsButton>
          
          {showNotifications && (
            <NotificationsDropdown>
              <NotificationsHeader>
                <h4>Notifications</h4>
                <MarkReadButton onClick={markAllAsRead}>Mark all as read</MarkReadButton>
              </NotificationsHeader>
              {notifications.length > 0 ? (
                <NotificationsList>
                  {notifications.map(notification => (
                    <NotificationItem key={notification.id} $read={notification.read}>
                      <NotificationContent>
                        <NotificationMessage>{notification.message}</NotificationMessage>
                        <NotificationTime>{notification.time}</NotificationTime>
                      </NotificationContent>
                    </NotificationItem>
                  ))}
                </NotificationsList>
              ) : (
                <EmptyNotifications>
                  <p>No new notifications</p>
                </EmptyNotifications>
              )}
            </NotificationsDropdown>
          )}
        </NotificationsWrapper>
        
        <ProfileWrapper ref={profileRef}>
          <ProfileButton 
            onClick={() => setShowProfile(!showProfile)}
            title="Profile"
          >
            <FaUserCircle />
          </ProfileButton>
          
          {showProfile && (
            <ProfileDropdown>
              <ProfileHeader>
                <ProfileAvatar>
                  <FaUserCircle />
                </ProfileAvatar>
                <ProfileInfo>
                  <ProfileName>Admin User</ProfileName>
                  <ProfileEmail>admin@example.com</ProfileEmail>
                </ProfileInfo>
              </ProfileHeader>
              
              <ProfileActions>
                <ProfileAction to="/owner/settings">
                  <FaCog />
                  <span>Settings</span>
                </ProfileAction>
                
                <ProfileActionButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Logout</span>
                </ProfileActionButton>
              </ProfileActions>
            </ProfileDropdown>
          )}
        </ProfileWrapper>
      </RightSection>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 768px) {
    font-size: 1.4rem;
    background-color: ${({ theme }) => theme.hover};
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const NotificationsWrapper = styled.div`
  position: relative;
`;

const NotificationsButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  position: relative;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 0.6rem;
  height: 0.6rem;
  background: ${({ theme }) => theme.primary};
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.cardBg};
`;

const NotificationsDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  min-width: 300px;
  max-width: 350px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  margin-top: 0.5rem;
  
  @media (max-width: 480px) {
    left: -100px;
    min-width: 280px;
  }
`;

const NotificationsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  h4 {
    margin: 0;
    font-size: 1rem;
  }
`;

const MarkReadButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const NotificationsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const NotificationItem = styled.div<{ $read: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ $read, theme }) => $read ? 'transparent' : `${theme.primary}08`};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const NotificationContent = styled.div``;

const NotificationMessage = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const NotificationTime = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text}aa;
`;

const EmptyNotifications = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${({ theme }) => theme.text}aa;
`;

const ProfileWrapper = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  width: 250px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  margin-top: 0.5rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ProfileAvatar = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  margin-right: 1rem;
`;

const ProfileInfo = styled.div``;

const ProfileName = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ProfileEmail = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
`;

const ProfileActions = styled.div`
  padding: 0.5rem;
`;

const ProfileAction = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  
  svg {
    margin-right: 0.75rem;
  }
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const ProfileActionButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  text-align: left;
  border-radius: 0.5rem;
  
  svg {
    margin-right: 0.75rem;
  }
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const HomeButton = styled(NavLink)`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

export default DashboardOwnerHeader; 
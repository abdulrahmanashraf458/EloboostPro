import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaHome, FaInbox,
  FaCog, FaSignOutAlt, FaTasks, FaListAlt, FaBell
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const DashboardBoosterSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === `/booster${path}`;
  };
  
  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <LogoContainer>
          {isOpen ? (
            <Logo>Booster Dashboard</Logo>
          ) : (
            <Logo>B</Logo>
          )}
        </LogoContainer>
      </SidebarHeader>
      
      <ProfileSection>
        {isOpen ? (
          <>
            <ProfileAvatar>
              <img src="https://i.pravatar.cc/150?img=12" alt="Booster" />
            </ProfileAvatar>
            <ProfileInfo>
              <ProfileName>{user?.username || user?.email || 'Booster'}</ProfileName>
              <ProfileRole>Pro Booster</ProfileRole>
            </ProfileInfo>
          </>
        ) : (
          <ProfileAvatar>
            <img src="https://i.pravatar.cc/150?img=12" alt="Booster" />
          </ProfileAvatar>
        )}
      </ProfileSection>
      
      <NavSection>
        <NavItem 
          active={isActive('')} 
          as={Link} 
          to="/booster"
          title="Dashboard"
        >
          <NavIcon>
            <FaHome />
          </NavIcon>
          {isOpen && <NavText>Dashboard</NavText>}
        </NavItem>
        
        <NavItem 
          active={isActive('/available-orders')} 
          as={Link} 
          to="/booster/available-orders"
          title="Available Orders"
        >
          <NavIcon>
            <FaListAlt />
          </NavIcon>
          {isOpen && <NavText>Available Orders</NavText>}
        </NavItem>
        
        <NavItem 
          active={isActive('/orders')} 
          as={Link} 
          to="/booster/orders"
          title="Active Orders"
        >
          <NavIcon>
            <FaTasks />
          </NavIcon>
          {isOpen && <NavText>Active Orders</NavText>}
        </NavItem>
        
        <NavItem 
          active={isActive('/chat')} 
          as={Link} 
          to="/booster/chat"
          title="Client Chat"
        >
          <NavIcon>
            <FaInbox />
          </NavIcon>
          {isOpen && <NavText>Client Chat</NavText>}
        </NavItem>
        
        <NavItem 
          active={isActive('/notifications')} 
          as={Link} 
          to="/booster/notifications"
          title="Notifications"
        >
          <NavIcon>
            <FaBell />
          </NavIcon>
          {isOpen && <NavText>Notifications</NavText>}
        </NavItem>
        
        <NavItem 
          active={isActive('/settings')} 
          as={Link} 
          to="/booster/settings"
          title="Settings"
        >
          <NavIcon>
            <FaCog />
          </NavIcon>
          {isOpen && <NavText>Settings</NavText>}
        </NavItem>
      </NavSection>
      
      <FooterSection>
        <LogoutButton 
          onClick={logout} 
          as="button"
          title="Logout"
        >
          <NavIcon>
            <FaSignOutAlt />
          </NavIcon>
          {isOpen && <NavText>Logout</NavText>}
        </LogoutButton>
      </FooterSection>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ $isOpen }) => ($isOpen ? '250px' : '70px')};
  background-color: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.border};
  transition: width 0.2s ease-out;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow-y: auto;
  height: 100vh;
  
  @media (max-width: 768px) {
    width: ${({ $isOpen }) => ($isOpen ? '250px' : '0')};
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  min-height: 70px;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: center;
`;

const Logo = styled.div`
  color: ${({ theme }) => theme.primary};
  font-weight: 700;
  font-size: 1.25rem;
  white-space: nowrap;
  text-align: center;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileInfo = styled.div`
  margin-left: 0.75rem;
  overflow: hidden;
`;

const ProfileName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
`;

const ProfileRole = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight};
  white-space: nowrap;
`;

const NavSection = styled.div`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const NavItem = styled.a<{ active?: boolean; $isLogout?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${({ active, $isLogout, theme }) => {
    if ($isLogout) return '#e74c3c';
    return active ? theme.primary : theme.text;
  }};
  text-decoration: none;
  transition: background-color 0.2s ease;
  border-left: 3px solid ${({ active, theme }) => (active ? theme.primary : 'transparent')};
  background: ${({ active, theme }) => (active ? `${theme.primary}11` : 'transparent')};
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
    color: ${({ $isLogout, theme }) => ($isLogout ? '#c0392b' : theme.primary)};
  }
`;

const NavIcon = styled.div`
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.75rem;
`;

const NavText = styled.div`
  margin-left: 0.75rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const FooterSection = styled.div`
  padding: 1rem 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const LogoutButton = styled(NavItem)`
  color: #e74c3c;
  
  &:hover {
    color: #c0392b;
  }
`;

export default DashboardBoosterSidebar;
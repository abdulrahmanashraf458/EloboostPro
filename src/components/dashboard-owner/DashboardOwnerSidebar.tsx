import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaClipboardList, FaUsersCog, FaChartLine, FaComments, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { MdSupervisorAccount } from 'react-icons/md';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar?: () => void;
}

const DashboardOwnerSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    // Navigate to home page
    window.location.href = '/';
  };
  
  const handleNavItemClick = (path: string) => {
    navigate(path);
    if (window.innerWidth <= 768) {
      toggleSidebar?.();
    }
  };
  
  return (
    <SidebarContainer $isOpen={isOpen}>
      <LogoContainer>
        {isOpen ? (
          <Logo>
            <LogoText>Owner</LogoText>
            <span>Dashboard</span>
          </Logo>
        ) : (
          <SmallLogo>
            <LogoText>O</LogoText>
          </SmallLogo>
        )}
        <CloseButton onClick={toggleSidebar}>
          <FaTimes />
        </CloseButton>
      </LogoContainer>
      
      <NavItems>
        <NavItem 
          to="/owner" 
          $isActive={location.pathname === '/owner' || location.pathname === '/owner/dashboard'}
          title="Dashboard"
          onClick={() => handleNavItemClick('/owner')}
        >
          <NavIcon>
            <FaHome />
          </NavIcon>
          {isOpen && <NavText>Dashboard</NavText>}
        </NavItem>
        
        <NavItem 
          to="/owner/orders" 
          $isActive={location.pathname.includes('/owner/orders')}
          title="Order Tracking"
          onClick={() => handleNavItemClick('/owner/orders')}
        >
          <NavIcon>
            <FaClipboardList />
          </NavIcon>
          {isOpen && <NavText>Order Tracking</NavText>}
        </NavItem>
        
        <NavItem 
          to="/owner/boosters" 
          $isActive={location.pathname.includes('/owner/boosters')}
          title="Booster Management"
          onClick={() => handleNavItemClick('/owner/boosters')}
        >
          <NavIcon>
            <FaUsersCog />
          </NavIcon>
          {isOpen && <NavText>Boosters</NavText>}
        </NavItem>
        
        <NavItem 
          to="/owner/clients" 
          $isActive={location.pathname.includes('/owner/clients')}
          title="Client Management"
          onClick={() => handleNavItemClick('/owner/clients')}
        >
          <NavIcon>
            <MdSupervisorAccount />
          </NavIcon>
          {isOpen && <NavText>Clients</NavText>}
        </NavItem>
        
        <NavItem 
          to="/owner/analytics" 
          $isActive={location.pathname.includes('/owner/analytics')}
          title="Analytics"
          onClick={() => handleNavItemClick('/owner/analytics')}
        >
          <NavIcon>
            <FaChartLine />
          </NavIcon>
          {isOpen && <NavText>Analytics</NavText>}
        </NavItem>
        
        <NavItem 
          to="/owner/livechat" 
          $isActive={location.pathname.includes('/owner/livechat')}
          title="Live Chat Monitor"
          onClick={() => handleNavItemClick('/owner/livechat')}
        >
          <NavIcon>
            <FaComments />
          </NavIcon>
          {isOpen && <NavText>Live Chat</NavText>}
        </NavItem>
        
        <NavItem 
          to="/owner/settings" 
          $isActive={location.pathname.includes('/owner/settings')}
          title="Settings"
          onClick={() => handleNavItemClick('/owner/settings')}
        >
          <NavIcon>
            <FaCog />
          </NavIcon>
          {isOpen && <NavText>Settings</NavText>}
        </NavItem>
      </NavItems>
      
      <SidebarFooter>
        <LogoutButton onClick={handleLogout} title="Logout">
          <NavIcon>
            <FaSignOutAlt />
          </NavIcon>
          {isOpen && <NavText>Logout</NavText>}
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.$isOpen ? '280px' : '80px'};
  background-color: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.border};
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow-y: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    width: ${props => props.$isOpen ? '280px' : '0'};
    transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.$isOpen ? '0 0 15px rgba(0, 0, 0, 0.2)' : 'none'};
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const LogoText = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  letter-spacing: 1px;
`;

const SmallLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem 0.75rem;
  flex: 1;
  overflow-y: auto;
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  
  /* IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const NavItem = styled(NavLink)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: ${({ $isActive, theme }) => $isActive ? theme.primary : theme.text};
  background-color: ${({ $isActive, theme }) => $isActive ? `${theme.primary}11` : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  min-width: 24px;
`;

const NavText = styled.span`
  margin-left: 1rem;
  font-weight: 500;
`;

const SidebarFooter = styled.div`
  padding: 1.5rem 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #e74c3c;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

export default DashboardOwnerSidebar; 
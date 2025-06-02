import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  FaList, 
  FaComment, 
  FaCog, 
  FaSignOutAlt, 
  FaTachometerAlt 
} from 'react-icons/fa';

// Define all styled components at the top so they can be used in the component
const NavItemWithTooltip = styled.div`
  position: relative;
  width: 100%;
`;

interface DashboardSidebarProps {
  user: any;
  isOpen: boolean;
  isMobile: boolean;
  handleSidebarClose: () => void;
  handleLogout: () => void;
  onClose: () => void;
  minimized: boolean;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  user,
  isOpen,
  isMobile,
  handleSidebarClose,
  handleLogout,
  onClose,
  minimized
}) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Calculate if link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const showTooltip = minimized && !isMobile && hoveredItem !== null;

  useEffect(() => {
    const updateTooltipPosition = (e: MouseEvent) => {
      const tooltip = document.getElementById('sidebarTooltip');
      if (tooltip) {
        document.documentElement.style.setProperty('--tooltip-y', `${e.clientY}px`);
      }
    };
  
    window.addEventListener('mousemove', updateTooltipPosition);
    
    return () => {
      window.removeEventListener('mousemove', updateTooltipPosition);
    };
  }, []);

  return (
    <>
      <Sidebar isOpen={isOpen} minimized={minimized && !isMobile}>
        <SidebarHeader minimized={minimized && !isMobile}>
          {!minimized || isMobile ? (
            <>
              <SidebarLogo>
                <Link to="/">
                  <LogoText>
                    <span>ELO</span>Boost<span>Pro</span>
                  </LogoText>
                </Link>
              </SidebarLogo>
              <MobileClose onClick={onClose}>
                &times;
              </MobileClose>
            </>
          ) : (
            <MinimizedLogo>
              <span>E</span>
            </MinimizedLogo>
          )}
        </SidebarHeader>
        
        <UserProfileContainer minimized={minimized && !isMobile}>
          {(!minimized || isMobile) ? (
            <UserProfile>
              <UserAvatar src={user?.avatar || 'https://i.pravatar.cc/150?u=user123'} alt={user?.username} />
              <UserInfo>
                <UserName>{user?.username || 'User123'}</UserName>
                <UserEmail>{user?.email || 'user@example.com'}</UserEmail>
              </UserInfo>
            </UserProfile>
          ) : (
            <MinimizedUserProfile
              onMouseEnter={() => setHoveredItem('profile')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <UserAvatar src={user?.avatar || 'https://i.pravatar.cc/150?u=user123'} alt={user?.username} />
            </MinimizedUserProfile>
          )}
        </UserProfileContainer>
        
        <SidebarNav>
          <SidebarNavItem 
            onMouseEnter={() => setHoveredItem('/dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
            active={isActive('/dashboard')}
            hovered={hoveredItem === '/dashboard'}
          >
            <SidebarNavLink to="/dashboard" end onClick={handleSidebarClose} minimized={minimized && !isMobile}>
              <NavIcon active={isActive('/dashboard')}>
                <FaTachometerAlt />
              </NavIcon>
              <NavTextWrapper minimized={minimized && !isMobile}>
                {(!minimized || isMobile) && <NavText>Dashboard</NavText>}
              </NavTextWrapper>
              {(isActive('/dashboard') || hoveredItem === '/dashboard') && <ActiveIndicator />}
            </SidebarNavLink>
          </SidebarNavItem>

          <SidebarNavItem 
            onMouseEnter={() => setHoveredItem('/dashboard/orders')}
            onMouseLeave={() => setHoveredItem(null)}
            active={isActive('/dashboard/orders')}
            hovered={hoveredItem === '/dashboard/orders'}
          >
            <SidebarNavLink to="/dashboard/orders" onClick={handleSidebarClose} minimized={minimized && !isMobile}>
              <NavIcon active={isActive('/dashboard/orders')}>
                <FaList />
              </NavIcon>
              <NavTextWrapper minimized={minimized && !isMobile}>
                {(!minimized || isMobile) && <NavText>My Orders</NavText>}
              </NavTextWrapper>
              {(isActive('/dashboard/orders') || hoveredItem === '/dashboard/orders') && <ActiveIndicator />}
            </SidebarNavLink>
          </SidebarNavItem>

          <SidebarNavItem 
            onMouseEnter={() => setHoveredItem('/dashboard/chat')}
            onMouseLeave={() => setHoveredItem(null)}
            active={isActive('/dashboard/chat')}
            hovered={hoveredItem === '/dashboard/chat'}
          >
            <SidebarNavLink to="/dashboard/chat" onClick={handleSidebarClose} minimized={minimized && !isMobile}>
              <NavIcon active={isActive('/dashboard/chat')}>
                <FaComment />
              </NavIcon>
              <NavTextWrapper minimized={minimized && !isMobile}>
                {(!minimized || isMobile) && <NavText>Chat with Booster</NavText>}
              </NavTextWrapper>
              {(isActive('/dashboard/chat') || hoveredItem === '/dashboard/chat') && <ActiveIndicator />}
            </SidebarNavLink>
          </SidebarNavItem>

          <SidebarNavItem 
            onMouseEnter={() => setHoveredItem('/dashboard/settings')}
            onMouseLeave={() => setHoveredItem(null)}
            active={isActive('/dashboard/settings')}
            hovered={hoveredItem === '/dashboard/settings'}
          >
            <SidebarNavLink to="/dashboard/settings" onClick={handleSidebarClose} minimized={minimized && !isMobile}>
              <NavIcon active={isActive('/dashboard/settings')}>
                <FaCog />
              </NavIcon>
              <NavTextWrapper minimized={minimized && !isMobile}>
                {(!minimized || isMobile) && <NavText>Settings</NavText>}
              </NavTextWrapper>
              {(isActive('/dashboard/settings') || hoveredItem === '/dashboard/settings') && <ActiveIndicator />}
            </SidebarNavLink>
          </SidebarNavItem>
        </SidebarNav>
        
        <SidebarFooter minimized={minimized && !isMobile}>
          {(!minimized || isMobile) ? (
            <SidebarButton onClick={handleLogout}>
              <NavIcon>
                <FaSignOutAlt />
              </NavIcon>
              <LogoutTextWrapper>
                <span>Logout</span>
              </LogoutTextWrapper>
            </SidebarButton>
          ) : (
            <MinimizedLogoutContainer
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <MinimizedLogout onClick={handleLogout}>
                <FaSignOutAlt />
              </MinimizedLogout>
            </MinimizedLogoutContainer>
          )}
        </SidebarFooter>
      </Sidebar>

      {/* Fixed global tooltip that follows cursor */}
      {showTooltip && (
        <GlobalTooltip id="sidebarTooltip">
          {hoveredItem === 'profile' && 'Profile: ' + (user?.username || 'User123')}
          {hoveredItem === '/dashboard' && 'Dashboard'}
          {hoveredItem === '/dashboard/orders' && 'My Orders'}
          {hoveredItem === '/dashboard/chat' && 'Chat with Booster'}
          {hoveredItem === '/dashboard/settings' && 'Settings'}
          {hoveredItem === 'logout' && 'Logout'}
        </GlobalTooltip>
      )}
    </>
  );
};

const GlobalTooltip = styled.div`
  position: fixed;
  left: 85px;
  top: calc(var(--tooltip-y, 50vh) - 15px);
  background-color: #5c4adb;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 9999;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 6px solid #5c4adb;
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: ${({ theme }) => theme.primary};
  border-radius: 4px 0 0 4px;
  transition: all 0.3s ease;
`;

const Sidebar = styled.aside<{ isOpen: boolean; minimized: boolean }>`
  width: ${({ minimized }) => minimized ? '70px' : '280px'};
  background: ${({ theme }) => theme.cardBg};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 50;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  box-shadow: ${({ isOpen, theme }) => isOpen ? '0 0 20px rgba(0,0,0,0.1)' : 'none'};
  overflow-y: auto;
  height: 100vh;
  
  @media (max-width: 992px) {
    width: 250px;
  }
  
  @media (max-width: 576px) {
    width: 100%;
  }
`;

const SidebarHeader = styled.div<{ minimized: boolean }>`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: ${({ minimized }) => minimized ? 'center' : 'space-between'};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SidebarLogo = styled.div``;

const MinimizedLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  width: 100%;
  text-align: center;
  
  span {
    color: ${({ theme }) => theme.primary};
    font-size: 2rem;
  }
`;

const LogoText = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  
  span {
    color: ${({ theme }) => theme.primary};
  }
`;

const MobileClose = styled.button`
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 992px) {
    display: flex;
  }
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const UserProfileContainer = styled.div<{ minimized: boolean }>`
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

const UserProfile = styled.div`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const UserAvatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 1.5rem 0;
  flex: 1;
  overflow-y: auto;
`;

const SidebarNavItem = styled.li<{ active: boolean; hovered: boolean }>`
  margin-bottom: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
  background: ${({ active, hovered, theme }) => 
    active ? `${theme.primary}15` : 
    hovered ? `${theme.hover}` : 'transparent'
  };
`;

const NavIcon = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 1rem;
  transition: all 0.3s ease;
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
`;

const NavTextWrapper = styled.div<{ minimized: boolean }>`
  opacity: ${({ minimized }) => minimized ? 0 : 1};
  transform: ${({ minimized }) => minimized ? 'translateX(-20px)' : 'translateX(0)'};
  transition: opacity 0.3s ease, transform 0.3s ease;
  max-width: ${({ minimized }) => minimized ? '0' : '200px'};
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
`;

const NavText = styled.span`
  transition: transform 0.3s ease;
`;

const SidebarNavLink = styled(NavLink)<{ minimized: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.875rem ${({ minimized }) => minimized ? '0' : '1.5rem'};
  justify-content: ${({ minimized }) => minimized ? 'center' : 'flex-start'};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${NavIcon} {
    margin-right: ${({ minimized }) => minimized ? '0' : '1rem'};
    transition: margin 0.3s ease;
  }
  
  &.active {
    color: ${({ theme }) => theme.primary};
    font-weight: 600;
    
    ${NavIcon} {
      transform: scale(1.1);
    }
  }
  
  &:hover {
    ${NavIcon} {
      transform: translateX(2px);
    }
  }
  
  @media (max-width: 576px) {
    padding: 1rem 1.5rem;
    
    ${NavIcon} {
      font-size: 1.5rem;
    }
  }
`;

const SidebarFooter = styled.div<{ minimized: boolean }>`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: ${({ minimized }) => minimized ? 'center' : 'flex-start'};
  margin-top: auto;
`;

const SidebarButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #e74c3c;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    color: #c0392b;
    
    ${NavIcon} {
      transform: translateX(2px);
    }
  }
`;

const MinimizedLogoutContainer = styled.div`
  position: relative;
`;

const MinimizedLogout = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  color: #e74c3c;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    color: #c0392b;
  }
`;

const MinimizedUserProfile = styled.div`
  padding: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: relative;
  cursor: pointer;
  
  &:hover {
    ${UserAvatar} {
      transform: scale(1.05);
      box-shadow: 0 0 0 4px rgba(62, 116, 255, 0.2);
    }
  }
`;

const LogoutTextWrapper = styled.div`
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
  flex: 1;
`;

export default DashboardSidebar;
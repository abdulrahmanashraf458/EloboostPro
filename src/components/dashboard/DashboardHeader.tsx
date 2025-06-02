import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaFilter, FaMoon, FaSun, FaBars, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { FiSettings, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import { MenuProps } from '../../styles/StyledComponentTypes';

interface DashboardHeaderProps {
  toggleTheme: () => void;
  theme: string;
  toggleSidebar: () => void;
  userMenuOpen: boolean;
  setUserMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
  userMenuRef: React.RefObject<HTMLDivElement>;
  user: any;
  isMobile: boolean;
  isOpen: boolean;
  minimized: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  toggleTheme,
  theme,
  toggleSidebar,
  userMenuOpen,
  setUserMenuOpen,
  handleLogout,
  userMenuRef,
  user,
  isMobile,
  isOpen,
  minimized
}) => {
  const location = useLocation();

  // Check if path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Header>
      <ToggleSidebarButton onClick={toggleSidebar}>
        {isMobile ? (
          <FaBars />
        ) : (
          minimized ? <FaArrowRight /> : <FaArrowLeft />
        )}
      </ToggleSidebarButton>
      
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <DashboardLogo>
          <span>ELO</span>Boost<span>Pro</span>
        </DashboardLogo>
      </Link>
      
      <HeaderActions>
        <ThemeToggle onClick={toggleTheme}>
          <AnimatedIcon>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </AnimatedIcon>
        </ThemeToggle>
        
        <UserMenuContainer ref={userMenuRef}>
          <UserMenuButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <UserAvatar 
              src={user?.avatar || 'https://i.pravatar.cc/150?u=user123'} 
              alt={user?.username || 'User'} 
              isOpen={userMenuOpen}
            />
          </UserMenuButton>
          <UserDropdown isOpen={userMenuOpen}>
            <DropdownItem isActive={isActive('/dashboard')}>
              <Link to="/dashboard" onClick={() => setUserMenuOpen(false)}>
                <IconWrapper isActive={isActive('/dashboard')}>
                  <FiShoppingBag />
                </IconWrapper>
                Dashboard
              </Link>
            </DropdownItem>
            <DropdownItem isActive={isActive('/dashboard/orders')}>
              <Link to="/dashboard/orders" onClick={() => setUserMenuOpen(false)}>
                <IconWrapper isActive={isActive('/dashboard/orders')}>
                  <FiShoppingBag />
                </IconWrapper>
                My Orders
              </Link>
            </DropdownItem>
            <DropdownItem isActive={isActive('/dashboard/settings')}>
              <Link to="/dashboard/settings" onClick={() => setUserMenuOpen(false)}>
                <IconWrapper isActive={isActive('/dashboard/settings')}>
                  <FiSettings />
                </IconWrapper>
                Settings
              </Link>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem>
              <LogoutButton onClick={handleLogout}>
                <IconWrapper className="logout-icon">
                  <FiLogOut />
                </IconWrapper>
                Logout
              </LogoutButton>
            </DropdownItem>
          </UserDropdown>
        </UserMenuContainer>
      </HeaderActions>
    </Header>
  );
};

const AnimatedIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const Header = styled.header`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background: ${({ theme }) => theme.cardBg};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
`;

const ToggleSidebarButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    background: ${({ theme }) => theme.hover};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const ThemeToggle = styled.button`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  margin-right: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.hover};
    
    ${AnimatedIcon} {
      transform: rotate(15deg) scale(1.1);
    }
  }
  
  &:active {
    ${AnimatedIcon} {
      transform: scale(0.9);
    }
  }
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const UserAvatar = styled.img<{ isOpen: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme, isOpen }) => isOpen ? theme.primary : theme.border};
  transition: all 0.3s ease;
  box-shadow: ${({ isOpen }) => isOpen ? '0 0 0 4px rgba(62, 116, 255, 0.2)' : 'none'};
  
  &:hover {
    box-shadow: 0 0 0 4px rgba(62, 116, 255, 0.2);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const IconWrapper = styled.span<{ isActive?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  transition: transform 0.3s ease;
  color: ${({ isActive, theme }) => isActive ? theme.primary : 'inherit'};
  
  &.logout-icon {
    color: ${({ theme }) => theme.error};
  }
`;

const UserDropdown = styled.div<MenuProps>`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  width: 200px;
  z-index: 100;
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.border};
  transform-origin: top right;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  transform: ${({ isOpen }) => (isOpen ? 'scale(1)' : 'scale(0)')};
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
`;

const DropdownItem = styled.div<{ isActive?: boolean }>`
  background: ${({ isActive, theme }) => isActive ? `${theme.primary}15` : 'transparent'};
  
  a, button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 15px;
    text-decoration: none;
    color: ${({ isActive, theme }) => isActive ? theme.primary : theme.text};
    font-weight: ${({ isActive }) => isActive ? '600' : 'normal'};
    transition: all 0.25s ease;
    
    &:hover {
      background: ${({ theme }) => theme.hover};
      padding-left: 20px;
      
      ${IconWrapper} {
        transform: translateX(3px);
      }
    }
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 8px 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 15px;
  background: none;
  border: none;
  font-size: 14px;
  color: ${({ theme }) => theme.error};
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const DashboardLogo = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0;
  
  span {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export default DashboardHeader; 
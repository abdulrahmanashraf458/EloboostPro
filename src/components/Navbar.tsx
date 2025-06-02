import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUserCircle, FaBars, FaTimes, FaPalette, FaMoon, FaSun, FaHome, FaClipboardList, FaCog, FaCrown, FaRocket } from 'react-icons/fa';
import { FiShoppingBag, FiSettings, FiLogOut, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { StyledNavProps, MobileProps, SelectionProps, MenuProps } from '../styles/StyledComponentTypes';
import ThemeSwitcher from './ThemeSwitcher';
import ThemeManager from './ThemeManager';

interface NavbarProps {
  toggleTheme: () => void;
  theme: string;
  toggleLoginModal: () => void;
  setCustomTheme?: (theme: any) => void;
}

interface LogoImageProps {
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, theme, toggleLoginModal, setCustomTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Check if user is on dashboard
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/owner') || 
                         location.pathname.includes('/booster');
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Handle click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navigate = useNavigate();
  
  // Redirect to homepage when logging out from dashboard
  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    
    if (isDashboardPage) {
      navigate('/');
    } else {
      setTimeout(() => window.location.reload(), 100);
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const toggleUserDropdown = () => {
    console.log("User permissions:", { 
      is_owner: user?.is_owner, 
      is_booster: user?.is_booster 
    });
    setUserDropdownOpen(!userDropdownOpen);
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Don't render navbar on dashboard pages at all - moved after all hooks
  if (isDashboardPage) {
    return null;
  }

  return (
    <StyledNav isScrolled={isScrolled}>
      <NavContainer>
        <LogoContainer>
          <Link to="/">
            <LogoImage 
              src="/images/logo.png" 
              alt="ELOBoostPro" 
              isDarkMode={theme === 'dark'}
            />
          </Link>
        </LogoContainer>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
        
        <NavLinksContainer open={mobileMenuOpen}>
          <NavLinks>
            <NavItem active={isActive('/')}>
              <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
            </NavItem>
            <NavItem active={isActive('/services')}>
              <NavLink to="/services" onClick={closeMobileMenu}>Services</NavLink>
            </NavItem>
            <NavItem active={isActive('/faq')}>
              <NavLink to="/faq" onClick={closeMobileMenu}>FAQ</NavLink>
            </NavItem>
          </NavLinks>
          
          <NavActions>
            {setCustomTheme ? (
              <ThemeManager 
                currentTheme={theme} 
                toggleTheme={toggleTheme}
                setCustomTheme={setCustomTheme}
              />
            ) : (
              <ThemeSwitcher currentTheme={theme} toggleTheme={toggleTheme} />
            )}
            
            {isAuthenticated ? (
              <UserSection ref={userMenuRef}>
                <UserButton onClick={toggleUserDropdown}>
                  {user?.avatar ? (
                    <UserAvatar src={user.avatar} alt={user.username} />
                  ) : (
                    <FaUserCircle />
                  )}
                  <span>{user?.username}</span>
                </UserButton>
                
                {userDropdownOpen && (
                  <UserDropdown isOpen={userDropdownOpen}>
                    {!user?.is_owner && !user?.is_booster && (
                      <>
                        <UserDropdownItem to="/dashboard">
                          <FaHome />
                          Dashboard
                        </UserDropdownItem>
                        <UserDropdownItem to="/dashboard/orders">
                          <FaClipboardList />
                          My Orders
                        </UserDropdownItem>
                        <UserDropdownItem to="/dashboard/settings">
                          <FaCog />
                          Settings
                        </UserDropdownItem>
                      </>
                    )}
                    
                    <UserDropdownItem to="/theme-settings">
                      <FaPalette />
                      Theme Settings
                    </UserDropdownItem>
                    
                    {user?.is_owner && (
                      <UserDropdownItem to="/owner">
                        <FaCrown />
                        Owner Dashboard
                      </UserDropdownItem>
                    )}
                    
                    {user?.is_booster && (
                      <UserDropdownItem to="/booster">
                        <FaRocket />
                        Booster Dashboard
                      </UserDropdownItem>
                    )}
                    
                    <UserDropdownDivider />
                    <LogoutButton onClick={handleLogout}>
                      <FiLogOut />
                      Logout
                    </LogoutButton>
                  </UserDropdown>
                )}
              </UserSection>
            ) : (
              <AuthButtons>
                <LoginButton onClick={() => {
                  toggleLoginModal();
                  closeMobileMenu();
                }}>
                  Log In
                </LoginButton>
                <SignupButton onClick={() => {
                  toggleLoginModal();
                  closeMobileMenu();
                }}>
                  Sign Up
                </SignupButton>
              </AuthButtons>
            )}
          </NavActions>
        </NavLinksContainer>
      </NavContainer>
    </StyledNav>
  );
};

const StyledNav = styled.nav<StyledNavProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: ${({ theme, isScrolled }) => 
    isScrolled ? theme.navBg : 'transparent'};
  box-shadow: ${({ isScrolled, theme }) => 
    isScrolled ? theme.shadow : 'none'};
  backdrop-filter: ${({ isScrolled }) => 
    isScrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s ease;
  padding: ${({ isScrolled }) => (isScrolled ? '0.3rem 0' : '0.5rem 0')};
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const LogoContainer = styled.div`
  z-index: 10;
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img<LogoImageProps>`
  height: 120px;
  width: auto;
  padding: 2px 0;
  filter: ${({ isDarkMode }) => isDarkMode ? 'brightness(1.5)' : 'brightness(1)'};
  transition: filter 0.3s ease;
`;

const MobileMenuButton = styled.button`
  display: none;
  z-index: 60;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.text};
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background: ${({ theme }) => theme.hover};
  }
`;

const NavLinksContainer = styled.div<MobileProps>`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    justify-content: flex-start;
    background: ${({ theme }) => theme.navBg};
    transform: ${({ open }) => (open ? 'translateY(0)' : 'translateY(-100%)')};
    transition: transform 0.3s ease;
    z-index: 50;
    padding-top: 5rem;
    overflow-y: auto;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  margin-right: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    margin-right: 0;
    margin-bottom: 2rem;
  }
`;

const NavItem = styled.li<SelectionProps>`
  margin: 0 0.75rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ active, theme }) => (active ? theme.primary : 'transparent')};
    transition: background-color 0.3s ease;
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
    
    &::after {
      bottom: -8px;
    }
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

const LoginButton = styled.button`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  margin-right: 0.75rem;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.75rem;
    width: 100%;
    text-align: center;
  }
`;

const SignupButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
  
  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
  
  svg {
    font-size: 2.25rem;
    color: ${({ theme }) => theme.primary};
  }
  
  span {
    color: ${({ theme }) => theme.text};
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background-color: ${({ theme }) => theme.hover};
  }
`;

const UserAvatar = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.primary};
  background-color: ${({ theme }) => theme.cardBg};
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
`;

const UserDropdown = styled.div<MenuProps>`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  padding: 0.75rem 0;
  margin-top: 0.5rem;
  display: block;
  z-index: 101;
  border: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-top: 0;
    border-radius: 0.75rem;
    overflow: hidden;
  }
`;

const UserDropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.primary};
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const UserDropdownDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.border};
  margin: 0.5rem 0;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  transition: background-color 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.error};
  }
`;

export default Navbar;
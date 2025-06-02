import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrophy, FaMedal, FaGamepad, FaCrown, FaLevelUpAlt, FaUsers } from 'react-icons/fa';
import { GiCrossedSwords } from 'react-icons/gi';
import { smoothTransition, applyAnimation, fadeIn, scaleIn } from '../styles/animations';

const ServiceNav: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  // Scroll active item into view when path changes
  useEffect(() => {
    if (activeItemRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeItem = activeItemRef.current;
      
      const scrollLeft = activeItem.offsetLeft - (container.clientWidth / 2) + (activeItem.clientWidth / 2);
      
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentPath]);

  // Check if a route is active (exact match or starts with for nested routes)
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <NavContainer ref={scrollRef}>
      <NavWrapper>
        <NavItem 
          to="/boosting-order" 
          $isActive={isActive('/boosting-order')}
          ref={isActive('/boosting-order') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaTrophy />
          </NavIcon>
          <NavText>Division Boosting</NavText>
        </NavItem>
        
        <NavItem 
          to="/placement-matches" 
          $isActive={isActive('/placement-matches')}
          ref={isActive('/placement-matches') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaMedal />
          </NavIcon>
          <NavText>Placement Matches</NavText>
        </NavItem>
        
        <NavItem 
          to="/net-wins-boost" 
          $isActive={isActive('/net-wins-boost')}
          ref={isActive('/net-wins-boost') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaTrophy />
          </NavIcon>
          <NavText>Ranked Net Wins</NavText>
        </NavItem>
        
        <NavItem 
          to="/normal-games" 
          $isActive={isActive('/normal-games')}
          ref={isActive('/normal-games') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaGamepad />
          </NavIcon>
          <NavText>Normal Games</NavText>
        </NavItem>
        
        <NavItem 
          to="/champion-mastery" 
          $isActive={isActive('/champion-mastery')}
          ref={isActive('/champion-mastery') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaCrown />
          </NavIcon>
          <NavText>Champion Mastery</NavText>
        </NavItem>
        
        <NavItem 
          to="/account-leveling" 
          $isActive={isActive('/account-leveling')}
          ref={isActive('/account-leveling') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaLevelUpAlt />
          </NavIcon>
          <NavText>Account Leveling</NavText>
        </NavItem>
        
        <NavItem 
          to="/coaching" 
          $isActive={isActive('/coaching')}
          ref={isActive('/coaching') ? activeItemRef : undefined}
        >
          <NavIcon>
            <FaUsers />
          </NavIcon>
          <NavText>Coaching</NavText>
        </NavItem>
        
        <NavItem 
          to="/arena-boosting" 
          $isActive={isActive('/arena-boosting')}
          ref={isActive('/arena-boosting') ? activeItemRef : undefined}
        >
          <NavIcon>
            <GiCrossedSwords />
          </NavIcon>
          <NavText>Arena Boosting</NavText>
        </NavItem>
      </NavWrapper>
    </NavContainer>
  );
};

const NavContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  margin-bottom: 2rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.primary} ${theme.body}`};
  scroll-behavior: smooth;
  ${applyAnimation(fadeIn, 500)}

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.body};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 10px;
  }
`;

const NavWrapper = styled.div`
  display: flex;
  min-width: min-content;
  padding: 0.75rem;
`;

const NavItem = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  min-width: 120px;
  border-radius: 8px;
  ${smoothTransition('all', 300)}
  position: relative;
  
  background-color: ${({ $isActive, theme }) => $isActive ? theme.primary + '15' : 'transparent'};
  color: ${({ $isActive, theme }) => $isActive ? theme.primary : theme.text};
  
  &:hover {
    background-color: ${({ theme, $isActive }) => $isActive ? theme.primary + '25' : theme.hover};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10%;
    width: 80%;
    height: 3px;
    background-color: ${({ $isActive, theme }) => $isActive ? theme.primary : 'transparent'};
    border-radius: 3px;
    ${smoothTransition('all', 300)}
  }

  ${({ $isActive }) => $isActive && applyAnimation(scaleIn, 400)}
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  ${smoothTransition('transform', 200)}
  ${NavItem}:hover & {
    transform: scale(1.1);
  }
`;

const NavText = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  ${smoothTransition('font-weight', 200)}
  ${NavItem}:hover & {
    font-weight: 600;
  }
`;

export default ServiceNav; 
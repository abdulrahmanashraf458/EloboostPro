import React from 'react';
import styled from 'styled-components';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ThemeSwitcherProps {
  currentTheme: string;
  toggleTheme: () => void;
  showLabel?: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  toggleTheme,
  showLabel = false
}) => {
  return (
    <SwitcherContainer onClick={toggleTheme} aria-label={`Toggle ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}>
      <IconContainer>
        {currentTheme === 'dark' ? <FaSun /> : <FaMoon />}
      </IconContainer>
      {showLabel && (
        <SwitcherLabel>
          {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </SwitcherLabel>
      )}
    </SwitcherContainer>
  );
};

const SwitcherContainer = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover, &:focus {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.hover};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary + '40'};
  }
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
`;

const SwitcherLabel = styled.span`
  margin-left: 0.5rem;
  font-size: 0.9rem;
`;

export default ThemeSwitcher; 
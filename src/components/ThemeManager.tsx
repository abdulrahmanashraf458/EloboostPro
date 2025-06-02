import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSun, FaMoon, FaPalette, FaTimes, FaRedo } from 'react-icons/fa';
import { fadeIn, float } from '../styles/animations';

interface ThemeManagerProps {
  currentTheme: string;
  toggleTheme: () => void;
  setCustomTheme?: (theme: object | null) => void;
}

const ThemeManager: React.FC<ThemeManagerProps> = ({ 
  currentTheme, 
  toggleTheme,
  setCustomTheme
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#6C4BFF');
  const [secondaryColor, setSecondaryColor] = useState('#42D1B8');
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
  
  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
    // Close color picker when closing options
    setActiveColorPicker(null);
  };
  
  const applyCustomTheme = () => {
    if (setCustomTheme) {
      const customTheme = {
        primary: primaryColor,
        secondary: secondaryColor,
      };
      setCustomTheme(customTheme);
    }
    // Close color picker after applying
    setActiveColorPicker(null);
  };
  
  const resetToDefault = () => {
    if (setCustomTheme) {
      setCustomTheme(null);
    }
    // Close color picker after resetting
    setActiveColorPicker(null);
  };
  
  const toggleColorPicker = (pickerName: string) => {
    setActiveColorPicker(prevPicker => prevPicker === pickerName ? null : pickerName);
  };

  const handleColorChange = (color: string, type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setPrimaryColor(color);
    } else {
      setSecondaryColor(color);
    }
  };
  
  return (
    <ThemeManagerContainer>
      <ThemeButton 
        onClick={handleToggleOptions}
        aria-label="Theme Settings"
      >
        <FaPalette />
      </ThemeButton>
      
      {showOptions && (
        <ThemeOptions>
          <ThemeOptionHeader>
            <ThemeOptionTitle>Theme Settings</ThemeOptionTitle>
            <CloseButton onClick={handleToggleOptions}>
              <FaTimes />
            </CloseButton>
          </ThemeOptionHeader>
          
          <ThemeOptionSection>
            <ThemeOptionLabel>Mode</ThemeOptionLabel>
            <ThemeToggleButtons>
              <ThemeToggleButton 
                active={currentTheme === 'light'}
                onClick={currentTheme === 'dark' ? toggleTheme : undefined}
                aria-label="Activate Light Mode"
              >
                <FaSun /> Light
              </ThemeToggleButton>
              <ThemeToggleButton 
                active={currentTheme === 'dark'}
                onClick={currentTheme === 'light' ? toggleTheme : undefined}
                aria-label="Activate Dark Mode"
              >
                <FaMoon /> Dark
              </ThemeToggleButton>
            </ThemeToggleButtons>
          </ThemeOptionSection>
          
          {setCustomTheme && (
            <>
              <ThemeOptionSection>
                <ThemeOptionActions>
                  <ThemeOptionLabel>Custom Colors</ThemeOptionLabel>
                  <DefaultButton 
                    onClick={resetToDefault}
                    aria-label="Reset to default theme"
                  >
                    <FaRedo /> Default
                  </DefaultButton>
                </ThemeOptionActions>

                {/* Improved mobile color picker UI */}
                <ColorPickersContainer>
                  <ColorOptionRow>
                    <ColorPickerText>Primary Color</ColorPickerText>
                    <ColorOption 
                      color={primaryColor} 
                      onClick={() => toggleColorPicker('primary')}
                      active={activeColorPicker === 'primary'}
                    />
                  </ColorOptionRow>
                  
                  <ColorOptionRow>
                    <ColorPickerText>Secondary Color</ColorPickerText>
                    <ColorOption 
                      color={secondaryColor} 
                      onClick={() => toggleColorPicker('secondary')}
                      active={activeColorPicker === 'secondary'}
                    />
                  </ColorOptionRow>
                </ColorPickersContainer>
                
                {activeColorPicker && (
                  <MobileColorPickerOverlay>
                    <MobileColorPickerContent>
                      <MobileColorPickerHeader>
                        <span>Select {activeColorPicker === 'primary' ? 'Primary' : 'Secondary'} Color</span>
                        <CloseButton onClick={() => setActiveColorPicker(null)}>
                          <FaTimes />
                        </CloseButton>
                      </MobileColorPickerHeader>
                      
                      <MobileColorInput
                        type="color"
                        value={activeColorPicker === 'primary' ? primaryColor : secondaryColor}
                        onChange={(e) => handleColorChange(e.target.value, activeColorPicker as 'primary' | 'secondary')}
                      />
                      
                      <ColorHexValue>
                        {activeColorPicker === 'primary' ? primaryColor : secondaryColor}
                      </ColorHexValue>
                      
                      <MobileColorPickerButtons>
                        <MobilePickerButton 
                          onClick={() => setActiveColorPicker(null)}
                          secondary
                        >
                          Cancel
                        </MobilePickerButton>
                        <MobilePickerButton 
                          onClick={() => {
                            // Apply immediately here
                            if (setCustomTheme) {
                              const customTheme = {
                                primary: primaryColor,
                                secondary: secondaryColor,
                              };
                              setCustomTheme(customTheme);
                            }
                            setActiveColorPicker(null);
                          }}
                        >
                          Apply
                        </MobilePickerButton>
                      </MobileColorPickerButtons>
                    </MobileColorPickerContent>
                  </MobileColorPickerOverlay>
                )}
                
                <ApplyButton onClick={applyCustomTheme}>
                  Apply Custom Colors
                </ApplyButton>
              </ThemeOptionSection>
            </>
          )}
        </ThemeOptions>
      )}
    </ThemeManagerContainer>
  );
};

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(10px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromBottom = keyframes`
  from { 
    opacity: 0;
    transform: translateY(100%);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInFromTop = keyframes`
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const ThemeManagerContainer = styled.div`
  position: relative;
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => `${theme.hover}`};
    animation: ${pulse} 0.5s ease-in-out;
  }
  
  @media (max-width: 768px) {
    padding: 0.7rem;
    font-size: 1.3rem;
  }
`;

const ThemeOptions = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: 0.75rem;
  z-index: 100;
  animation: ${slideIn} 0.3s ease-out;
  backdrop-filter: blur(10px);
  
  &:before {
    content: '';
    position: absolute;
    top: -8px;
    right: 10px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid ${({ theme }) => theme.cardBg};
  }
  
  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    margin-top: 0;
    border-radius: 16px 16px 0 0;
    max-height: 80vh;
    overflow-y: auto;
    animation: ${slideInFromBottom} 0.3s ease-out;
    padding: 1.5rem;
    
    &:before {
      display: none;
    }
  }
`;

const ThemeOptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  @media (max-width: 768px) {
    position: sticky;
    top: 0;
    background: ${({ theme }) => theme.cardBg};
    z-index: 5;
    padding: 0.5rem 0 0.75rem;
  }
`;

const ThemeOptionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1.1rem;
    background: ${({ theme }) => theme.hover};
  }
`;

const ThemeOptionSection = styled.div`
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  animation: ${fadeIn} 0.4s ease-out;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ThemeOptionActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const ThemeOptionLabel = styled.p`
  margin: 0 0 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const DefaultButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: ${({ theme }) => theme.hover};
  color: ${({ theme }) => theme.text};
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.primary};
    transform: translateY(-2px);
  }
`;

const ThemeToggleButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

interface ThemeToggleButtonProps {
  active: boolean;
}

const ThemeToggleButton = styled.button<ThemeToggleButtonProps>`
  flex: 1;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ active, theme }) => active ? theme.primary : theme.hover};
  color: ${({ active, theme }) => active ? 'white' : theme.text};
  border: none;
  box-shadow: ${({ active }) => active ? '0 4px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    background: ${({ active, theme }) => active ? theme.primary : theme.border};
    transform: translateY(-2px);
  }
`;

// New mobile-friendly color picker components
const ColorPickersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ColorOptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColorPickerText = styled.span`
  font-size: 0.85rem;
  font-weight: 500;
`;

interface ColorOptionProps {
  color: string;
  active: boolean;
}

const ColorOption = styled.button<ColorOptionProps>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: ${props => props.color};
  cursor: pointer;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  transition: all 0.2s ease;
  box-shadow: ${props => props.active ? 
    `0 0 0 2px ${props.theme.background}, 0 0 0 4px ${props.theme.primary}40` : 
    '0 2px 6px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
  }
`;

const MobileColorPickerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 0.2s ease-out;
`;

const MobileColorPickerContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 16px;
  padding: 1.5rem;
  width: 90%;
  max-width: 340px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: ${slideInFromTop} 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MobileColorPickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  span {
    font-weight: 600;
    font-size: 1rem;
  }
`;

const MobileColorInput = styled.input`
  width: 100%;
  height: 100px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin: 0.5rem 0;
  background: transparent;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ColorHexValue = styled.div`
  font-family: monospace;
  text-align: center;
  font-size: 1rem;
  padding: 0.5rem;
  background: ${({ theme }) => theme.background};
  border-radius: 8px;
  color: ${({ theme }) => theme.text};
  margin: 0.5rem 0;
`;

const MobileColorPickerButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

interface MobilePickerButtonProps {
  secondary?: boolean;
}

const MobilePickerButton = styled.button<MobilePickerButtonProps>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: ${({ secondary, theme }) => secondary ? theme.hover : theme.primary};
  color: ${({ secondary, theme }) => secondary ? theme.text : 'white'};
  
  &:hover {
    transform: translateY(-2px);
    background: ${({ secondary, theme }) => secondary ? theme.border : theme.primaryDark || theme.primary};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const ApplyButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px ${({ theme }) => `${theme.primary}40`};
  
  &:hover {
    background: ${({ theme }) => theme.primaryDark || theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px ${({ theme }) => `${theme.primary}60`};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    margin-top: 0.5rem;
  }
`;

export default ThemeManager;
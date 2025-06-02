import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheck, FaRedo } from 'react-icons/fa';
import { fadeIn } from '../styles/animations';
import { lightTheme, darkTheme } from '../styles/theme';

interface ThemeCustomizerProps {
  currentTheme: string;
  customTheme: any;
  setCustomTheme: (theme: any) => void;
}

const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  currentTheme,
  customTheme,
  setCustomTheme
}) => {
  const baseTheme = currentTheme === 'light' ? lightTheme : darkTheme;
  
  const [colors, setColors] = useState({
    primary: customTheme?.primary || baseTheme.primary,
    secondary: customTheme?.secondary || baseTheme.secondary,
    background: customTheme?.body || baseTheme.body,
    text: customTheme?.text || baseTheme.text,
    cardBg: customTheme?.cardBg || baseTheme.cardBg
  });
  
  // Update colors when theme changes
  useEffect(() => {
    const updatedBaseTheme = currentTheme === 'light' ? lightTheme : darkTheme;
    
    setColors(prev => ({
      primary: customTheme?.primary || updatedBaseTheme.primary,
      secondary: customTheme?.secondary || updatedBaseTheme.secondary,
      background: customTheme?.body || updatedBaseTheme.body,
      text: customTheme?.text || updatedBaseTheme.text,
      cardBg: customTheme?.cardBg || updatedBaseTheme.cardBg
    }));
  }, [currentTheme, customTheme]);
  
  const handleColorChange = (key: string, value: string) => {
    setColors(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const applyCustomTheme = () => {
    setCustomTheme({
      primary: colors.primary,
      secondary: colors.secondary,
      body: colors.background,
      text: colors.text,
      cardBg: colors.cardBg
    });
  };
  
  const resetToDefault = () => {
    const defaultTheme = currentTheme === 'light' ? lightTheme : darkTheme;
    setColors({
      primary: defaultTheme.primary,
      secondary: defaultTheme.secondary,
      background: defaultTheme.body,
      text: defaultTheme.text,
      cardBg: defaultTheme.cardBg
    });
    setCustomTheme(null);
  };
  
  return (
    <CustomizerContainer>
      <CustomizerHeader>
        <CustomizerTitle>تخصيص السمة</CustomizerTitle>
        <ResetButton onClick={resetToDefault} aria-label="إعادة تعيين السمة إلى الإعدادات الافتراضية">
          <FaRedo /> إعادة الضبط
        </ResetButton>
      </CustomizerHeader>
      
      <CustomizerDescription>
        قم بتخصيص ألوان السمة حسب تفضيلاتك الشخصية. يمكنك تغيير الألوان الرئيسية والثانوية، وألوان الخلفية والنص.
      </CustomizerDescription>
      
      <ColorPalette>
        <ColorGroup>
          <ColorLabel>اللون الرئيسي</ColorLabel>
          <ColorInput 
            type="color" 
            value={colors.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
          />
          <ColorHex>{colors.primary}</ColorHex>
        </ColorGroup>
        
        <ColorGroup>
          <ColorLabel>اللون الثانوي</ColorLabel>
          <ColorInput 
            type="color" 
            value={colors.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
          />
          <ColorHex>{colors.secondary}</ColorHex>
        </ColorGroup>
        
        <ColorGroup>
          <ColorLabel>لون الخلفية</ColorLabel>
          <ColorInput 
            type="color" 
            value={colors.background}
            onChange={(e) => handleColorChange('background', e.target.value)}
          />
          <ColorHex>{colors.background}</ColorHex>
        </ColorGroup>
        
        <ColorGroup>
          <ColorLabel>لون النص</ColorLabel>
          <ColorInput 
            type="color" 
            value={colors.text}
            onChange={(e) => handleColorChange('text', e.target.value)}
          />
          <ColorHex>{colors.text}</ColorHex>
        </ColorGroup>
        
        <ColorGroup>
          <ColorLabel>لون البطاقات</ColorLabel>
          <ColorInput 
            type="color" 
            value={colors.cardBg}
            onChange={(e) => handleColorChange('cardBg', e.target.value)}
          />
          <ColorHex>{colors.cardBg}</ColorHex>
        </ColorGroup>
      </ColorPalette>
      
      <ThemePreview style={{
        background: colors.background,
        color: colors.text
      }}>
        <PreviewTitle style={{
          color: colors.text
        }}>معاينة</PreviewTitle>
        
        <PreviewCard style={{
          background: colors.cardBg,
          color: colors.text,
          border: `1px solid ${colors.text}33`
        }}>
          <PreviewCardTitle style={{
            color: colors.primary
          }}>عنوان البطاقة</PreviewCardTitle>
          
          <PreviewCardText>
            هذا نص تجريبي لعرض شكل النص بالألوان المختارة.
          </PreviewCardText>
          
          <PreviewButton style={{
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            color: 'white'
          }}>
            زر عمل
          </PreviewButton>
        </PreviewCard>
      </ThemePreview>
      
      <ApplyButton onClick={applyCustomTheme}>
        <FaCheck /> تطبيق الألوان المخصصة
      </ApplyButton>
    </CustomizerContainer>
  );
};

const CustomizerContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  animation: ${fadeIn} 0.4s ease-out;
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 2rem;
  direction: rtl;
`;

const CustomizerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const CustomizerTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  background: ${({ theme }) => `${theme.hover}`};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => `${theme.border}`};
    color: ${({ theme }) => theme.primary};
  }
`;

const CustomizerDescription = styled.p`
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.textLight || theme.text};
`;

const ColorPalette = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ColorGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColorLabel = styled.label`
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const ColorInput = styled.input`
  height: 40px;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 4px;
  }
`;

const ColorHex = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textLight || theme.text};
  font-family: monospace;
`;

const ThemePreview = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const PreviewTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  text-align: center;
`;

const PreviewCard = styled.div`
  padding: 1.25rem;
  border-radius: 8px;
  max-width: 300px;
  margin: 0 auto;
`;

const PreviewCardTitle = styled.h4`
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
`;

const PreviewCardText = styled.p`
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const PreviewButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.primaryDark || theme.primary};
    opacity: 0.95;
  }
`;

export default ThemeCustomizer; 
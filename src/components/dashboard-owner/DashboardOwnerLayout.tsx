import React, { useState, useEffect, ReactNode, useContext } from 'react';
import styled from 'styled-components';
import DashboardOwnerSidebar from './DashboardOwnerSidebar';
import DashboardOwnerHeader from './DashboardOwnerHeader';
import { ThemeContext } from '../../App';

interface DashboardOwnerLayoutProps {
  children: ReactNode;
}

const DashboardOwnerLayout: React.FC<DashboardOwnerLayoutProps> = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <DashboardContainer>
      <DashboardOwnerSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {isMobile && sidebarOpen && (
        <Overlay onClick={toggleSidebar} />
      )}
      <MainContent $sidebarOpen={sidebarOpen} $isMobile={isMobile}>
        <DashboardOwnerHeader 
          toggleSidebar={toggleSidebar} 
          toggleTheme={toggleTheme} 
          darkMode={theme === 'dark'} 
        />
        <PageContent>
          {children}
        </PageContent>
      </MainContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const MainContent = styled.div<{ $sidebarOpen: boolean, $isMobile: boolean }>`
  flex: 1;
  margin-left: ${({ $sidebarOpen, $isMobile }) => 
    $isMobile ? '0' : ($sidebarOpen ? '280px' : '80px')};
  transition: margin-left 0.3s ease;
  width: 100%;
  overflow-y: auto;
  max-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const PageContent = styled.div`
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export default DashboardOwnerLayout; 
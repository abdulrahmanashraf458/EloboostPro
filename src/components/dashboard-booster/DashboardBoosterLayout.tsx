import React, { useState, useEffect, ReactNode, useContext } from 'react';
import styled from 'styled-components';
import DashboardBoosterSidebar from './DashboardBoosterSidebar';
import DashboardBoosterHeader from './DashboardBoosterHeader';
import { ThemeContext } from '../../App';

interface DashboardBoosterLayoutProps {
  children: ReactNode;
}

const DashboardBoosterLayout: React.FC<DashboardBoosterLayoutProps> = ({ children }) => {
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
    <DashboardContainer data-sidebar-open={sidebarOpen.toString()}>
      <DashboardBoosterSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {isMobile && sidebarOpen && (
        <Overlay onClick={toggleSidebar} />
      )}
      <MainContent $sidebarOpen={sidebarOpen} $isMobile={isMobile}>
        <DashboardBoosterHeader 
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
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
  --sidebar-width: 250px;
  --sidebar-collapsed-width: 70px;
  
  &[data-sidebar-open="false"] {
    --sidebar-width: 70px;
  }
  
  @media (max-width: 768px) {
    --sidebar-width: 0px;
  }
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
    $isMobile ? '0' : ($sidebarOpen ? '250px' : '70px')};
  transition: margin-left 0.2s ease-out;
  width: 100%;
  background-color: ${({ theme }) => theme.body};
  overflow-y: auto;
  max-height: 100vh;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const PageContent = styled.div`
  padding: 1.5rem;
  padding-top: calc(70px + 1.5rem);
  background-color: ${({ theme }) => theme.body};
  
  @media (max-width: 768px) {
    padding: 1rem;
    padding-top: calc(70px + 1rem);
  }
`;

export default DashboardBoosterLayout; 
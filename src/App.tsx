import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import BoosterDashboard from './pages/BoosterDashboard';
import BoostingOrder from './pages/BoostingOrder';
import PlacementMatches from './pages/PlacementMatches';
import NormalGames from './pages/NormalGames';
import ChampionMastery from './pages/ChampionMastery';
import AccountLeveling from './pages/AccountLeveling';
import NotFound from './pages/NotFound';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import NetWinsBoost from './pages/NetWinsBoost';
import Coaching from './pages/Coaching';
import ArenaBoost from './pages/ArenaBoost';
import PageTransition from './components/PageTransition';
import ThemeSettings from './pages/ThemeSettings';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Refund from './pages/Refund';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import { CheckoutProvider } from './context/CheckoutContext';

// Create a theme context to provide theme globally
import React from 'react';

export const ThemeContext = React.createContext({
  theme: 'dark',
  toggleTheme: () => {},
  customTheme: null as any,
  setCustomTheme: (theme: any) => {}
});

interface AnimatedRoutesProps {
  toggleTheme: () => void;
  theme: string;
  customTheme: any;
  setCustomTheme: (theme: object | null) => void;
}

// Animation wrapper component
const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({ toggleTheme, theme, customTheme, setCustomTheme }) => {
  const location = useLocation();
  
  return (
    <PageTransition>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/theme-settings" element={
          <ThemeSettings 
            currentTheme={theme} 
            toggleTheme={toggleTheme} 
            customTheme={customTheme} 
            setCustomTheme={setCustomTheme} 
          />
        } />
        <Route path="/dashboard/*" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        <Route path="/owner/*" element={
          <RequireRole role="owner">
            <OwnerDashboard />
          </RequireRole>
        } />
        <Route path="/booster/*" element={
          <RequireRole role="booster">
            <BoosterDashboard />
          </RequireRole>
        } />
        <Route path="/boosting-order" element={<BoostingOrder />} />
        <Route path="/placement-matches" element={<PlacementMatches />} />
        <Route path="/net-wins-boost" element={<NetWinsBoost />} />
        <Route path="/normal-games" element={<NormalGames />} />
        <Route path="/champion-mastery" element={<ChampionMastery />} />
        <Route path="/account-leveling" element={<AccountLeveling />} />
        <Route path="/coaching" element={<Coaching />} />
        <Route path="/arena-boosting" element={<ArenaBoost />} />
        
        {/* Company Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Support Pages */}
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/refund" element={<Refund />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [customTheme, setCustomTheme] = useState<any>(null);
  
  // Load theme preference from localStorage on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }

    // Load custom theme from localStorage if exists
    const savedCustomTheme = localStorage.getItem('customTheme');
    if (savedCustomTheme) {
      try {
        setCustomTheme(JSON.parse(savedCustomTheme));
      } catch (error) {
        console.error('Failed to parse custom theme', error);
        localStorage.removeItem('customTheme');
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSetCustomTheme = (newCustomTheme: any) => {
    setCustomTheme(newCustomTheme);
    if (newCustomTheme) {
      localStorage.setItem('customTheme', JSON.stringify(newCustomTheme));
    } else {
      localStorage.removeItem('customTheme');
    }
  };

  // Merge base theme with custom theme if exists
  const getActiveTheme = () => {
    const baseTheme = theme === 'light' ? lightTheme : darkTheme;
    
    if (customTheme) {
      return {
        ...baseTheme,
        ...customTheme
      };
    }
    
    return baseTheme;
  };

  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  // Theme context value
  const themeContextValue = {
    theme,
    toggleTheme,
    customTheme,
    setCustomTheme: handleSetCustomTheme
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={themeContextValue}>
        <ThemeProvider theme={getActiveTheme()}>
          <ModalProvider>
            <CheckoutProvider>
              <GlobalStyles theme={getActiveTheme()} />
              <Router>
                <Navbar 
                  toggleTheme={toggleTheme} 
                  theme={theme} 
                  toggleLoginModal={toggleLoginModal}
                  setCustomTheme={handleSetCustomTheme}
                />
                <AnimatedRoutes 
                  toggleTheme={toggleTheme} 
                  theme={theme} 
                  customTheme={customTheme} 
                  setCustomTheme={handleSetCustomTheme} 
                />
                <Footer />
                {showLoginModal && <LoginModal onClose={toggleLoginModal} />}
              </Router>
            </CheckoutProvider>
          </ModalProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaGoogle, FaDiscord, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginWithGoogle, loginWithDiscord } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have a redirect path from a previous attempt to access a protected route
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleGoogleLogin = () => {
    setLoading(true);
    try {
      loginWithGoogle();
      // النظام سيعيد التوجيه تلقائيًا، لا داعي لإغلاق Modal هنا
    } catch (err) {
      setError('Google authentication failed.');
      setLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    setLoading(true);
    try {
      loginWithDiscord();
      // النظام سيعيد التوجيه تلقائيًا، لا داعي لإغلاق Modal هنا
    } catch (err) {
      setError('Discord authentication failed.');
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent className="fadeIn">
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        
        <ModalHeader>
          <ModalTitle>Sign in to continue</ModalTitle>
        </ModalHeader>
        
        <WelcomeText>
          Welcome! Please sign in using one of the following methods:
        </WelcomeText>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <SocialButtons>
          <SocialButton type="button" onClick={handleGoogleLogin} $provider="google" disabled={loading}>
            <FaGoogle /> Continue with Google
          </SocialButton>
          <SocialButton type="button" onClick={handleDiscordLogin} $provider="discord" disabled={loading}>
            <FaDiscord /> Continue with Discord
          </SocialButton>
        </SocialButtons>
        
        <PrivacyText>
          By signing in, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
        </PrivacyText>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  position: relative;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: none;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalTitle = styled.h2`
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const WelcomeText = styled.p`
  text-align: center;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => `${theme.error}11`};
  color: ${({ theme }) => theme.error};
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  text-align: center;
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

interface SocialButtonProps {
  $provider: 'google' | 'discord';
}

const SocialButton = styled.button<SocialButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  
  background-color: ${({ $provider }) => 
    $provider === 'google' ? '#ffffff' : 
    $provider === 'discord' ? '#5865F2' : 
    '#f5f5f5'};
  
  color: ${({ $provider }) => 
    $provider === 'google' ? '#4285F4' : 
    $provider === 'discord' ? '#ffffff' : 
    'inherit'};
  
  border: ${({ $provider }) => 
    $provider === 'google' ? '1px solid #dddddd' : 'none'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PrivacyText = styled.p`
  font-size: 0.75rem;
  text-align: center;
  color: ${({ theme }) => theme.text};
  opacity: 0.6;
  
  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default LoginModal; 
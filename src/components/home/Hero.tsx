import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaShieldAlt } from 'react-icons/fa';
import { fadeIn } from '../../styles/animations';

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle>
          The Leading <HeroTitleHighlight>ELO</HeroTitleHighlight> <br />
          <HeroTitleHighlight>Boost</HeroTitleHighlight> Platform
        </HeroTitle>
        <HeroSubtitle>
          Reach your dream rank effortlessly with the finest
          <HighlightedText> LoL Boost</HighlightedText>, Coaching & Accounts services.
        </HeroSubtitle>
        <HeroActions>
          <PrimaryButton to="/boosting-order" aria-label="Get boosting services">
            Rank Up Now
          </PrimaryButton>
          <SecondaryButton to="/services" aria-label="Purchase accounts">
            Buy Account
          </SecondaryButton>
        </HeroActions>
        <TrustIndicators aria-label="Our trust indicators">
          <TrustItem>
            <CheckIcon aria-hidden="true" />
            <span>Professional Boosters</span>
          </TrustItem>
          <TrustItem>
            <CheckIcon aria-hidden="true" />
            <span>VPN Protected</span>
          </TrustItem>
          <TrustItem>
            <CheckIcon aria-hidden="true" />
            <span>24/7 Support</span>
          </TrustItem>
        </TrustIndicators>
      </HeroContent>
    </HeroSection>
  );
};

const CheckIcon = styled(FaShieldAlt)`
  color: ${({ theme }) => theme.primary};
  margin-right: 0.5rem;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => `${theme.body}`},
    ${({ theme }) => `${theme.cardBg}`}
  );
  
  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  flex: 1;
  padding: 2rem;
  z-index: 2;
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: 992px) {
    padding: 1rem;
    margin-top: 4rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const HeroTitleHighlight = styled.span`
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline;
`;

const HighlightedText = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  color: ${({ theme }) => theme.text}cc;
  margin-bottom: 2.5rem;
  max-width: 600px;
  
  @media (max-width: 992px) {
    margin: 0 auto 2.5rem;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 10px ${({ theme }) => theme.primary}44;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px ${({ theme }) => theme.primary}66;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid ${({ theme }) => theme.border};
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const TrustIndicators = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    justify-content: center;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}cc;
`;

export default Hero; 
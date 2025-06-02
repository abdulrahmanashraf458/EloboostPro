import React from 'react';
import styled from 'styled-components';
import { FaHeadset, FaGamepad, FaShieldAlt } from 'react-icons/fa';

const Features: React.FC = () => {
  return (
    <FeaturesSection id="features">
      <SectionTitle>Our Key Features</SectionTitle>
      <SectionSubtitle>The most satisfying in-game service</SectionSubtitle>
      <FeaturesDescription>
        Forget about frustrating games; reach your deserved rank effortlessly. 
        Whether you're purchasing League, Valorant, or Wild Rift Boosting, 
        you are privileged to all premium features.
      </FeaturesDescription>
      
      <FeatureGrid>
        <FeatureCard>
          <FeatureIconWrapper aria-hidden="true">
            <FaHeadset />
          </FeatureIconWrapper>
          <FeatureCardTitle>24/7 Support</FeatureCardTitle>
          <FeatureCardDescription>
            Use our live support to receive premium help whenever you are in need.
          </FeatureCardDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIconWrapper aria-hidden="true">
            <FaGamepad />
          </FeatureIconWrapper>
          <FeatureCardTitle>Appear Offline</FeatureCardTitle>
          <FeatureCardDescription>
            The booster plays offline, so the process is undetectable from your friend list.
          </FeatureCardDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIconWrapper aria-hidden="true">
            <FaShieldAlt />
          </FeatureIconWrapper>
          <FeatureCardTitle>VPN Protection</FeatureCardTitle>
          <FeatureCardDescription>
            Your account remains safe with our automated VPN system.
          </FeatureCardDescription>
        </FeatureCard>
      </FeatureGrid>
    </FeaturesSection>
  );
};

const FeaturesSection = styled.section`
  padding: 5rem 1.5rem;
  text-align: center;
  background: ${({ theme }) => `${theme.primary}05`};
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: 1rem;
  font-weight: 800;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text}cc;
  margin-bottom: 1.5rem;
`;

const FeaturesDescription = styled.p`
  max-width: 800px;
  margin: 0 auto 3rem;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text}cc;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIconWrapper = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  background: ${({ theme }) => `${theme.primary}22`};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${({ theme }) => theme.primary};
  font-size: 1.5rem;
`;

const FeatureCardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const FeatureCardDescription = styled.p`
  color: ${({ theme }) => theme.text}cc;
  font-size: 0.9rem;
  line-height: 1.6;
`;

export default Features; 
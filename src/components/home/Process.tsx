import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Process: React.FC = () => {
  return (
    <ProcessSection id="process">
      <SectionTitle>Experience Flow</SectionTitle>
      <SectionSubtitle>An effortless rank-up process</SectionSubtitle>
      
      <ProcessSteps>
        <ProcessStep>
          <ProcessStepNumber aria-hidden="true">1</ProcessStepNumber>
          <ProcessStepContent>
            <ProcessStepTitle>Select Your Favored Service</ProcessStepTitle>
            <ProcessStepDescription>
              First, select your game and method of ranking up. There are various ways to reach your desired goal.
            </ProcessStepDescription>
          </ProcessStepContent>
        </ProcessStep>
        
        <ProcessStep>
          <ProcessStepNumber aria-hidden="true">2</ProcessStepNumber>
          <ProcessStepContent>
            <ProcessStepTitle>Complete Payment</ProcessStepTitle>
            <ProcessStepDescription>
              Choose your preferred payment method and complete your order securely.
            </ProcessStepDescription>
          </ProcessStepContent>
        </ProcessStep>
        
        <ProcessStep>
          <ProcessStepNumber aria-hidden="true">3</ProcessStepNumber>
          <ProcessStepContent>
            <ProcessStepTitle>Rank-up</ProcessStepTitle>
            <ProcessStepDescription>
              Follow your order progress and live chat with your booster anytime during the process.
            </ProcessStepDescription>
          </ProcessStepContent>
        </ProcessStep>
      </ProcessSteps>
      
      <ProcessCTA>
        <PrimaryButton to="/boosting-order" aria-label="Start boosting process">
          Get Started
        </PrimaryButton>
      </ProcessCTA>
    </ProcessSection>
  );
};

const ProcessSection = styled.section`
  padding: 5rem 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
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
  margin-bottom: 3rem;
`;

const ProcessSteps = styled.div`
  max-width: 900px;
  margin: 0 auto 3rem;
`;

const ProcessStep = styled.div`
  display: flex;
  margin-bottom: 2.5rem;
  align-items: flex-start;
  text-align: left;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
`;

const ProcessStepNumber = styled.div`
  width: 3rem;
  height: 3rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 2rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const ProcessStepContent = styled.div`
  flex: 1;
`;

const ProcessStepTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
`;

const ProcessStepDescription = styled.p`
  color: ${({ theme }) => theme.text}cc;
  font-size: 1rem;
  line-height: 1.6;
`;

const ProcessCTA = styled.div`
  margin-top: 2rem;
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

export default Process; 
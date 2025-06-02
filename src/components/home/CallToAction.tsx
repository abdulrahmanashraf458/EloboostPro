import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <CtaSection id="cta">
      <CtaContent>
        <CtaTitle>Ready to Climb Ranks?</CtaTitle>
        <CtaDescription>
          Don't waste more time in low ELO. Start playing on your new rank today!
        </CtaDescription>
        <CtaButton to="/boosting-order" aria-label="Start boosting now">
          Start Boosting Now
        </CtaButton>
      </CtaContent>
    </CtaSection>
  );
};

const CtaSection = styled.section`
  padding: 5rem 1.5rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  text-align: center;
  color: white;
`;

const CtaContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  font-weight: 800;
`;

const CtaDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
`;

const CtaButton = styled(Link)`
  display: inline-block;
  padding: 1rem 2.5rem;
  background: white;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 15px rgba(0, 0, 0, 0.2);
  }
`;

export default CallToAction; 
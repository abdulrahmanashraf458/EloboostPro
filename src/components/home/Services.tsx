import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaShieldAlt, FaTrophy, FaChartLine } from 'react-icons/fa';
import { SectionTitle, SectionSubtitle } from '../../styles/sharedComponents';

const Services: React.FC = () => {
  return (
    <ServicesSection id="services">
      <SectionTitle>Our League Services</SectionTitle>
      <SectionSubtitle>Premier League of Legends Boosting Services</SectionSubtitle>
      
      <ServiceCards>
        <ServiceCard>
          <ServiceIcon aria-hidden="true">
            <FaShieldAlt />
          </ServiceIcon>
          <ServiceTitle>Solo/Duo Boosting</ServiceTitle>
          <ServiceDescription>
            Reach your desired rank with our professional Challenger boosters. Fast, secure, and guaranteed results.
          </ServiceDescription>
          <ServiceLink to="/boosting-order" aria-label="Get Solo/Duo boosting">Get Boosted</ServiceLink>
        </ServiceCard>
        
        <ServiceCard>
          <ServiceIcon aria-hidden="true">
            <FaTrophy />
          </ServiceIcon>
          <ServiceTitle>Placement Matches</ServiceTitle>
          <ServiceDescription>
            Maximize your season start with our expert boosters winning your placement matches for optimal rank.
          </ServiceDescription>
          <ServiceLink to="/placement-matches" aria-label="Get placement matches boosting">Start Now</ServiceLink>
        </ServiceCard>
        
        <ServiceCard>
          <ServiceIcon aria-hidden="true">
            <FaChartLine />
          </ServiceIcon>
          <ServiceTitle>Coaching Services</ServiceTitle>
          <ServiceDescription>
            Learn from the best with personalized coaching sessions from our high-elo professional players.
          </ServiceDescription>
          <ServiceLink to="/coaching" aria-label="Book coaching services">Book Coach</ServiceLink>
        </ServiceCard>
      </ServiceCards>
    </ServicesSection>
  );
};

const ServicesSection = styled.section`
  padding: 5rem 1.5rem;
  text-align: center;
`;

const ServiceCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2.5rem 1.5rem;
  transition: all 0.3s ease;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ServiceIcon = styled.div`
  width: 4rem;
  height: 4rem;
  background: ${({ theme }) => `${theme.primary}22`};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: ${({ theme }) => theme.primary};
  font-size: 1.75rem;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.text}cc;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ServiceLink = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-3px);
  }
`;

export default Services; 
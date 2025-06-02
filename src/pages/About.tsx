import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { fadeIn } from '../styles/animations';
import { FaUsers, FaTrophy, FaShieldAlt, FaHandshake, FaChartLine } from 'react-icons/fa';

const About: React.FC = () => {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <AnimatedTitle>About EloBoostPro</AnimatedTitle>
          <HeroDescription>
            Your trusted partner for professional gaming services since 2017
          </HeroDescription>
        </HeroContent>
      </HeroSection>
      
      <ContentSection>
        <ContentContainer>
          <SectionTitle>
            <SectionIcon>
              <FaUsers />
            </SectionIcon>
            Who We Are
          </SectionTitle>
          <Paragraph>
            EloBoostPro is a premier gaming services provider specializing in League of Legends boosting, coaching, and related services. Established in 2017, we've built a reputation for excellence and reliability in the competitive gaming community.
          </Paragraph>
          <Paragraph>
            Our team consists of high-elo players, including former professional gamers and coaches, who are dedicated to delivering the highest quality service to our clients around the world.
          </Paragraph>
          
          <SectionTitle>
            <SectionIcon>
              <FaTrophy />
            </SectionIcon>
            Our Mission
          </SectionTitle>
          <Paragraph>
            We aim to help players achieve their gaming goals through professional boosting, personalized coaching, and strategic guidance. Whether you're looking to climb the ranked ladder, improve specific skills, or simply enjoy the game more, our mission is to provide the support you need.
          </Paragraph>
          
          <SectionTitle>
            <SectionIcon>
              <FaShieldAlt />
            </SectionIcon>
            Our Values
          </SectionTitle>
          <ValueGrid>
            <ValueCard>
              <ValueTitle>Quality</ValueTitle>
              <ValueDescription>We ensure the highest standards in every service we provide.</ValueDescription>
            </ValueCard>
            <ValueCard>
              <ValueTitle>Security</ValueTitle>
              <ValueDescription>Your account safety and privacy are our top priorities.</ValueDescription>
            </ValueCard>
            <ValueCard>
              <ValueTitle>Reliability</ValueTitle>
              <ValueDescription>We deliver on our promises with consistent results.</ValueDescription>
            </ValueCard>
            <ValueCard>
              <ValueTitle>Expertise</ValueTitle>
              <ValueDescription>Our team consists of skilled professionals at the top of their game.</ValueDescription>
            </ValueCard>
          </ValueGrid>
          
          <SectionTitle>
            <SectionIcon>
              <FaHandshake />
            </SectionIcon>
            Why Choose Us
          </SectionTitle>
          <Paragraph>
            With thousands of satisfied customers and a track record of successful boosts, we pride ourselves on:
          </Paragraph>
          <FeatureList>
            <FeatureItem>Experienced boosters from Diamond to Challenger ranks</FeatureItem>
            <FeatureItem>24/7 customer support</FeatureItem>
            <FeatureItem>Secure payment methods</FeatureItem>
            <FeatureItem>VPN protection for account safety</FeatureItem>
            <FeatureItem>Competitive pricing with regular promotions</FeatureItem>
            <FeatureItem>Fast completion times</FeatureItem>
          </FeatureList>
          
          <SectionTitle>
            <SectionIcon>
              <FaChartLine />
            </SectionIcon>
            Our Growth
          </SectionTitle>
          <Paragraph>
            Since our inception, we've grown to serve thousands of players across all regions. We continually expand our services to meet the evolving needs of the gaming community while maintaining our commitment to quality and customer satisfaction.
          </Paragraph>
          
          <ContactInfo>
            <ContactText>
              Have questions about our company? We'd love to hear from you!
            </ContactText>
            <ContactEmail href="mailto:support@eloboostpro.com">
              support@eloboostpro.com
            </ContactEmail>
            <AdditionalLinks>
              <AdditionalLink to="/how-it-works">How It Works</AdditionalLink>
              <AdditionalLink to="/reviews">Reviews</AdditionalLink>
              <AdditionalLink to="/contact">Contact Us</AdditionalLink>
              <AdditionalLink to="/faq">Frequently Asked Questions</AdditionalLink>
            </AdditionalLinks>
          </ContactInfo>
        </ContentContainer>
      </ContentSection>
    </PageContainer>
  );
};

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
  margin-top: 100px;
  
  @media (max-width: 768px) {
    margin-top: 80px;
    padding: 0 1rem 2rem;
  }
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
  background: ${({ theme }) => `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`};
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    margin-bottom: 1.5rem;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const AnimatedTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.8s ease forwards;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const HeroDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  opacity: 0.9;
  animation: ${fadeInUp} 0.8s ease 0.2s forwards;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ContentSection = styled.div`
  animation: ${fadeIn} 1s ease;
`;

const ContentContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: ${({ theme }) => theme.text};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 0.75rem;
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const SectionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.primary}22;
  color: ${({ theme }) => theme.primary};
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 0.75rem;
`;

const Paragraph = styled.p`
  margin-bottom: 1.25rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text}ee;
  font-size: 1rem;
`;

const ValueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const ValueCard = styled.div`
  background: ${({ theme }) => theme.body};
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ValueTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.primary};
`;

const ValueDescription = styled.p`
  color: ${({ theme }) => theme.text}dd;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const FeatureList = styled.ul`
  list-style-type: none;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FeatureItem = styled.li`
  position: relative;
  padding: 0.5rem 0;
  
  &:before {
    content: "✓";
    color: ${({ theme }) => theme.primary};
    position: absolute;
    left: -1.5rem;
    font-weight: bold;
  }
`;

const ContactInfo = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  text-align: center;
`;

const ContactText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const ContactEmail = styled.a`
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AdditionalLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const AdditionalLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-size: 0.95rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default About; 
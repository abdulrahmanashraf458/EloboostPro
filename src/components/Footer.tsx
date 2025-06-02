import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaTwitter, FaDiscord, FaTwitch, FaYoutube, FaEnvelope, FaStar, FaArrowRight } from 'react-icons/fa';
import { fadeIn, fadeInUp, pulse } from '../styles/animations';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  
  // Don't render footer on dashboard, owner, or booster pages
  if (location.pathname.includes('/dashboard') || location.pathname.includes('/owner') || location.pathname.includes('/booster')) {
    return null;
  }
  
  return (
    <FooterWrapper>
      <FooterBackground />
      <FooterShapeTop />
      
      <FooterContainer>
        <FooterTop>
          <FooterLogo>
            <Link to="/">
              <LogoText>
                <LogoSpan>ELO</LogoSpan>Boost<LogoSpan>Pro</LogoSpan>
              </LogoText>
            </Link>
            <FooterTagline>
              Your trusted partner for professional League of Legends boosting services since 2017
            </FooterTagline>
          </FooterLogo>
          
          <FooterNavigation>
            <FooterSection>
              <SectionTitle>
                <SectionIcon><FaStar /></SectionIcon>
                Services
              </SectionTitle>
              <FooterLinks>
                <FooterLink>
                  <FooterLinkItem to="/boosting-order">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    LoL Division Boosting
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/placement-matches">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    LoL Placement Matches
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/net-wins-boost">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    LoL Win Boosting
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/coaching">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    LoL Coaching
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/champion-mastery">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    Champion Mastery
                  </FooterLinkItem>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
            
            <FooterSection>
              <SectionTitle>
                <SectionIcon><FaStar /></SectionIcon>
                Company
              </SectionTitle>
              <FooterLinks>
                <FooterLink>
                  <FooterLinkItem to="/about">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    About Us
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/how-it-works">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    How It Works
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/reviews">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    Reviews
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/contact">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    Contact
                  </FooterLinkItem>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
            
            <FooterSection>
              <SectionTitle>
                <SectionIcon><FaStar /></SectionIcon>
                Support
              </SectionTitle>
              <FooterLinks>
                <FooterLink>
                  <FooterLinkItem to="/faq">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    FAQ
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/terms">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    Terms of Service
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/privacy">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    Privacy Policy
                  </FooterLinkItem>
                </FooterLink>
                <FooterLink>
                  <FooterLinkItem to="/refund">
                    <LinkIcon><FaArrowRight /></LinkIcon>
                    Refund Policy
                  </FooterLinkItem>
                </FooterLink>
              </FooterLinks>
            </FooterSection>
          </FooterNavigation>
          
          <FooterNewsletter>
            <SectionTitle>
              <SectionIcon><FaStar /></SectionIcon>
              Stay Updated
            </SectionTitle>
            <NewsletterText>Join our community to receive guides, promotions and updates on our services.</NewsletterText>
            <NewsletterForm>
              <NewsletterInput type="email" placeholder="Your email address" />
              <SubscribeButton>Subscribe</SubscribeButton>
            </NewsletterForm>
            <SocialLinks>
              <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <SocialIcon>
                  <FaTwitter />
                </SocialIcon>
              </SocialLink>
              <SocialLink href="https://discord.com" target="_blank" rel="noopener noreferrer">
                <SocialIcon>
                  <FaDiscord />
                </SocialIcon>
              </SocialLink>
              <SocialLink href="https://twitch.tv" target="_blank" rel="noopener noreferrer">
                <SocialIcon>
                  <FaTwitch />
                </SocialIcon>
              </SocialLink>
              <SocialLink href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <SocialIcon>
                  <FaYoutube />
                </SocialIcon>
              </SocialLink>
              <SocialLink href="mailto:contact@eloboostpro.com">
                <SocialIcon>
                  <FaEnvelope />
                </SocialIcon>
              </SocialLink>
            </SocialLinks>
          </FooterNewsletter>
        </FooterTop>
        
        <FooterDivider />
        
        <FooterBottom>
          <CopyrightText>
            © {currentYear} ELOBoostPro. All rights reserved.
          </CopyrightText>
        </FooterBottom>
      </FooterContainer>
    </FooterWrapper>
  );
};

const animateGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const appearFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const FooterWrapper = styled.footer`
  position: relative;
  background-color: ${({ theme }) => theme.footerBg};
  padding: 6rem 0 2rem;
  margin-top: 4rem;
  overflow: hidden;
`;

const FooterBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    ${({ theme }) => `${theme.primary}10`} 0%, 
    ${({ theme }) => `${theme.secondary}10` || `${theme.primary}10`} 25%,
    ${({ theme }) => `${theme.primary}05`} 50%,
    ${({ theme }) => `${theme.secondary}05` || `${theme.primary}05`} 75%,
    ${({ theme }) => `${theme.primary}10`} 100%
  );
  background-size: 400% 400%;
  animation: ${animateGradient} 15s ease infinite;
  z-index: 0;
`;

const FooterShapeTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${({ theme }) => theme.footerBg};
  transform-origin: top center;
  clip-path: ellipse(55% 60px at 50% 0%);
  z-index: 1;
`;

const FooterContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  z-index: 2;
  animation: ${appearFromBottom} 0.8s ease-out forwards;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr 1fr;
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.6s ease forwards;
`;

const LogoSpan = styled.span`
  color: ${({ theme }) => theme.primary};
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.primary}, 
    ${({ theme }) => theme.secondary || theme.primary}
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${floatAnimation} 4s ease-in-out infinite;
`;

const LogoText = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.75rem;
`;

const FooterTagline = styled.p`
  color: ${({ theme }) => theme.text}dd;
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 280px;
  position: relative;
  padding-left: 1rem;
  
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(to bottom, 
      ${({ theme }) => theme.primary}, 
      ${({ theme }) => theme.secondary || theme.primary}
    );
    border-radius: 3px;
  }
`;

const FooterNavigation = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 2rem;
  animation: ${fadeInUp} 0.6s ease 0.1s forwards;
`;

const FooterSection = styled.div`
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover}50;
    transform: translateY(-5px);
  }
`;

const SectionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primary};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${({ theme }) => theme.primary}80;
    border-radius: 3px;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
`;

const FooterLink = styled.li`
  margin-bottom: 0.85rem;
`;

const LinkIcon = styled.span`
  opacity: 0;
  margin-right: 0.5rem;
  font-size: 0.75rem;
  transition: all 0.3s ease;
`;

const FooterLinkItem = styled(Link)`
  color: ${({ theme }) => theme.text}cc;
  font-size: 0.95rem;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    transform: translateX(5px);
    
    ${LinkIcon} {
      opacity: 1;
    }
  }
`;

const FooterNewsletter = styled.div`
  animation: ${fadeInUp} 0.6s ease 0.2s forwards;
`;

const NewsletterText = styled.p`
  color: ${({ theme }) => theme.text}cc;
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  line-height: 1.6;
`;

const NewsletterForm = styled.form`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 0.85rem 1.25rem;
  border-radius: 0;
  border: 1px solid ${({ theme }) => theme.border};
  border-right: none;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const SubscribeButton = styled.button`
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.primary}, 
    ${({ theme }) => theme.secondary || theme.primary}
  );
  color: white;
  font-weight: 500;
  padding: 0 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.secondary || theme.primary},
      ${({ theme }) => theme.primary}
    );
    filter: brightness(1.1);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.text};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const SocialIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.primary};
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: ${({ theme }) => theme.primary};
    color: white;
    box-shadow: 0 5px 10px ${({ theme }) => theme.primary}40;
  }
`;

const FooterDivider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, 
    transparent,
    ${({ theme }) => theme.border}, 
    transparent
  );
  margin: 2rem 0;
  opacity: 0.6;
`;

const FooterBottom = styled.div`
  text-align: center;
  animation: ${fadeIn} 0.8s ease 0.3s forwards;
`;

const CopyrightText = styled.p`
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
`;

export default Footer; 
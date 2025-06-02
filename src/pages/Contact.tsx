import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { fadeIn } from '../styles/animations';
import { FaEnvelope, FaDiscord, FaWhatsapp, FaHeadset, FaCheck } from 'react-icons/fa';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    submitted: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would send the form data to your backend here
    setFormState(prev => ({
      ...prev,
      submitted: true
    }));
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
        submitted: false
      });
    }, 3000);
  };

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <AnimatedTitle>Contact Us</AnimatedTitle>
          <HeroDescription>
            We're here to help with any questions or concerns
          </HeroDescription>
        </HeroContent>
      </HeroSection>
      
      <ContentSection>
        <ContentContainer>
          <ContactGrid>
            <ContactForm onSubmit={handleSubmit}>
              <FormTitle>Send us a message</FormTitle>
              
              {formState.submitted ? (
                <SuccessMessage>
                  <SuccessIcon>
                    <FaCheck />
                  </SuccessIcon>
                  Your message has been sent successfully! We'll get back to you soon.
                </SuccessMessage>
              ) : (
                <>
                  <FormGroup>
                    <FormLabel htmlFor="name">Your Name</FormLabel>
                    <FormInput 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formState.name}
                      onChange={handleChange}
                      required 
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormInput 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formState.email}
                      onChange={handleChange}
                      required 
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="subject">Subject</FormLabel>
                    <FormSelect 
                      id="subject" 
                      name="subject" 
                      value={formState.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Feedback">Feedback</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel htmlFor="message">Your Message</FormLabel>
                    <FormTextarea 
                      id="message" 
                      name="message" 
                      rows={5}
                      value={formState.message}
                      onChange={handleChange}
                      required 
                    />
                  </FormGroup>
                  
                  <SubmitButton type="submit">
                    Send Message
                  </SubmitButton>
                </>
              )}
            </ContactForm>
            
            <ContactInfo>
              <InfoTitle>Get in Touch</InfoTitle>
              <InfoText>
                Have questions or need assistance? Our support team is available 24/7 to help with any inquiries.
              </InfoText>
              
              <ContactMethods>
                <ContactMethod>
                  <ContactIcon>
                    <FaEnvelope />
                  </ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Email Us</ContactLabel>
                    <ContactValue href="mailto:support@eloboostpro.com">
                      support@eloboostpro.com
                    </ContactValue>
                  </ContactDetails>
                </ContactMethod>
                
                <ContactMethod>
                  <ContactIcon>
                    <FaDiscord />
                  </ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Discord</ContactLabel>
                    <ContactValue href="https://discord.gg/eloboostpro" target="_blank">
                      Join our Discord server
                    </ContactValue>
                  </ContactDetails>
                </ContactMethod>
                
                <ContactMethod>
                  <ContactIcon>
                    <FaWhatsapp />
                  </ContactIcon>
                  <ContactDetails>
                    <ContactLabel>WhatsApp</ContactLabel>
                    <ContactValue href="https://wa.me/1234567890" target="_blank">
                      +1 (234) 567-890
                    </ContactValue>
                  </ContactDetails>
                </ContactMethod>
                
                <ContactMethod>
                  <ContactIcon>
                    <FaHeadset />
                  </ContactIcon>
                  <ContactDetails>
                    <ContactLabel>Live Chat</ContactLabel>
                    <ContactValue as="span">
                      Available on the bottom right of our website
                    </ContactValue>
                  </ContactDetails>
                </ContactMethod>
              </ContactMethods>
              
              <ResponseInfo>
                <ResponseTitle>Response Time</ResponseTitle>
                <ResponseText>
                  We aim to respond to all inquiries within 2-4 hours. For urgent matters, please use our Live Chat for immediate assistance.
                </ResponseText>
              </ResponseInfo>
            </ContactInfo>
          </ContactGrid>
          
          <NavigationLinks>
            <LinkTitle>You might also be interested in:</LinkTitle>
            <AdditionalLinks>
              <AdditionalLink to="/about">About Us</AdditionalLink>
              <AdditionalLink to="/how-it-works">How It Works</AdditionalLink>
              <AdditionalLink to="/reviews">Reviews</AdditionalLink>
              <AdditionalLink to="/faq">Frequently Asked Questions</AdditionalLink>
            </AdditionalLinks>
          </NavigationLinks>
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

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
  
  &:hover {
    background: ${({ theme }) => theme.primaryDark || theme.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px ${({ theme }) => `${theme.primary}40`};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.success}22;
  color: ${({ theme }) => theme.success};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const SuccessIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: ${({ theme }) => theme.success};
  color: white;
  border-radius: 50%;
  margin-right: 1rem;
`;

const ContactInfo = styled.div`
  background: ${({ theme }) => theme.body};
  border-radius: 0.5rem;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const InfoTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.text}dd;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ContactMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ContactMethod = styled.div`
  display: flex;
  align-items: flex-start;
`;

const ContactIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ theme }) => theme.primary}22;
  color: ${({ theme }) => theme.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-right: 1rem;
  flex-shrink: 0;
`;

const ContactDetails = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.text};
`;

const ContactValue = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ResponseInfo = styled.div`
  background: ${({ theme }) => theme.hover};
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const ResponseTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${({ theme }) => theme.text};
`;

const ResponseText = styled.p`
  color: ${({ theme }) => theme.text}dd;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const NavigationLinks = styled.div`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  text-align: center;
`;

const LinkTitle = styled.div`
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const AdditionalLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
`;

const AdditionalLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  font-size: 0.95rem;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Contact; 
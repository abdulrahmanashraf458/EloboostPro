import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: 1rem;
  font-weight: 800;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

export const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text}cc;
  margin-bottom: 3rem;
`;

export const PrimaryButton = styled(Link)`
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

export const SecondaryButton = styled(Link)`
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

export const Card = styled.div`
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

export const IconWrapper = styled.div`
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
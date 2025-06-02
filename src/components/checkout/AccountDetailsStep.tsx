import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

interface AccountDetailsProps {
  onSubmit: (details: {
    username: string;
    password: string;
    email: string;
    agreeToTerms: boolean;
  }) => void;
  initialValues: {
    username: string;
    password: string;
    email: string;
    agreeToTerms: boolean;
  };
}

const AccountDetailsStep: React.FC<AccountDetailsProps> = ({ onSubmit, initialValues }) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    email?: string;
    agreeToTerms?: string;
  }>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: {
      username?: string;
      password?: string;
      email?: string;
      agreeToTerms?: string;
    } = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Account username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Account password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <StepContainer>
      <StepDescription>
        <FaLock />
        <p>
          We need your League of Legends account details to provide the boosting service. 
          All information is securely encrypted and never shared with third parties.
        </p>
      </StepDescription>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="username">Account Username</Label>
          <Input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            placeholder="Enter your League of Legends username"
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="password">Account Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            placeholder="Enter your password"
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            placeholder="Enter your email address"
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>
        
        <SecurityNote>
          <FaInfoCircle />
          <p>Your account information is securely encrypted with 256-bit SSL technology.</p>
        </SecurityNote>
        
        <CheckboxGroup>
          <Checkbox
            type="checkbox"
            id="agreeToTerms"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleChange}
          />
          <CheckboxLabel htmlFor="agreeToTerms">
            I agree to the <TermsLink href="/terms" target="_blank">Terms of Service</TermsLink> and 
            understand that my account details will be used exclusively for boosting services.
          </CheckboxLabel>
        </CheckboxGroup>
        {errors.agreeToTerms && <ErrorMessage>{errors.agreeToTerms}</ErrorMessage>}
        
        <SubmitButton type="submit">
          Continue to Payment
        </SubmitButton>
      </Form>
    </StepContainer>
  );
};

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StepDescription = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.body};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  
  svg {
    margin-top: 0.25rem;
    color: ${({ theme }) => theme.primary};
    font-size: 1.25rem;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.text};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
`;

const Input = styled.input<{ error?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme, error }) => error ? theme.error : theme.border};
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme, error }) => error ? theme.error : theme.primary};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.error};
  font-size: 0.85rem;
  margin-top: 0.25rem;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => `${theme.success}11`};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => `${theme.success}44`};
  margin: 0.5rem 0;
  
  svg {
    margin-top: 0.25rem;
    color: ${({ theme }) => theme.success};
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
    line-height: 1.4;
    color: ${({ theme }) => theme.text};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  line-height: 1.4;
  color: ${({ theme }) => theme.text};
`;

const TermsLink = styled.a`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  color: white;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export default AccountDetailsStep; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import AccountDetailsStep from './AccountDetailsStep';
import PaymentStep from './PaymentStep';

interface OrderDetails {
  gameType: 'lol' | 'valorant' | 'wild-rift';
  boostType: 'solo' | 'duo';
  currentRank?: any;
  desiredRank?: any;
  server?: string;
  options?: any;
  service?: string;
  price: number;
  discount?: number;
  estimatedTime?: string;
  selectedOptions?: Array<{name: string, price: string}>;
}

interface CheckoutFlowProps {
  orderDetails: OrderDetails;
  onComplete: (orderId: string) => void;
  onCancel: () => void;
}

const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ 
  orderDetails, 
  onComplete, 
  onCancel 
}) => {
  const [currentStep, setCurrentStep] = useState<number>(
    // If it's a duo boost, skip the account details step
    orderDetails.boostType === 'duo' ? 1 : 0
  );
  const [accountDetails, setAccountDetails] = useState({
    username: '',
    password: '',
    email: '',
    agreeToTerms: false
  });
  
  const totalSteps = orderDetails.boostType === 'duo' ? 1 : 2;
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };
  
  const handleAccountDetailsSubmit = (details: any) => {
    setAccountDetails(details);
    handleNext();
  };
  
  const handlePaymentComplete = (orderId: string) => {
    onComplete(orderId);
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AccountDetailsStep 
            onSubmit={handleAccountDetailsSubmit} 
            initialValues={accountDetails}
          />
        );
      case 1:
        return (
          <PaymentStep 
            orderDetails={{
              ...orderDetails,
              accountDetails: orderDetails.boostType === 'solo' ? accountDetails : undefined
            }}
            onComplete={handlePaymentComplete}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <CheckoutTitle>
          {currentStep === 0 ? 'Account Details' : 'Payment'}
        </CheckoutTitle>
        <SecurityNote>
          <FaLock />
          <span>All information is encrypted and secure</span>
        </SecurityNote>
      </CheckoutHeader>
      
      {/* Steps progress indicator */}
      {orderDetails.boostType === 'solo' && (
        <StepsProgressContainer>
          <StepItem active={currentStep === 0}>
            <StepNumber active={currentStep === 0}>1</StepNumber>
            <StepText>Account Details</StepText>
          </StepItem>
          <StepConnector />
          <StepItem active={currentStep === 1}>
            <StepNumber active={currentStep === 1}>2</StepNumber>
            <StepText>Payment</StepText>
          </StepItem>
        </StepsProgressContainer>
      )}
      
      {/* Current step content */}
      <StepContent>
        {renderStep()}
      </StepContent>
      
      {/* Navigation buttons at bottom */}
      <NavigationButtons>
        <BackButton onClick={handleBack}>
          <FaChevronLeft /> Back
        </BackButton>
        
        {currentStep < totalSteps - 1 && (
          <NextButton onClick={handleNext}>
            Next <FaChevronRight />
          </NextButton>
        )}
      </NavigationButtons>
    </CheckoutContainer>
  );
};

const CheckoutContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadow};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.border};
`;

const CheckoutHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}22, ${({ theme }) => theme.secondary}22);
`;

const CheckoutTitle = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
  
  svg {
    color: ${({ theme }) => theme.success};
  }
`;

const StepsProgressContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const StepItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ active }) => active ? 1 : 0.6};
`;

const StepNumber = styled.div<{ active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ active, theme }) => active ? theme.primary : theme.body};
  color: ${({ active, theme }) => active ? '#fff' : theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
`;

const StepText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const StepConnector = styled.div`
  flex: 1;
  height: 2px;
  background-color: ${({ theme }) => theme.border};
  margin: 0 1rem 1.5rem;
`;

const StepContent = styled.div`
  padding: 2rem 1.5rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => `${theme.body}dd`};
  }
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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

export default CheckoutFlow; 
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCcVisa, FaCcMastercard, FaCcPaypal, FaApplePay, FaGooglePay, FaCheck, FaCreditCard } from 'react-icons/fa';

interface OrderDetails {
  gameType?: 'lol' | 'valorant' | 'wild-rift';
  boostType?: 'solo' | 'duo';
  service?: string;
  price: number;
  discount?: number;
  accountDetails?: {
    username: string;
    password: string;
    email: string;
  };
}

interface PaymentStepProps {
  orderDetails: OrderDetails;
  onComplete: (orderId: string) => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ orderDetails, onComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    email: orderDetails.accountDetails?.email || ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setFormData({
        ...formData,
        [name]: formatted
      });
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiry') {
      const formatted = value.replace(/\//g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      
      setFormData({
        ...formData,
        [name]: formatted
      });
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleMethodChange = (method: string) => {
    setPaymentMethod(method);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would process the payment
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Generate random order ID
      const orderId = `ORD-${Math.floor(Math.random() * 100000)}`;
      
      // Notify parent component
      setTimeout(() => {
        onComplete(orderId);
      }, 1500);
    }, 2000);
  };
  
  // Calculate final price
  const finalPrice = orderDetails.discount 
    ? orderDetails.price * (1 - orderDetails.discount / 100) 
    : orderDetails.price;
  
  if (success) {
    return (
      <SuccessContainer>
        <SuccessIcon>
          <FaCheck />
        </SuccessIcon>
        <SuccessTitle>Payment Successful!</SuccessTitle>
        <SuccessMessage>
          Your order has been confirmed and will be processed immediately.
          {orderDetails.accountDetails && (
            <p>We will begin the boosting process on your account shortly.</p>
          )}
        </SuccessMessage>
      </SuccessContainer>
    );
  }
  
  return (
    <StepContainer>
      <PaymentSummary>
        <SummaryTitle>Order Summary</SummaryTitle>
        <SummaryDetails>
          <SummaryItem>
            <SummaryLabel>Service:</SummaryLabel>
            <SummaryValue>{orderDetails.service || 'Boosting Service'}</SummaryValue>
          </SummaryItem>
          
          {orderDetails.gameType && (
            <SummaryItem>
              <SummaryLabel>Game:</SummaryLabel>
              <SummaryValue>
                {orderDetails.gameType === 'lol' ? 'League of Legends' : 
                  orderDetails.gameType === 'valorant' ? 'Valorant' : 'Wild Rift'}
              </SummaryValue>
            </SummaryItem>
          )}
          
          {orderDetails.boostType && (
            <SummaryItem>
              <SummaryLabel>Boost Type:</SummaryLabel>
              <SummaryValue>
                {orderDetails.boostType === 'solo' ? 'Solo Boost' : 'Duo Boost'}
              </SummaryValue>
            </SummaryItem>
          )}
          
          {orderDetails.discount && orderDetails.discount > 0 && (
            <SummaryItem>
              <SummaryLabel>Discount:</SummaryLabel>
              <SummaryValue highlight>-{orderDetails.discount}%</SummaryValue>
            </SummaryItem>
          )}
          
          <TotalPriceItem>
            <TotalLabel>Total:</TotalLabel>
            <TotalValue>€{finalPrice.toFixed(2)}</TotalValue>
          </TotalPriceItem>
        </SummaryDetails>
      </PaymentSummary>
      
      <PaymentMethodTabs>
        <PaymentTab 
          active={paymentMethod === 'card'} 
          onClick={() => handleMethodChange('card')}
        >
          <FaCreditCard />
          <span>Credit Card</span>
        </PaymentTab>
        <PaymentTab 
          active={paymentMethod === 'paypal'} 
          onClick={() => handleMethodChange('paypal')}
        >
          <FaCcPaypal />
          <span>PayPal</span>
        </PaymentTab>
        <PaymentTab 
          active={paymentMethod === 'googlepay'} 
          onClick={() => handleMethodChange('googlepay')}
        >
          <FaGooglePay />
          <span>Google Pay</span>
        </PaymentTab>
      </PaymentMethodTabs>
      
      <Form onSubmit={handleSubmit}>
        {paymentMethod === 'card' && (
          <>
            <PaymentIcons>
              <FaCcVisa />
              <FaCcMastercard />
            </PaymentIcons>
            
            <FormGroup>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  type="text"
                  id="expiry"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  maxLength={3}
                  required
                />
              </FormGroup>
            </FormRow>
          </>
        )}
        
        {paymentMethod === 'paypal' && (
          <PaypalContainer>
            <PaypalLogo>
              <FaCcPaypal />
            </PaypalLogo>
            <p>You will be redirected to PayPal to complete your payment.</p>
          </PaypalContainer>
        )}
        
        {paymentMethod === 'googlepay' && (
          <GooglePayContainer>
            <GooglePayLogo>
              <FaGooglePay />
            </GooglePayLogo>
            <p>You will be redirected to Google Pay to complete your payment.</p>
          </GooglePayContainer>
        )}
        
        <FormGroup>
          <Label htmlFor="email">Email (for receipt)</Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
        </FormGroup>
        
        <PayButton type="submit" disabled={loading}>
          {loading ? 'Processing...' : `Pay €${finalPrice.toFixed(2)}`}
        </PayButton>
        
        <SecurityInfo>
          <p>All payments are secure and encrypted. We never store your payment details.</p>
        </SecurityInfo>
      </Form>
    </StepContainer>
  );
};

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PaymentSummary = styled.div`
  background: ${({ theme }) => theme.body};
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  padding: 1.25rem;
`;

const SummaryTitle = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const SummaryDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
`;

const SummaryLabel = styled.span`
  color: ${({ theme }) => theme.text}aa;
`;

const SummaryValue = styled.span<{ highlight?: boolean }>`
  font-weight: 500;
  color: ${({ theme, highlight }) => 
    highlight ? theme.success : theme.text};
`;

const TotalPriceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const TotalLabel = styled.span`
  font-weight: 600;
  font-size: 1.05rem;
`;

const TotalValue = styled.span`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.primary};
`;

const PaymentMethodTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const PaymentTab = styled.div<{ active: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${({ theme, active }) => active ? `${theme.primary}11` : theme.body};
  border: 1px solid ${({ theme, active }) => active ? theme.primary : theme.border};
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    font-size: 1.5rem;
    color: ${({ theme, active }) => active ? theme.primary : `${theme.text}aa`};
  }
  
  span {
    font-size: 0.85rem;
    font-weight: ${({ active }) => active ? 600 : 400};
    color: ${({ theme, active }) => active ? theme.primary : theme.text};
  }
  
  &:hover {
    background: ${({ theme, active }) => active ? `${theme.primary}22` : `${theme.body}aa`};
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  svg {
    font-size: 2rem;
    color: ${({ theme }) => `${theme.text}aa`};
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const PaypalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.body};
  border-radius: 0.5rem;
  
  p {
    margin: 0;
    text-align: center;
    font-size: 0.95rem;
  }
`;

const PaypalLogo = styled.div`
  font-size: 3rem;
  color: #0070ba;
`;

const GooglePayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.body};
  border-radius: 0.5rem;
  
  p {
    margin: 0;
    text-align: center;
    font-size: 0.95rem;
  }
`;

const GooglePayLogo = styled.div`
  font-size: 3rem;
  color: #5f6368;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  border-radius: 0.5rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  color: white;
  border: none;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SecurityInfo = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}aa;
  margin-top: 0.5rem;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
`;

const SuccessIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.success};
  color: white;
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.success};
`;

const SuccessMessage = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  
  p {
    margin: 0.75rem 0 0;
  }
`;

export default PaymentStep; 
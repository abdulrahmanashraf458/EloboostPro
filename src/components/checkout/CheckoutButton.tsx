import React from 'react';
import styled from 'styled-components';
import { FaChevronRight } from 'react-icons/fa';
import { useCheckoutContext } from '../../context/CheckoutContext';

interface OrderDetails {
  gameType: 'lol' | 'valorant' | 'wild-rift';
  boostType: 'solo' | 'duo';
  service: string;
  price: number;
  discount?: number;
  estimatedTime?: string;
  currentRank?: any;
  desiredRank?: any;
  server?: string;
  options?: any;
  selectedOptions?: Array<{name: string, price: string}>;
}

interface CheckoutButtonProps {
  orderDetails: OrderDetails;
  className?: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ orderDetails, className }) => {
  const { initiateCheckout } = useCheckoutContext();
  
  const handleClick = () => {
    initiateCheckout(orderDetails);
  };
  
  return (
    <Button className={className} onClick={handleClick}>
      Proceed to Checkout <FaChevronRight />
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    margin-left: 0.5rem;
  }
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }
`;

export default CheckoutButton; 
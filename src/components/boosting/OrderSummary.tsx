import React, { useState } from 'react';
import styled from 'styled-components';
import { FaClock, FaTag, FaStopwatch, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCheckoutContext } from '../../context/CheckoutContext';

interface RankTier {
  tier: 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'challenger';
  division: 'IV' | 'III' | 'II' | 'I' | null;
  lp?: number;
}

interface BoostingOrder {
  gameType: 'lol' | 'valorant' | 'wild-rift';
  boostType: 'solo' | 'duo';
  currentRank: RankTier;
  desiredRank: RankTier;
  server: string;
  options: {
    priorityBoost: boolean;
    soloOnly: boolean;
    streaming: boolean;
    championsSelection: boolean;
    offlineMode: boolean;
    specificRoles: string[];
    specificChampions: string[];
  };
}

interface SelectedOption {
  name: string;
  price: string;
}

interface OrderSummaryProps {
  order: BoostingOrder;
  price: number;
  discount: number;
  estimatedTime: string;
  isAuthenticated: boolean;
  selectedOptions?: SelectedOption[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  order, 
  price, 
  discount, 
  estimatedTime,
  isAuthenticated,
  selectedOptions = []
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const navigate = useNavigate();
  
  // Use checkout context
  const { initiateCheckout } = useCheckoutContext();
  
  const applyPromoCode = () => {
    if (!couponCode) return;
    
    // For demo purposes, any coupon code will give 10% off
    if (!couponApplied) {
      setCouponApplied(true);
      setPromoDiscount(10);
    }
  };
  
  const handleCheckout = () => {
    // Use the checkout context to initiate checkout flow
    const finalPrice = promoDiscount > 0 
      ? price * (1 - promoDiscount / 100)
      : price;
      
    initiateCheckout({
      gameType: order.gameType,
      boostType: order.boostType,
      currentRank: order.currentRank,
      desiredRank: order.desiredRank,
      server: order.server,
      options: order.options,
      price: finalPrice,
      discount: discount + promoDiscount,
      estimatedTime,
      service: 'League of Legends Boosting',
      selectedOptions
    });
  };
  
  const tierName = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };
  
  const getActiveOptions = () => {
    const options = [];
    
    if (order.options.priorityBoost) options.push('Priority Boost');
    if (order.options.soloOnly) options.push('Solo Queue Only');
    if (order.options.streaming) options.push('Stream Games');
    if (order.options.championsSelection) options.push('Champion Selection');
    if (order.options.offlineMode) options.push('Offline Mode');
    if (order.options.specificRoles.length > 0) {
      options.push(`Roles: ${order.options.specificRoles.join(', ')}`);
    }
    
    return options;
  };
  
  const finalPrice = promoDiscount > 0 
    ? price * (1 - promoDiscount / 100)
    : price;
  
  return (
    <SummaryContainer>
      <SummaryHeader>
        <SummaryTitle>Order Summary</SummaryTitle>
      </SummaryHeader>
      
      <SummaryContent>
        <RankBoostSummary>
          <CurrentRankInfo>
            <RankText>
              <span>From:</span> {tierName(order.currentRank.tier)} {order.currentRank.division}
              {order.currentRank.lp !== undefined && ` (${order.currentRank.lp} LP)`}
            </RankText>
          </CurrentRankInfo>
          
          <RankArrow>→</RankArrow>
          
          <DesiredRankInfo>
            <RankText>
              <span>To:</span> {tierName(order.desiredRank.tier)} {order.desiredRank.division}
            </RankText>
          </DesiredRankInfo>
        </RankBoostSummary>
        
        <DetailsGroup>
          <DetailItem>
            <DetailIcon>
              <FaStopwatch />
            </DetailIcon>
            <DetailText>
              <strong>Boost Type:</strong> {order.boostType === 'solo' ? 'Solo Boost' : 'Duo Boost'}
            </DetailText>
          </DetailItem>
          
          <DetailItem>
            <DetailIcon>
              <FaClock />
            </DetailIcon>
            <DetailText>
              <strong>Estimated Time:</strong> {estimatedTime}
            </DetailText>
          </DetailItem>
        </DetailsGroup>
        
        {selectedOptions.length > 0 && (
          <SelectedOptionsContainer>
            <OptionsTitle>Selected Options:</OptionsTitle>
            <OptionsList>
              {selectedOptions.map((option, index) => (
                <OptionItem key={index}>
                  <OptionBullet />
                  <OptionName>{option.name}</OptionName>
                  <OptionPrice>{option.price}</OptionPrice>
                </OptionItem>
              ))}
            </OptionsList>
          </SelectedOptionsContainer>
        )}
        
        <PromoCodeSection>
          <PromoCodeTitle>
            <FaTag />
            <span>Discount Code</span>
          </PromoCodeTitle>
          <PromoCodeInput
            type="text"
            placeholder="Enter promo code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={couponApplied}
          />
          <PromoCodeButton 
            onClick={applyPromoCode}
            disabled={couponApplied || !couponCode}
          >
            {couponApplied ? 'Applied' : 'Apply'}
          </PromoCodeButton>
        </PromoCodeSection>
        
        <PriceSummary>
          <PriceRow>
            <PriceLabel>Subtotal:</PriceLabel>
            <PriceValue>€{price.toFixed(2)}</PriceValue>
          </PriceRow>
          
          {promoDiscount > 0 && (
            <PriceRow>
              <PriceLabel>Promo Code Discount:</PriceLabel>
              <PriceValue highlight>-{promoDiscount}%</PriceValue>
            </PriceRow>
          )}
          
          <TotalPriceRow>
            <TotalPriceLabel>Total:</TotalPriceLabel>
            <TotalPriceValue>€{finalPrice.toFixed(2)}</TotalPriceValue>
          </TotalPriceRow>
        </PriceSummary>
        
        <CheckoutButton onClick={handleCheckout}>
          Proceed to Checkout <FaChevronRight />
        </CheckoutButton>
      </SummaryContent>
    </SummaryContainer>
  );
};

const SummaryContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const SummaryHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.primary}11;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0;
`;

const SummaryContent = styled.div`
  padding: 1.5rem;
`;

const RankBoostSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.body};
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const CurrentRankInfo = styled.div`
  text-align: center;
`;

const DesiredRankInfo = styled.div`
  text-align: center;
`;

const RankText = styled.div`
  font-weight: 500;
  
  span {
    font-weight: normal;
    color: ${({ theme }) => theme.text}aa;
    font-size: 0.9rem;
  }
`;

const RankArrow = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const DetailsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DetailIcon = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => `${theme.primary}11`};
  color: ${({ theme }) => theme.primary};
`;

const DetailText = styled.div`
  font-size: 0.9rem;
  
  strong {
    font-weight: 500;
  }
`;

const SelectedOptionsContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.border};
`;

const OptionsTitle = styled.h4`
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.9rem;
`;

const OptionBullet = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary};
  margin-right: 8px;
`;

const OptionName = styled.span`
  flex: 1;
`;

const OptionPrice = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.accent};
`;

const PromoCodeSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.body};
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const PromoCodeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
  
  svg {
    color: ${({ theme }) => theme.primary};
  }
`;

const PromoCodeInput = styled.input`
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
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PromoCodeButton = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.buttonHover};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PriceSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PriceLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
`;

const PriceValue = styled.div<{ highlight?: boolean }>`
  font-weight: 500;
  color: ${({ theme, highlight }) => 
    highlight ? theme.success : theme.text};
`;

const TotalPriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const TotalPriceLabel = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const TotalPriceValue = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.primary};
`;

const CheckoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1rem;
  margin-top: 1.5rem;
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

export default OrderSummary; 
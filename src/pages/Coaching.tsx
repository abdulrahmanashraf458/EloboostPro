import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUsers, FaGlobe, FaCog, FaPlus, FaMinus, FaClock, FaCrown, FaChevronRight } from 'react-icons/fa';
import ServiceNav from '../components/ServiceNav';
import { useCheckoutContext } from '../context/CheckoutContext';

// Servers
const SERVERS = ["NA", "EUW", "EUNE", "OCE", "LAS", "LAN", "BR", "TR", "RU", "JP", "KR"];

interface CoachingOptions {
  coachType: 'Regular' | 'Elite';
  hours: number;
  server: string;
  customization: {
    priority: boolean;
    championsSelection: boolean;
    roleSelection: boolean;
  };
  promoCode: string;
}

const Coaching: React.FC = () => {
  const { initiateCheckout } = useCheckoutContext();
  const [coachingOptions, setCoachingOptions] = useState<CoachingOptions>({
    coachType: 'Regular',
    hours: 2,
    server: "Europe West",
    customization: {
      priority: false,
      championsSelection: false,
      roleSelection: true,
    },
    promoCode: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Handle coach type change
  const handleCoachTypeChange = (type: 'Regular' | 'Elite') => {
    setCoachingOptions(prev => ({
      ...prev,
      coachType: type
    }));
  };

  // Handle hours change
  const handleHoursChange = (value: number) => {
    const newValue = Math.max(1, value);
    setCoachingOptions(prev => ({
      ...prev,
      hours: newValue
    }));
  };

  // Handle server change
  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCoachingOptions(prev => ({
      ...prev,
      server: e.target.value
    }));
  };

  // Toggle customization options
  const toggleOption = (option: keyof CoachingOptions['customization']) => {
    setCoachingOptions(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [option]: !prev.customization[option]
      }
    }));
  };

  // Handle promo code input
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoachingOptions(prev => ({
      ...prev,
      promoCode: e.target.value
    }));
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (coachingOptions.promoCode.toUpperCase() === "EB24PLAY") {
      setAppliedDiscount(30);
    } else {
      setAppliedDiscount(0);
    }
  };

  // Calculate price
  useEffect(() => {
    let price = 0;
    
    // Base price based on coach type and hours
    if (coachingOptions.coachType === 'Regular') {
      price = coachingOptions.hours * 14; // €14 per hour for Regular
    } else {
      price = coachingOptions.hours * 20; // €20 per hour for Elite
    }
    
    // Apply customization modifiers
    if (coachingOptions.customization.priority) {
      price += price * 0.25; // 25% extra for priority
    }
    
    if (coachingOptions.customization.championsSelection) {
      price += price * 0.10; // 10% extra for champions selection
    }
    
    // Role selection is free
    
    // Apply promo code discount
    if (appliedDiscount > 0) {
      price = price * (1 - appliedDiscount / 100);
    }
    
    setTotalPrice(Number(price.toFixed(2)));
  }, [coachingOptions, appliedDiscount]);

  // Add function to handle checkout - note we're setting boostType to 'duo' to skip account details
  const handleCheckout = () => {
    initiateCheckout({
      gameType: 'lol',
      boostType: 'duo', // Using 'duo' specifically to skip account details step
      price: totalPrice,
      discount: appliedDiscount,
      service: `Coaching - ${coachingOptions.coachType} - ${coachingOptions.hours} hours`,
      selectedOptions: getSelectedOptions(),
      server: coachingOptions.server,
      options: coachingOptions.customization
    });
  };

  // Get selected options for display in order summary
  const getSelectedOptions = () => {
    const options = [];
    
    if (coachingOptions.customization.priority) {
      options.push({
        name: "Priority Coaching",
        price: "+25%"
      });
    }
    
    if (coachingOptions.customization.championsSelection) {
      options.push({
        name: "Champions Selection",
        price: "+10%"
      });
    }
    
    if (coachingOptions.customization.roleSelection) {
      options.push({
        name: "Role Selection",
        price: "FREE"
      });
    }
    
    return options;
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Coaching</PageTitle>
        <PageDescription>
          Learn from the best players with personalized coaching sessions
        </PageDescription>
      </PageHeader>

      <ServiceNav />

      <ContentGrid>
        {/* Left Column: Coaching Options */}
        <MainContent>
          <Section>
            <SectionHeader>
              <SectionIcon>
                <FaCrown />
              </SectionIcon>
              <SectionTitle>Coach type</SectionTitle>
            </SectionHeader>

            <CoachTypeContainer>
              <CoachTypeOption 
                active={coachingOptions.coachType === 'Regular'} 
                onClick={() => handleCoachTypeChange('Regular')}
              >
                <CoachTypeName>Regular</CoachTypeName>
                <CoachTypePrice>€14/hour</CoachTypePrice>
              </CoachTypeOption>
              
              <CoachTypeOption 
                active={coachingOptions.coachType === 'Elite'} 
                onClick={() => handleCoachTypeChange('Elite')}
              >
                <CoachTypeName>Elite</CoachTypeName>
                <CoachTypePrice>€20/hour</CoachTypePrice>
              </CoachTypeOption>
            </CoachTypeContainer>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>
                <FaGlobe />
              </SectionIcon>
              <SectionTitle>Server</SectionTitle>
            </SectionHeader>

            <SelectWrapper>
              <StyledSelect value={coachingOptions.server} onChange={handleServerChange}>
                <option value="Europe West">Europe West</option>
                {SERVERS.map(server => (
                  <option key={server} value={server}>{server}</option>
                ))}
              </StyledSelect>
            </SelectWrapper>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>
                <FaClock />
              </SectionIcon>
              <SectionTitle>Hours</SectionTitle>
            </SectionHeader>

            <HoursControlContainer>
              <HoursButton onClick={() => handleHoursChange(coachingOptions.hours - 1)}>
                <FaMinus />
              </HoursButton>
              <HoursDisplay>
                <input
                  type="number"
                  value={coachingOptions.hours}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      handleHoursChange(value);
                    }
                  }}
                  min="1"
                />
              </HoursDisplay>
              <HoursButton onClick={() => handleHoursChange(coachingOptions.hours + 1)}>
                <FaPlus />
              </HoursButton>
            </HoursControlContainer>
          </Section>

          <CoachingFeatures>
            <FeatureCard>
              <FeatureIcon>
                <FaUsers />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Voice Communication Available</FeatureTitle>
                <FeatureDescription>
                  Upon your request, our coach will use voice communication. Through your personal dashboard, you can chat with the coach and manage your coaching session, including pausing and resuming.
                </FeatureDescription>
              </FeatureContent>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon>
                <FaCrown />
              </FeatureIcon>
              <FeatureContent>
                <FeatureTitle>Knowledgeable Coaches</FeatureTitle>
                <FeatureDescription>
                  The Eloboost24 team offers knowledgeable coaches dedicated to helping you enhance your gameplay. Customize your LoL coaching order and learn while playing alongside your coach.
                </FeatureDescription>
              </FeatureContent>
            </FeatureCard>
          </CoachingFeatures>
        </MainContent>

        {/* Right Column: Order Summary */}
        <OrderSummarySidebar>
          <OrderSummary>
            <OrderSummaryHeader>Order Summary</OrderSummaryHeader>
            
            <OrderDetails>
              <OrderDetailRow>
                <OrderDetailLabel>Coach Type:</OrderDetailLabel>
                <OrderDetailValue>{coachingOptions.coachType}</OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Hours:</OrderDetailLabel>
                <OrderDetailValue>{coachingOptions.hours}</OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Server:</OrderDetailLabel>
                <OrderDetailValue>{coachingOptions.server}</OrderDetailValue>
              </OrderDetailRow>
            </OrderDetails>

            <SectionHeader>
              <SectionIcon>
                <FaCog />
              </SectionIcon>
              <SectionTitle>Coaching customization</SectionTitle>
            </SectionHeader>

            <CustomizationOptions>
              <CustomizationOption>
                <CustomizationLabel>Priority <PriceTag>+25%</PriceTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={coachingOptions.customization.priority} 
                    onChange={() => toggleOption('priority')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
              
              <CustomizationOption>
                <CustomizationLabel>Champions selection <PriceTag>+10%</PriceTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={coachingOptions.customization.championsSelection} 
                    onChange={() => toggleOption('championsSelection')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
              
              <CustomizationOption>
                <CustomizationLabel>Role selection <FreeTag>FREE</FreeTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={coachingOptions.customization.roleSelection} 
                    onChange={() => toggleOption('roleSelection')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
            </CustomizationOptions>
            
            <SelectedOptionsSection>
              <SelectedOptionsHeader>Selected Options:</SelectedOptionsHeader>
              <OptionsList>
                {coachingOptions.customization.priority && (
                  <OptionItem>
                    • Priority <OptionPrice>+25%</OptionPrice>
                  </OptionItem>
                )}
                {coachingOptions.customization.championsSelection && (
                  <OptionItem>
                    • Champions Selection <OptionPrice>+10%</OptionPrice>
                  </OptionItem>
                )}
                {coachingOptions.customization.roleSelection && (
                  <OptionItem>
                    • Role Selection <OptionPriceFree>FREE</OptionPriceFree>
                  </OptionItem>
                )}
                {!coachingOptions.customization.priority && 
                 !coachingOptions.customization.championsSelection && 
                 !coachingOptions.customization.roleSelection && (
                  <OptionItem>No options selected</OptionItem>
                )}
              </OptionsList>
            </SelectedOptionsSection>
            
            <PromoSection>
              <PromoLabel>Discount code</PromoLabel>
              <PromoInputContainer>
                <PromoInput 
                  type="text" 
                  placeholder="Enter code"
                  value={coachingOptions.promoCode}
                  onChange={handlePromoCodeChange}
                />
                <PromoButton onClick={applyPromoCode}>Apply</PromoButton>
              </PromoInputContainer>
              {appliedDiscount > 0 && (
                <DiscountApplied>
                  {appliedDiscount}% discount applied!
                </DiscountApplied>
              )}
            </PromoSection>
            
            <PriceSection>
              <TotalPriceLabel>Total</TotalPriceLabel>
              <TotalPriceValue>€{totalPrice.toFixed(2)}</TotalPriceValue>
            </PriceSection>
            
            <ProceedButton onClick={handleCheckout}>
              Proceed to Checkout <FaChevronRight />
            </ProceedButton>
          </OrderSummary>
        </OrderSummarySidebar>
      </ContentGrid>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 1.5rem 4rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.primary};
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.textLight};
  max-width: 700px;
  margin: 0 auto;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: ${({ theme }) => theme.primary}22;
  color: ${({ theme }) => theme.primary};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
`;

const CoachTypeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const CoachTypeOption = styled.div<{ active: boolean }>`
  background: ${({ active, theme }) => active ? `linear-gradient(135deg, ${theme.primary}22, ${theme.secondary}22)` : theme.body};
  border: 1px solid ${({ active, theme }) => active ? theme.primary : theme.border};
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary}11;
  }
`;

const CoachTypeName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CoachTypePrice = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
`;

const SelectWrapper = styled.div`
  position: relative;
  
  &::after {
    content: '▼';
    font-size: 0.8rem;
    top: 50%;
    right: 1rem;
    position: absolute;
    transform: translateY(-50%);
    pointer-events: none;
    color: ${({ theme }) => theme.text};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  appearance: none;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const HoursControlContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
`;

const HoursButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.primary}22;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const HoursDisplay = styled.div`
  input {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-size: 1.2rem;
    font-weight: 600;
    appearance: textfield;
    -moz-appearance: textfield;
    
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
    }
  }
`;

const CustomizationOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CustomizationOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.border};
`;

const CustomizationLabel = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
`;

const PriceTag = styled.span`
  color: ${({ theme }) => theme.primary};
  font-size: 0.85rem;
  margin-left: 0.5rem;
`;

const FreeTag = styled.span`
  background-color: #FFD600;
  color: black;
  border-radius: 0.25rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const OptionToggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e0e0e0;
  transition: .4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  
  input:checked + & {
    background-color: ${({ theme }) => theme.primary};
  }
  
  input:checked + &:before {
    transform: translateX(24px);
  }
`;

const CoachingFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: flex-start;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const FeatureIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.primary}22;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h4`
  font-size: 1.1rem;
  margin-top: 0;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
  margin: 0;
  line-height: 1.5;
`;

const OrderSummarySidebar = styled.div`
  @media (min-width: 992px) {
    position: sticky;
    top: 2rem;
  }
`;

const OrderSummary = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const OrderSummaryHeader = styled.h3`
  font-size: 1.3rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const OrderDetails = styled.div`
  margin-bottom: 1.5rem;
`;

const OrderDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const OrderDetailLabel = styled.div`
  color: ${({ theme }) => theme.textLight};
`;

const OrderDetailValue = styled.div`
  font-weight: 500;
`;

const SelectedOptionsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SelectedOptionsHeader = styled.h4`
  font-size: 1rem;
  margin-top: 0;
  margin-bottom: 0.75rem;
`;

const OptionsList = styled.div`
  font-size: 0.9rem;
`;

const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  line-height: 1.4;
`;

const OptionPrice = styled.span`
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
`;

const OptionPriceFree = styled.span`
  background-color: #FFD600;
  color: black;
  border-radius: 0.25rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
`;

const PromoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const PromoLabel = styled.div`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.textLight};
`;

const PromoInputContainer = styled.div`
  display: flex;
`;

const PromoInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const PromoButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0 0.5rem 0.5rem 0;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const DiscountApplied = styled.div`
  color: ${({ theme }) => theme.success || 'green'};
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const PriceSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const TotalPriceLabel = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
`;

const TotalPriceValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.primary};
`;

const ProceedButton = styled.button`
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

export default Coaching; 
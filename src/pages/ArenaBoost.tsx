import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTrophy, FaGlobe, FaCog, FaPlus, FaMinus, FaUsers, FaChevronRight } from 'react-icons/fa';
import { GiCrossedSwords } from 'react-icons/gi';
import ServiceNav from '../components/ServiceNav';
import { useCheckoutContext } from '../context/CheckoutContext';

// Servers
const SERVERS = ["NA", "EUW", "EUNE", "OCE", "LAS", "LAN", "BR", "TR", "RU", "JP", "KR"];

interface ArenaOptions {
  boostMode: 'NET WINS' | 'PER GAME';
  winsCount: number;
  server: string;
  customization: {
    streaming: boolean;
    expressOrder: boolean;
    appearOffline: boolean;
    soloOnly: boolean;
  };
  promoCode: string;
}

const ArenaBoost: React.FC = () => {
  const { initiateCheckout } = useCheckoutContext();
  const [arenaOptions, setArenaOptions] = useState<ArenaOptions>({
    boostMode: 'NET WINS',
    winsCount: 5,
    server: 'Europe West',
    customization: {
      streaming: false,
      expressOrder: false,
      appearOffline: false,
      soloOnly: false,
    },
    promoCode: '',
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Handle boost mode change
  const handleBoostModeChange = (mode: 'NET WINS' | 'PER GAME') => {
    setArenaOptions(prev => ({
      ...prev,
      boostMode: mode
    }));
    setModeDropdownOpen(false);
  };

  // Handle wins count change
  const handleWinsCountChange = (value: number) => {
    const newValue = Math.max(1, value);
    setArenaOptions(prev => ({
      ...prev,
      winsCount: newValue
    }));
  };

  // Handle server change
  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArenaOptions(prev => ({
      ...prev,
      server: e.target.value
    }));
  };

  // Toggle customization options
  const toggleOption = (option: keyof ArenaOptions['customization']) => {
    setArenaOptions(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [option]: !prev.customization[option]
      }
    }));
  };

  // Handle promo code input
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArenaOptions(prev => ({
      ...prev,
      promoCode: e.target.value
    }));
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (arenaOptions.promoCode.toUpperCase() === "ARENA10") {
      setAppliedDiscount(10);
    } else {
      setAppliedDiscount(0);
    }
  };

  // Calculate price
  useEffect(() => {
    let price = 0;
    
    // Base price based on boost mode and number of wins
    const basePricePerWin = arenaOptions.boostMode === 'NET WINS' ? 8 : 5;
    price = basePricePerWin * arenaOptions.winsCount;
    
    // Apply customization modifiers
    if (arenaOptions.customization.streaming) {
      price += price * 0.15; // 15% extra for streaming
    }
    
    if (arenaOptions.customization.expressOrder) {
      price += price * 0.25; // 25% extra for express order
    }
    
    if (arenaOptions.customization.soloOnly) {
      price += price * 0.50; // 50% extra for solo only
    }
    
    // Apply promo code discount
    if (appliedDiscount > 0) {
      price = price * (1 - appliedDiscount / 100);
    }
    
    setTotalPrice(Number(price.toFixed(2)));
  }, [arenaOptions, appliedDiscount]);

  // Add function to handle checkout
  const handleCheckout = () => {
    initiateCheckout({
      gameType: 'lol',
      boostType: 'solo',
      price: totalPrice,
      discount: appliedDiscount,
      service: `Arena Boost - ${arenaOptions.boostMode} - ${arenaOptions.winsCount} ${arenaOptions.boostMode === 'NET WINS' ? 'Wins' : 'Games'}`,
      selectedOptions: getSelectedOptions(),
      server: arenaOptions.server,
      options: arenaOptions.customization
    });
  };

  // Get selected options for display in order summary
  const getSelectedOptions = () => {
    const options = [];
    
    if (arenaOptions.customization.streaming) {
      options.push({
        name: "Streaming",
        price: "+15%"
      });
    }
    
    if (arenaOptions.customization.expressOrder) {
      options.push({
        name: "Express Order",
        price: "+25%"
      });
    }
    
    if (arenaOptions.customization.soloOnly) {
      options.push({
        name: "Solo Only",
        price: "+50%"
      });
    }
    
    if (arenaOptions.customization.appearOffline) {
      options.push({
        name: "Appear Offline",
        price: "FREE"
      });
    }
    
    return options;
  };

  // Styled components for the new mode selection design
  const ModeHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  `;

  const ModeIcon = styled.div`
    background-color: #2b2b35;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    
    svg {
      color: #ff4655;
      font-size: 22px;
    }
  `;

  const ModeHeaderText = styled.h3`
    color: white;
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  `;

  const ModeDropdown = styled.div`
    position: relative;
    width: 100%;
    user-select: none;
  `;

  const ModeCurrentSelection = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2b2b35;
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background-color: #323240;
    }
  `;

  const ModeOptions = styled.div<{ isOpen: boolean }>`
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #2b2b35;
    border-radius: 10px;
    margin-top: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 10;
    display: ${props => props.isOpen ? 'block' : 'none'};
    overflow: hidden;
  `;

  const ModeOption = styled.div`
    padding: 15px 20px;
    cursor: pointer;
    color: white;
    
    &:hover {
      background-color: #323240;
    }
  `;

  // Replace the Mode Selection section in the render
  const renderModeSection = () => {
    return (
      <Section>
        <ModeHeader>
          <ModeIcon>
            <GiCrossedSwords />
          </ModeIcon>
          <ModeHeaderText>SELECT MODE</ModeHeaderText>
        </ModeHeader>
        <ModeDropdown>
          <ModeCurrentSelection onClick={() => setModeDropdownOpen(!modeDropdownOpen)}>
            {arenaOptions.boostMode}
            <FaPlus style={{ transform: modeDropdownOpen ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
          </ModeCurrentSelection>
          <ModeOptions isOpen={modeDropdownOpen}>
            <ModeOption onClick={() => handleBoostModeChange('NET WINS')}>
              NET WINS
            </ModeOption>
            <ModeOption onClick={() => handleBoostModeChange('PER GAME')}>
              PER GAME
            </ModeOption>
          </ModeOptions>
        </ModeDropdown>
      </Section>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Arena Boosting</PageTitle>
        <PageDescription>
          Climb the arena ranks with our specialized arena boosters
        </PageDescription>
      </PageHeader>

      <ServiceNav />

      <ContentGrid>
        {/* Left Column: Arena Boosting Options */}
        <MainContent>
          {renderModeSection()}

          <Section>
            <SectionHeader>
              <SectionIcon>
                <FaTrophy />
              </SectionIcon>
              <SectionTitle>Number of Wins</SectionTitle>
            </SectionHeader>

            <WinsControlContainer>
              <WinsButton onClick={() => handleWinsCountChange(arenaOptions.winsCount - 1)}>
                <FaMinus />
              </WinsButton>
              <WinsDisplay>
                <input
                  type="number"
                  value={arenaOptions.winsCount}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      handleWinsCountChange(value);
                    }
                  }}
                  min="1"
                />
              </WinsDisplay>
              <WinsButton onClick={() => handleWinsCountChange(arenaOptions.winsCount + 1)}>
                <FaPlus />
              </WinsButton>
            </WinsControlContainer>
          </Section>

          <Section>
            <SectionHeader>
              <SectionIcon>
                <FaGlobe />
              </SectionIcon>
              <SectionTitle>Server</SectionTitle>
            </SectionHeader>

            <SelectWrapper>
              <StyledSelect value={arenaOptions.server} onChange={handleServerChange}>
                <option value="Europe West">Europe West</option>
                {SERVERS.map(server => (
                  <option key={server} value={server}>{server}</option>
                ))}
              </StyledSelect>
            </SelectWrapper>
          </Section>

          <FeatureCard>
            <FeatureIcon>
              <FaUsers />
            </FeatureIcon>
            <FeatureContent>
              <FeatureTitle>Professional Arena Boosters</FeatureTitle>
              <FeatureDescription>
                Our Arena boosting team consists of top-tier players who specialize in the Arena game mode. They understand the meta, strategies, and compositions needed to maximize your success rate and climb quickly.
              </FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        </MainContent>

        {/* Right Column: Order Summary */}
        <OrderSummarySidebar>
          <OrderSummary>
            <OrderSummaryHeader>Order Summary</OrderSummaryHeader>
            
            <OrderDetails>
              <OrderDetailRow>
                <OrderDetailLabel>Mode:</OrderDetailLabel>
                <OrderDetailValue>{arenaOptions.boostMode}</OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Wins:</OrderDetailLabel>
                <OrderDetailValue>{arenaOptions.winsCount}</OrderDetailValue>
              </OrderDetailRow>
              
              <OrderDetailRow>
                <OrderDetailLabel>Server:</OrderDetailLabel>
                <OrderDetailValue>{arenaOptions.server}</OrderDetailValue>
              </OrderDetailRow>
            </OrderDetails>
            
            <SectionHeader>
              <SectionIcon>
                <FaCog />
              </SectionIcon>
              <SectionTitle>Boost customization</SectionTitle>
            </SectionHeader>

            <CustomizationOptions>
              <CustomizationOption>
                <CustomizationLabel>Streaming <PriceTag>+15%</PriceTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={arenaOptions.customization.streaming} 
                    onChange={() => toggleOption('streaming')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
              
              <CustomizationOption>
                <CustomizationLabel>Express Order <PriceTag>+25%</PriceTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={arenaOptions.customization.expressOrder} 
                    onChange={() => toggleOption('expressOrder')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
              
              <CustomizationOption>
                <CustomizationLabel>Solo Only <PriceTag>+50%</PriceTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={arenaOptions.customization.soloOnly} 
                    onChange={() => toggleOption('soloOnly')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
              
              <CustomizationOption>
                <CustomizationLabel>Appear Offline <FreeTag>FREE</FreeTag></CustomizationLabel>
                <OptionToggle>
                  <input 
                    type="checkbox" 
                    checked={arenaOptions.customization.appearOffline} 
                    onChange={() => toggleOption('appearOffline')} 
                  />
                  <ToggleSlider />
                </OptionToggle>
              </CustomizationOption>
            </CustomizationOptions>
            
            <SelectedOptionsSection>
              <SelectedOptionsHeader>Selected Options:</SelectedOptionsHeader>
              <OptionsList>
                {arenaOptions.customization.streaming && (
                  <OptionItem>
                    • Streaming <OptionPrice>+15%</OptionPrice>
                  </OptionItem>
                )}
                {arenaOptions.customization.expressOrder && (
                  <OptionItem>
                    • Express Order <OptionPrice>+25%</OptionPrice>
                  </OptionItem>
                )}
                {arenaOptions.customization.soloOnly && (
                  <OptionItem>
                    • Solo Only <OptionPrice>+50%</OptionPrice>
                  </OptionItem>
                )}
                {arenaOptions.customization.appearOffline && (
                  <OptionItem>
                    • Appear Offline <OptionPriceFree>FREE</OptionPriceFree>
                  </OptionItem>
                )}
                {!arenaOptions.customization.streaming && 
                 !arenaOptions.customization.expressOrder && 
                 !arenaOptions.customization.soloOnly &&
                 !arenaOptions.customization.appearOffline && (
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
                  value={arenaOptions.promoCode}
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

const WinsControlContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
`;

const WinsButton = styled.button`
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

const WinsDisplay = styled.div`
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

const CustomizationOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
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

export default ArenaBoost; 
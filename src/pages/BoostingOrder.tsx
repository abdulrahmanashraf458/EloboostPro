import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCrown, FaRocket, FaTrophy, FaShieldAlt, FaStar, FaCheck, FaInfoCircle, FaGlobeAmericas, FaHeadset, FaGhost, FaGlobe, FaCog, FaChevronRight } from 'react-icons/fa';
import RankSelector from '../components/boosting/RankSelector';
import BoostOptions from '../components/boosting/BoostOptions';
import OrderSummary from '../components/boosting/OrderSummary';
import { useAuth } from '../contexts/AuthContext';
import ServiceNav from '../components/ServiceNav';

type BoostType = 'solo' | 'duo';
type GameType = 'lol';

interface RankTier {
  tier: 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'challenger';
  division: 'IV' | 'III' | 'II' | 'I' | null;
  lp?: number;
}

interface BoostingOrder {
  gameType: GameType;
  boostType: BoostType;
  currentRank: RankTier;
  desiredRank: RankTier;
  server: string;
  options: {
    priorityBoost: boolean;
    soloOnly: boolean;
    streaming: boolean;
    championsSelection: boolean;
    offlineMode: boolean;
    duoBoost: boolean;
    voiceDuo: boolean;
    ghostDuo: boolean;
    specificRoles: string[];
    specificChampions: string[];
  };
}

const BoostingOrder: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeGame, setActiveGame] = useState<GameType>('lol');
  const [currentStep, setCurrentStep] = useState(1);
  const [order, setOrder] = useState<BoostingOrder>({
    gameType: 'lol',
    boostType: 'solo',
    currentRank: { tier: 'silver', division: 'I', lp: 0 },
    desiredRank: { tier: 'gold', division: 'IV', lp: 0 },
    server: 'Europe West',
    options: {
      priorityBoost: false,
      soloOnly: false,
      streaming: false,
      championsSelection: false,
      offlineMode: true,
      duoBoost: false,
      voiceDuo: false,
      ghostDuo: false,
      specificRoles: [],
      specificChampions: []
    }
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState('~24 Hours');
  const [availableOptions, setAvailableOptions] = useState({
    priorityBoost: true,
    soloOnly: true,
    streaming: true,
    championsSelection: true,
    offlineMode: true,
    voiceDuo: false,
    ghostDuo: false
  });
  
  useEffect(() => {
    // Calculate price based on current and desired ranks (simplified for demo)
    const rankValues = {
      'iron': 0,
      'bronze': 1,
      'silver': 2,
      'gold': 3,
      'platinum': 4,
      'diamond': 5,
      'master': 6,
      'grandmaster': 7,
      'challenger': 8
    };
    
    const divisionValues = {
      'IV': 0,
      'III': 1,
      'II': 2,
      'I': 3,
      'null': 0
    };
    
    const currentValue = rankValues[order.currentRank.tier] * 4 + divisionValues[order.currentRank.division || 'null'];
    const desiredValue = rankValues[order.desiredRank.tier] * 4 + divisionValues[order.desiredRank.division || 'null'];
    const rankDifference = desiredValue - currentValue;
    
    // Base pricing calculation
    let price = Math.max(0, rankDifference * 5); // $5 per division
    
    // Add options pricing
    if (order.options.priorityBoost) price *= 1.25;
    if (order.options.soloOnly) price *= 1.2;
    if (order.options.streaming) price *= 1.15;
    if (order.options.championsSelection) price *= 1.1;
    if (order.options.duoBoost) price *= 1.3; // Add 30% for duo boost
    if (order.options.voiceDuo) price *= 1.1; // Add 10% for voice duo
    if (order.options.ghostDuo) price *= 1.15; // Add 15% for ghost duo
    
    // Calculate estimated completion time
    const hourPerDivision = 2;
    const estHours = Math.max(1, rankDifference * hourPerDivision);
    let timeText = '';
    
    if (estHours < 24) {
      timeText = `~${estHours} Hours`;
    } else if (estHours < 48) {
      timeText = '~1 Day';
    } else {
      timeText = `~${Math.ceil(estHours / 24)} Days`;
    }
    
    // Apply priority boost effect on time
    if (order.options.priorityBoost) {
      if (estHours < 24) {
        timeText = `~${Math.max(1, Math.floor(estHours * 0.75))} Hours`;
      } else {
        const days = Math.ceil(estHours * 0.75 / 24);
        timeText = days === 1 ? '~1 Day' : `~${days} Days`;
      }
    }
    
    // Apply discount (for demo purposes)
    const discountPercent = 20; // 20% discount
    const discountAmount = (price * discountPercent) / 100;
    
    setTotalPrice(Math.round((price - discountAmount) * 100) / 100);
    setDiscount(discountPercent);
    setEstimatedTime(timeText);
    
    // Update available options based on boost type
    if (order.boostType === 'duo') {
      setAvailableOptions({
        priorityBoost: true,
        soloOnly: false, // Not applicable for duo boost
        streaming: true,
        championsSelection: true,
        offlineMode: false, // Not applicable for duo boost
        voiceDuo: true,    // Only available for duo boost
        ghostDuo: true     // Only available for duo boost
      });
      
      // Turn off incompatible options if duo is selected
      if (order.options.soloOnly || order.options.offlineMode) {
        const updatedOptions = {
          ...order.options,
          soloOnly: false,
          offlineMode: false
        };
        
        setOrder(prev => ({
          ...prev,
          options: updatedOptions
        }));
      }
    } else {
      // Reset to all options available for solo boost
      setAvailableOptions({
        priorityBoost: true,
        soloOnly: true,
        streaming: true,
        championsSelection: true,
        offlineMode: true,
        voiceDuo: false,   // Not available for solo boost
        ghostDuo: false    // Not available for solo boost
      });
      
      // Turn off duo-specific options when switching to solo
      if (order.options.voiceDuo || order.options.ghostDuo) {
        const updatedOptions = {
          ...order.options,
          voiceDuo: false,
          ghostDuo: false
        };
        
        setOrder(prev => ({
          ...prev,
          options: updatedOptions
        }));
      }
    }
  }, [order]);
  
  // Helper function to get rank numeric value for comparison
  const getRankValue = (rank: RankTier) => {
    const rankValues = {
      'iron': 0,
      'bronze': 1,
      'silver': 2,
      'gold': 3,
      'platinum': 4,
      'diamond': 5,
      'master': 6,
      'grandmaster': 7,
      'challenger': 8
    };
    
    const divisionValues = {
      'IV': 0,
      'III': 1,
      'II': 2,
      'I': 3,
      'null': 0
    };
    
    // Calculate total value - tier * 4 + division value
    return rankValues[rank.tier] * 4 + (rank.division ? divisionValues[rank.division] : 0);
  };

  const updateOrder = (updates: Partial<BoostingOrder>) => {
    const newOrder = { ...order, ...updates };
    
    // Add validation to ensure current rank is not higher than desired rank
    if (updates.currentRank || updates.desiredRank) {
      const current = updates.currentRank || order.currentRank;
      const desired = updates.desiredRank || order.desiredRank;
      
      const currentValue = getRankValue(current);
      const desiredValue = getRankValue(desired);
      
      // If current rank is higher than or equal to desired rank
      if (currentValue >= desiredValue) {
        if (updates.currentRank) {
          // User is updating current rank, so we need to adjust desired rank
          
          // Get the next tier up from current
          if (current.tier !== 'challenger') {
            const tiers = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'challenger'];
            const currentIndex = tiers.indexOf(current.tier);
            const nextTier = tiers[currentIndex + 1] as RankTier['tier'];
            
            newOrder.desiredRank = {
              tier: nextTier,
              division: nextTier === 'master' || nextTier === 'grandmaster' || nextTier === 'challenger' ? null : 'IV',
              lp: 0
            };
          }
        } else if (updates.desiredRank) {
          // User is updating desired rank, so we need to adjust current rank
          
          // Get the tier below desired
          if (desired.tier !== 'iron') {
            const tiers = ['iron', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster', 'challenger'];
            const desiredIndex = tiers.indexOf(desired.tier);
            const prevTier = tiers[desiredIndex - 1] as RankTier['tier'];
            
            newOrder.currentRank = {
              tier: prevTier,
              division: 'I',
              lp: 0
            };
          }
        }
      }
    }
    
    setOrder(newOrder);
  };
  
  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrder({ server: e.target.value });
  };
  
  const updateOptions = (optionName: string, value: boolean | string[]) => {
    const newOptions = {
      ...order.options,
      [optionName]: value
    };
    
    // Update boostType when duoBoost option changes
    if (optionName === 'duoBoost') {
      // When enabling duo boost, disable incompatible options
      if (value === true) {
        newOptions.soloOnly = false;
        newOptions.offlineMode = false;
      }
      
      setOrder({
        ...order,
        boostType: value ? 'duo' : 'solo',
        options: newOptions
      });
    } else {
      setOrder({
        ...order,
        options: newOptions
      });
    }
  };
  
  // Custom Duo options for the Boost Customization section
  const renderDuoOptions = () => {
    if (!order.options.duoBoost) return null;
    
    return (
      <>
        <CustomOptionItem $isActive={order.options.voiceDuo}>
          <OptionContent>
            <OptionIcon $isActive={order.options.voiceDuo}>
              <FaHeadset />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Voice Duo <PriceTag>+10%</PriceTag></OptionTitle>
              <OptionDescription>
                Voice communication with your booster during the games.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={order.options.voiceDuo} 
            onChange={() => updateOptions('voiceDuo', !order.options.voiceDuo)}
          />
        </CustomOptionItem>
        
        <CustomOptionItem $isActive={order.options.ghostDuo}>
          <OptionContent>
            <OptionIcon $isActive={order.options.ghostDuo}>
              <FaGhost />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Ghost Duo <PriceTag>+15%</PriceTag></OptionTitle>
              <OptionDescription>
                Booster plays from a smurf account, appearing as a random teammate.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={order.options.ghostDuo} 
            onChange={() => updateOptions('ghostDuo', !order.options.ghostDuo)}
          />
        </CustomOptionItem>
      </>
    );
  };
  
  // Function to render the selected options for Order Summary
  const renderSelectedOptions = () => {
    const selectedOptions = [];
    
    // Add boost type
    if (order.boostType === 'duo') {
      selectedOptions.push({ 
        name: 'Duo Boost', 
        price: '+30%'
      });
    }
    
    // Add all enabled options
    if (order.options.priorityBoost) {
      selectedOptions.push({ 
        name: 'Priority Boost', 
        price: '+25%'
      });
    }
    
    if (order.options.soloOnly) {
      selectedOptions.push({ 
        name: 'Solo Queue Only', 
        price: '+20%'
      });
    }
    
    if (order.options.streaming) {
      selectedOptions.push({ 
        name: 'Stream Games', 
        price: '+15%'
      });
    }
    
    if (order.options.championsSelection) {
      selectedOptions.push({ 
        name: 'Champion Selection', 
        price: '+10%'
      });
    }
    
    if (order.options.voiceDuo) {
      selectedOptions.push({ 
        name: 'Voice Duo', 
        price: '+10%'
      });
    }
    
    if (order.options.ghostDuo) {
      selectedOptions.push({ 
        name: 'Ghost Duo', 
        price: '+15%'
      });
    }
    
    if (order.options.offlineMode) {
      selectedOptions.push({ 
        name: 'Offline Mode', 
        price: 'FREE'
      });
    }
    
    // Check for role selections
    if (order.options.specificRoles.length > 0) {
      const roles = order.options.specificRoles.map(role => 
        role.charAt(0).toUpperCase() + role.slice(1)
      ).join(', ');
      
      selectedOptions.push({ 
        name: `Roles: ${roles}`, 
        price: 'FREE'
      });
    }
    
    // Add selected champions to the order summary
    if (order.options.specificChampions.length > 0) {
      const champions = order.options.specificChampions.join(', ');
      
      selectedOptions.push({
        name: `Champions: ${champions}`,
        price: 'FREE'
      });
    }
    
    return selectedOptions;
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>League of Legends Boosting</PageTitle>
        <PageDescription>
          Climb the ranks with our professional boosting service
        </PageDescription>
      </PageHeader>

      <ServiceNav />

      <BoostingGrid>
        <BoostingSelectionContainer>
          <GameSelection>
            <GameTab 
              active={true}
            >
              League of Legends
            </GameTab>
          </GameSelection>
          
          <SectionTitle>Current Rank</SectionTitle>
          <RankSelector 
            type="current"
            value={order.currentRank} 
            onChange={(rank) => updateOrder({ currentRank: rank })}
          />
          
          <SectionTitle>Desired Rank</SectionTitle>
          <RankSelector 
            type="desired"
            value={order.desiredRank} 
            onChange={(rank) => updateOrder({ desiredRank: rank })}
          />
          
          <SectionTitle>
            <SectionTitleWithIcon>
              <ServerIcon><FaGlobeAmericas /></ServerIcon>
              Server
            </SectionTitleWithIcon>
          </SectionTitle>
          <SelectWrapper>
            <StyledSelect value={order.server} onChange={handleServerChange}>
              <option value="Europe West">Europe West</option>
              <option value="Europe Nordic & East">Europe Nordic & East</option>
              <option value="North America">North America</option>
              <option value="Middle East">Middle East</option>
              <option value="Oceania">Oceania</option>
              <option value="South East Asia">South East Asia</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Taiwan">Taiwan</option>
              <option value="Russia">Russia</option>
              <option value="Turkey">Turkey</option>
              <option value="Latin America North">Latin America North</option>
              <option value="Latin America South">Latin America South</option>
            </StyledSelect>
          </SelectWrapper>
          
          <SectionTitle>Boost Customization <CustomizationIcon><FaCrown /></CustomizationIcon></SectionTitle>
          
          {/* Updated Duo Boost Option with improved styling */}
          <CustomOptionItem $isActive={order.options.duoBoost}>
            <OptionContent>
              <OptionIcon $isActive={order.options.duoBoost}>
                <FaTrophy />
              </OptionIcon>
              <OptionDetails>
                <OptionTitle>Duo Boost <PriceTag>+30%</PriceTag></OptionTitle>
                <OptionDescription>
                  Play together with a challenger booster.
                </OptionDescription>
              </OptionDetails>
            </OptionContent>
            <ToggleSwitch 
              checked={order.options.duoBoost} 
              onChange={() => updateOptions('duoBoost', !order.options.duoBoost)}
            />
          </CustomOptionItem>
          
          {/* Render Duo-specific options if Duo is selected */}
          {renderDuoOptions()}
          
          <BoostOptions 
            options={order.options}
            updateOptions={updateOptions}
            availableOptions={availableOptions}
          />
        </BoostingSelectionContainer>
        
        <OrderSummaryContainer>
          <OrderSummary
            order={order}
            price={totalPrice}
            discount={discount}
            estimatedTime={estimatedTime}
            isAuthenticated={isAuthenticated}
            selectedOptions={renderSelectedOptions()}
          />
        </OrderSummaryContainer>
      </BoostingGrid>
      
      <FeaturesSection>
        <FeatureCard>
          <FeatureIcon>
            <FaRocket />
          </FeatureIcon>
          <FeatureTitle>Fast Delivery</FeatureTitle>
          <FeatureDescription>
            Our professional boosters work efficiently to deliver your order as quickly as possible.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaShieldAlt />
          </FeatureIcon>
          <FeatureTitle>Account Security</FeatureTitle>
          <FeatureDescription>
            We use VPN protection and secure practices to ensure your account remains safe.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaStar />
          </FeatureIcon>
          <FeatureTitle>Top Rated Boosters</FeatureTitle>
          <FeatureDescription>
            Our boosters are hand-picked from Challenger and Grandmaster tiers for guaranteed quality.
          </FeatureDescription>
        </FeatureCard>
        
        <FeatureCard>
          <FeatureIcon>
            <FaCheck />
          </FeatureIcon>
          <FeatureTitle>100% Completion Rate</FeatureTitle>
          <FeatureDescription>
            We guarantee completion of your order or your money back.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 7rem 1.5rem 4rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text}cc;
  max-width: 800px;
  margin: 0 auto;
`;

const BoostingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const BoostingSelectionContainer = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const GameSelection = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const GameTab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  color: ${({ active, theme }) => (active ? theme.primary : theme.text)};
  border: none;
  background: none;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${({ active, theme }) => (active ? theme.primary : 'transparent')};
    transition: background-color 0.2s;
  }
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  margin-top: 2rem;
`;

const CustomizationIcon = styled.span`
  color: ${({ theme }) => theme.accent};
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
`;

const OrderSummaryContainer = styled.div`
  position: sticky;
  top: 6rem;
  align-self: flex-start;
`;

// Custom option styling (similar to BoostOptions component)
const CustomOptionItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${({ theme, $isActive }) => 
    $isActive ? `${theme.primary}11` : theme.body};
  border: 1px solid ${({ theme, $isActive }) => 
    $isActive ? theme.primary : theme.border};
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const OptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const OptionIcon = styled.div<{ $isActive: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme, $isActive }) => 
    $isActive ? `${theme.primary}22` : `${theme.primary}11`};
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.primary : theme.textLight};
  font-size: 1.2rem;
  transition: all 0.3s ease;
`;

const OptionDetails = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
`;

const PriceTag = styled.span`
  background: ${({ theme }) => `${theme.accent}22`};
  color: ${({ theme }) => theme.accent};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const FreeTag = styled.span`
  background: ${({ theme }) => `${theme.success}22`};
  color: ${({ theme }) => theme.success};
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <SwitchContainer onClick={onChange}>
      <SwitchInput type="checkbox" checked={checked} onChange={() => {}} />
      <SwitchSlider checked={checked} />
    </SwitchContainer>
  );
};

const SwitchContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const SwitchSlider = styled.span<{ checked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.checked ? '#00bcd4' : '#ccc'};
  transition: 0.4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: ${props => props.checked ? '27px' : '3px'};
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const FeaturesSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 4rem;
`;

const FeatureCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2rem 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.text}cc;
  font-size: 0.9rem;
`;

const SectionTitleWithIcon = styled.div`
  display: flex;
  align-items: center;
`;

const ServerIcon = styled.span`
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
`;

const SelectWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  
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

export default BoostingOrder; 
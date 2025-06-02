// Updated Champion Mastery component - fixed TypeScript error
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCrown, FaTrophy, FaGamepad, FaRocket, FaGlobe, FaCog, FaChevronRight, FaTag, FaSearch, FaPlus, FaMinus, FaChevronDown, FaStar, FaTimes } from 'react-icons/fa';
import ServiceNav from '../components/ServiceNav';
import { useCheckoutContext } from '../context/CheckoutContext';

// Champion list from the user
const CHAMPIONS = [
  "Aatrox", "Ahri", "Akali", "Akshan", "Alistar", "Ambessa", "Amumu", "Anivia", "Annie", "Aphelios",
  "Ashe", "Aurelion Sol", "Aurora", "Azir", "Bard", "Bel'Veth", "Blitzcrank", "Brand", "Braum", "Briar",
  "Caitlyn", "Camille", "Cassiopeia", "Cho'Gath", "Corki", "Darius", "Diana", "Dr. Mundo", "Draven", "Ekko",
  "Elise", "Evelynn", "Ezreal", "Fiddlesticks", "Fiora", "Fizz", "Galio", "Gangplank", "Garen", "Gnar",
  "Gragas", "Graves", "Gwen", "Hecarim", "Heimerdinger", "Hwei", "Illaoi", "Irelia", "Ivern", "Janna",
  "Jarvan IV", "Jax", "Jayce", "Jhin", "Jinx", "K'Sante", "Kai'Sa", "Kalista", "Karma", "Karthus",
  "Kassadin", "Katarina", "Kayle", "Kayn", "Kennen", "Kha'Zix", "Kindred", "Kled", "Kog'Maw", "LeBlanc",
  "Lee Sin", "Leona", "Lillia", "Lissandra", "Lucian", "Lulu", "Lux", "Malphite", "Malzahar", "Maokai",
  "Master Yi", "Mel", "Milio", "Miss Fortune", "Mordekaiser", "Morgana", "Naafiri", "Nami", "Nasus", "Nautilus",
  "Neeko", "Nidalee", "Nilah", "Nocturne", "Nunu & Willump", "Olaf", "Orianna", "Ornn", "Pantheon", "Poppy",
  "Pyke", "Qiyana", "Quinn", "Rakan", "Rammus", "Rek'Sai", "Rell", "Renata Glasc", "Renekton", "Rengar",
  "Riven", "Rumble", "Ryze", "Samira", "Sejuani", "Senna", "Seraphine", "Sett", "Shaco", "Shen",
  "Shyvana", "Singed", "Sion", "Sivir", "Skarner", "Smolder", "Sona", "Soraka", "Swain", "Sylas",
  "Syndra", "Tahm Kench", "Taliyah", "Talon", "Taric", "Teemo", "Thresh", "Tristana", "Trundle", "Tryndamere",
  "Twisted Fate", "Twitch", "Udyr", "Urgot", "Varus", "Vayne", "Veigar", "Vel'Koz", "Vex", "Vi",
  "Viego", "Viktor", "Vladimir", "Volibear", "Warwick", "Wukong", "Xayah", "Xerath", "Xin Zhao", "Yasuo",
  "Yone", "Yorick", "Yuumi", "Zac", "Zed", "Zeri", "Ziggs", "Zilean", "Zoe", "Zyra"
];

// Ranks and servers
const RANKS = ["UNRANKED", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
const SERVERS = ["NA", "EUW", "EUNE", "OCE", "LAS", "LAN", "BR", "TR", "RU", "JP", "KR"];

interface MasteryOptions {
  champion: string;
  currentLevel: number;
  desiredLevel: number;
  server: string;
  rank: string;
  flash: 'FLASH_F' | 'FLASH_D';
  options: {
    streaming: boolean;
    expressOrder: boolean;
    soloOnly: boolean;
    appearOffline: boolean;
  };
  promoCode: string;
}

const ChampionMastery: React.FC = () => {
  const { initiateCheckout } = useCheckoutContext();
  const [champModalOpen, setChampModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [masteryOptions, setMasteryOptions] = useState<MasteryOptions>({
    champion: "",
    currentLevel: 1,
    desiredLevel: 2,
    server: "NA",
    rank: "SILVER",
    flash: "FLASH_D",
    options: {
      streaming: false,
      expressOrder: false,
      soloOnly: false,
      appearOffline: true,
    },
    promoCode: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  // Filter champions based on search
  const filteredChampions = CHAMPIONS.filter(champion => 
    champion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle champion selection
  const selectChampion = (champion: string) => {
    setMasteryOptions(prev => ({
      ...prev,
      champion
    }));
    setChampModalOpen(false);
  };

  // Handle level changes
  const handleCurrentLevelChange = (value: number) => {
    const newValue = Math.max(1, Math.min(6, value));
    setMasteryOptions(prev => ({
      ...prev,
      currentLevel: newValue,
      desiredLevel: Math.max(prev.desiredLevel, newValue + 1)
    }));
  };

  const handleDesiredLevelChange = (value: number) => {
    const newValue = Math.max(2, Math.min(7, value));
    setMasteryOptions(prev => ({
      ...prev,
      desiredLevel: newValue,
      currentLevel: Math.min(prev.currentLevel, newValue - 1)
    }));
  };

  // Handle server change
  const handleServerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMasteryOptions(prev => ({
      ...prev,
      server: e.target.value
    }));
  };

  // Handle rank change
  const handleRankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMasteryOptions(prev => ({
      ...prev,
      rank: e.target.value
    }));
  };

  // Handle flash preference change
  const handleFlashChange = (flash: 'FLASH_F' | 'FLASH_D') => {
    setMasteryOptions(prev => ({
      ...prev,
      flash
    }));
  };

  // Toggle options
  const toggleOption = (option: keyof MasteryOptions['options']) => {
    setMasteryOptions(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: !prev.options[option]
      }
    }));
  };

  // Handle promo code input
  const handlePromoCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasteryOptions(prev => ({
      ...prev,
      promoCode: e.target.value
    }));
  };

  // Calculate price
  useEffect(() => {
    if (!masteryOptions.champion) return;
    
    const levelDifference = masteryOptions.desiredLevel - masteryOptions.currentLevel;
    let price = levelDifference * 5; // $5 per level
    setBasePrice(price);
    
    // Apply option modifiers
    if (masteryOptions.options.streaming) {
      price += 5; // $5 extra for streaming
    }
    
    if (masteryOptions.options.expressOrder) {
      price += price * 0.25; // 25% extra for express order
    }
    
    if (masteryOptions.options.soloOnly) {
      price -= price * 0.5; // 50% discount for marks only
    }
    
    // No discount applied anymore
    
    setTotalPrice(Number(price.toFixed(2)));
  }, [masteryOptions]);

  // Get selected options for display in order summary
  const getSelectedOptions = () => {
    const selected = [];
    
    if (masteryOptions.options.streaming) {
      selected.push({ name: "STREAMING", price: "+$5" });
    }
    
    if (masteryOptions.options.expressOrder) {
      selected.push({ name: "EXPRESS ORDER", price: "+25%" });
    }
    
    if (masteryOptions.options.soloOnly) {
      selected.push({ name: "MARKS ONLY", price: "+50%" });
    }
    
    if (masteryOptions.options.appearOffline) {
      selected.push({ name: "APPEAR OFFLINE", price: "FREE" });
    }
    
    return selected;
  };

  // Add function to handle checkout
  const handleCheckout = () => {
    initiateCheckout({
      gameType: 'lol',
      boostType: 'solo',
      price: totalPrice,
      discount: 0, // No discount applied
      service: `Champion Mastery - ${masteryOptions.champion} - Level ${masteryOptions.currentLevel} to ${masteryOptions.desiredLevel}`,
      selectedOptions: getSelectedOptions(),
      server: masteryOptions.server,
      options: masteryOptions.options
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageContainer>
        <PageHeader>
          <PageTitle>Champion Mastery</PageTitle>
          <PageDescription>
            Level up specific champions to get mastery tokens and emblems
          </PageDescription>
        </PageHeader>

        <ServiceNav />

        <ContentGrid>
          {/* Left Column: Champion Mastery Options */}
          <MainContent>
            <Section>
              <SectionWithIcon>
                <SectionIcon>
                  <FaCrown />
                </SectionIcon>
                <SectionTitle>Champion Selection</SectionTitle>
              </SectionWithIcon>

              <ChampionSelector onClick={() => setChampModalOpen(true)}>
                {masteryOptions.champion ? (
                  <ChampionName>{masteryOptions.champion}</ChampionName>
                ) : (
                  <ChampionName>Select a champion</ChampionName>
                )}
              </ChampionSelector>

              <SectionWithIcon>
                <SectionIcon>
                  <FaStar />
                </SectionIcon>
                <SectionTitle>Mastery Level</SectionTitle>
              </SectionWithIcon>

              <LevelSelectionContainer>
                <LevelColumn>
                  <LevelLabel>Current Level</LevelLabel>
                  <LevelControls>
                    <LevelButton onClick={() => handleCurrentLevelChange(masteryOptions.currentLevel - 1)}>
                      <FaMinus />
                    </LevelButton>
                    <LevelDisplay>{masteryOptions.currentLevel}</LevelDisplay>
                    <LevelButton onClick={() => handleCurrentLevelChange(masteryOptions.currentLevel + 1)}>
                      <FaPlus />
                    </LevelButton>
                  </LevelControls>
                </LevelColumn>

                <LevelColumn>
                  <LevelLabel>Desired Level</LevelLabel>
                  <LevelControls>
                    <LevelButton onClick={() => handleDesiredLevelChange(masteryOptions.desiredLevel - 1)}>
                      <FaMinus />
                    </LevelButton>
                    <LevelDisplay>{masteryOptions.desiredLevel}</LevelDisplay>
                    <LevelButton onClick={() => handleDesiredLevelChange(masteryOptions.desiredLevel + 1)}>
                      <FaPlus />
                    </LevelButton>
                  </LevelControls>
                </LevelColumn>
              </LevelSelectionContainer>

              <SectionWithIcon>
                <SectionIcon>
                  <FaGlobe />
                </SectionIcon>
                <SectionTitle>Server</SectionTitle>
              </SectionWithIcon>

              <SelectWrapper>
                <StyledSelect value={masteryOptions.server} onChange={handleServerChange}>
                  {SERVERS.map(server => (
                    <option key={server} value={server}>{server}</option>
                  ))}
                </StyledSelect>
              </SelectWrapper>

              <SectionWithIcon>
                <SectionIcon>
                  <FaTrophy />
                </SectionIcon>
                <SectionTitle>Current Rank</SectionTitle>
              </SectionWithIcon>

              <SelectWrapper>
                <StyledSelect value={masteryOptions.rank} onChange={handleRankChange}>
                  {RANKS.map(rank => (
                    <option key={rank} value={rank}>{rank}</option>
                  ))}
                </StyledSelect>
              </SelectWrapper>

              <SectionWithIcon>
                <SectionIcon>
                  <FaRocket />
                </SectionIcon>
                <SectionTitle>Flash Keyset</SectionTitle>
              </SectionWithIcon>

              <FlashKeysetContainer>
                <FlashKeyOption 
                  active={masteryOptions.flash === 'FLASH_F'} 
                  onClick={() => handleFlashChange('FLASH_F')}
                >
                  FLASH F
                </FlashKeyOption>
                <FlashKeyOption 
                  active={masteryOptions.flash === 'FLASH_D'} 
                  onClick={() => handleFlashChange('FLASH_D')}
                >
                  FLASH D
                </FlashKeyOption>
              </FlashKeysetContainer>

              <SectionWithIcon>
                <SectionIcon>
                  <FaCog />
                </SectionIcon>
                <SectionTitle>Customization Options</SectionTitle>
              </SectionWithIcon>

              <BoostOptions>
                <BoostOption>
                  <BoostOptionLabel>STREAMING (+5$ or 15%)</BoostOptionLabel>
                  <OptionToggle>
                    <input 
                      type="checkbox" 
                      checked={masteryOptions.options.streaming} 
                      onChange={() => toggleOption('streaming')} 
                    />
                    <ToggleSlider />
                  </OptionToggle>
                </BoostOption>
                
                <BoostOption>
                  <BoostOptionLabel>EXPRESS ORDER (+25%)</BoostOptionLabel>
                  <OptionToggle>
                    <input 
                      type="checkbox" 
                      checked={masteryOptions.options.expressOrder} 
                      onChange={() => toggleOption('expressOrder')} 
                    />
                    <ToggleSlider />
                  </OptionToggle>
                </BoostOption>
                
                <BoostOption>
                  <BoostOptionLabel>SOLO ONLY (+50%)</BoostOptionLabel>
                  <OptionToggle>
                    <input 
                      type="checkbox" 
                      checked={masteryOptions.options.soloOnly} 
                      onChange={() => toggleOption('soloOnly')} 
                    />
                    <ToggleSlider />
                  </OptionToggle>
                </BoostOption>
                
                <BoostOption>
                  <BoostOptionLabel>APPEAR OFFLINE (FREE)</BoostOptionLabel>
                  <OptionToggle>
                    <input 
                      type="checkbox" 
                      checked={masteryOptions.options.appearOffline} 
                      onChange={() => toggleOption('appearOffline')} 
                    />
                    <ToggleSlider />
                  </OptionToggle>
                </BoostOption>
              </BoostOptions>
            </Section>

            <Section>
              <SectionWithIcon>
                <SectionIcon>
                  <FaTrophy />
                </SectionIcon>
                <SectionTitle>Mastery Level</SectionTitle>
              </SectionWithIcon>

              <LevelSelectionContainer>
                <LevelColumn>
                  <LevelLabel>Current Level</LevelLabel>
                  <LevelControls>
                    <LevelButton onClick={() => handleCurrentLevelChange(masteryOptions.currentLevel - 1)}>
                      <FaMinus />
                    </LevelButton>
                    <LevelDisplay>{masteryOptions.currentLevel}</LevelDisplay>
                    <LevelButton onClick={() => handleCurrentLevelChange(masteryOptions.currentLevel + 1)}>
                      <FaPlus />
                    </LevelButton>
                  </LevelControls>
                </LevelColumn>

                <LevelColumn>
                  <LevelLabel>Desired Level</LevelLabel>
                  <LevelControls>
                    <LevelButton onClick={() => handleDesiredLevelChange(masteryOptions.desiredLevel - 1)}>
                      <FaMinus />
                    </LevelButton>
                    <LevelDisplay>{masteryOptions.desiredLevel}</LevelDisplay>
                    <LevelButton onClick={() => handleDesiredLevelChange(masteryOptions.desiredLevel + 1)}>
                      <FaPlus />
                    </LevelButton>
                  </LevelControls>
                </LevelColumn>
              </LevelSelectionContainer>
            </Section>

            <Section>
              <SectionWithIcon>
                <SectionIcon>
                  <FaGlobe />
                </SectionIcon>
                <SectionTitle>Server</SectionTitle>
              </SectionWithIcon>

              <SelectWrapper>
                <StyledSelect value={masteryOptions.server} onChange={handleServerChange}>
                  {SERVERS.map(server => (
                    <option key={server} value={server}>{server}</option>
                  ))}
                </StyledSelect>
              </SelectWrapper>
            </Section>
          </MainContent>

          {/* Right Column: Order Summary */}
          <OrderSummaryContainer>
            <SummaryCard>
              <SummaryHeader>
                <SummaryIcon>
                  <FaCrown />
                </SummaryIcon>
                <SummaryInfo>
                  <SummaryTitle>Champion Mastery</SummaryTitle>
                  <SummaryType>
                    {masteryOptions.champion ? masteryOptions.champion : "Select a champion"}
                  </SummaryType>
                </SummaryInfo>
              </SummaryHeader>

              <OrderSummaryItem>
                <OrderSummaryLabel>Server</OrderSummaryLabel>
                <OrderSummaryValue>{masteryOptions.server}</OrderSummaryValue>
              </OrderSummaryItem>

              <OrderSummaryItem>
                <OrderSummaryLabel>Rank</OrderSummaryLabel>
                <OrderSummaryValue>{masteryOptions.rank}</OrderSummaryValue>
              </OrderSummaryItem>

              <OrderSummaryItem>
                <OrderSummaryLabel>Mastery Level</OrderSummaryLabel>
                <OrderSummaryValue>{masteryOptions.currentLevel} → {masteryOptions.desiredLevel}</OrderSummaryValue>
              </OrderSummaryItem>

              <OrderSummaryItem>
                <OrderSummaryLabel>Flash Key</OrderSummaryLabel>
                <OrderSummaryValue>{masteryOptions.flash === 'FLASH_F' ? 'F' : 'D'}</OrderSummaryValue>
              </OrderSummaryItem>

              {/* Add Selected Options Display */}
              {getSelectedOptions().length > 0 && (
                <>
                  <OrderSummaryItem style={{ flexDirection: 'column' }}>
                    <OrderSummaryLabel style={{ marginBottom: '8px' }}>Selected Options</OrderSummaryLabel>
                    {getSelectedOptions().map((option, index) => (
                      <SelectedOptionItem key={index}>
                        <span>• {option.name}</span>
                        <span>{option.price}</span>
                      </SelectedOptionItem>
                    ))}
                  </OrderSummaryItem>
                </>
              )}

              <OrderDetailsSection>
                <OrderDetailsSectionTitle>Order Details</OrderDetailsSectionTitle>
                <OrderSummaryItem>
                  <OrderSummaryLabel>Base Price</OrderSummaryLabel>
                  <OrderSummaryValue>${basePrice.toFixed(2)}</OrderSummaryValue>
                </OrderSummaryItem>

                <PromoCodeContainer>
                  <PromoCodeInput 
                    type="text"
                    placeholder="Promo Code"
                    value={masteryOptions.promoCode}
                    onChange={handlePromoCodeChange}
                  />
                  <PromoCodeIcon>
                    <FaTag />
                  </PromoCodeIcon>
                  <ApplyButton>Apply</ApplyButton>
                </PromoCodeContainer>

                <OrderTotalItem>
                  <OrderTotalLabel>Total</OrderTotalLabel>
                  <OrderTotalValue>${totalPrice.toFixed(2)}</OrderTotalValue>
                </OrderTotalItem>
              </OrderDetailsSection>

              <ProceedButton onClick={handleCheckout}>
                Proceed to Checkout <FaChevronRight />
              </ProceedButton>
            </SummaryCard>
          </OrderSummaryContainer>
        </ContentGrid>
      </PageContainer>

      {/* Champion Selection Modal */}
      {champModalOpen && (
        <ModalOverlay onClick={() => setChampModalOpen(false)}>
          <ChampionModal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Select your champions</ModalTitle>
              <ModalClose onClick={() => setChampModalOpen(false)}>×</ModalClose>
            </ModalHeader>
            
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search Champion"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchIcon>
                <FaSearch />
              </SearchIcon>
            </SearchContainer>
            
            <ChampionGrid>
              {filteredChampions.map((champion) => (
                <ChampionItem key={champion} onClick={() => selectChampion(champion)}>
                  {champion}
                </ChampionItem>
              ))}
            </ChampionGrid>
          </ChampionModal>
        </ModalOverlay>
      )}
    </motion.div>
  );
};

// Styled Components
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
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const SectionWithIcon = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
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

const ChampionSelector = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  margin-bottom: 1.5rem;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ChampionName = styled.div`
  font-weight: 500;
`;

const LevelSelectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LevelColumn = styled.div``;

const LevelLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const LevelControls = styled.div`
  display: flex;
  align-items: center;
`;

const LevelButton = styled.button`
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

const LevelDisplay = styled.div`
  flex: 1;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 0.5rem;
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
    transform: translateY(+50%);
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

const FlashKeysetContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const FlashKeyOption = styled.div<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ active, theme }) => active ? theme.primary : theme.border};
  background: ${({ active, theme }) => active ? theme.primary + '22' : theme.body};
  color: ${({ active, theme }) => active ? theme.primary : theme.text};
  font-weight: ${({ active }) => active ? '600' : '400'};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary}11;
  }
`;

const BoostOptions = styled.div`
  margin-bottom: 1.5rem;
`;

const BoostOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 0.75rem;
`;

const BoostOptionLabel = styled.div`
  font-weight: 500;
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

const OrderSummaryContainer = styled.div`
  position: sticky;
  top: 6rem;
  align-self: flex-start;
`;

const SummaryCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const SummaryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

const SummaryIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.primary}22`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.primary};
  font-size: 2rem;
  margin-right: 1rem;
`;

const SummaryInfo = styled.div`
  flex: 1;
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem;
  margin: 0 0 0.5rem 0;
`;

const SummaryType = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
`;

const OrderSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border}66;
`;

const OrderSummaryLabel = styled.div`
  color: ${({ theme }) => theme.textLight};
`;

const OrderSummaryValue = styled.div`
  font-weight: 500;
`;

const OrderDetailsSection = styled.div`
  margin-top: 1.5rem;
`;

const OrderDetailsSectionTitle = styled.h4`
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const OrderTotalItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const OrderTotalLabel = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const OrderTotalValue = styled.div`
  font-weight: 700;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.primary};
`;

const PromoCodeContainer = styled.div`
  display: flex;
  position: relative;
  margin: 1rem 0;
`;

const PromoCodeInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem 0 0 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-right: none;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const PromoCodeIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(+50%);
  color: ${({ theme }) => theme.textLight};
`;

const ApplyButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0 0.5rem 0.5rem 0;
  border: 1px solid ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme.primary}dd;
  }
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

// Modal Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ChampionModal = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
`;

const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
`;

const SearchContainer = styled.div`
  position: relative;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 2rem;
  top: 50%;
  transform: translateY(+50%);
  color: ${({ theme }) => theme.textLight};
`;

const ChampionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
  padding: 1rem;
  overflow-y: auto;
  max-height: 400px;
`;

const ChampionItem = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primary}11;
  }
`;

// Add new styled component for selected options
const SelectedOptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  font-size: 0.85rem;
  width: 100%;
`;

export default ChampionMastery; 
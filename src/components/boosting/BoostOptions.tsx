import React, { useState } from 'react';
import styled from 'styled-components';
import { FaRocket, FaUserShield, FaTv, FaGamepad, FaEye, FaUsers, FaCheck, FaInfoCircle, FaSearch, FaTimes } from 'react-icons/fa';

// Champion list from League of Legends
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

interface BoostOptionsProps {
  options: {
    priorityBoost: boolean;
    soloOnly: boolean;
    streaming: boolean;
    championsSelection: boolean;
    offlineMode: boolean;
    specificRoles: string[];
    specificChampions: string[];
  };
  updateOptions: (optionName: string, value: boolean | string[]) => void;
  availableOptions?: {
    priorityBoost: boolean;
    soloOnly: boolean;
    streaming: boolean;
    championsSelection: boolean;
    offlineMode: boolean;
  };
}

const BoostOptions: React.FC<BoostOptionsProps> = ({ 
  options, 
  updateOptions, 
  availableOptions = {
    priorityBoost: true,
    soloOnly: true,
    streaming: true,
    championsSelection: true,
    offlineMode: true
  }
}) => {
  const [showChampionSelect, setShowChampionSelect] = useState(false);
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [champModalOpen, setChampModalOpen] = useState(false);
  
  const filteredChampions = CHAMPIONS.filter(champion => 
    champion.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleToggleOption = (optionName: string) => {
    updateOptions(optionName, !options[optionName as keyof typeof options]);
    
    // Show/hide champion selection when toggling champion option
    if (optionName === 'championsSelection') {
      setShowChampionSelect(!options.championsSelection);
    }
  };
  
  const handleRoleSelection = (role: string) => {
    const updatedRoles = options.specificRoles.includes(role)
      ? options.specificRoles.filter(r => r !== role)
      : [...options.specificRoles, role];
    
    updateOptions('specificRoles', updatedRoles);
  };
  
  const handleChampionSelection = (champion: string) => {
    const updatedChampions = options.specificChampions.includes(champion)
      ? options.specificChampions.filter(c => c !== champion)
      : [...options.specificChampions, champion];
    
    updateOptions('specificChampions', updatedChampions);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const roles = [
    { id: 'top', name: 'Top' },
    { id: 'jungle', name: 'Jungle' },
    { id: 'mid', name: 'Mid' },
    { id: 'adc', name: 'ADC' },
    { id: 'support', name: 'Support' }
  ];
  
  return (
    <OptionsContainer>
      {availableOptions.priorityBoost && (
        <OptionItem $isActive={options.priorityBoost}>
          <OptionContent>
            <OptionIcon $isActive={options.priorityBoost}>
              <FaRocket />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Priority Boost <PriceTag>+25%</PriceTag></OptionTitle>
              <OptionDescription>
                Get your order done faster with higher priority in booster assignment.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={options.priorityBoost} 
            onChange={() => handleToggleOption('priorityBoost')}
          />
        </OptionItem>
      )}
      
      {availableOptions.soloOnly && (
        <OptionItem $isActive={options.soloOnly}>
          <OptionContent>
            <OptionIcon $isActive={options.soloOnly}>
              <FaUserShield />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Solo Queue Only <PriceTag>+20%</PriceTag></OptionTitle>
              <OptionDescription>
                Booster will only play Solo/Duo queue matches, not Flex.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={options.soloOnly} 
            onChange={() => handleToggleOption('soloOnly')}
          />
        </OptionItem>
      )}
      
      {availableOptions.streaming && (
        <OptionItem $isActive={options.streaming}>
          <OptionContent>
            <OptionIcon $isActive={options.streaming}>
              <FaTv />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Stream Games <PriceTag>+15%</PriceTag></OptionTitle>
              <OptionDescription>
                Watch your booster play live through our private streaming.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={options.streaming} 
            onChange={() => handleToggleOption('streaming')}
          />
        </OptionItem>
      )}
      
      {availableOptions.championsSelection && (
        <OptionItem $isActive={options.championsSelection}>
          <OptionContent>
            <OptionIcon $isActive={options.championsSelection}>
              <FaGamepad />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Champion Selection <PriceTag>+10%</PriceTag></OptionTitle>
              <OptionDescription>
                Specify which champions the booster should play.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={options.championsSelection} 
            onChange={() => handleToggleOption('championsSelection')}
          />
        </OptionItem>
      )}
      
      {availableOptions.offlineMode && (
        <OptionItem $isActive={options.offlineMode}>
          <OptionContent>
            <OptionIcon $isActive={options.offlineMode}>
              <FaEye />
            </OptionIcon>
            <OptionDetails>
              <OptionTitle>Offline Mode <FreeTag>FREE</FreeTag></OptionTitle>
              <OptionDescription>
                Booster will appear offline while playing on your account.
              </OptionDescription>
            </OptionDetails>
          </OptionContent>
          <ToggleSwitch 
            checked={options.offlineMode} 
            onChange={() => handleToggleOption('offlineMode')}
          />
        </OptionItem>
      )}
      
      <OptionItem $isActive={options.specificRoles.length > 0}>
        <OptionContent>
          <OptionIcon $isActive={options.specificRoles.length > 0}>
            <FaUsers />
          </OptionIcon>
          <OptionDetails>
            <OptionTitle>Role Selection <FreeTag>FREE</FreeTag></OptionTitle>
            <OptionDescription>
              Choose which lanes/roles the booster should play.
            </OptionDescription>
          </OptionDetails>
        </OptionContent>
        <ToggleButton 
          isActive={showRoleSelect}
          onClick={() => setShowRoleSelect(!showRoleSelect)}
        >
          {showRoleSelect ? 'Hide' : 'Select'}
        </ToggleButton>
      </OptionItem>
      
      {showRoleSelect && (
        <RoleSelectionContainer>
          {roles.map(role => (
            <RoleButton 
              key={role.id}
              isSelected={options.specificRoles.includes(role.id)}
              onClick={() => handleRoleSelection(role.id)}
            >
              {role.name}
              {options.specificRoles.includes(role.id) && (
                <RoleCheckmark>
                  <FaCheck />
                </RoleCheckmark>
              )}
            </RoleButton>
          ))}
          <RoleSelectionInfo>
            <FaInfoCircle />
            <span>You can select multiple roles</span>
          </RoleSelectionInfo>
        </RoleSelectionContainer>
      )}
      
      {showChampionSelect && availableOptions.championsSelection && (
        <ChampionSelectionContainer>
          <ChampionSelectionHeader>
            <ChampionSelectionTitle>
              Select Champions
            </ChampionSelectionTitle>
          </ChampionSelectionHeader>
          
          {champModalOpen ? (
            <ChampModalOverlay>
              <ChampModalContent>
                <ChampModalHeader>
                  <ChampModalTitle>Select your champions</ChampModalTitle>
                  <CloseButton onClick={() => setChampModalOpen(false)}>
                    <FaTimes />
                  </CloseButton>
                </ChampModalHeader>
                
                <ChampModalSearch>
                  <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                  <ChampionSearchInput 
                    type="text" 
                    placeholder="Search Champion"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ paddingLeft: '2.5rem', width: '100%' }}
                  />
                </ChampModalSearch>
                
                <ChampGrid>
                  {filteredChampions.map(champion => (
                    <ChampButton 
                      key={champion}
                      isSelected={options.specificChampions.includes(champion)}
                      onClick={() => handleChampionSelection(champion)}
                    >
                      {champion}
                      {options.specificChampions.includes(champion) && (
                        <SelectedIcon>
                          <FaCheck />
                        </SelectedIcon>
                      )}
                    </ChampButton>
                  ))}
                </ChampGrid>
              </ChampModalContent>
            </ChampModalOverlay>
          ) : (
            <ChampionSelectionContent>
              {options.specificChampions.length > 0 ? (
                <SelectedChampionsContainer>
                  {options.specificChampions.map(champion => (
                    <SelectedChampTag key={champion}>
                      {champion}
                      <RemoveChampButton onClick={() => handleChampionSelection(champion)}>
                        <FaTimes />
                      </RemoveChampButton>
                    </SelectedChampTag>
                  ))}
                  <SelectMoreButton onClick={() => setChampModalOpen(true)}>
                    + Add More
                  </SelectMoreButton>
                </SelectedChampionsContainer>
              ) : (
                <SelectChampionsButton onClick={() => setChampModalOpen(true)}>
                  <FaGamepad style={{ marginRight: '8px' }} /> Select your preferred champions
                </SelectChampionsButton>
              )}
            </ChampionSelectionContent>
          )}
        </ChampionSelectionContainer>
      )}
    </OptionsContainer>
  );
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <SwitchContainer>
      <SwitchInput type="checkbox" checked={checked} onChange={onChange} />
      <SwitchSlider />
    </SwitchContainer>
  );
};

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const OptionItem = styled.div<{ $isActive: boolean }>`
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
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme, $isActive }) => 
    $isActive ? `${theme.primary}22` : `${theme.text}11`};
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.primary : theme.text};
  font-size: 1.2rem;
  transition: all 0.3s ease;
`;

const OptionDetails = styled.div`
  flex: 1;
`;

const OptionTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
`;

const OptionDescription = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text}cc;
`;

const PriceTag = styled.span`
  margin-left: 0.5rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  background: ${({ theme }) => theme.primary}22;
  color: ${({ theme }) => theme.primary};
  border-radius: 4px;
  font-weight: 700;
`;

const FreeTag = styled.span`
  margin-left: 0.5rem;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  background: ${({ theme }) => theme.success}22;
  color: ${({ theme }) => theme.success};
  border-radius: 4px;
  font-weight: 700;
`;

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${({ theme }) => theme.primary};
  }
  
  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.border};
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 500;
  background: ${({ theme, isActive }) => 
    isActive ? theme.primary : 'transparent'};
  color: ${({ theme, isActive }) => 
    isActive ? 'white' : theme.text};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.primary : theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme, isActive }) => 
      isActive ? theme.buttonHover : `${theme.primary}11`};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const RoleSelectionContainer = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const RoleButton = styled.button<{ isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  background: ${({ theme, isSelected }) => 
    isSelected ? `${theme.primary}22` : 'transparent'};
  color: ${({ theme, isSelected }) => 
    isSelected ? theme.primary : theme.text};
  border: 1px solid ${({ theme, isSelected }) => 
    isSelected ? theme.primary : theme.border};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  padding-right: ${({ isSelected }) => isSelected ? '2rem' : '1rem'};
  
  &:hover {
    background: ${({ theme }) => `${theme.primary}11`};
    border-color: ${({ theme }) => theme.primary};
  }
`;

const RoleCheckmark = styled.span`
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
`;

const RoleSelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
  margin-top: 0.5rem;
  
  svg {
    font-size: 0.9rem;
  }
`;

const ChampionSelectionContainer = styled.div`
  padding: 1rem;
  border-radius: 0.75rem;
  background: #f8f9fb;
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const ChampionSelectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const ChampionSelectionTitle = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const ChampionSearchInput = styled.input`
  padding: 0.5rem 1rem;
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

const ChampionSelectionContent = styled.div`
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChampModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ChampModalContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.border};
`;

const ChampModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChampModalTitle = styled.h3`
  font-size: 1.3rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const ChampModalSearch = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const ChampGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
`;

const ChampButton = styled.button<{ isSelected: boolean }>`
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem;
  background: ${({ theme, isSelected }) => isSelected ? `${theme.primary}22` : theme.body};
  border: 1px solid ${({ theme, isSelected }) => isSelected ? theme.primary : theme.border};
  color: ${({ theme, isSelected }) => isSelected ? theme.primary : theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme, isSelected }) => isSelected ? `${theme.primary}22` : `${theme.primary}11`};
  }
`;

const SelectedIcon = styled.span`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.primary};
`;

const SelectedChampionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
`;

const SelectedChampTag = styled.div`
  display: flex;
  align-items: center;
  background: #f0edff;
  color: #7066e0;
  border: 1px solid #7066e0;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RemoveChampButton = styled.button`
  background: none;
  border: none;
  color: #7066e0;
  font-size: 0.8rem;
  margin-left: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.danger};
  }
`;

const SelectMoreButton = styled.button`
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text}aa;
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primary};
  }
`;

const SelectChampionsButton = styled.button`
  background: #f0edff;
  border: 1.5px solid #7066e0;
  color: #7066e0;
  border-radius: 0.5rem;
  padding: 0.9rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  &:hover {
    background: #e0dcff;
    border-color: #5b51c7;
    color: #5b51c7;
  }
`;

export default BoostOptions; 
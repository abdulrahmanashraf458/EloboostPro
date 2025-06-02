import React, { useState } from 'react';
import styled from 'styled-components';

interface RankTier {
  tier: 'iron' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster' | 'challenger';
  division: 'IV' | 'III' | 'II' | 'I' | null;
  lp?: number;
}

interface RankSelectorProps {
  type: 'current' | 'desired';
  value: RankTier;
  onChange: (rank: RankTier) => void;
}

const tiers = [
  { id: 'iron', name: 'Iron', color: '#5D5D5D', hasDivisions: true },
  { id: 'bronze', name: 'Bronze', color: '#A57046', hasDivisions: true },
  { id: 'silver', name: 'Silver', color: '#9BA2B2', hasDivisions: true },
  { id: 'gold', name: 'Gold', color: '#E8B944', hasDivisions: true },
  { id: 'platinum', name: 'Platinum', color: '#42B1A7', hasDivisions: true },
  { id: 'diamond', name: 'Diamond', color: '#576BCD', hasDivisions: true },
  { id: 'master', name: 'Master', color: '#B147C9', hasDivisions: false },
  { id: 'grandmaster', name: 'Grandmaster', color: '#C93A45', hasDivisions: false },
  { id: 'challenger', name: 'Challenger', color: '#2CCCFF', hasDivisions: false }
];

const divisions = ['IV', 'III', 'II', 'I'];

const RankSelector: React.FC<RankSelectorProps> = ({ type, value, onChange }) => {
  const [expandedLP, setExpandedLP] = useState(false);
  
  const handleTierChange = (tier: RankTier['tier']) => {
    const hasDivisions = tiers.find(t => t.id === tier)?.hasDivisions;
    
    onChange({
      tier,
      division: hasDivisions ? value.division || 'IV' : null,
      lp: (!hasDivisions && ['master', 'grandmaster', 'challenger'].includes(tier)) ? 0 : value.lp
    });
  };
  
  const handleDivisionChange = (division: RankTier['division']) => {
    onChange({
      ...value,
      division
    });
  };
  
  const handleLPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const lp = parseInt(e.target.value);
    if (isNaN(lp)) return;
    
    // Set max LP based on tier
    let maxLP = 100;
    if (value.tier === 'master' || value.tier === 'grandmaster' || value.tier === 'challenger') {
      maxLP = 1000;
    }
    
    onChange({
      ...value,
      lp: Math.min(Math.max(0, lp), maxLP)
    });
  };
  
  const getCurrentTier = () => {
    return tiers.find(tier => tier.id === value.tier);
  };

  // Get tier image path - updated to use the new rank_icon folder
  const getTierImagePath = (tier: string) => {
    // Capitalize first letter of tier name for the filename
    const capitalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1);
    return `/rank_icon/${capitalizedTier}.png`;
  };
  
  return (
    <RankSelectorContainer>
      <TierSelection>
        {tiers.map(tier => (
          <TierButton
            key={tier.id}
            active={value.tier === tier.id}
            color={tier.color}
            onClick={() => handleTierChange(tier.id as RankTier['tier'])}
          >
            <TierImage 
              src={getTierImagePath(tier.id)} 
              alt={tier.name} 
            />
            {tier.name}
          </TierButton>
        ))}
      </TierSelection>
      
      {getCurrentTier()?.hasDivisions && (
        <DivisionSelection>
          {divisions.map(div => (
            <DivisionButton
              key={div}
              active={value.division === div}
              onClick={() => handleDivisionChange(div as RankTier['division'])}
            >
              {div}
            </DivisionButton>
          ))}
        </DivisionSelection>
      )}
      
      {/* Only show LP for current rank or for Master+ tiers */}
      {(type === 'current' || ['master', 'grandmaster', 'challenger'].includes(value.tier)) && (
        <LPSelection>
          <LPLabel htmlFor={`lp-${type}`}>
            LP:
          </LPLabel>
          
          <LPInputWrapper>
            <LPInput
              id={`lp-${type}`}
              type="number"
              min="0"
              max={value.tier === 'master' || value.tier === 'grandmaster' || value.tier === 'challenger' ? "1000" : "100"}
              value={value.lp || 0}
              onChange={handleLPChange}
            />
            <LPMax>
              / {value.tier === 'master' || value.tier === 'grandmaster' || value.tier === 'challenger' ? 1000 : 100}
            </LPMax>
          </LPInputWrapper>
        </LPSelection>
      )}
      
      <RankDisplay>
        <RankImage 
          src={getTierImagePath(value.tier)} 
          alt={`${getCurrentTier()?.name} ${value.division || ''}`} 
        />
        <RankInfo>
          <RankName>
            {getCurrentTier()?.name} {value.division && value.division}
          </RankName>
          {value.lp !== undefined && <RankLP>{value.lp} LP</RankLP>}
        </RankInfo>
      </RankDisplay>
    </RankSelectorContainer>
  );
};

const RankSelectorContainer = styled.div`
  margin-bottom: 2rem;
  max-width: 100%;
  overflow: hidden;
`;

const TierSelection = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
`;

const TierButton = styled.button<{ active: boolean; color: string }>`
  background: ${({ active, theme, color }) => 
    active ? `${color}33` : theme.body};
  border: 2px solid ${({ active, color, theme }) => 
    active ? color : theme.border};
  border-radius: 0.5rem;
  padding: 0.75rem 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.75rem;
  min-height: 85px;
  font-weight: ${({ active }) => active ? '600' : '400'};
  color: ${({ active, color, theme }) => active ? color : theme.text};
  text-align: center;
  width: 100%;
  word-break: keep-all;
  
  &:hover {
    border-color: ${({ color }) => color};
    background: ${({ color }) => `${color}22`};
  }
`;

const TierImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin: 0 auto 5px;
  display: block;
`;

const DivisionSelection = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const DivisionButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: ${({ active, theme }) => 
    active ? `${theme.primary}22` : theme.body};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.primary : theme.border};
  color: ${({ active, theme }) => 
    active ? theme.primary : theme.text};
  font-weight: ${({ active }) => (active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => `${theme.primary}11`};
  }
`;

const LPSelection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const LPLabel = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const LPInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
`;

const LPInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
  
  /* Hide arrows for number input */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const LPMax = styled.div`
  position: absolute;
  right: 1rem;
  color: ${({ theme }) => theme.text}aa;
  font-size: 0.9rem;
  pointer-events: none;
`;

const RankDisplay = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.body};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const RankImage = styled.img`
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-right: 1.25rem;
`;

const RankInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const RankName = styled.div`
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
`;

const RankLP = styled.div`
  color: ${({ theme }) => theme.textLight};
  font-size: 0.9rem;
`;

export default RankSelector; 
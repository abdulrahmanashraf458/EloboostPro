import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { fadeIn } from '../../styles/animations';

interface TestimonialType {
  id: number;
  name: string;
  service: string;
  text: string;
  rating: number;
  region?: string;
  fromRank?: string;
  toRank?: string;
}

const testimonialData: TestimonialType[] = [
  {
    id: 1,
    name: "James K.",
    service: "Diamond Boost",
    region: "EUW",
    fromRank: "Platinum II",
    toRank: "Diamond IV",
    text: "Never thought I'd escape Platinum until I tried this service. My booster Xian completed the job in under 72 hours, playing mostly at night to avoid detection. Worth every penny!",
    rating: 5
  },
  {
    id: 2,
    name: "Sarah M.",
    service: "Duo Queue Boost",
    region: "NA",
    fromRank: "Silver IV",
    toRank: "Platinum III",
    text: "Six months stuck in Silver had me ready to uninstall LoL for good. Two weeks of duo sessions later and I'm in Platinum! My booster taught me that I was playing too passively as a jungler - now I control the map!",
    rating: 5
  },
  {
    id: 3,
    name: "Michael T.",
    service: "Account Purchase",
    region: "EUNE",
    text: "Skeptical at first about buying an account, but the risk was worth it. Login details arrived within an hour of payment. The account came with 87 skins including 3 ultimates that would have cost me a fortune!",
    rating: 5
  },
  {
    id: 4,
    name: "Emma J.",
    service: "Coaching Sessions",
    region: "NA",
    fromRank: "Gold III",
    toRank: "Platinum II",
    text: "As a mid main struggling with roaming timing, my coach completely transformed my gameplay. After 5 sessions reviewing my replays, he identified exactly where I was wasting opportunities. Not cheap, but changed my entire approach to the game.",
    rating: 4
  },
  {
    id: 5,
    name: "Alex P.",
    service: "Placement Matches",
    region: "EUW",
    text: "7-3 in placements put me straight into Gold II! Last season I went 5-5 and landed in Bronze. The difference is night and day. Booster even dodged a game where our comp was terrible - that attention to detail impressed me.",
    rating: 5
  },
  {
    id: 6,
    name: "David L.",
    service: "Champion Mastery",
    region: "NA",
    text: "M7 Yasuo, M7 Zed, and M7 Lee Sin in ONE WEEKEND? My friends can't believe I suddenly 'got good' with mechanically intensive champions. The booster even added me on discord to share some combos afterward.",
    rating: 5
  },
  {
    id: 7,
    name: "Lisa R.",
    service: "Rank Boost",
    region: "KR",
    fromRank: "Gold I",
    toRank: "Diamond V",
    text: "한국 서버에서 다이아까지 올려준 부스터에게 정말 감사합니다. 2주 안에 완료했고 제 계정을 아주 안전하게 관리해주었어요. 특히 MMR 안정화를 위해 추가 게임도 진행해 주셨습니다.",
    rating: 5
  },
  {
    id: 8,
    name: "Robert K.",
    service: "Clash Boost",
    region: "NA",
    text: "Our 4-man premade needed a carry for weekend Clash. The booster we hired absolutely DOMINATED as Irelia top - 12/2/8, 15/1/6, and 8/0/11 in the finals! Trophy secured and he was cool to play with.",
    rating: 5
  },
  {
    id: 9,
    name: "Jessica T.",
    service: "Account Leveling",
    region: "LAN",
    text: "Ordered a level 30 account with specific champions for my boyfriend's birthday. Not only was it ready in 4 days, but they added extra BE as a courtesy so he could buy a few more champs. Best gift ever!",
    rating: 5
  },
  {
    id: 10,
    name: "Thomas B.",
    service: "Duo Queue",
    region: "OCE",
    fromRank: "Bronze III",
    toRank: "Silver I",
    text: "B3→S1 ✓\nMade new friend ✓\nLearned Thresh hooks ✓\nStopped dying to ganks ✓\nTook notes during every session ✓\nFinally enjoying support role ✓",
    rating: 5
  },
  {
    id: 11,
    name: "Maria C.",
    service: "Normal Games",
    region: "BR",
    text: "Evento K/DA precisava de 2000 tokens. Sem tempo para jogar, contratei 25 jogos normais. Booster terminou com 85% de vitórias, ganhei todos os tokens necessários para a skin Prestige. Muito profissional!",
    rating: 5
  },
  {
    id: 12,
    name: "Kevin W.",
    service: "TFT Boosting",
    region: "NA",
    fromRank: "Gold IV",
    toRank: "Diamond IV",
    text: "TFT boost delivered in 32 games with 75% top 4 rate. As a bonus, booster sent me a spreadsheet with 6 different meta comps and itemization strategies. I've been able to maintain my rank since!",
    rating: 5
  },
  {
    id: 13,
    name: "Natalie S.",
    service: "Flex Queue Boost",
    region: "EUW",
    fromRank: "Silver II",
    toRank: "Gold I",
    text: "Season rewards secured with just 3 days before season end! The booster only played my main champions (Lux/Seraphine) to keep my match history looking authentic. Customer service was responsive at every step.",
    rating: 5
  },
  {
    id: 14,
    name: "Christopher M.",
    service: "Specific Champion Boost",
    region: "NA",
    text: "Needed better stats on Yasuo after weeks of trolling... 63% winrate over 30 games from my booster fixed my profile! No more team bans when I hover Yasuo, and I got FOUR S grades for chest farming. Literally solved my biggest LoL problem.",
    rating: 5
  },
  {
    id: 15,
    name: "Oliver P.",
    service: "Account Purchase",
    region: "EUW",
    text: "Unbox level: 1000\nSkins: 273 (all limited events since 2014)\nBlue Essence: 154,000\nGems: 23\nPermanent ward skins: 37\nHonor level: 5\n\nSafe transaction. Account delivered in 10 minutes. No red flags after two months of use.",
    rating: 5
  }
];

// Animation for sliding from right to left
const slideFromRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Animation for sliding out to the left
const slideToLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const testimonialsPerPage = window.innerWidth >= 1200 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  
  // Function to get visible testimonials based on current index
  const getVisibleTestimonials = () => {
    const visibleItems: TestimonialType[] = [];
    for (let i = 0; i < testimonialsPerPage; i++) {
      const index = (activeIndex + i) % testimonialData.length;
      visibleItems.push(testimonialData[index]);
    }
    return visibleItems;
  };
  
  // Handle sliding to the next testimonial
  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPrevIndex(activeIndex);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonialData.length);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match the animation duration
  };
  
  // Handle sliding to the previous testimonial
  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setPrevIndex(activeIndex);
    setActiveIndex((prevIndex) => (prevIndex === 0 ? testimonialData.length - 1 : prevIndex - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Match the animation duration
  };
  
  // Set up auto sliding from right to left
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextTestimonial();
      }, 5000); // Change testimonial every 5 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, activeIndex, isAnimating]);
  
  // Pause autoplay on hover
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);
  
  // Handle window resize - update testimonialsPerPage
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render when the window size changes
      setActiveIndex(activeIndex);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);
  
  return (
    <TestimonialsSection id="testimonials">
      <SectionTitle>Our Satisfied Customers</SectionTitle>
      <SectionSubtitle>See what our clients say about us</SectionSubtitle>
      
      <CarouselContainer 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CarouselButtonContainer left>
          <CarouselButton onClick={prevTestimonial} aria-label="Previous testimonial">
            <FaChevronLeft />
          </CarouselButton>
        </CarouselButtonContainer>
        
        <TestimonialSlider>
          <TestimonialCarousel>
            {getVisibleTestimonials().map((testimonial, index) => (
              <TestimonialCard 
                key={`${testimonial.id}-${index}`}
                $isAnimating={isAnimating}
              >
                <TestimonialRating aria-label={`${testimonial.rating} out of 5 stars`}>
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <FaStar key={i} aria-hidden="true" />
                  ))}
                </TestimonialRating>
                
                <TestimonialContent>
                  <TestimonialText>
                    "{testimonial.text}"
                  </TestimonialText>
                  
                  <TestimonialMeta>
                    <TestimonialAuthor>{testimonial.name}</TestimonialAuthor>
                    <TestimonialDetails>
                      <TestimonialService>{testimonial.service}</TestimonialService>
                      {testimonial.region && (
                        <TestimonialRegion>Region: {testimonial.region}</TestimonialRegion>
                      )}
                      {testimonial.fromRank && testimonial.toRank && (
                        <TestimonialRank>
                          {testimonial.fromRank} → {testimonial.toRank}
                        </TestimonialRank>
                      )}
                    </TestimonialDetails>
                  </TestimonialMeta>
                </TestimonialContent>
              </TestimonialCard>
            ))}
          </TestimonialCarousel>
        </TestimonialSlider>
        
        <CarouselButtonContainer right>
          <CarouselButton onClick={nextTestimonial} aria-label="Next testimonial">
            <FaChevronRight />
          </CarouselButton>
        </CarouselButtonContainer>
      </CarouselContainer>
      
      <CarouselIndicators>
        {Array.from({ length: Math.ceil(testimonialData.length / testimonialsPerPage) }).map((_, index) => {
          const isActive = Math.floor(activeIndex / testimonialsPerPage) === index;
          return (
            <CarouselIndicator 
              key={index} 
              $active={isActive}
              onClick={() => {
                if (isAnimating) return;
                setIsAnimating(true);
                setPrevIndex(activeIndex);
                setActiveIndex(index * testimonialsPerPage);
                setTimeout(() => {
                  setIsAnimating(false);
                }, 500);
              }}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          );
        })}
      </CarouselIndicators>
    </TestimonialsSection>
  );
};

const TestimonialsSection = styled.section`
  padding: 5rem 1.5rem;
  text-align: center;
  background: ${({ theme }) => `${theme.primary}05`};
  overflow: hidden;
  position: relative;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  margin-bottom: 1rem;
  font-weight: 800;
  background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  animation: ${fadeIn} 0.8s ease-out;
`;

const SectionSubtitle = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.text}cc;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out 0.2s backwards;
`;

const CarouselContainer = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CarouselButtonContainerProps {
  left?: boolean;
  right?: boolean;
}

const CarouselButtonContainer = styled.div<CarouselButtonContainerProps>`
  position: absolute;
  left: ${props => props.left ? '0' : 'auto'};
  right: ${props => props.right ? '0' : 'auto'};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const CarouselButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  opacity: 0.7;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
  }
`;

const TestimonialSlider = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 1.5rem 50px;
`;

const TestimonialCarousel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

interface TestimonialCardProps {
  $isAnimating: boolean;
}

const TestimonialCard = styled.div<TestimonialCardProps>`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  animation: ${slideFromRight} 0.5s forwards;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const TestimonialRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
  color: #FFD700;
  font-size: 1.25rem;
`;

const TestimonialContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
`;

const TestimonialText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.text};
  margin-bottom: 1.5rem;
  font-style: italic;
  position: relative;
  text-align: left;
  flex: 1;
  
  &::before, &::after {
    content: '"';
    font-size: 2rem;
    color: ${({ theme }) => `${theme.primary}33`};
    position: absolute;
  }
  
  &::before {
    top: -1rem;
    left: -0.5rem;
  }
  
  &::after {
    bottom: -1.5rem;
    right: -0.5rem;
  }
`;

const TestimonialMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: auto;
`;

const TestimonialAuthor = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
  text-align: left;
`;

const TestimonialDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 0.25rem;
`;

const TestimonialService = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
`;

const TestimonialRegion = styled.div`
  color: ${({ theme }) => theme.text}99;
  font-size: 0.8rem;
  text-align: left;
`;

const TestimonialRank = styled.div`
  color: ${({ theme }) => theme.secondary};
  font-size: 0.8rem;
  font-weight: 500;
  text-align: left;
`;

const CarouselIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

interface CarouselIndicatorProps {
  $active: boolean;
}

const CarouselIndicator = styled.button<CarouselIndicatorProps>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.$active ? props.theme.primary : '#ddd'};
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? props.theme.primary : props.theme.secondary + '99'};
    transform: scale(1.2);
  }
`;

export default Testimonials; 
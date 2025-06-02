import React from 'react';
import styled from 'styled-components';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <TransitionContainer>
      {children}
    </TransitionContainer>
  );
};

const TransitionContainer = styled.div`
  position: relative;
  width: 100%;
`;

export default PageTransition; 
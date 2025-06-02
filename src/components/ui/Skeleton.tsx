import React from 'react';
import styled, { keyframes } from 'styled-components';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '1rem',
  borderRadius = '0.25rem',
  margin = '0'
}) => {
  return (
    <SkeletonBase 
      style={{ 
        width, 
        height, 
        borderRadius,
        margin
      }} 
    />
  );
};

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const SkeletonBase = styled.div`
  display: inline-block;
  background: ${({ theme }) => theme.hover};
  background: linear-gradient(
    90deg, 
    ${({ theme }) => theme.hover} 25%, 
    ${({ theme }) => theme.background} 50%, 
    ${({ theme }) => theme.hover} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`; 
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle<{ theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Inter', 'Poppins', sans-serif;
    transition: all 0.25s linear;
    line-height: 1.6;
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.primary};
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.buttonHover};
    }
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.cardBg};
    color: ${({ theme }) => theme.text};
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.body};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.buttonHover};
  }

  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }

  .slideUp {
    animation: slideUp 0.5s ease forwards;
  }
`; 
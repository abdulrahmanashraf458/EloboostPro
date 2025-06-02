// Define interfaces for styled component props to prevent DOM warnings
import 'styled-components';

// Declare module to extend DefaultTheme
declare module 'styled-components' {
  export interface DefaultTheme {
    primary: string;
    primaryDark: string;
    secondary: string;
    danger: string;
    warning: string;
    text: string;
    textLight: string;
    background: string;
    body: string;
    cardBg: string;
    border: string;
    hover: string;
    inputBg: string;
    shadow: string;
    modalBg: string;
    success: string;
    info: string;
    accent: string;
    navBg: string;
    footerBg: string;
    buttonHover: string;
    error: string;
  }
}

// Navbar props
export interface StyledNavProps {
  isScrolled?: boolean;
}

// Menu/dropdown props
export interface MenuProps {
  isOpen?: boolean;
}

// Mobile navigation props
export interface MobileProps {
  open?: boolean;
  $open?: boolean;  // Using $ prefix for transient props
}

// Common button props
export interface ButtonProps {
  primary?: boolean;
  danger?: boolean;
}

// Selection/tab props
export interface SelectionProps {
  active?: boolean;
  isActive?: boolean;
  $isActive?: boolean; // Using $ prefix for transient props (not passed to DOM)
}

// Status indicators
export interface StatusProps {
  status?: string;
}

// Message props
export interface MessageProps {
  sender?: string;
} 
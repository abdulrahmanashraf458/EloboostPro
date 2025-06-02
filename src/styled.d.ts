import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    primary: string;
    primaryDark: string;
    secondary: string;
    accent: string;
    cardBg: string;
    border: string;
    navBg: string;
    footerBg: string;
    shadow: string;
    hover: string;
    buttonHover: string;
    success: string;
    successDark: string;
    error: string;
    danger: string;
    dangerDark: string;
    warning: string;
    warningDark: string;
    info: string;
    colors: {
      primary: string;
      primaryDark: string;
      secondary: string;
      success: string;
      successDark: string;
      danger: string;
      dangerDark: string;
      warning: string;
      warningDark: string;
      info: string;
      text: {
        primary: string;
        secondary: string;
        placeholder: string;
      }
      background: {
        default: string;
        lighter: string;
        hover: string;
      }
      border: {
        light: string;
      }
    }
  }
} 
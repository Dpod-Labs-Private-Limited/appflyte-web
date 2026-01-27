import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    // primary: {
      // main: '#FFFFFF',
      // hover: '#FA6401',
      // light: '#F5F5F5',
      // dark: '#CCCCCC',
      // contrastText: '#000000',
    // },
    // secondary: {
    // main: '#F3F5F7',
    // hover: '#FFFFFF',
    // light: '#FF8C42',
    // dark: '#C05000',
    // contrastText: '#FFFFFF',
    // },
    // info: {
    //   main: '#842B3E',
    //   hover: '#FFFFFF',
    //   light: '#A34F5F',
    //   dark: '#5E1E2D',
    //   contrastText: '#FFFFFF',
    // },
    // background: {
    //   default: '#FFFFFF',
    //   paper: '#F5F5F5',
    // },
    // text: {
    //   primary: '#000000',
    //   secondary: '#555555',
    //   disabled: '#AAAAAA',
    // },
    sidebar: {
      background: '#000000',
    },
    navbar: {
      background: '#FFFFFF',
      text: '#000000',
    },
  },
  typography: {
    fontFamily: 'Inter',
    h1: {
      fontSize: '19px',
    },
    h2: {
      fontSize: '18px',
    },
    h3: {
      fontSize: '17px',
    },
    h4: {
      fontSize: '16px'
    },
    h5: {
      fontSize: '15px'
    },
    h6: {
      fontSize: '14px'
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    primaryButton: {
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'none',
    },
    secondaryButton: {
      fontSize: '15px',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  overrides: {
    MuiTabScrollButton: {
      root: {
        width: '13px',
      },
    },
  },
});
export default theme;

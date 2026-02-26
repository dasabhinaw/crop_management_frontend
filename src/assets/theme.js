import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
        main: "#333996",
        light: '#748ffc'
    },
    secondary: {
        main: "#f83245",
        light: '#f8324526'
    },
    background: {
        default: "#f4f5fd"
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#002147"
    },
    primary: {
      main: "#ffffff"
    },
    secondary: {
      main: "#ffb300"
    },
    text: {
      primary: "#ffffff"
    }
  },
  typography: {
    fontFamily: "Montserrat, 'Segoe UI', Arial, sans-serif",
    h1: {
      fontWeight: 900
    },
    h2: {
      fontWeight: 700
    }
  }
});

export default theme;
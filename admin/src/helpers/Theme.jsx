import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff5733",
    },
  },
  typography: {
    fontFamily: ["Poppins"].join(","),
  },
});

export default theme;

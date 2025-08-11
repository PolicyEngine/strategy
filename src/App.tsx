import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { palette } from "./theme/palette";
import RoadmapGraph from "./components/RoadmapGraph";
import TechStackAuto from "./components/TechStackAuto";
import TopBar from "./components/TopBar";

const theme = createTheme({
  palette: {
    primary: { main: palette.BLUE },
    secondary: { main: palette.TEAL_ACCENT },
    background: { 
      default: palette.BLUE_98,
      paper: palette.WHITE,
    },
    text: { 
      primary: palette.DARKEST_BLUE, 
      secondary: palette.DARK_GRAY 
    },
  },
  typography: { 
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <TopBar />
        <Routes>
          <Route path="/" element={<Navigate to="/roadmap" replace />} />
          <Route path="/roadmap" element={<RoadmapGraph />} />
          <Route path="/tech-stack" element={<TechStackAuto />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

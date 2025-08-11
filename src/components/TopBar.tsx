import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, ButtonGroup } from "@mui/material";
import { AccountTree, Hub } from "@mui/icons-material";
import { palette } from "../theme/palette";

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ background: palette.DARKEST_BLUE }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            PolicyEngine Strategy
          </Typography>
          <Typography variant="body2" sx={{ ml: 2, opacity: 0.8 }}>
            2025-2027 Vision
          </Typography>
        </Box>
        <ButtonGroup variant="text" size="small">
          <Button
            startIcon={<AccountTree />}
            onClick={() => navigate('/roadmap')}
            sx={{
              color: location.pathname === '/roadmap' ? palette.TEAL_ACCENT : 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Roadmap
          </Button>
          <Button
            startIcon={<Hub />}
            onClick={() => navigate('/tech-stack')}
            sx={{
              color: location.pathname === '/tech-stack' ? palette.TEAL_ACCENT : 'white',
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            Tech Stack
          </Button>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
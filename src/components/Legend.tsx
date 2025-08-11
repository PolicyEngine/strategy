import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { palette } from "../theme/palette";

const categories = [
  { name: "Data & Modeling", color: palette.BLUE },
  { name: "Policy Coverage", color: palette.TEAL_ACCENT },
  { name: "Policy Research", color: palette.BLUE_PRESSED },
  { name: "Technology", color: palette.DARK_BLUE_HOVER },
  { name: "Community & Partnerships", color: palette.TEAL_PRESSED },
  { name: "Growth", color: palette.DARK_GRAY },
  { name: "Users & Stakeholders", color: palette.DARK_RED },
];

const Legend: React.FC = () => {
  return (
    <Paper
      elevation={2}
      sx={{
        position: "absolute",
        bottom: 20,
        left: 20,
        p: 2,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        zIndex: 1000,
      }}
    >
      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
        Categories
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {categories.map((cat) => (
          <Box key={cat.name} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "4px",
                backgroundColor: cat.color,
              }}
            />
            <Typography variant="body2">{cat.name}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default Legend;
import React from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Chip,
  Box,
  Divider,
  Stack,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import { palette } from "../theme/palette";

interface NodeData {
  id: string;
  label: string;
  description: string;
  kpi: string[];
  owner: string;
  category: string;
  timeline?: string;
}

interface Props {
  node: NodeData;
  onClose: () => void;
}

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    "Data & Modeling": palette.BLUE,
    "Policy Coverage": palette.TEAL_ACCENT,
    "Policy Research": palette.BLUE_PRESSED,
    "Technology": palette.DARK_BLUE_HOVER,
    "Community & Partnerships": palette.TEAL_PRESSED,
    "Growth": palette.DARK_GRAY,
  };
  return colors[category] || palette.GRAY;
};

const NodeCard: React.FC<Props> = ({ node, onClose }) => {
  return (
    <Drawer anchor="right" open onClose={onClose}>
      <Box sx={{ width: 420, p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Box flex={1}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {node.label}
            </Typography>
            <Chip
              label={node.category}
              size="small"
              sx={{
                backgroundColor: getCategoryColor(node.category),
                color: palette.WHITE,
                fontWeight: 500,
              }}
            />
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box sx={{ display: "flex", gap: 2, mb: 2, color: palette.DARK_GRAY }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon fontSize="small" />
            <Typography variant="body2">{node.owner}</Typography>
          </Box>
          {node.timeline && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2">{node.timeline}</Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" paragraph sx={{ lineHeight: 1.7 }}>
          {node.description}
        </Typography>

        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3 }}>
          Key Performance Indicators
        </Typography>
        <Stack spacing={1}>
          {node.kpi.map((k, index) => (
            <Box key={index}>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                {k}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: palette.LIGHT_GRAY,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getCategoryColor(node.category),
                  },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Drawer>
  );
};

export default NodeCard;
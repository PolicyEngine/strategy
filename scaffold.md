Below is a **self‑contained blueprint** (file layout, data schema, and starter code) for a lightweight React application that lets a user **explore the strategic‐roadmap “connection points”** you outlined. It emphasises clarity and extensibility over flashy visuals so your team can iterate quickly.

---

## 1. Project scaffold

```text
policyengine-roadmap/
├─ public/
│  └─ index.html
├─ src/
│  ├─ assets/
│  │  └─ logo.svg
│  ├─ data/
│  │  └─ roadmap.json          ← nodes & edges live here
│  ├─ theme/
│  │  └─ palette.ts            ← colour constants you supplied
│  ├─ components/
│  │  ├─ RoadmapGraph.tsx      ← interactive network view
│  │  ├─ NodeCard.tsx          ← fly‑out / side drawer with details
│  │  ├─ Legend.tsx
│  │  ├─ TopBar.tsx
│  │  └─ …                     ← add screens as you grow
│  ├─ App.tsx
│  ├─ index.tsx
│  └─ styles.css
├─ package.json
└─ tsconfig.json               ← using TypeScript for type safety
```

_Assumes **create‑react‑app** with the TypeScript template (`npx create-react-app policyengine-roadmap --template typescript`)._

---

## 2. Theme – `theme/palette.ts`

```ts
// Exact values you provided
export const palette = {
  BLACK: "#000000",
  BLUE_98: "#F7FAFD",
  BLUE: "#2C6496",
  BLUE_LIGHT: "#D8E6F3",
  BLUE_PRESSED: "#17354F",
  DARK_BLUE_HOVER: "#1d3e5e",
  DARK_GRAY: "#616161",
  DARK_RED: "#b50d0d",
  DARKEST_BLUE: "#0C1A27",
  GRAY: "#808080",
  LIGHT_GRAY: "#F2F2F2",
  MEDIUM_DARK_GRAY: "#D2D2D2",
  MEDIUM_LIGHT_GRAY: "#BDBDBD",
  TEAL_ACCENT: "#39C6C0",
  TEAL_LIGHT: "#F7FDFC",
  TEAL_PRESSED: "#227773",
  WHITE: "#FFFFFF",
};

export type ColorKey = keyof typeof palette;
```

Use a **ThemeProvider** (from _styled‑components_, _emotion_, or _MUI v5_) so every component can consume colours via `props.theme.palette.BLUE`.

---

## 3. Strategic‑roadmap data format – `data/roadmap.json`

```json
{
  "nodes": [
    {
      "id": "data-modeling",
      "label": "Data & Modeling",
      "category": "Core Product",
      "description": "Longitudinal panel, synthetic firms, OLG, machine‑learning imputation …",
      "kpi": [
        "75‑year panel live by Q4 2026",
        "County‑level results in US & UK"
      ],
      "owner": "Chief Economist"
    },
    {
      "id": "api-platform",
      "label": "API & Platform",
      "category": "Technology",
      "description": "Scalable API, SDKs, Pro tier, AI explanations …",
      "kpi": [">10 M API calls / mo", "99.9 % uptime"],
      "owner": "CTO"
    },
    {
      "id": "policy-research",
      "label": "Policy Research",
      "category": "Research & Outreach",
      "description": "Take‑up studies, marginal tax schedules, policy briefs …",
      "kpi": ["12 peer‑reviewed papers", "Quarterly brief series"],
      "owner": "Director of Policy Research"
    },
    {
      "id": "community-grants",
      "label": "Community & Grants",
      "category": "Growth",
      "description": "NSF POSE programme, hackathons, open‑source contributor growth …",
      "kpi": ["5 hackathons / yr", "200 OSS contributors"],
      "owner": "Head of Partnerships"
    }
    // …extend as needed
  ],

  "edges": [
    {
      "id": "dm->api",
      "source": "data-modeling",
      "target": "api-platform",
      "label": "Exposes micro‑sim results via API"
    },
    {
      "id": "api->policy",
      "source": "api-platform",
      "target": "policy-research",
      "label": "Enables self‑serve analysis"
    },
    {
      "id": "policy->community",
      "source": "policy-research",
      "target": "community-grants",
      "label": "Drives stories to attract funders"
    }
    // …add all “connection points” you want users to explore
  ]
}
```

> _Why JSON?_ Easy to edit without touching code and can later be fetched from a CMS or Google Sheet.

---

## 4. Main app shell – `App.tsx`

```tsx
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { palette } from "./theme/palette";
import RoadmapGraph from "./components/RoadmapGraph";
import TopBar from "./components/TopBar";

const theme = createTheme({
  palette: {
    primary: { main: palette.BLUE },
    secondary: { main: palette.TEAL_ACCENT },
    background: { default: palette.BLUE_98 },
    text: { primary: palette.DARKEST_BLUE, secondary: palette.DARK_GRAY },
  },
  typography: { fontFamily: '"Inter", sans-serif' },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar />
      <RoadmapGraph />
    </ThemeProvider>
  );
};

export default App;
```

---

## 5. Interactive roadmap view – `components/RoadmapGraph.tsx`

Use **react‑flow** (small footprint, declarative, good UX) to render nodes and draggable edges.

```tsx
import React, { useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import roadmap from "../data/roadmap.json";
import NodeCard from "./NodeCard";

const initialNodes: Node[] = roadmap.nodes.map((n) => ({
  id: n.id,
  data: { label: n.label },
  position: { x: Math.random() * 500, y: Math.random() * 400 },
  style: { background: "#2C6496", color: "#fff", borderRadius: 4, padding: 10 },
}));

const initialEdges: Edge[] = roadmap.edges.map((e) => ({
  id: e.id,
  source: e.source,
  target: e.target,
  type: "smoothstep",
  animated: true,
  label: e.label,
}));

const RoadmapGraph: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = React.useState<string | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelected(node.id);
  }, []);

  return (
    <div style={{ height: "calc(100vh - 64px)" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Side‑drawer with node details */}
      {selected && (
        <NodeCard
          node={roadmap.nodes.find((n) => n.id === selected)!}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default RoadmapGraph;
```

---

## 6. Node detail drawer – `components/NodeCard.tsx`

```tsx
import React from "react";
import {
  Drawer,
  IconButton,
  Typography,
  Chip,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { palette } from "../theme/palette";

interface Props {
  node: {
    id: string;
    label: string;
    description: string;
    kpi: string[];
    owner: string;
    category: string;
  };
  onClose: () => void;
}

const NodeCard: React.FC<Props> = ({ node, onClose }) => {
  return (
    <Drawer anchor="right" open onClose={onClose}>
      <Box sx={{ width: 360, p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{node.label}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Typography variant="subtitle2" sx={{ color: palette.GRAY }}>
          {node.category} &mdash; Owner: {node.owner}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" paragraph>
          {node.description}
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          Key KPIs
        </Typography>
        {node.kpi.map((k) => (
          <Chip key={k} label={k} sx={{ mr: 0.5, mb: 0.5 }} />
        ))}
      </Box>
    </Drawer>
  );
};

export default NodeCard;
```

---

## 7. Minimal top bar – `components/TopBar.tsx`

```tsx
import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { palette } from "../theme/palette";

const TopBar: React.FC = () => (
  <AppBar position="static" sx={{ background: palette.DARKEST_BLUE }}>
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        PolicyEngine Strategic Roadmap
      </Typography>
    </Toolbar>
  </AppBar>
);

export default TopBar;
```

---

## 8. Styling tweaks – `styles.css`

```css
body {
  margin: 0;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

/* example scroll‑bar colours to match palette */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #2c6496;
  border-radius: 4px;
}
```

---

## 9. Running locally

```bash
# one‑time setup
npm install
# you’ll need reactflow, @mui/material, @emotion/react, @emotion/styled
npm install reactflow @mui/material @emotion/react @emotion/styled

# start dev server
npm start
```

The dev server will hot‑reload. All roadmap content lives in `data/roadmap.json`, so **non‑technical teammates can update the strategy map without touching code**.

---

### Extending the app

| Feature                  | Quick‑start ideas                                                                           |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| **Filtering & layers**   | Add checkboxes (e.g., “Show only Technology nodes”) that toggle node/edge visibility.       |
| **Timeline slider**      | Store a `quarter` field per node/edge, then hide/show based on a Material‑UI `Slider`.      |
| **Export**               | Use `reactflow`’s `toPng` helper to let users export the graph as an image for slide decks. |
| **Auth & collaboration** | Wrap the app in Firebase Auth; persist node positions or comments in Firestore.             |
| **Deployment**           | Push to a free Vercel or Netlify site — automatic CI/CD from `main` branch.                 |

---

## 10. Why this architecture?

- **React Flow** gives an opinionated but flexible graph canvas with zero WebGL headaches.
- **MUI v5** provides accessible components and easy theming with your palette.
- Data‑driven JSON means strategy changes are content, not code.
- TypeScript prevents crashes as the roadmap organically grows.

---

### Next steps for your team

1. **Populate `roadmap.json`** with all nodes/edges from the strategic document.
2. **Refine categories** (e.g., `Core Product`, `Technology`, `Research`, `Growth`) and style nodes by category colour (use `node.style.background`).
3. **Iterate UX** – e.g., tooltips on hover, KPI progress bars that update from a backend, etc.
4. **Optional graph layout** – if manual drag‑and‑drop feels messy, integrate `@dagrejs/graphlib` or `elkjs` to auto‑layout the graph.

With this scaffold you’ll have a **clean, theme‑consistent React app** that stakeholders can click through to understand how Data & Modeling links to API work, how Policy Research feeds community growth, and so on.

import React, { useCallback, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { Box } from "@mui/material";

import roadmap from "../data/roadmap.json";
import NodeCard from "./NodeCard";
import Legend from "./Legend";
import { palette } from "../theme/palette";

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    "Data & Modeling": palette.BLUE,
    "Policy Coverage": palette.TEAL_ACCENT,
    "Policy Research": palette.BLUE_PRESSED,
    "Technology": palette.DARK_BLUE_HOVER,
    "Community & Partnerships": palette.TEAL_PRESSED,
    "Growth": palette.DARK_GRAY,
    "Users & Stakeholders": palette.DARK_RED,
  };
  return colors[category] || palette.GRAY;
};

// Custom node component
const CustomNode = ({ data }: { data: any }) => {
  return (
    <Box
      sx={{
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: getCategoryColor(data.category),
        color: palette.WHITE,
        fontSize: "13px",
        fontWeight: 500,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.2s",
        width: "180px",
        textAlign: "center",
        "&:hover": {
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {data.label}
    </Box>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const RoadmapGraph: React.FC = () => {
  const initialNodes: Node[] = useMemo(() => {
    // Arrange nodes in a more structured layout by category with better spacing
    const categoryPositions: { [key: string]: { x: number; y: number; count: number } } = {
      "Data & Modeling": { x: 50, y: 50, count: 0 },
      "Policy Coverage": { x: 500, y: 50, count: 0 },
      "Policy Research": { x: 950, y: 50, count: 0 },
      "Technology": { x: 50, y: 400, count: 0 },
      "Community & Partnerships": { x: 500, y: 400, count: 0 },
      "Growth": { x: 950, y: 400, count: 0 },
      "Users & Stakeholders": { x: 300, y: 750, count: 0 },
    };

    return roadmap.nodes.map((n) => {
      const catPos = categoryPositions[n.category] || { x: 250, y: 250, count: 0 };
      const cols = 2; // Number of columns per category
      const nodeWidth = 200; // Approximate width of a node
      const nodeHeight = 80; // Approximate height of a node
      const horizontalGap = 20; // Gap between nodes horizontally
      const verticalGap = 20; // Gap between nodes vertically
      
      const col = catPos.count % cols;
      const row = Math.floor(catPos.count / cols);
      
      const position = {
        x: catPos.x + col * (nodeWidth + horizontalGap),
        y: catPos.y + row * (nodeHeight + verticalGap),
      };
      catPos.count++;

      return {
        id: n.id,
        data: { label: n.label, category: n.category },
        position,
        type: "custom",
      };
    });
  }, []);

  const initialEdges: Edge[] = roadmap.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: "smoothstep",
    animated: true,
    label: e.label,
    labelStyle: { fontSize: 11, fontWeight: 400 },
    style: { stroke: palette.MEDIUM_LIGHT_GRAY, strokeWidth: 2 },
  }));

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selected, setSelected] = React.useState<string | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelected(node.id);
  }, []);

  const selectedNode = selected ? roadmap.nodes.find((n) => n.id === selected) : null;

  return (
    <Box sx={{ height: "calc(100vh - 64px)", position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.1, maxZoom: 1 }}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
        }}
        minZoom={0.3}
        maxZoom={2}
      >
        <MiniMap
          nodeColor={(node) => getCategoryColor(node.data.category)}
          style={{
            backgroundColor: palette.BLUE_98,
          }}
        />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={palette.MEDIUM_DARK_GRAY} />
      </ReactFlow>

      <Legend />

      {selectedNode && (
        <NodeCard
          node={selectedNode}
          onClose={() => setSelected(null)}
        />
      )}
    </Box>
  );
};

export default RoadmapGraph;
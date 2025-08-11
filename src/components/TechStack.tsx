import React, { useState, useLayoutEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  Node,
  Edge,
  ConnectionMode,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Position,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import techStackData from '../data/techStack.json';

interface NodeData {
  category: string;
  deprecated?: boolean;
}

interface EdgeData {
  source: string;
  target: string;
  deprecated?: boolean;
}

interface TechStackData {
  nodes: Record<string, NodeData>;
  edges: {
    current: EdgeData[];
    future: EdgeData[];
  };
  categoryStyles: Record<string, any>;
}

// Create dagre graph for automatic layout
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 180;
const nodeHeight = 40;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ 
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 20,
    marginy: 20
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? Position.Left : Position.Top;
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
    
    // Provide default position if dagre doesn't return one (for testing)
    if (nodeWithPosition && nodeWithPosition.x !== undefined && nodeWithPosition.y !== undefined) {
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    } else {
      // Fallback position for testing
      node.position = { x: 0, y: 0 };
    }
  });

  return { nodes, edges };
};

const TechStack = () => {
  const [view, setView] = useState<'current' | 'future'>('current');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useLayoutEffect(() => {
    const edgeList = view === 'current' 
      ? techStackData.edges.current 
      : techStackData.edges.future;
    
    // Get nodes that have edges
    const nodesWithEdges = new Set<string>();
    edgeList.forEach(edge => {
      nodesWithEdges.add(edge.source);
      nodesWithEdges.add(edge.target);
    });
    
    // Create node objects for nodes with edges
    const filteredNodes: Node[] = Array.from(nodesWithEdges).map(nodeId => {
      const nodeData = (techStackData.nodes as Record<string, NodeData>)[nodeId];
      const categoryStyles = techStackData.categoryStyles as Record<string, any>;
      const style = nodeData && categoryStyles[nodeData.category] ? {
        ...categoryStyles[nodeData.category],
        cursor: 'pointer'
      } : {};
      
      return {
        id: nodeId,
        type: 'default',
        data: { label: nodeId },
        position: { x: 0, y: 0 },
        style: {
          ...style,
          fontSize: '12px',
          padding: '8px'
        }
      };
    });
    
    // Create edge objects
    const formattedEdges: Edge[] = edgeList.map((edge, idx) => ({
      id: `edge-${idx}`,
      source: edge.source,
      target: edge.target,
      markerEnd: 'url(#arrow)'
    }));
    
    // Apply automatic layout
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      filteredNodes,
      formattedEdges,
      'TB'
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [view, setNodes, setEdges]);
  
  // Apply hover effects
  const displayNodes = nodes.map(node => {
    const connectedNodeIds = hoveredNode ? new Set<string>() : null;
    if (hoveredNode && connectedNodeIds) {
      connectedNodeIds.add(hoveredNode);
      edges.forEach(edge => {
        if (edge.source === hoveredNode) {
          connectedNodeIds.add(edge.target);
        }
        if (edge.target === hoveredNode) {
          connectedNodeIds.add(edge.source);
        }
      });
    }
    
    return {
      ...node,
      style: {
        ...node.style,
        opacity: hoveredNode ? (connectedNodeIds?.has(node.id) ? 1 : 0.3) : 1,
        transition: 'opacity 0.2s ease',
      }
    };
  });
  
  const displayEdges = edges.map(edge => ({
    ...edge,
    style: {
      ...edge.style,
      stroke: hoveredNode 
        ? (edge.source === hoveredNode || edge.target === hoveredNode) 
          ? '#2196F3' 
          : '#999'
        : undefined,
      strokeWidth: hoveredNode 
        ? (edge.source === hoveredNode || edge.target === hoveredNode) 
          ? 3 
          : 1
        : undefined,
      opacity: hoveredNode 
        ? (edge.source === hoveredNode || edge.target === hoveredNode) 
          ? 1 
          : 0.2
        : edge.style?.opacity || 1,
      transition: 'all 0.2s ease',
    },
    animated: hoveredNode 
      ? (edge.source === hoveredNode || edge.target === hoveredNode)
      : false,
  }));

  const handleNodeClick = (_: any, node: Node) => {
    // All repos are on GitHub under PolicyEngine org
    const url = `https://github.com/PolicyEngine/${node.id}`;
    window.open(url, '_blank');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 1.5, m: 1, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">PolicyEngine Tech Stack Architecture</Typography>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, newView) => newView && setView(newView)}
            aria-label="architecture view"
          >
            <ToggleButton value="current">Current State</ToggleButton>
            <ToggleButton value="future">Future State</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <Typography variant="caption" sx={{ mb: 0.5 }}>
          Click on any component to visit its GitHub repository. Hover over nodes to highlight connections.
        </Typography>
        
        {view === 'future' && (
          <Box sx={{ bgcolor: 'info.light', p: 1, borderRadius: 1 }}>
            <Typography variant="caption">
              <strong>Key Changes:</strong> policyengine-api removed • policyengine.py expanded role • 
              unified policyengine-data package • new country models (IL, NG) • TypeScript app v2
            </Typography>
          </Box>
        )}
      </Paper>

      <Box sx={{ flex: 1, px: 1, pb: 1, minHeight: 0 }}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={displayNodes}
            edges={displayEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            onNodeMouseEnter={(_, node) => setHoveredNode(node.id)}
            onNodeMouseLeave={() => setHoveredNode(null)}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{
              padding: 0.2,
              maxZoom: 1.5,
              minZoom: 0.5
            }}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            minZoom={0.3}
            maxZoom={2}
          >
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <marker
                  id="arrow"
                  markerWidth="15"
                  markerHeight="15"
                  refX="14"
                  refY="7.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path
                    d="M 0 0 L 15 7.5 L 0 15 z"
                    fill="#222"
                    stroke="#222"
                  />
                </marker>
              </defs>
            </svg>
            <Background />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </Box>
    </Box>
  );
};

export default TechStack;
import React from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: '2', position: { x: 200, y: 0 }, data: { label: 'Node 2' } },
];

// Test different arrow configurations
const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    type: 'default',
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    label: 'Arrow Test'
  },
];

function ArrowTest() {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <h2 style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        Arrow Test - Should show arrow on edge
      </h2>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default ArrowTest;
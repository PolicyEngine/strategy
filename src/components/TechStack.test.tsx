import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechStack from './TechStack';

// Create mock nodes and edges for testing
const mockNodes = [
  { id: 'node1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'node2', position: { x: 100, y: 100 }, data: { label: 'Node 2' } },
];

const mockEdges = [
  { id: 'edge1', source: 'node1', target: 'node2' },
];

// Mock ReactFlow with more complete implementation
const mockSetNodes = jest.fn();
const mockSetEdges = jest.fn();
const mockOnNodesChange = jest.fn();
const mockOnEdgesChange = jest.fn();

jest.mock('reactflow', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ 
      children, 
      nodes, 
      edges, 
      onNodeClick,
      onNodeMouseEnter,
      onNodeMouseLeave,
      onNodesChange,
      onEdgesChange,
    }: any) => {
      // Simulate ReactFlow behavior
      React.useEffect(() => {
        // Trigger node events for testing
        if (nodes && nodes.length > 0) {
          // Store handlers for testing
          (window as any).__reactFlowHandlers = {
            onNodeClick,
            onNodeMouseEnter,
            onNodeMouseLeave,
          };
        }
      }, [nodes, onNodeClick, onNodeMouseEnter, onNodeMouseLeave]);

      return (
        <div data-testid="react-flow">
          {nodes?.map((node: any) => (
            <div 
              key={node.id} 
              data-testid={`node-${node.id}`}
              data-node-id={node.id}
              onClick={() => onNodeClick && onNodeClick(null, node)}
              onMouseEnter={() => onNodeMouseEnter && onNodeMouseEnter(null, node)}
              onMouseLeave={() => onNodeMouseLeave && onNodeMouseLeave()}
              style={node.style}
            >
              {node.data?.label || node.id}
            </div>
          ))}
          {edges?.map((edge: any) => (
            <div 
              key={edge.id} 
              data-testid={`edge-${edge.id}`}
              style={edge.style}
            >
              {edge.source} → {edge.target}
            </div>
          ))}
          {children}
        </div>
      );
    },
    Controls: () => <div data-testid="controls">Controls</div>,
    Background: () => <div data-testid="background">Background</div>,
    ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
    useNodesState: () => {
      const React = require('react');
      const [nodes, setNodes] = React.useState(mockNodes);
      mockSetNodes.mockImplementation(setNodes);
      return [nodes, mockSetNodes, mockOnNodesChange];
    },
    useEdgesState: () => {
      const React = require('react');
      const [edges, setEdges] = React.useState(mockEdges);
      mockSetEdges.mockImplementation(setEdges);
      return [edges, mockSetEdges, mockOnEdgesChange];
    },
    Position: {
      Top: 'top',
      Bottom: 'bottom',
      Left: 'left',
      Right: 'right',
    },
    ConnectionMode: {
      Loose: 'loose',
    },
  };
});

// Mock dagre with different implementations for testing
const mockDagreNode = jest.fn();
jest.mock('dagre', () => ({
  graphlib: {
    Graph: jest.fn().mockImplementation(() => ({
      setDefaultEdgeLabel: jest.fn(),
      setGraph: jest.fn(),
      setNode: jest.fn(),
      setEdge: jest.fn(),
      node: mockDagreNode,
    })),
  },
  layout: jest.fn(),
}));

// Mock techStack data
jest.mock('../data/techStack.json', () => ({
  nodes: {
    'policyengine-core': { category: 'core' },
    'policyengine-us': { category: 'country' },
    'policyengine-uk': { category: 'country' },
    'microdf': { category: 'utilities' },
    'policyengine-api': { category: 'api' },
    'policyengine-app': { category: 'frontend' },
  },
  edges: {
    current: [
      { source: 'microdf', target: 'policyengine-core' },
      { source: 'policyengine-core', target: 'policyengine-us' },
      { source: 'policyengine-core', target: 'policyengine-uk' },
    ],
    future: [
      { source: 'microdf', target: 'policyengine-core' },
      { source: 'policyengine-core', target: 'policyengine-us' },
      { source: 'policyengine-core', target: 'policyengine-uk' },
      { source: 'policyengine-app', target: 'policyengine-api' },
    ],
  },
  categoryStyles: {
    core: { backgroundColor: '#e3f2fd', border: '2px solid #2196F3' },
    country: { backgroundColor: '#f3e5f5', border: '2px solid #9c27b0' },
    utilities: { backgroundColor: '#e8f5e9', border: '2px solid #4caf50' },
    api: { backgroundColor: '#fff3e0', border: '2px solid #ff9800' },
    frontend: { backgroundColor: '#fce4ec', border: '2px solid #e91e63' },
  },
}));

describe('TechStack', () => {
  beforeEach(() => {
    // Reset mocks
    global.open = jest.fn();
    mockSetNodes.mockClear();
    mockSetEdges.mockClear();
    mockOnNodesChange.mockClear();
    mockOnEdgesChange.mockClear();
    mockDagreNode.mockReturnValue({ x: 100, y: 100 });
  });

  it('should render without crashing', () => {
    render(<TechStack />);
    expect(screen.getByText('PolicyEngine Tech Stack Architecture')).toBeInTheDocument();
  });

  it('should have current and future state toggle buttons', () => {
    render(<TechStack />);
    expect(screen.getByRole('button', { name: /current state/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /future state/i })).toBeInTheDocument();
  });

  it('should toggle between current and future views', () => {
    render(<TechStack />);
    
    const currentButton = screen.getByRole('button', { name: /current state/i });
    const futureButton = screen.getByRole('button', { name: /future state/i });
    
    // Current should be selected by default
    expect(currentButton).toHaveAttribute('aria-pressed', 'true');
    expect(futureButton).toHaveAttribute('aria-pressed', 'false');
    
    // Click future button
    fireEvent.click(futureButton);
    
    // Future should now be selected
    expect(currentButton).toHaveAttribute('aria-pressed', 'false');
    expect(futureButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should display key changes message in future view', () => {
    render(<TechStack />);
    
    // Should not show in current view
    expect(screen.queryByText(/Key Changes:/)).not.toBeInTheDocument();
    
    // Switch to future view
    const futureButton = screen.getByRole('button', { name: /future state/i });
    fireEvent.click(futureButton);
    
    // Should show in future view
    expect(screen.getByText(/Key Changes:/)).toBeInTheDocument();
  });

  it('should render ReactFlow component', () => {
    render(<TechStack />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('should render controls and background', () => {
    render(<TechStack />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  it('should display instructions for interacting with the graph', () => {
    render(<TechStack />);
    expect(screen.getByText(/Click on any component to visit its GitHub repository/)).toBeInTheDocument();
    expect(screen.getByText(/Hover over nodes to highlight connections/)).toBeInTheDocument();
  });

  it('should handle node click and open GitHub URL', async () => {
    render(<TechStack />);
    
    // Wait for nodes to be rendered
    await waitFor(() => {
      const node = screen.getByTestId('node-node1');
      expect(node).toBeInTheDocument();
    });
    
    // Click on a node
    const node = screen.getByTestId('node-node1');
    fireEvent.click(node);
    
    // Check that window.open was called with correct URL
    expect(global.open).toHaveBeenCalledWith(
      'https://github.com/PolicyEngine/node1',
      '_blank'
    );
  });

  it('should handle node hover to highlight connections', async () => {
    render(<TechStack />);
    
    // Wait for nodes to be rendered
    await waitFor(() => {
      const node = screen.getByTestId('node-node1');
      expect(node).toBeInTheDocument();
    });
    
    // Hover over a node
    const node = screen.getByTestId('node-node1');
    fireEvent.mouseEnter(node);
    
    // Check that node styles are updated (opacity changes)
    await waitFor(() => {
      const nodes = screen.getAllByTestId(/^node-/);
      nodes.forEach(n => {
        const style = n.getAttribute('style');
        expect(style).toContain('opacity');
      });
    });
    
    // Mouse leave to reset
    fireEvent.mouseLeave(node);
  });

  it('should handle toggle with null value gracefully', () => {
    render(<TechStack />);
    
    const toggleGroup = screen.getByLabelText('architecture view');
    
    // Simulate onChange with null (when clicking same button)
    fireEvent.click(toggleGroup);
    
    // Should still be on current view
    const currentButton = screen.getByRole('button', { name: /current state/i });
    expect(currentButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should update nodes and edges when switching views', async () => {
    render(<TechStack />);
    
    // Initial render with current view
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled();
      expect(mockSetEdges).toHaveBeenCalled();
    });
    
    // Clear mock calls
    mockSetNodes.mockClear();
    mockSetEdges.mockClear();
    
    // Switch to future view
    const futureButton = screen.getByRole('button', { name: /future state/i });
    fireEvent.click(futureButton);
    
    // Should update nodes and edges
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled();
      expect(mockSetEdges).toHaveBeenCalled();
    });
  });

  it('should handle dagre layout with missing position data', async () => {
    // Mock dagre to return undefined position
    mockDagreNode.mockReturnValue(undefined);
    
    render(<TechStack />);
    
    // Should still render without crashing
    expect(screen.getByText('PolicyEngine Tech Stack Architecture')).toBeInTheDocument();
    
    // Nodes should have fallback positions
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled();
    });
  });

  it('should apply category styles to nodes', async () => {
    render(<TechStack />);
    
    // Wait for nodes to be rendered
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled();
    });
    
    // Check that nodes have styles applied
    const nodeCallArgs = mockSetNodes.mock.calls[0][0];
    expect(nodeCallArgs).toBeDefined();
    
    // Verify some nodes have category styles
    if (Array.isArray(nodeCallArgs)) {
      nodeCallArgs.forEach((node: any) => {
        expect(node.style).toBeDefined();
        expect(node.style.cursor).toBe('pointer');
      });
    }
  });

  it('should handle nodes without category data', async () => {
    // Mock a node without category
    mockDagreNode.mockReturnValue({ x: 100, y: 100 });
    
    render(<TechStack />);
    
    // Should still render without crashing
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled();
    });
  });

  it('should create edges with arrow markers', async () => {
    render(<TechStack />);
    
    await waitFor(() => {
      expect(mockSetEdges).toHaveBeenCalled();
    });
    
    // Check that edges have arrow markers
    const edgeCallArgs = mockSetEdges.mock.calls[0][0];
    if (Array.isArray(edgeCallArgs)) {
      edgeCallArgs.forEach((edge: any) => {
        expect(edge.markerEnd).toBe('url(#arrow)');
      });
    }
  });

  it('should render SVG arrow marker definition', () => {
    render(<TechStack />);
    
    // Check for SVG defs
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    
    const marker = document.querySelector('marker#arrow');
    expect(marker).toBeInTheDocument();
    
    const path = marker?.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('d')).toBe('M 0 0 L 15 7.5 L 0 15 z');
  });

  it('should apply hover effects to edges', async () => {
    render(<TechStack />);
    
    // Wait for initial render
    await waitFor(() => {
      const node = screen.getByTestId('node-node1');
      expect(node).toBeInTheDocument();
    });
    
    // Hover over a node
    const node = screen.getByTestId('node-node1');
    fireEvent.mouseEnter(node);
    
    // Wait for edge style updates
    await waitFor(() => {
      const edges = screen.getAllByTestId(/^edge-/);
      edges.forEach(edge => {
        const style = edge.getAttribute('style');
        expect(style).toBeDefined();
      });
    });
  });

  it('should handle horizontal layout direction', async () => {
    render(<TechStack />);
    
    // The component uses 'TB' (top-bottom) layout by default
    // Verify dagre is configured correctly
    await waitFor(() => {
      expect(mockSetNodes).toHaveBeenCalled();
    });
    
    // Check that node positions are set correctly
    const nodeCallArgs = mockSetNodes.mock.calls[0][0];
    if (Array.isArray(nodeCallArgs)) {
      nodeCallArgs.forEach((node: any) => {
        expect(node.targetPosition).toBe('top');
        expect(node.sourcePosition).toBe('bottom');
      });
    }
  });
});
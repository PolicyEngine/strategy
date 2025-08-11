import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoadmapGraph from './RoadmapGraph';

// Mock ReactFlow
jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children, nodes, edges, onNodeClick }: any) => {
    // Simulate rendering nodes
    return (
      <div data-testid="react-flow">
        {nodes?.map((node: any) => (
          <div 
            key={node.id} 
            data-testid={`node-${node.id}`}
            onClick={() => onNodeClick && onNodeClick(null, node)}
          >
            {node.data?.label}
          </div>
        ))}
        {children}
      </div>
    );
  },
  Controls: () => <div data-testid="controls">Controls</div>,
  Background: () => <div data-testid="background">Background</div>,
  ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
  MiniMap: () => <div data-testid="minimap">MiniMap</div>,
  useNodesState: () => {
    const [nodes, setNodes] = React.useState([]);
    return [nodes, setNodes, jest.fn()];
  },
  useEdgesState: () => {
    const [edges, setEdges] = React.useState([]);
    return [edges, setEdges, jest.fn()];
  },
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
  MarkerType: {
    ArrowClosed: 'arrowclosed',
  },
}));

// Mock components
jest.mock('./Legend', () => {
  return function Legend() {
    return <div data-testid="legend">Legend</div>;
  };
});

jest.mock('./NodeCard', () => {
  return function NodeCard({ task, onClose }: any) {
    return (
      <div data-testid="node-card">
        <div>{task?.title}</div>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };
});

// Mock data
jest.mock('../data/roadmapData', () => ({
  quarters: ['2025 Q1', '2025 Q2'],
  tasks: [
    {
      id: 'task1',
      title: 'Test Task 1',
      quarter: '2025 Q1',
      category: 'infrastructure',
      status: 'in-progress',
      description: 'Test description',
      url: 'https://example.com',
    },
    {
      id: 'task2',
      title: 'Test Task 2',
      quarter: '2025 Q2',
      category: 'feature',
      status: 'planned',
    },
  ],
  dependencies: [
    { from: 'task1', to: 'task2' },
  ],
}));

describe('RoadmapGraph', () => {
  beforeEach(() => {
    // Reset window.open mock
    global.open = jest.fn();
  });

  it('renders without crashing', () => {
    render(<RoadmapGraph />);
    expect(screen.getByText('PolicyEngine Roadmap')).toBeInTheDocument();
  });

  it('displays the roadmap title', () => {
    render(<RoadmapGraph />);
    const title = screen.getByText('PolicyEngine Roadmap');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H5');
  });

  it('renders ReactFlow component', () => {
    render(<RoadmapGraph />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('renders controls', () => {
    render(<RoadmapGraph />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
  });

  it('renders background', () => {
    render(<RoadmapGraph />);
    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  it('renders minimap', () => {
    render(<RoadmapGraph />);
    expect(screen.getByTestId('minimap')).toBeInTheDocument();
  });

  it('renders legend', () => {
    render(<RoadmapGraph />);
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('creates nodes from tasks data', async () => {
    render(<RoadmapGraph />);
    await waitFor(() => {
      expect(screen.getByTestId('node-task1')).toBeInTheDocument();
      expect(screen.getByTestId('node-task2')).toBeInTheDocument();
    });
  });

  it('opens NodeCard when a task node is clicked', async () => {
    render(<RoadmapGraph />);
    
    // Wait for node to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('node-task1')).toBeInTheDocument();
    });
    
    // Click on task node
    fireEvent.click(screen.getByTestId('node-task1'));
    
    // Check if NodeCard is displayed
    await waitFor(() => {
      expect(screen.getByTestId('node-card')).toBeInTheDocument();
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });
  });

  it('closes NodeCard when close button is clicked', async () => {
    render(<RoadmapGraph />);
    
    // Open NodeCard
    await waitFor(() => {
      expect(screen.getByTestId('node-task1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId('node-task1'));
    
    // Wait for NodeCard to appear
    await waitFor(() => {
      expect(screen.getByTestId('node-card')).toBeInTheDocument();
    });
    
    // Click close button
    fireEvent.click(screen.getByText('Close'));
    
    // Check if NodeCard is closed
    await waitFor(() => {
      expect(screen.queryByTestId('node-card')).not.toBeInTheDocument();
    });
  });

  it('handles nodes without click (group nodes)', async () => {
    render(<RoadmapGraph />);
    
    // Group nodes (quarters) should be rendered but not clickable
    await waitFor(() => {
      const reactFlow = screen.getByTestId('react-flow');
      expect(reactFlow).toBeInTheDocument();
    });
  });

  it('displays quarter information', () => {
    render(<RoadmapGraph />);
    const description = screen.getByText(/Hover over or click on tasks to see more details/);
    expect(description).toBeInTheDocument();
  });

  it('applies correct container styling', () => {
    const { container } = render(<RoadmapGraph />);
    const mainBox = container.querySelector('.MuiBox-root');
    expect(mainBox).toBeInTheDocument();
  });
});
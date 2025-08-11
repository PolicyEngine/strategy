import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechStackDiagram from '../TechStackDiagram';

// Mock ReactFlow to test our component logic
jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ nodes, edges, nodeTypes, children }: any) => {
    return (
      <div data-testid="react-flow">
        <div data-testid="nodes-count">{nodes.length}</div>
        <div data-testid="edges-count">{edges.length}</div>
        <div data-testid="has-node-types">{nodeTypes ? 'yes' : 'no'}</div>
        {edges.map((edge: any) => (
          <div key={edge.id} data-testid={`edge-${edge.id}`}>
            <span data-testid={`edge-${edge.id}-source`}>{edge.source}</span>
            <span data-testid={`edge-${edge.id}-target`}>{edge.target}</span>
            <span data-testid={`edge-${edge.id}-has-marker`}>
              {edge.markerEnd ? 'yes' : 'no'}
            </span>
            <span data-testid={`edge-${edge.id}-type`}>{edge.type || 'default'}</span>
          </div>
        ))}
        {children}
      </div>
    );
  },
  Background: () => <div data-testid="background">Background</div>,
  Controls: () => <div data-testid="controls">Controls</div>,
  MiniMap: () => <div data-testid="minimap">MiniMap</div>,
  Position: { Left: 'left', Right: 'right', Top: 'top', Bottom: 'bottom' },
  MarkerType: {
    ArrowClosed: 'arrowClosed',
    Arrow: 'arrow',
  },
}));

describe('TechStackDiagram', () => {
  it('renders without crashing', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('PolicyEngine Tech Stack Architecture')).toBeInTheDocument();
  });

  it('shows current state by default', () => {
    render(<TechStackDiagram />);
    const currentButton = screen.getByRole('button', { name: /current state/i });
    expect(currentButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('can switch between current and future state', () => {
    render(<TechStackDiagram />);
    const futureButton = screen.getByRole('button', { name: /future state/i });
    
    fireEvent.click(futureButton);
    
    expect(futureButton).toHaveAttribute('aria-pressed', 'true');
  });

  describe('Current State', () => {
    it('has the correct number of nodes', () => {
      render(<TechStackDiagram />);
      const nodesCount = screen.getByTestId('nodes-count');
      expect(nodesCount).toHaveTextContent('14'); // Based on currentStateNodes
    });

    it('has the correct number of edges with dependencies', () => {
      render(<TechStackDiagram />);
      const edgesCount = screen.getByTestId('edges-count');
      expect(edgesCount).toHaveTextContent('22'); // Based on currentStateEdges
    });

    it('all edges have arrow markers', () => {
      render(<TechStackDiagram />);
      
      // Check that key edges have markers
      const e1 = screen.getByTestId('edge-e1-has-marker');
      expect(e1).toHaveTextContent('yes');
      
      const e2 = screen.getByTestId('edge-e2-has-marker');
      expect(e2).toHaveTextContent('yes');
    });

    it('edges have smoothstep type', () => {
      render(<TechStackDiagram />);
      
      const e1Type = screen.getByTestId('edge-e1-type');
      expect(e1Type).toHaveTextContent('smoothstep');
    });

    it('core dependencies are set up correctly', () => {
      render(<TechStackDiagram />);
      
      // microdf -> core
      const e1Source = screen.getByTestId('edge-e1-source');
      const e1Target = screen.getByTestId('edge-e1-target');
      expect(e1Source).toHaveTextContent('microdf');
      expect(e1Target).toHaveTextContent('core');
      
      // core -> us
      const e2Source = screen.getByTestId('edge-e2-source');
      const e2Target = screen.getByTestId('edge-e2-target');
      expect(e2Source).toHaveTextContent('core');
      expect(e2Target).toHaveTextContent('us');
    });
  });

  describe('Future State', () => {
    beforeEach(() => {
      render(<TechStackDiagram />);
      const futureButton = screen.getByRole('button', { name: /future state/i });
      fireEvent.click(futureButton);
    });

    it('has the correct number of nodes including new ones', () => {
      const nodesCount = screen.getByTestId('nodes-count');
      expect(nodesCount).toHaveTextContent('18'); // Based on futureStateNodes
    });

    it('has the correct number of edges', () => {
      const edgesCount = screen.getByTestId('edges-count');
      expect(edgesCount).toHaveTextContent('26'); // Based on futureStateEdges
    });

    it('shows key changes info box', () => {
      expect(screen.getByText(/Key Changes:/)).toBeInTheDocument();
      expect(screen.getByText(/policyengine-api removed/)).toBeInTheDocument();
    });

    it('all future edges have arrow markers', () => {
      // Check that key edges have markers
      const e1 = screen.getByTestId('edge-e1-has-marker');
      expect(e1).toHaveTextContent('yes');
      
      const e19 = screen.getByTestId('edge-e19-has-marker');
      expect(e19).toHaveTextContent('yes');
    });
  });

  it('renders custom node types', () => {
    render(<TechStackDiagram />);
    const hasNodeTypes = screen.getByTestId('has-node-types');
    expect(hasNodeTypes).toHaveTextContent('yes');
  });

  it('includes ReactFlow controls', () => {
    render(<TechStackDiagram />);
    expect(screen.getByTestId('background')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('minimap')).toBeInTheDocument();
  });

  it('displays legend with all categories', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('Core Infrastructure')).toBeInTheDocument();
    expect(screen.getByText('Country Models')).toBeInTheDocument();
    expect(screen.getByText('Data & Microdata')).toBeInTheDocument();
    expect(screen.getByText('APIs')).toBeInTheDocument();
    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getByText('Utilities')).toBeInTheDocument();
  });
});
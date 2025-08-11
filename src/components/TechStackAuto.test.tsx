import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechStackAuto from './TechStackAuto';

// Mock ReactFlow to avoid issues with the library in tests
jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
  Controls: () => <div data-testid="controls">Controls</div>,
  Background: () => <div data-testid="background">Background</div>,
  ReactFlowProvider: ({ children }: any) => <div>{children}</div>,
  useNodesState: () => [[], jest.fn(), jest.fn()],
  useEdgesState: () => [[], jest.fn(), jest.fn()],
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
  },
  ConnectionMode: {
    Loose: 'loose',
  },
}));

// Mock dagre
jest.mock('dagre', () => ({
  graphlib: {
    Graph: jest.fn().mockImplementation(() => ({
      setDefaultEdgeLabel: jest.fn(),
      setGraph: jest.fn(),
      setNode: jest.fn(),
      setEdge: jest.fn(),
      node: jest.fn(() => ({ x: 100, y: 100 })),
    })),
  },
  layout: jest.fn(),
}));

describe('TechStackAuto', () => {
  beforeEach(() => {
    // Reset window.open mock
    global.open = jest.fn();
  });

  it('should render without crashing', () => {
    render(<TechStackAuto />);
    expect(screen.getByText('PolicyEngine Tech Stack Architecture')).toBeInTheDocument();
  });

  it('should have current and future state toggle buttons', () => {
    render(<TechStackAuto />);
    expect(screen.getByRole('button', { name: /current state/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /future state/i })).toBeInTheDocument();
  });

  it('should toggle between current and future views', () => {
    render(<TechStackAuto />);
    
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
    render(<TechStackAuto />);
    
    // Should not show in current view
    expect(screen.queryByText(/Key Changes:/)).not.toBeInTheDocument();
    
    // Switch to future view
    const futureButton = screen.getByRole('button', { name: /future state/i });
    fireEvent.click(futureButton);
    
    // Should show in future view
    expect(screen.getByText(/Key Changes:/)).toBeInTheDocument();
  });

  it('should render ReactFlow component', () => {
    render(<TechStackAuto />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  it('should render controls and background', () => {
    render(<TechStackAuto />);
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  it('should display instructions for interacting with the graph', () => {
    render(<TechStackAuto />);
    expect(screen.getByText(/Click on any component to visit its GitHub repository/)).toBeInTheDocument();
    expect(screen.getByText(/Hover over nodes to highlight connections/)).toBeInTheDocument();
  });
});
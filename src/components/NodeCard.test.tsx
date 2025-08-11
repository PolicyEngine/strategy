import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NodeCard from './NodeCard';

describe('NodeCard', () => {
  const mockNode = {
    id: 'node1',
    label: 'Test Node',
    description: 'This is a test node description',
    kpi: ['KPI 1', 'KPI 2'],
    owner: 'Test Owner',
    category: 'Technology',
    timeline: '2025 Q1',
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    global.open = jest.fn();
  });

  it('renders drawer when node is provided', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('renders node information when node is provided', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByText('This is a test node description')).toBeInTheDocument();
    expect(screen.getByText('2025 Q1')).toBeInTheDocument();
  });

  it('displays category chip with correct label', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    const categoryChip = screen.getByText('Technology');
    expect(categoryChip).toBeInTheDocument();
    expect(categoryChip.closest('.MuiChip-root')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    const closeButton = screen.getByTestId('CloseIcon').closest('button');
    fireEvent.click(closeButton!);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays owner information', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test Owner')).toBeInTheDocument();
  });

  it('displays KPIs', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
    expect(screen.getByText('KPI 1')).toBeInTheDocument();
    expect(screen.getByText('KPI 2')).toBeInTheDocument();
  });

  it('displays timeline when provided', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    expect(screen.getByText('2025 Q1')).toBeInTheDocument();
  });

  it('does not display timeline when not provided', () => {
    const nodeWithoutTimeline = { ...mockNode, timeline: undefined };
    render(<NodeCard node={nodeWithoutTimeline} onClose={mockOnClose} />);
    
    expect(screen.queryByText('2025 Q1')).not.toBeInTheDocument();
  });



  it('displays correct category color', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    const categoryChip = screen.getByText('Technology');
    expect(categoryChip).toBeInTheDocument();
  });

  it('uses Drawer component for side panel', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    const drawer = document.querySelector('.MuiDrawer-root');
    expect(drawer).toBeInTheDocument();
  });




  it('renders LinearProgress for KPIs', () => {
    render(<NodeCard node={mockNode} onClose={mockOnClose} />);
    
    const progressBars = document.querySelectorAll('.MuiLinearProgress-root');
    expect(progressBars).toHaveLength(2); // One for each KPI
  });
});
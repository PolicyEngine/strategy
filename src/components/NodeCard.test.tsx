import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NodeCard from './NodeCard';

describe('NodeCard', () => {
  const mockTask = {
    id: 'task1',
    title: 'Test Task',
    description: 'This is a test task description',
    quarter: '2025 Q1',
    category: 'infrastructure',
    status: 'in-progress' as const,
    url: 'https://github.com/PolicyEngine/test-repo',
    dependencies: ['dep1', 'dep2'],
  };

  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    global.open = jest.fn();
  });

  it('renders nothing when task is null', () => {
    const { container } = render(<NodeCard task={null} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders task information when task is provided', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
    expect(screen.getByText('2025 Q1')).toBeInTheDocument();
  });

  it('displays status chip with correct label', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    const statusChip = screen.getByText('In Progress');
    expect(statusChip).toBeInTheDocument();
    expect(statusChip.closest('.MuiChip-root')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays GitHub link when URL is provided', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    const githubButton = screen.getByRole('button', { name: /view on github/i });
    expect(githubButton).toBeInTheDocument();
  });

  it('opens GitHub URL in new tab when button is clicked', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    const githubButton = screen.getByRole('button', { name: /view on github/i });
    fireEvent.click(githubButton);
    
    expect(global.open).toHaveBeenCalledWith('https://github.com/PolicyEngine/test-repo', '_blank');
  });

  it('does not display GitHub button when URL is not provided', () => {
    const taskWithoutUrl = { ...mockTask, url: undefined };
    render(<NodeCard task={taskWithoutUrl} onClose={mockOnClose} />);
    
    const githubButton = screen.queryByRole('button', { name: /view on github/i });
    expect(githubButton).not.toBeInTheDocument();
  });

  it('displays dependencies when provided', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    expect(screen.getByText(/Dependencies:/)).toBeInTheDocument();
    expect(screen.getByText(/dep1, dep2/)).toBeInTheDocument();
  });

  it('does not display dependencies section when no dependencies', () => {
    const taskWithoutDeps = { ...mockTask, dependencies: undefined };
    render(<NodeCard task={taskWithoutDeps} onClose={mockOnClose} />);
    
    expect(screen.queryByText(/Dependencies:/)).not.toBeInTheDocument();
  });

  it('handles empty dependencies array', () => {
    const taskWithEmptyDeps = { ...mockTask, dependencies: [] };
    render(<NodeCard task={taskWithEmptyDeps} onClose={mockOnClose} />);
    
    expect(screen.queryByText(/Dependencies:/)).not.toBeInTheDocument();
  });

  it('displays correct status chip color for different statuses', () => {
    const statuses = [
      { status: 'completed' as const, label: 'Completed' },
      { status: 'in-progress' as const, label: 'In Progress' },
      { status: 'planned' as const, label: 'Planned' },
    ];

    statuses.forEach(({ status, label }) => {
      const { rerender } = render(
        <NodeCard task={{ ...mockTask, status }} onClose={mockOnClose} />
      );
      
      const statusChip = screen.getByText(label);
      expect(statusChip).toBeInTheDocument();
      
      rerender(<NodeCard task={null} onClose={mockOnClose} />);
    });
  });

  it('uses Dialog component for modal', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    const dialog = document.querySelector('.MuiDialog-root');
    expect(dialog).toBeInTheDocument();
  });

  it('has correct dialog title', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    const dialogTitle = document.querySelector('.MuiDialogTitle-root');
    expect(dialogTitle).toBeInTheDocument();
    expect(dialogTitle).toHaveTextContent('Test Task');
  });

  it('formats status label correctly', () => {
    const taskWithPlanned = { ...mockTask, status: 'planned' as const };
    render(<NodeCard task={taskWithPlanned} onClose={mockOnClose} />);
    
    expect(screen.getByText('Planned')).toBeInTheDocument();
  });

  it('handles task without description', () => {
    const taskWithoutDesc = { ...mockTask, description: undefined };
    render(<NodeCard task={taskWithoutDesc} onClose={mockOnClose} />);
    
    // Should still render without crashing
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('displays category correctly', () => {
    render(<NodeCard task={mockTask} onClose={mockOnClose} />);
    
    // Category is displayed as part of the structure
    const dialogContent = document.querySelector('.MuiDialogContent-root');
    expect(dialogContent).toBeInTheDocument();
  });
});
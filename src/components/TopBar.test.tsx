import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopBar from './TopBar';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/roadmap' }),
}));

describe('TopBar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    render(<TopBar />);
    expect(screen.getByText('PolicyEngine Strategy')).toBeInTheDocument();
  });

  it('displays the app title', () => {
    render(<TopBar />);
    const title = screen.getByText('PolicyEngine Strategy');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H6');
  });

  it('renders Roadmap button', () => {
    render(<TopBar />);
    const roadmapButton = screen.getByText('Roadmap');
    expect(roadmapButton).toBeInTheDocument();
  });

  it('renders Tech Stack button', () => {
    render(<TopBar />);
    const techStackButton = screen.getByText('Tech Stack');
    expect(techStackButton).toBeInTheDocument();
  });

  it('highlights current page button', () => {
    render(<TopBar />);
    const roadmapButton = screen.getByText('Roadmap');
    // Check if the button has the contained variant (active state)
    expect(roadmapButton.closest('button')).toHaveClass('MuiButton-contained');
  });

  it('navigates to roadmap when Roadmap button is clicked', () => {
    render(<TopBar />);
    const roadmapButton = screen.getByText('Roadmap');
    fireEvent.click(roadmapButton);
    expect(mockNavigate).toHaveBeenCalledWith('/roadmap');
  });

  it('navigates to tech-stack when Tech Stack button is clicked', () => {
    render(<TopBar />);
    const techStackButton = screen.getByText('Tech Stack');
    fireEvent.click(techStackButton);
    expect(mockNavigate).toHaveBeenCalledWith('/tech-stack');
  });

  it('applies correct styling to AppBar', () => {
    const { container } = render(<TopBar />);
    const appBar = container.querySelector('.MuiAppBar-root');
    expect(appBar).toBeInTheDocument();
    expect(appBar).toHaveClass('MuiAppBar-positionStatic');
  });

  it('uses Box component for layout', () => {
    const { container } = render(<TopBar />);
    const boxes = container.querySelectorAll('.MuiBox-root');
    expect(boxes.length).toBeGreaterThan(0);
  });

  it('highlights Tech Stack button when on tech-stack route', () => {
    // Mock location to be on tech-stack route
    jest.spyOn(require('react-router-dom'), 'useLocation').mockReturnValue({ pathname: '/tech-stack' });
    
    render(<TopBar />);
    const techStackButton = screen.getByText('Tech Stack');
    expect(techStackButton.closest('button')).toHaveClass('MuiButton-contained');
  });
});
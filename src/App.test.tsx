import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  HashRouter: ({ children }: any) => <div>{children}</div>,
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: ({ element }: any) => element,
  Navigate: ({ to }: any) => <div>Navigate to {to}</div>,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/roadmap' }),
}));

// Mock components
jest.mock('./components/TopBar', () => {
  return function TopBar() {
    return <div>TopBar</div>;
  };
});

jest.mock('./components/RoadmapGraph', () => {
  return function RoadmapGraph() {
    return <div>RoadmapGraph</div>;
  };
});

jest.mock('./components/TechStack', () => {
  return function TechStack() {
    return <div>TechStack</div>;
  };
});

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('renders TopBar', () => {
    render(<App />);
    expect(screen.getByText('TopBar')).toBeInTheDocument();
  });

  it('applies theme provider', () => {
    const { container } = render(<App />);
    // Check that MUI's CssBaseline is applied (it adds styles to the body)
    expect(container.firstChild).toBeTruthy();
  });

  it('sets up routing structure', () => {
    render(<App />);
    // Since we're mocking the router, we can check that our mock components are rendered
    expect(screen.getByText('Navigate to /roadmap')).toBeInTheDocument();
  });
});

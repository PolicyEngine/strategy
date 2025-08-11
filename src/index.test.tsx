import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

// Mock App component
jest.mock('./App', () => {
  return function MockApp() {
    return <div>App</div>;
  };
});

// Mock reportWebVitals
jest.mock('./reportWebVitals', () => jest.fn());

// Mock console methods
const originalError = console.error;
const originalWarn = console.warn;

describe('index', () => {
  let rootElement: HTMLDivElement;

  beforeEach(() => {
    // Create a root element
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Suppress console errors/warnings during tests
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(rootElement);
    jest.clearAllMocks();
    
    // Restore console methods
    console.error = originalError;
    console.warn = originalWarn;
  });

  it('should render the app without crashing', () => {
    // Import index.tsx (this will execute the code)
    require('./index');

    // Check that createRoot was called with the root element
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

    // Check that render was called
    const mockRoot = (ReactDOM.createRoot as jest.Mock).mock.results[0].value;
    expect(mockRoot.render).toHaveBeenCalled();
  });

  it('should render App in StrictMode', () => {
    require('./index');

    const mockRoot = (ReactDOM.createRoot as jest.Mock).mock.results[0].value;
    const renderCall = mockRoot.render.mock.calls[0][0];
    
    // Check that StrictMode wraps the App
    expect(renderCall.type).toBe(React.StrictMode);
    expect(renderCall.props.children.type.name).toBe('MockApp');
  });

  it('should call reportWebVitals', () => {
    require('./index');

    expect(reportWebVitals).toHaveBeenCalled();
  });

  it('should find the root element by id', () => {
    // Remove the root element temporarily
    document.body.removeChild(rootElement);
    
    // Should throw an error or handle missing root gracefully
    expect(() => {
      jest.resetModules();
      require('./index');
    }).toThrow();
    
    // Add it back for cleanup
    document.body.appendChild(rootElement);
  });
});
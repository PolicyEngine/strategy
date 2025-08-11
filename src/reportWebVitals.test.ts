import reportWebVitals from './reportWebVitals';

// Mock web-vitals module
jest.mock('web-vitals', () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe('reportWebVitals', () => {
  let webVitals: any;

  beforeEach(() => {
    jest.resetModules();
    webVitals = require('web-vitals');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call web vitals functions when onPerfEntry is a function', () => {
    const mockOnPerfEntry = jest.fn();
    
    reportWebVitals(mockOnPerfEntry);

    expect(webVitals.getCLS).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getFID).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getFCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getLCP).toHaveBeenCalledWith(mockOnPerfEntry);
    expect(webVitals.getTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
  });

  it('should not call web vitals functions when onPerfEntry is not provided', () => {
    reportWebVitals();

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('should not call web vitals functions when onPerfEntry is null', () => {
    reportWebVitals(null as any);

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('should not call web vitals functions when onPerfEntry is not a function', () => {
    reportWebVitals('not a function' as any);

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('should handle empty object as parameter', () => {
    reportWebVitals({} as any);

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('should handle undefined as parameter', () => {
    reportWebVitals(undefined);

    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });
});
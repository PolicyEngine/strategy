import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Legend from './Legend';

describe('Legend', () => {
  it('renders without crashing', () => {
    render(<Legend />);
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('displays the legend title', () => {
    render(<Legend />);
    const title = screen.getByText('Categories');
    expect(title).toBeInTheDocument();
  });

  it('displays all category items', () => {
    render(<Legend />);
    
    expect(screen.getByText('Data & Modeling')).toBeInTheDocument();
    expect(screen.getByText('Policy Coverage')).toBeInTheDocument();
    expect(screen.getByText('Policy Research')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Community & Partnerships')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
    expect(screen.getByText('Users & Stakeholders')).toBeInTheDocument();
  });




  it('renders status color indicators', () => {
    const { container } = render(<Legend />);
    
    // Check for color boxes (they're Box components with bgcolor)
    const colorBoxes = container.querySelectorAll('.MuiBox-root[style*="background-color"]');
    
    // We expect 7 color boxes for categories
    expect(colorBoxes.length).toBeGreaterThanOrEqual(7);
  });

  it('uses correct colors for category indicators', () => {
    const { container } = render(<Legend />);
    
    // Find a category color box
    const categoryItem = screen.getByText('Data & Modeling').closest('.MuiBox-root');
    const categoryColorBox = categoryItem?.querySelector('[style*="background-color"]');
    
    expect(categoryColorBox).toBeTruthy();
  });

  it('uses Paper component for container', () => {
    const { container } = render(<Legend />);
    const paper = container.querySelector('.MuiPaper-root');
    
    expect(paper).toBeInTheDocument();
  });

  it('applies correct spacing between items', () => {
    const { container } = render(<Legend />);
    
    // Check that items have spacing
    const boxes = container.querySelectorAll('.MuiBox-root');
    expect(boxes.length).toBeGreaterThan(0);
  });

  it('displays items in a flex layout', () => {
    const { container } = render(<Legend />);
    
    // Get categories container
    const categoriesTitle = screen.getByText('Categories');
    const categoriesContainer = categoriesTitle.nextElementSibling;
    
    // Check if it has flex display
    expect(categoriesContainer).toHaveStyle({ display: 'flex' });
  });

  it('has correct typography variants', () => {
    render(<Legend />);
    
    // Check title
    const title = screen.getByText('Categories');
    expect(title.className).toContain('MuiTypography-subtitle2');
    
    // Check body text
    const categoryLabel = screen.getByText('Data & Modeling');
    expect(categoryLabel.className).toContain('MuiTypography-body2');
  });

  it('renders all required legend items', () => {
    render(<Legend />);
    
    // Category items
    const categoryItems = [
      'Data & Modeling',
      'Policy Coverage',
      'Policy Research',
      'Technology',
      'Community & Partnerships',
      'Growth',
      'Users & Stakeholders'
    ];
    categoryItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('has correct structure for legend items', () => {
    render(<Legend />);
    
    // Each legend item should have a color box and a label
    const categoryText = screen.getByText('Data & Modeling');
    const categoryParent = categoryText.closest('.MuiBox-root');
    
    // Should have a sibling or child that's a color box
    const colorBox = categoryParent?.querySelector('[style*="width: 16px"]');
    expect(colorBox).toBeTruthy();
  });

  it('applies correct dimensions to color boxes', () => {
    const { container } = render(<Legend />);
    
    // Find color boxes by their dimensions
    const colorBoxes = container.querySelectorAll('[style*="width: 16px"][style*="height: 16px"]');
    
    // Should have one color box per item (7 categories)
    expect(colorBoxes.length).toBe(7);
  });
});
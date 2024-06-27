import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  test('renders the footer with correct text and links', () => {
    render(<Footer />);

    // Check for text content using a more flexible matcher
    expect(screen.getByText((content, element) => 
      content.includes('Background image by') &&
      element.tagName.toLowerCase() === 'p'
    )).toBeInTheDocument();
    
    // Check for the photographer's name link
    const jedOwenLink = screen.getByText('Jed Owen');
    expect(jedOwenLink).toBeInTheDocument();
    expect(jedOwenLink).toHaveAttribute('href', 'https://unsplash.com/@jediahowen');

    // Check for the Unsplash link
    const unsplashLink = screen.getByText('Unsplash');
    expect(unsplashLink).toBeInTheDocument();
    expect(unsplashLink).toHaveAttribute('href', 'unsplash.com');
  });
});



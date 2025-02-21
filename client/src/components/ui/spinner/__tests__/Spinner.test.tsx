import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
    it('renders with default props', () => {
        render(<Spinner />);
        const svg = screen.getByTestId('spinner');
        expect(svg).toBeInTheDocument();
    });

    it('applies default size class', () => {
        render(<Spinner />);
        const svg = screen.getByTestId('spinner');
        expect(svg).toHaveClass('h-8', 'w-8'); // md size
    });

    it('applies default variant class', () => {
        render(<Spinner />);
        const svg = screen.getByTestId('spinner');
        expect(svg).toHaveClass('text-primary');
    });

    it('applies different size classes', () => {
        const sizes = {
            sm: ['h-4', 'w-4'],
            md: ['h-8', 'w-8'],
            lg: ['h-16', 'w-16'],
            xl: ['h-24', 'w-24'],
        };

        Object.entries(sizes).forEach(([size, classes]) => {
            const { rerender } = render(<Spinner size={size as keyof typeof sizes} />);
            const svg = screen.getByTestId('spinner');
            classes.forEach(className => {
                expect(svg).toHaveClass(className);
            });
            rerender(<></>);
        });
    });

    it('applies custom className to container', () => {
        render(<Spinner className="custom-class" />);
        const container = screen.getByTestId('spinner').parentElement;
        expect(container).toHaveClass('custom-class');
    });

    it('applies default container classes', () => {
        render(<Spinner />);
        const container = screen.getByTestId('spinner').parentElement;
        expect(container).toHaveClass('flex', 'justify-center', 'items-center', 'w-full');
    });

    it('applies animation class to svg', () => {
        render(<Spinner />);
        const svg = screen.getByTestId('spinner');
        expect(svg).toHaveClass('animate-spin');
    });

    it('renders with correct svg attributes', () => {
        render(<Spinner />);
        const svg = screen.getByTestId('spinner');
        
        expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
        expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
        expect(svg).toHaveAttribute('fill', 'none');
        expect(svg).toHaveAttribute('stroke', 'currentColor');
        expect(svg).toHaveAttribute('strokeWidth', '2');
        expect(svg).toHaveAttribute('strokeLinecap', 'round');
        expect(svg).toHaveAttribute('strokeLinejoin', 'round');
    });

    it('renders path element correctly', () => {
        render(<Spinner />);
        const path = document.querySelector('path');
        expect(path).toHaveAttribute('d', 'M21 12a9 9 0 1 1-6.219-8.56');
    });

    it('combines multiple classes correctly', () => {
        render(<Spinner size="lg" className="custom-class" />);
        const container = screen.getByTestId('spinner').parentElement;
        const svg = screen.getByTestId('spinner');
        
        expect(container).toHaveClass('flex', 'justify-center', 'items-center', 'w-full', 'custom-class');
        expect(svg).toHaveClass('animate-spin', 'h-16', 'w-16', 'text-primary');
    });

    it('maintains consistent structure with different props', () => {
        const { rerender } = render(<Spinner />);
        
        // Test with different combinations of props
        const testCases = [
            { size: 'sm' as const },
            { size: 'xl' as const, className: 'test' },
            { variant: 'primary' as const, size: 'lg' as const },
        ];

        testCases.forEach(props => {
            rerender(<Spinner {...props} />);
            const container = screen.getByTestId('spinner').parentElement;
            const svg = screen.getByTestId('spinner');
            
            expect(container).toBeInTheDocument();
            expect(svg).toBeInTheDocument();
            expect(svg.querySelector('path')).toBeInTheDocument();
        });
    });
});

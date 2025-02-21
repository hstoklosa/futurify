import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldWrapper } from '../FieldWrapper';

describe('FieldWrapper', () => {
    it('renders children correctly', () => {
        render(
            <FieldWrapper>
                <input data-testid="test-input" />
            </FieldWrapper>
        );
        
        expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
        render(
            <FieldWrapper label="Test Label">
                <input />
            </FieldWrapper>
        );
        
        expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('does not render label when not provided', () => {
        render(
            <FieldWrapper>
                <input />
            </FieldWrapper>
        );
        
        expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });

    it('shows required indicator when required prop is true', () => {
        render(
            <FieldWrapper label="Required Field" required>
                <input />
            </FieldWrapper>
        );
        
        const requiredIndicator = screen.getByText('*');
        expect(requiredIndicator).toBeInTheDocument();
        expect(requiredIndicator).toHaveClass('text-foreground/80');
    });

    it('applies default wrapper classes', () => {
        render(
            <FieldWrapper>
                <input />
            </FieldWrapper>
        );
        
        const wrapper = screen.getByTestId('field-wrapper');
        expect(wrapper).toHaveClass('w-full');
    });

    it('applies default label classes', () => {
        render(
            <FieldWrapper label="Test Label">
                <input />
            </FieldWrapper>
        );
        
        const label = screen.getByText('Test Label');
        expect(label).toHaveClass('text-foreground', 'text-sm', 'font-semibold', 'mb-2');
    });

    it('applies custom className to label', () => {
        render(
            <FieldWrapper label="Test Label" className="custom-class">
                <input />
            </FieldWrapper>
        );
        
        const label = screen.getByText('Test Label');
        expect(label).toHaveClass('custom-class');
    });

    it('wraps children in a div with correct spacing', () => {
        render(
            <FieldWrapper label="Test Label">
                <input data-testid="test-input" />
            </FieldWrapper>
        );
        
        const childrenWrapper = screen.getByTestId('test-input').parentElement;
        expect(childrenWrapper).toHaveClass('mt-1');
    });

    it('maintains correct structure with multiple children', () => {
        render(
            <FieldWrapper label="Test Label">
                <input data-testid="input-1" />
                <span data-testid="span-1">Helper text</span>
            </FieldWrapper>
        );
        
        const wrapper = screen.getByText('Test Label').closest('div');
        expect(wrapper).toHaveClass('w-full');
        
        const childrenWrapper = screen.getByTestId('input-1').parentElement;
        expect(childrenWrapper).toHaveClass('mt-1');
        expect(screen.getByTestId('span-1')).toBeInTheDocument();
    });

    it('handles empty label with required field', () => {
        render(
            <FieldWrapper required>
                <input />
            </FieldWrapper>
        );
        
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { z } from 'zod';
import Form from '../Form';

describe('Form', () => {
    // Sample schema for testing
    const testSchema = z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
    });

    const TestForm = ({
        onSubmit = vi.fn(),
        defaultValues = {},
    }) => (
        <Form<typeof testSchema>
            schema={testSchema}
            onSubmit={onSubmit}
            options={{ defaultValues }}
        >
            {(methods) => (
                <>
                    <input
                        {...methods.register('name')}
                        placeholder="Enter name"
                        data-testid="name-input"
                    />
                    {methods.formState.errors.name && (
                        <span>{methods.formState.errors.name.message}</span>
                    )}
                    <input
                        {...methods.register('email')}
                        placeholder="Enter email"
                        data-testid="email-input"
                    />
                    {methods.formState.errors.email && (
                        <span>{methods.formState.errors.email.message}</span>
                    )}
                    <button type="submit">Submit</button>
                </>
            )}
        </Form>
    );

    it('renders form with children correctly', () => {
        render(<TestForm />);
        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('applies default className', () => {
        render(<TestForm />);
        const form = screen.getByTestId('form');
        expect(form).toHaveClass('space-y-4');
    });

    it('applies custom className', () => {
        render(
            <Form schema={testSchema} onSubmit={vi.fn()} className="custom-class">
                {() => <div>Form content</div>}
            </Form>
        );
        const form = screen.getByTestId('form');
        expect(form).toHaveClass('custom-class');
    });

    it('handles valid form submission', async () => {
        const onSubmit = vi.fn();
        render(<TestForm onSubmit={onSubmit} />);

        fireEvent.change(screen.getByTestId('name-input'), {
            target: { value: 'John Doe' },
        });
        fireEvent.change(screen.getByTestId('email-input'), {
            target: { value: 'john@example.com' },
        });

        fireEvent.submit(screen.getByTestId('form'));

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    name: 'John Doe',
                    email: 'john@example.com',
                },
                expect.anything()
            );
        });
    });

    it('shows validation errors for invalid input', async () => {
        render(<TestForm />);

        fireEvent.change(screen.getByTestId('name-input'), {
            target: { value: 'a' }, // Too short
        });
        fireEvent.change(screen.getByTestId('email-input'), {
            target: { value: 'invalid-email' }, // Invalid email
        });

        fireEvent.submit(screen.getByTestId('form'));

        await waitFor(() => {
            expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        });
    });

    it('uses provided default values', () => {
        const defaultValues = {
            name: 'John Doe',
            email: 'john@example.com',
        };

        render(<TestForm defaultValues={defaultValues} />);

        expect(screen.getByTestId('name-input')).toHaveValue('John Doe');
        expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
    });

    it('prevents submission with invalid data', async () => {
        const onSubmit = vi.fn();
        render(<TestForm onSubmit={onSubmit} />);

        fireEvent.submit(screen.getByTestId('form'));

        await waitFor(() => {
            expect(onSubmit).not.toHaveBeenCalled();
        });
    });
});

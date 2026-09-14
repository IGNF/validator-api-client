import React from 'react';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../StatusBadge';

describe('StatusBadge', () => {
    it.each([
        ['waiting_for_args', 'En attente de paramètres', 'badge-warning'],
        ['pending', 'En attente', 'badge-primary'],
        ['processing', 'En cours', 'badge-primary'],
        ['finished', 'Terminée', 'badge-success'],
        ['error', 'En erreur', 'badge-danger'],
        ['archived', 'Archivée', 'badge-secondary'],
    ])('renders the expected label and class for status "%s"', (status, expectedText, expectedClass) => {
        render(<StatusBadge status={status} />);

        const badge = screen.getByText(expectedText);
        expect(badge).toHaveClass('badge', expectedClass);
    });

    it('renders an empty badge for an unknown status', () => {
        render(<StatusBadge status="unknown_status" />);

        const badge = document.querySelector('span.badge');
        expect(badge).toHaveTextContent('');
    });
});

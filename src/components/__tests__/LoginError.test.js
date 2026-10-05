import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import LoginError from '../LoginError';

describe('LoginError', () => {
    afterEach(() => {
        window.history.replaceState(null, '', '/');
    });

    it('displays nothing without error', () => {
        window.history.replaceState(null, '', '/validations');

        const { container } = render(<LoginError />);

        expect(container).toBeEmptyDOMElement();
    });

    it('displays the login error once and removes it from the URL', () => {
        window.history.replaceState(null, '', '/?login_error=1&x=2#/validation/abc');

        render(<LoginError />);

        expect(screen.getByText('La connexion a échoué. Veuillez réessayer.')).toBeInTheDocument();
        expect(window.location.search).toBe('?x=2');
        expect(window.location.hash).toBe('#/validation/abc');

        fireEvent.click(screen.getByLabelText('Fermer'));
        expect(screen.queryByText('La connexion a échoué. Veuillez réessayer.')).not.toBeInTheDocument();
    });
});

import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AuthContext from '../AuthContext';
import Navbar from '../Navbar';
import { AUTH_DISABLED } from '../../api/getCurrentUser';

const ANONYMOUS = { loading: false, enabled: true, authenticated: false, user: null, loginUrl: '/login', logoutUrl: '/logout' };
const USER = { ...ANONYMOUS, authenticated: true, user: { name: 'jdoe', email: null, is_admin: false } };
const ADMIN = { ...ANONYMOUS, authenticated: true, user: { name: 'admin', email: null, is_admin: true } };

function renderNavbar(auth, path = '/') {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <AuthContext.Provider value={auth}>
                <Navbar />
            </AuthContext.Provider>
        </MemoryRouter>
    );
}

// desktop header (the links are repeated in the mobile menu)
const desktop = () => within(document.querySelector('.header-principal--right'));
const mobile = () => within(screen.getByRole('navigation', { name: 'Menu principal (mobile)' }));

describe('Navbar', () => {
    it('hides the login when the authentication is disabled', () => {
        renderNavbar(AUTH_DISABLED);

        expect(screen.queryByText('Se connecter')).not.toBeInTheDocument();
        expect(screen.queryByText(/Se déconnecter/)).not.toBeInTheDocument();
    });

    it('offers the login, back to the current page', () => {
        window.history.pushState({}, '', '/validation/abc');

        renderNavbar(ANONYMOUS);

        expect(desktop().getByText('Se connecter')).toHaveAttribute('href', '/login?_target_path=%2Fvalidation%2Fabc');
        expect(mobile().getByText('Se connecter')).toHaveAttribute('href', '/login?_target_path=%2Fvalidation%2Fabc');
        expect(screen.queryByText('Administration')).not.toBeInTheDocument();
    });

    it('offers the logout to the users logged in', () => {
        renderNavbar(USER);

        expect(desktop().getByText('Se déconnecter (jdoe)')).toHaveAttribute('href', '/logout');
        expect(desktop().getByText('Mes validations')).toHaveAttribute('href', '/validations');
        expect(desktop().getByText('Mes validations')).toHaveClass('btn--accent');
        expect(mobile().getByText('Mes validations')).toHaveAttribute('href', '/validations');
        expect(screen.queryByText('Administration')).not.toBeInTheDocument();
    });

    it('offers the administration to the admins', () => {
        renderNavbar(ADMIN);

        expect(desktop().getByText('Administration')).toHaveAttribute('href', '/admin');
        expect(screen.queryByText('Mes validations')).not.toBeInTheDocument();
    });

    it('displays nothing while the current user is loaded', () => {
        renderNavbar({ ...ANONYMOUS, loading: true });

        expect(screen.queryByText('Se connecter')).not.toBeInTheDocument();
    });

    it('highlights the current page', () => {
        renderNavbar(ANONYMOUS, '/api');

        expect(desktop().getByText("Documentation de l'API").closest('li')).toHaveClass('is-active');
        expect(desktop().getByText('Accueil').closest('li')).not.toHaveClass('is-active');
        expect(mobile().getByText("Documentation de l'API").closest('li')).toHaveClass('is-active');
    });

    it('opens and closes the mobile menu', () => {
        const { container } = renderNavbar(ANONYMOUS);
        const toggler = screen.getByRole('button', { name: 'Ouvrir le menu' });
        expect(toggler).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(toggler);

        expect(container.querySelector('header')).toHaveClass('nav-is-open');
        expect(toggler).toHaveAttribute('aria-expanded', 'true');

        fireEvent.click(screen.getByRole('button', { name: 'Fermer le menu' }));

        expect(container.querySelector('header')).not.toHaveClass('nav-is-open');
    });

    it('closes the mobile menu when navigating', () => {
        const { container } = renderNavbar(ANONYMOUS);

        fireEvent.click(screen.getByRole('button', { name: 'Ouvrir le menu' }));
        fireEvent.click(mobile().getByText('A propos'));

        expect(container.querySelector('header')).not.toHaveClass('nav-is-open');
    });
});

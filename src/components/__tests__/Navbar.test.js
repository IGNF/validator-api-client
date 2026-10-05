import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AuthContext from '../AuthContext';
import Navbar from '../Navbar';
import { AUTH_DISABLED } from '../../api/getCurrentUser';

const ANONYMOUS = { loading: false, enabled: true, authenticated: false, user: null, loginUrl: '/login', logoutUrl: '/logout' };

function renderNavbar(auth) {
    return render(
        <MemoryRouter>
            <AuthContext.Provider value={auth}>
                <Navbar />
            </AuthContext.Provider>
        </MemoryRouter>
    );
}

describe('Navbar', () => {
    it('hides the login when the authentication is disabled', () => {
        renderNavbar(AUTH_DISABLED);

        expect(screen.queryByText('Se connecter')).not.toBeInTheDocument();
        expect(screen.queryByText(/Se déconnecter/)).not.toBeInTheDocument();
    });

    it('offers the login, back to the current page', () => {
        window.history.pushState({}, '', '/validation/abc');

        renderNavbar(ANONYMOUS);

        expect(screen.getByText('Se connecter')).toHaveAttribute('href', '/login?_target_path=%2Fvalidation%2Fabc');
        expect(screen.queryByText('Administration')).not.toBeInTheDocument();
    });

    it('offers the logout to the users logged in', () => {
        renderNavbar({ ...ANONYMOUS, authenticated: true, user: { name: 'jdoe', email: null, is_admin: false } });

        expect(screen.getByText('Se déconnecter (jdoe)')).toHaveAttribute('href', '/logout');
        expect(screen.getByText('Mes validations')).toHaveAttribute('href', '/validations');
        expect(screen.queryByText('Administration')).not.toBeInTheDocument();
    });

    it('offers the administration to the admins', () => {
        renderNavbar({ ...ANONYMOUS, authenticated: true, user: { name: 'admin', email: null, is_admin: true } });

        expect(screen.getByText('Administration')).toHaveAttribute('href', '/admin');
        expect(screen.queryByText('Mes validations')).not.toBeInTheDocument();
    });

    it('displays nothing while the current user is loaded', () => {
        renderNavbar({ ...ANONYMOUS, loading: true });

        expect(screen.queryByText('Se connecter')).not.toBeInTheDocument();
    });
});

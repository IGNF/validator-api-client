import React from 'react';
import { act, render, screen } from '@testing-library/react';

import { AuthProvider, useAuth } from '../AuthContext';
import getCurrentUser from '../../api/getCurrentUser';
import { notifyUnauthorized } from '../../api/authEvents';

jest.mock('../../api/getCurrentUser', () => {
    const actual = jest.requireActual('../../api/getCurrentUser');
    return { __esModule: true, ...actual, default: jest.fn() };
});

function CurrentUser() {
    const auth = useAuth();
    if (auth.loading) {
        return <span>loading</span>;
    }
    return <span>{auth.authenticated ? auth.user.name : 'anonymous'}</span>;
}

describe('AuthProvider', () => {
    it('loads the current user and reloads it when the session expired', async () => {
        const user = { loading: false, enabled: true, authenticated: true, user: { name: 'jdoe' }, loginUrl: '/login', logoutUrl: '/logout' };
        let resolve;
        getCurrentUser.mockReturnValueOnce(new Promise((r) => { resolve = r; }));

        render(<AuthProvider><CurrentUser /></AuthProvider>);
        expect(screen.getByText('loading')).toBeInTheDocument();

        await act(async () => resolve(user));
        expect(screen.getByText('jdoe')).toBeInTheDocument();

        getCurrentUser.mockResolvedValueOnce({ ...user, authenticated: false, user: null });
        await act(async () => notifyUnauthorized());
        expect(screen.getByText('anonymous')).toBeInTheDocument();
        expect(getCurrentUser).toHaveBeenCalledTimes(2);
    });
});

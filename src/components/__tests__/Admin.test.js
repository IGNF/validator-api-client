import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Admin from '../Admin';
import AuthContext from '../AuthContext';
import MyValidations from '../MyValidations';
import deleteValidationById from '../../api/deleteValidationById';
import listValidations from '../../api/listValidations';
import { AUTH_LOADING } from '../../api/getCurrentUser';

jest.mock('../../api/deleteValidationById');
jest.mock('../../api/listValidations');

const ANONYMOUS = { loading: false, enabled: true, authenticated: false, user: null, loginUrl: '/login', logoutUrl: '/logout' };
const USER = { ...ANONYMOUS, authenticated: true, user: { name: 'jdoe', is_admin: false } };
const ADMIN = { ...ANONYMOUS, authenticated: true, user: { name: 'admin', is_admin: true } };

const PAGE = {
    items: [
        { uid: 'abc', dataset_name: 'PLU_2026', owner: 'sub-1', owner_name: 'jdoe', status: 'finished', date_creation: '2026-10-05T10:00:00+02:00', date_finish: null, can_edit: true },
        { uid: 'def', dataset_name: 'old', owner: null, owner_name: null, status: 'archived', date_creation: '2026-01-01T10:00:00+01:00', date_finish: null, can_edit: true },
    ],
    total: 2,
    page: 1,
    limit: 20,
};

async function renderPage(Page, auth) {
    await act(async () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={auth}>
                    <Page />
                </AuthContext.Provider>
            </MemoryRouter>
        );
    });
}

beforeAll(() => {
    // used by react-data-table-component, not implemented by jsdom
    window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
    global.ResizeObserver = global.ResizeObserver || class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

beforeEach(() => {
    listValidations.mockReset();
    listValidations.mockResolvedValue(PAGE);
});

describe('Admin', () => {
    it('waits for the current user', async () => {
        await renderPage(Admin, AUTH_LOADING);

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(screen.queryByText('Accès réservé aux administrateurs')).not.toBeInTheDocument();
        expect(listValidations).not.toHaveBeenCalled();
    });

    it('is restricted to the admins', async () => {
        await renderPage(Admin, USER);

        expect(screen.getByText('Accès réservé aux administrateurs')).toBeInTheDocument();
        expect(screen.getByText("Votre compte n'a pas les droits d'administration.")).toBeInTheDocument();
        expect(listValidations).not.toHaveBeenCalled();
    });

    it('offers the login to the anonymous users', async () => {
        await renderPage(Admin, ANONYMOUS);

        expect(screen.getByText('Se connecter')).toHaveAttribute('href', expect.stringMatching(/^\/login\?_target_path=/));
    });

    it('lists the validations with their owner', async () => {
        await renderPage(Admin, ADMIN);

        expect(await screen.findByText('PLU_2026')).toHaveAttribute('href', '/validation/abc');
        expect(screen.getByText('jdoe')).toBeInTheDocument();
        expect(screen.getByText('anonyme')).toBeInTheDocument();
        expect(listValidations).toHaveBeenCalledWith({ page: 1, limit: 20, status: '' });
    });

    it('filters the validations by status', async () => {
        await renderPage(Admin, ADMIN);

        await act(async () => {
            fireEvent.change(screen.getByLabelText('Statut'), { target: { value: 'archived' } });
        });

        expect(listValidations).toHaveBeenLastCalledWith({ page: 1, limit: 20, status: 'archived' });
    });

    it('filters the validations by owner', async () => {
        await renderPage(Admin, ADMIN);

        await act(async () => {
            fireEvent.click(await screen.findByText('jdoe'));
        });
        expect(listValidations).toHaveBeenLastCalledWith({ page: 1, limit: 20, status: '', owner: 'sub-1' });
        expect(screen.getByText('Propriétaire : jdoe')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByLabelText('Retirer le filtre sur le propriétaire'));
        });
        expect(listValidations).toHaveBeenLastCalledWith({ page: 1, limit: 20, status: '' });
        expect(screen.queryByText('Propriétaire : jdoe')).not.toBeInTheDocument();
    });

    it('deletes a validation and reloads the list', async () => {
        deleteValidationById.mockResolvedValue('');
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        await renderPage(Admin, ADMIN);

        await act(async () => {
            fireEvent.click(screen.getAllByText('Supprimer')[0]);
        });

        expect(deleteValidationById).toHaveBeenCalledWith('abc');
        await waitFor(() => expect(listValidations).toHaveBeenCalledTimes(2));
    });
});

describe('MyValidations', () => {
    it('asks the anonymous users to log in', async () => {
        await renderPage(MyValidations, ANONYMOUS);

        expect(screen.getByText('Connexion requise')).toBeInTheDocument();
        expect(screen.getByText('Se connecter')).toBeInTheDocument();
        expect(listValidations).not.toHaveBeenCalled();
    });

    it('lists the validations of the user without the owner', async () => {
        listValidations.mockResolvedValue({ ...PAGE, items: [PAGE.items[0]], total: 1 });
        await renderPage(MyValidations, USER);

        expect(await screen.findByText('PLU_2026')).toBeInTheDocument();
        expect(screen.queryByText('Propriétaire')).not.toBeInTheDocument();
        expect(screen.getByText('Nouvelle validation')).toHaveAttribute('href', '/');
    });

    it('redirects the admins to the administration', async () => {
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/validations']}>
                    <AuthContext.Provider value={ADMIN}>
                        <Routes>
                            <Route path="/validations" element={<MyValidations />} />
                            <Route path="/admin" element={<span>administration</span>} />
                        </Routes>
                    </AuthContext.Provider>
                </MemoryRouter>
            );
        });

        expect(screen.getByText('administration')).toBeInTheDocument();
        expect(listValidations).not.toHaveBeenCalled();
    });

    it('displays a message without validation', async () => {
        listValidations.mockResolvedValue({ items: [], total: 0, page: 1, limit: 20 });
        await renderPage(MyValidations, USER);

        expect(await screen.findByText("Vous n'avez pas encore demandé de validation.")).toBeInTheDocument();
    });
});

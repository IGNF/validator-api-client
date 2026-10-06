import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AuthContext from '../AuthContext';
import ValidationActions from '../ValidationActions';
import deleteValidationById from '../../api/deleteValidationById';
import getAvailableDownloads from '../../api/getAvailableDownloads';

jest.mock('../../api/deleteValidationById');
jest.mock('../../api/getAvailableDownloads');

const validation = { uid: 'abc', status: 'finished' };

/**
 * Renders the actions row (inside a table) and waits for the available downloads to be read.
 */
async function renderActions(props) {
    let result;
    await act(async () => {
        result = render(
            <MemoryRouter>
                <table><tbody><ValidationActions validation={validation} {...props} /></tbody></table>
            </MemoryRouter>
        );
    });
    return result;
}

describe('ValidationActions', () => {
    it('hides the data downloads disabled by the API', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });

        await renderActions();

        expect(await screen.findByText('Rapport CSV')).toBeInTheDocument();
        expect(screen.queryByText('Fichiers sources')).not.toBeInTheDocument();
        expect(screen.queryByText('Fichiers normalisés')).not.toBeInTheDocument();
    });

    it('shows the data downloads enabled by the API', async () => {
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        await renderActions();

        expect(await screen.findByText('Fichiers sources')).toHaveAttribute(
            'href', expect.stringContaining('/validations/abc/files/source')
        );
        expect(screen.getByText('Fichiers normalisés')).toBeInTheDocument();
    });

    it('only offers the deletion of an unfinished validation', async () => {
        getAvailableDownloads.mockClear();
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        await renderActions({ validation: { uid: 'abc', status: 'archived', can_edit: true } });

        expect(screen.getByText('Supprimer')).toBeInTheDocument();
        expect(screen.queryByText('Logs du validateur')).not.toBeInTheDocument();
        expect(screen.queryByText('Rapport CSV')).not.toBeInTheDocument();
        expect(getAvailableDownloads).not.toHaveBeenCalled();
    });

    it('renders nothing for an unfinished validation of another user', async () => {
        const { container } = await renderActions({ validation: { uid: 'abc', status: 'pending', can_edit: false } });

        expect(container.querySelector('tr')).toBeNull();
    });

    it('renders nothing for a validation being processed', async () => {
        const { container } = await renderActions({ validation: { uid: 'abc', status: 'processing', can_edit: true } });

        expect(container.querySelector('tr')).toBeNull();
    });

    it('offers the reports and the logs of a finished validation', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });

        await renderActions();

        expect(await screen.findByText('Rapport PDF')).toHaveAttribute(
            'href', expect.stringContaining('/validations/abc/report?print=1')
        );
        expect(screen.getByText('Logs du validateur')).toHaveAttribute(
            'href', expect.stringContaining('/validations/abc/logs')
        );
    });

    it('offers only the logs and the deletion of a failed validation', async () => {
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        await renderActions({ validation: { uid: 'abc', status: 'error' } });

        expect(await screen.findByText('Logs du validateur')).toBeInTheDocument();
        expect(screen.getByText('Supprimer')).toBeInTheDocument();
        expect(screen.queryByText('Rapport CSV')).not.toBeInTheDocument();
        expect(screen.queryByText('Fichiers sources')).not.toBeInTheDocument();
    });

    it('offers the document-info.json when the document info is available', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });

        await renderActions({ validation: { uid: 'abc', status: 'finished', document_info: { name: 'doc' } } });

        expect(screen.getByText('document-info.json').closest('a')).toHaveAttribute('download', 'document-info.json');
    });

    it('hides the document-info.json without document info', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });

        await renderActions();

        expect(screen.queryByText('document-info.json')).not.toBeInTheDocument();
    });

    it('displays the deletion error returned by the API', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });
        deleteValidationById.mockRejectedValue(new Error('Validation is being processed, retry later'));
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        jest.spyOn(console, 'error').mockImplementation(() => {});

        await renderActions();
        fireEvent.click(await screen.findByText('Supprimer'));

        expect(await screen.findByText('Validation is being processed, retry later')).toBeInTheDocument();
    });

    it('hides the deletion to the users who are not the owner', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });

        await renderActions({ validation: { uid: 'abc', status: 'finished', can_edit: false } });

        expect(await screen.findByText('Rapport CSV')).toBeInTheDocument();
        expect(screen.queryByText('Supprimer')).not.toBeInTheDocument();
    });

    it('hides the data downloads to the users who are not the owner', async () => {
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        await renderActions({ validation: { uid: 'abc', status: 'finished', can_edit: false } });

        expect(await screen.findByText('Rapport CSV')).toBeInTheDocument();
        expect(screen.queryByText('Fichiers sources')).not.toBeInTheDocument();
        expect(screen.queryByText('Fichiers normalisés')).not.toBeInTheDocument();
    });

    it('offers the validator logs to the admins only when the authentication is enabled', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });
        const auth = { loading: false, enabled: true, authenticated: true, user: { name: 'jdoe', is_admin: false }, loginUrl: '/login', logoutUrl: '/logout' };
        const renderWith = async (value) => {
            let result;
            await act(async () => {
                result = render(
                    <MemoryRouter>
                        <AuthContext.Provider value={value}>
                            <table><tbody><ValidationActions validation={{ uid: 'abc', status: 'finished', can_edit: true }} /></tbody></table>
                        </AuthContext.Provider>
                    </MemoryRouter>
                );
            });
            return result;
        };

        const { unmount } = await renderWith(auth);
        expect(screen.getByText('Rapport CSV')).toBeInTheDocument();
        expect(screen.queryByText('Logs du validateur')).not.toBeInTheDocument();
        unmount();

        await renderWith({ ...auth, user: { name: 'admin', is_admin: true } });
        expect(screen.getByText('Logs du validateur')).toBeInTheDocument();
    });
});

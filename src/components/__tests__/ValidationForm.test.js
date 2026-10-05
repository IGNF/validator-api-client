import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import AuthContext from '../AuthContext';
import ValidationForm from '../ValidationForm';
import standards from '../../data/standards';
import uploadDataset from '../../api/uploadDataset';

jest.mock('../../api/uploadDataset');

function selectFile(name) {
    const file = new File(['PK'], name, { type: 'application/zip' });
    fireEvent.change(document.getElementById('fileInput'), { target: { files: [file] } });
}

function renderForm() {
    return render(
        <MemoryRouter>
            <ValidationForm />
        </MemoryRouter>
    );
}

describe('ValidationForm', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
        uploadDataset.mockReset();
    });

    it('warns as soon as a file with an invalid name is selected', () => {
        renderForm();

        selectFile('mon jeu de données.zip');

        expect(screen.getByText(/^Nom de fichier invalide/)).toBeInTheDocument();
    });

    it('does not upload a file with an invalid name', () => {
        renderForm();
        selectFile('..zip');

        fireEvent.submit(document.querySelector('form'));

        expect(uploadDataset).not.toHaveBeenCalled();
        expect(screen.getByText(/^Nom de fichier invalide/)).toBeInTheDocument();
    });

    it('displays the error returned by the API and does not send the parameters', async () => {
        uploadDataset.mockResolvedValue({
            ok: false,
            status: 400,
            json: () => Promise.resolve({ message: 'Dataset must be in a compressed [.zip] file' }),
        });
        renderForm();
        selectFile('PLU_2026.zip');

        fireEvent.submit(document.querySelector('form'));

        expect(await screen.findByText(
            "Problème dans l'envoi du fichier : Dataset must be in a compressed [.zip] file"
        )).toBeInTheDocument();
        expect(uploadDataset).toHaveBeenCalledTimes(1);
        expect(global.fetch).not.toHaveBeenCalled();
        // no progress after an error
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('sends the default arguments of the standard without modifying them', async () => {
        const index = standards.findIndex((standard) => standard.plugins === 'DGPR');
        const defaultArguments = { ...standards[index].defaultArguments };
        uploadDataset.mockResolvedValue({ ok: true, status: 201, json: () => Promise.resolve({ uid: 'abc' }) });
        global.fetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ uid: 'abc' }) });
        renderForm();
        fireEvent.change(document.getElementById('standardSelect'), { target: { value: String(index) } });
        selectFile('dgpr.zip');

        fireEvent.submit(document.querySelector('form'));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
        const [url, options] = global.fetch.mock.calls[0];
        expect(url).toContain('/validations/abc');
        expect(JSON.parse(options.body)).toEqual({
            ...defaultArguments,
            srs: 'EPSG:2154',
            model: standards[index].url,
            plugins: 'DGPR',
        });
        expect(standards[index].defaultArguments).toEqual(defaultArguments);
    });

    it('asks the anonymous users to log in when the authentication is enabled', () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ loading: false, enabled: true, authenticated: false, user: null, loginUrl: '/login', logoutUrl: '/logout' }}>
                    <ValidationForm />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText('Connexion requise')).toBeInTheDocument();
        expect(screen.getByText('Se connecter')).toHaveAttribute('href', expect.stringMatching(/^\/login\?_target_path=/));
        expect(document.querySelector('form')).toBeNull();
    });

    it('waits for the current user before displaying the form', () => {
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{ loading: true, enabled: false, authenticated: false, user: null }}>
                    <ValidationForm />
                </AuthContext.Provider>
            </MemoryRouter>
        );

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
        expect(document.querySelector('form')).toBeNull();
    });

    it('displays the upload progress, then waits for the server', async () => {
        let onProgress;
        let resolveUpload;
        uploadDataset.mockImplementation((file, callback) => {
            onProgress = callback;
            return new Promise((resolve) => { resolveUpload = resolve; });
        });
        let resolvePatch;
        global.fetch.mockReturnValue(new Promise((resolve) => { resolvePatch = resolve; }));
        renderForm();
        selectFile('PLU_2026.zip');

        fireEvent.submit(document.querySelector('form'));

        expect(await screen.findByText("Téléversement de l'archive...")).toBeInTheDocument();
        expect(screen.getByText('0 %')).toBeInTheDocument();

        act(() => onProgress(42));
        expect(screen.getByText('42 %')).toBeInTheDocument();
        expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42');

        act(() => onProgress(100));
        expect(screen.getByText("Réception de l'archive par le serveur...")).toBeInTheDocument();

        await act(async () => resolveUpload({ ok: true, status: 201, json: () => Promise.resolve({ uid: 'abc' }) }));
        expect(screen.getByText('Envoi des paramètres de la validation...')).toBeInTheDocument();

        await act(async () => resolvePatch({ ok: true, status: 200, json: () => Promise.resolve({ uid: 'abc' }) }));
    });
});

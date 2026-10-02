import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ValidationForm from '../ValidationForm';
import standards from '../../data/standards';

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

        expect(global.fetch).not.toHaveBeenCalled();
        expect(screen.getByText(/^Nom de fichier invalide/)).toBeInTheDocument();
    });

    it('displays the error returned by the API and does not send the parameters', async () => {
        global.fetch.mockResolvedValue({
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
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('sends the default arguments of the standard without modifying them', async () => {
        const index = standards.findIndex((standard) => standard.plugins === 'DGPR');
        const defaultArguments = { ...standards[index].defaultArguments };
        global.fetch
            .mockResolvedValueOnce({ ok: true, status: 201, json: () => Promise.resolve({ uid: 'abc' }) })
            .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ uid: 'abc' }) });
        renderForm();
        fireEvent.change(document.getElementById('standardSelect'), { target: { value: String(index) } });
        selectFile('dgpr.zip');

        fireEvent.submit(document.querySelector('form'));

        await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(2));
        const [url, options] = global.fetch.mock.calls[1];
        expect(url).toContain('/validations/abc');
        expect(JSON.parse(options.body)).toEqual({
            ...defaultArguments,
            srs: 'EPSG:2154',
            model: standards[index].url,
            plugins: 'DGPR',
        });
        expect(standards[index].defaultArguments).toEqual(defaultArguments);
    });
});

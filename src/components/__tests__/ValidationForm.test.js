import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ValidationForm from '../ValidationForm';

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
        jest.spyOn(console, 'log').mockImplementation(() => {});
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
});

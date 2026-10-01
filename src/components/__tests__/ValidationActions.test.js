import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ValidationActions from '../ValidationActions';
import getAvailableDownloads from '../../api/getAvailableDownloads';

jest.mock('../../api/getAvailableDownloads');

const validation = { uid: 'abc', status: 'finished' };

function renderActions(props) {
    return render(
        <MemoryRouter>
            <ValidationActions validation={validation} {...props} />
        </MemoryRouter>
    );
}

describe('ValidationActions', () => {
    it('hides the data downloads disabled by the API', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });

        renderActions();

        expect(await screen.findByText('Télécharger le rapport au format CSV')).toBeInTheDocument();
        expect(screen.queryByText('Télécharger les fichiers sources')).not.toBeInTheDocument();
        expect(screen.queryByText('Télécharger les fichiers normalisés')).not.toBeInTheDocument();
    });

    it('shows the data downloads enabled by the API', async () => {
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        renderActions();

        expect(await screen.findByText('Télécharger les fichiers sources')).toHaveAttribute(
            'href', expect.stringContaining('/validations/abc/files/source')
        );
        expect(screen.getByText('Télécharger les fichiers normalisés')).toBeInTheDocument();
    });

    it('renders nothing for unfinished validations', () => {
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        const { container } = renderActions({ validation: { uid: 'abc', status: 'pending' } });

        expect(container).toBeEmptyDOMElement();
    });
});

import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ValidationActions from '../ValidationActions';
import deleteValidationById from '../../api/deleteValidationById';
import getAvailableDownloads from '../../api/getAvailableDownloads';

jest.mock('../../api/deleteValidationById');
jest.mock('../../api/getAvailableDownloads');

const validation = { uid: 'abc', status: 'finished' };

/**
 * Renders the actions and waits for the available downloads to be read.
 */
async function renderActions(props) {
    let result;
    await act(async () => {
        result = render(
            <MemoryRouter>
                <ValidationActions validation={validation} {...props} />
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

    it('renders nothing for unfinished validations', async () => {
        getAvailableDownloads.mockClear();
        getAvailableDownloads.mockResolvedValue({ source: true, normalized: true });

        const { container } = await renderActions({ validation: { uid: 'abc', status: 'pending' } });

        expect(container).toBeEmptyDOMElement();
        expect(getAvailableDownloads).not.toHaveBeenCalled();
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

    it('displays the deletion error returned by the API', async () => {
        getAvailableDownloads.mockResolvedValue({ source: false, normalized: false });
        deleteValidationById.mockRejectedValue(new Error('Validation is being processed, retry later'));
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        jest.spyOn(console, 'error').mockImplementation(() => {});

        await renderActions();
        fireEvent.click(await screen.findByText('Supprimer'));

        expect(await screen.findByText('Validation is being processed, retry later')).toBeInTheDocument();
    });
});

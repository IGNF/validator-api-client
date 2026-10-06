import React from 'react';
import { render, screen } from '@testing-library/react';

import ValidationProperties from '../ValidationProperties';

jest.mock('../ValidationActions', () => () => <tr><td>Actions</td></tr>);

const validation = {
    uid: 'abc',
    status: 'finished',
    arguments: { model: 'https://example.org/cnig_PLU_2017.json', srs: 'EPSG:2154' },
    results: [],
    document_info: {
        documentModel: { name: 'cnig_PLU_2017' },
        documentExtent: [2.91614, 46.9345337, 3.0797908, 47.0850234],
    },
};

describe('ValidationProperties', () => {
    it('renders the model name linked to the model, the projection, the extent and the actions', () => {
        render(<ValidationProperties validation={validation} />);

        expect(screen.getByText('cnig_PLU_2017').closest('a')).toHaveAttribute('href', 'https://example.org/cnig_PLU_2017.json');
        expect(screen.getByText('EPSG:2154')).toBeInTheDocument();
        expect(screen.getByText(/2\.9161, 46\.9345 → 3\.0798, 47\.0850/)).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('falls back to the model url without document info', () => {
        render(<ValidationProperties validation={{ ...validation, document_info: null }} />);

        expect(screen.getByText('https://example.org/cnig_PLU_2017.json')).toBeInTheDocument();
        expect(screen.queryByText('Emprise')).not.toBeInTheDocument();
    });

    it.each([
        [{ status: 'finished', results: [{ level: 'INFO' }] }, 'Valide'],
        [{ status: 'finished', results: [{ level: 'WARNING' }] }, 'Valide avec avertissements'],
        [{ status: 'finished', results: [{ level: 'ERROR' }] }, 'Non valide'],
        [{ status: 'finished', results: [{ code: 'ZIP_ERROR' }] }, 'Non valide'],
        [{ status: 'error', results: null }, 'Erreur'],
    ])('renders the validation result %#', (props, expected) => {
        render(<ValidationProperties validation={{ ...validation, ...props }} />);

        expect(screen.getByText(expected)).toBeInTheDocument();
    });

    it('renders no result for a validation in progress', () => {
        render(<ValidationProperties validation={{ ...validation, status: 'processing', results: null }} />);

        expect(screen.queryByText(/valide/i)).not.toBeInTheDocument();
    });
});

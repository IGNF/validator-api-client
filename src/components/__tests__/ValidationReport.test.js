import React from 'react';
import { render, screen } from '@testing-library/react';

import { ErrorCode, FilePath, ReportSummary, ResultLocation, locationOf } from '../ValidationReport';

describe('FilePath', () => {
    it('renders the full path with a line break opportunity after each "/"', () => {
        const { container } = render(<FilePath path="Pieces_ecrites/1_Rapport/rapport.pdf" />);

        const span = container.querySelector('.validation-report__file');
        expect(span.textContent).toBe('Pieces_ecrites/1_Rapport/rapport.pdf');
        expect(span).toHaveAttribute('title', 'Pieces_ecrites/1_Rapport/rapport.pdf');
        expect(span.querySelectorAll('wbr')).toHaveLength(2);
    });

    it('renders nothing without file', () => {
        const { container } = render(<FilePath path={null} />);

        expect(container).toBeEmptyDOMElement();
    });
});

describe('ErrorCode', () => {
    it('renders the full code with a line break opportunity after each "_"', () => {
        const { container } = render(<ErrorCode code="DGPR_ISO_HT_FUSION" />);

        const span = container.querySelector('.validation-report__code');
        expect(span.textContent).toBe('DGPR_ISO_HT_FUSION');
        expect(span.querySelectorAll('wbr')).toHaveLength(3);
    });
});

describe('ResultLocation', () => {
    const databaseError = {
        file: 'TRI_BEZIERS/',
        fileModel: 'N_prefixTri_INONDABLE_suffixInond_S_ddd',
        featureId: 'SIN_1000',
    };

    it('renders the table and the object of the errors attached to the document directory', () => {
        render(<ResultLocation row={databaseError} />);

        expect(screen.getByText('N_prefixTri_INONDABLE_suffixInond_S_ddd')).toHaveAttribute('title', 'TRI_BEZIERS/');
        expect(screen.getByText('objet SIN_1000')).toBeInTheDocument();
        expect(locationOf(databaseError)).toBe('N_prefixTri_INONDABLE_suffixInond_S_ddd');
    });

    it('renders the file when the error is attached to a file', () => {
        const row = { file: 'PLU/Donnees_geographiques/ZONE_URBA.dbf', fileModel: 'ZONE_URBA', featureId: '12' };
        const { container } = render(<ResultLocation row={row} />);

        expect(container.textContent).toBe('PLU/Donnees_geographiques/ZONE_URBA.dbf');
        expect(locationOf(row)).toBe('PLU/Donnees_geographiques/ZONE_URBA.dbf');
    });

    it('renders the directory without table', () => {
        const { container } = render(<ResultLocation row={{ file: 'TRI_BEZIERS/', fileModel: '' }} />);

        expect(container.textContent).toBe('TRI_BEZIERS/');
    });
});

describe('ReportSummary', () => {
    it('counts the results by level', () => {
        render(<ReportSummary results={[
            { level: 'ERROR' }, { level: 'ERROR' },
            // zip pre-validation errors have no level
            { code: 'NO_FILE' },
            { level: 'WARNING' },
        ]} />);

        expect(screen.getByText('3 erreurs')).toHaveClass('badge-danger');
        expect(screen.getByText('1 avertissement')).toHaveClass('badge-warning');
        expect(screen.queryByText(/info/)).not.toBeInTheDocument();
    });

    it('tells when there is no result', () => {
        render(<ReportSummary results={[]} />);

        expect(screen.getByText('Aucune anomalie')).toBeInTheDocument();
    });
});

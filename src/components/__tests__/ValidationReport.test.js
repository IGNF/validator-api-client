import React from 'react';
import { render, screen } from '@testing-library/react';

import ValidationReport, { ErrorCode, FilePath, ReportSummary, ResultLocation, locationOf } from '../ValidationReport';

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

    it('renders the table of the errors attached to the document directory', () => {
        const { container } = render(<ResultLocation row={databaseError} />);

        expect(screen.getByText('N_prefixTri_INONDABLE_suffixInond_S_ddd')).toHaveAttribute('title', 'TRI_BEZIERS/');
        // the feature id has its own column
        expect(container.textContent).toBe('N_prefixTri_INONDABLE_suffixInond_S_ddd');
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

describe('ValidationReport', () => {
    beforeAll(() => {
        // used by react-data-table-component, missing in jsdom
        window.matchMedia = window.matchMedia || (() => ({
            matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}
        }));
    });

    it('renders the id of the feature in a dedicated column', () => {
        const validation = {
            results: [
                { level: 'ERROR', file: 'TRI_BEZIERS/', fileModel: 'N_TRI_S', featureId: 'SIN_1000', code: 'DGPR_A', message: 'erreur base' },
                { level: 'WARNING', file: 'PLU/ZONE_URBA.dbf', fileModel: 'ZONE_URBA', featureId: '12', code: 'PLU_B', message: 'erreur fichier' },
                { code: 'NO_FILE', message: 'erreur zip' },
            ]
        };
        render(<ValidationReport validation={validation} />);

        expect(screen.getByText('Objet')).toBeInTheDocument();
        expect(screen.getByText('SIN_1000')).toHaveClass('validation-report__feature');
        expect(screen.getByText('12')).toHaveClass('validation-report__feature');
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

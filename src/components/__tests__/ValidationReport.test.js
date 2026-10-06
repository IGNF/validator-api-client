import React from 'react';
import { render, screen } from '@testing-library/react';

import { FilePath, ReportSummary } from '../ValidationReport';

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

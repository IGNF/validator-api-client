import React from 'react';
import { render, screen } from '@testing-library/react';

import DocumentInfo from '../DocumentInfo';

describe('DocumentInfo', () => {
    it('renders nothing without document info (normalize disabled)', () => {
        const { container } = render(<DocumentInfo documentInfo={null} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders the document model, title and files', () => {
        render(<DocumentInfo documentInfo={{
            name: '50545_CC_20140101',
            documentModel: { name: 'cnig_CC_2014' },
            metadata: { title: 'Carte Communale de Saint-Romphaire' },
            files: [
                { type: 'table', modelName: 'DOC_URBA', path: 'DOC_URBA.dbf', totalFeatures: 0 },
                { type: 'pdf', modelName: 'PIECES_ECRITES', path: 'Pieces_ecrites/reglement.pdf' },
            ],
        }} />);

        expect(screen.getByText('50545_CC_20140101')).toBeInTheDocument();
        expect(screen.getByText('cnig_CC_2014')).toBeInTheDocument();
        expect(screen.getByText('Carte Communale de Saint-Romphaire')).toBeInTheDocument();
        expect(screen.getByText('DOC_URBA.dbf')).toBeInTheDocument();
        expect(screen.getByText('Pieces_ecrites/reglement.pdf')).toBeInTheDocument();
    });
});

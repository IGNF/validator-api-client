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

    it('renders counts, extents, GeoPackage tables and tags', () => {
        render(<DocumentInfo documentInfo={{
            name: '30014_PLU_20171013',
            documentExtent: [2.91614, 46.9345337, 3.0797908, 47.0850234],
            tags: { idurba: '30014_PLU_20171013' },
            files: [
                { type: 'table', modelName: 'ZONE_URBA', path: 'ZONE_URBA.dbf', totalFeatures: 1222, boundingBox: [2.9, 46.9, 3.0, 47.0] },
                { type: 'table', modelName: 'DATA', path: 'data.gpkg', totalFeatures: 5, tables: {
                    zone: { totalFeatures: 5, boundingBox: [1, 2, 3, 4] },
                } },
                { type: 'pdf', modelName: 'PIECES_ECRITES', path: 'reglement.pdf' },
            ],
        }} />);

        // 1222 + 5 features, formatted for fr-FR
        expect(screen.getByText('entités').previousSibling.textContent.replace(/\s/g, '')).toBe('1227');
        expect(screen.getByText('idurba')).toBeInTheDocument();
        expect(screen.getByText('zone')).toBeInTheDocument();
        expect(screen.getByText(/2\.9161, 46\.9345 → 3\.0798, 47\.0850/)).toBeInTheDocument();
        expect(screen.getAllByText('carte')[0].closest('a')).toHaveAttribute(
            'href', expect.stringContaining('minlon=2.91614')
        );
        expect(screen.getByText('Autres fichiers (1)')).toBeInTheDocument();
    });

    it('renders the metadata and offers the raw JSON', () => {
        render(<DocumentInfo documentInfo={{
            name: 'doc',
            files: [],
            metadata: {
                title: 'Titre',
                abstract: 'Un résumé',
                referenceSystemIdentifier: { code: 'EPSG:2154' },
                locators: [{ url: 'https://example.org/wms', name: 'Service WMS', protocol: 'OGC:WMS' }],
            },
        }} />);

        expect(screen.getByText('Un résumé')).toBeInTheDocument();
        expect(screen.getByText('EPSG:2154')).toBeInTheDocument();
        expect(screen.getByText('Service WMS')).toHaveAttribute('href', 'https://example.org/wms');
        expect(screen.getByText('document-info.json').closest('a')).toHaveAttribute('download', 'document-info.json');
    });
});

import React from 'react';
import { render } from '@testing-library/react';

import { FilePath } from '../ValidationReport';

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

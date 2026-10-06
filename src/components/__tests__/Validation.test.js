import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Validation, { POLLING_DELAYS } from '../Validation';
import getValidationById from '../../api/getValidationById';

jest.mock('../../api/getValidationById');
jest.mock('../ValidationReport', () => () => null);
jest.mock('../DocumentInfo', () => () => null);
jest.mock('../ValidationProperties', () => () => null);

async function renderValidation() {
    await act(async () => {
        render(
            <MemoryRouter initialEntries={['/validation/abc']}>
                <Routes>
                    <Route path="/validation/:uid" element={<Validation />} />
                </Routes>
            </MemoryRouter>
        );
    });
}

describe('Validation', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        getValidationById.mockReset();
    });

    afterEach(() => {
        jest.useRealTimers();
        delete document.hidden;
    });

    function setHidden(hidden) {
        Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
        document.dispatchEvent(new Event('visibilitychange'));
    }

    it('displays the loading until the validation is received', async () => {
        getValidationById.mockReturnValue(new Promise(() => {}));

        await renderValidation();

        expect(screen.getByText('Chargement...')).toBeInTheDocument();
    });

    it('slows down the polling while the status does not change', async () => {
        getValidationById.mockResolvedValue({ uid: 'abc', status: 'processing', arguments: {} });

        await renderValidation();
        expect(getValidationById).toHaveBeenCalledTimes(1);

        let expectedCalls = 1;
        for (const delay of POLLING_DELAYS) {
            await act(async () => jest.advanceTimersByTime(delay - 1));
            expect(getValidationById).toHaveBeenCalledTimes(expectedCalls);
            await act(async () => jest.advanceTimersByTime(1));
            expect(getValidationById).toHaveBeenCalledTimes(++expectedCalls);
        }
        // the last delay is repeated
        await act(async () => jest.advanceTimersByTime(POLLING_DELAYS[POLLING_DELAYS.length - 1]));
        expect(getValidationById).toHaveBeenCalledTimes(expectedCalls + 1);
    });

    it('pauses the polling while the page is hidden', async () => {
        getValidationById.mockResolvedValue({ uid: 'abc', status: 'processing', arguments: {} });

        await renderValidation();
        act(() => setHidden(true));
        await act(async () => jest.advanceTimersByTime(60000));
        expect(getValidationById).toHaveBeenCalledTimes(1);

        // refreshed as soon as the page is visible again
        await act(async () => setHidden(false));
        expect(getValidationById).toHaveBeenCalledTimes(2);
    });

    it('polls the validation until it is finished', async () => {
        getValidationById
            .mockResolvedValueOnce({ uid: 'abc', status: 'pending', arguments: {} })
            .mockResolvedValue({ uid: 'abc', status: 'finished', arguments: {} });

        await renderValidation();
        await act(async () => jest.advanceTimersByTime(5000));

        expect(getValidationById).toHaveBeenCalledTimes(2);
    });

    it.each(['archived', 'waiting_for_args'])('does not poll a validation %s', async (status) => {
        getValidationById.mockResolvedValue({ uid: 'abc', status, arguments: {} });

        await renderValidation();
        await act(async () => jest.advanceTimersByTime(5000));

        expect(getValidationById).toHaveBeenCalledTimes(1);
    });
});

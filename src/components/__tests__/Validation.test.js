import React from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import Validation from '../Validation';
import getValidationById from '../../api/getValidationById';

jest.mock('../../api/getValidationById');
jest.mock('../ValidationReport', () => () => null);
jest.mock('../ValidationActions', () => () => null);
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

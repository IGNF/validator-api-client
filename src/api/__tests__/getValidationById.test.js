import getValidationById from '../getValidationById';

describe('getValidationById', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    it('returns the parsed JSON body on success', async () => {
        const payload = { uid: 'abc', status: 'finished' };
        global.fetch.mockResolvedValue({
            status: 200,
            json: () => Promise.resolve(payload),
        });

        const data = await getValidationById('abc');

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/validations/abc'));
        expect(data).toEqual(payload);
    });

    it('throws the parsed JSON body when the response is not a 200', async () => {
        const errorPayload = { message: 'not found' };
        global.fetch.mockResolvedValue({
            status: 404,
            json: () => Promise.resolve(errorPayload),
        });

        await expect(getValidationById('missing')).rejects.toEqual(errorPayload);
    });
});

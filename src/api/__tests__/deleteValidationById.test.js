import deleteValidationById from '../deleteValidationById';

describe('deleteValidationById', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    it('resolves when the API confirms deletion with a 204', async () => {
        global.fetch.mockResolvedValue({
            status: 204,
            text: () => Promise.resolve(''),
        });

        await expect(deleteValidationById('abc')).resolves.toBe('');

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/validations/abc'),
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    it('throws the message returned by the API when the deletion is not confirmed', async () => {
        global.fetch.mockResolvedValue({
            status: 409,
            text: () => Promise.resolve(JSON.stringify({ message: 'Validation is being processed, retry later' })),
        });

        await expect(deleteValidationById('abc')).rejects.toThrow('Validation is being processed, retry later');
    });

    it('throws the HTTP status when the error body is not JSON', async () => {
        global.fetch.mockResolvedValue({
            status: 502,
            text: () => Promise.resolve('Bad Gateway'),
        });

        await expect(deleteValidationById('abc')).rejects.toThrow('Erreur HTTP 502');
    });
});

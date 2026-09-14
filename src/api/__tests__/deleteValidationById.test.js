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

    it('throws the response body when the deletion is not confirmed', async () => {
        global.fetch.mockResolvedValue({
            status: 404,
            text: () => Promise.resolve('not found'),
        });

        await expect(deleteValidationById('missing')).rejects.toBe('not found');
    });
});

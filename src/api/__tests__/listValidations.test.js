import listValidations from '../listValidations';

describe('listValidations', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    it('sends the filters and the pagination', async () => {
        const page = { items: [{ uid: 'abc' }], total: 1, page: 2, limit: 20 };
        global.fetch.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve(page) });

        await expect(listValidations({ page: 2, limit: 20, status: 'finished', owner: '' })).resolves.toEqual(page);

        expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/validations\/\?page=2&limit=20&status=finished$/));
    });

    it('throws an explicit message for the non admin users', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            status: 403,
            json: () => Promise.resolve({ message: 'Only the admins can list the validations' }),
        });

        await expect(listValidations()).rejects.toThrow('Action non autorisée (Only the admins can list the validations)');
    });
});

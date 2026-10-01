import getAvailableDownloads, { resetAvailableDownloads } from '../getAvailableDownloads';

const SPECS_WITH_DOWNLOADS = `
paths:
  /api/validations/{uid}/results.csv:
  /api/validations/{uid}/files/source:
  /api/validations/{uid}/files/normalized:
`;

describe('getAvailableDownloads', () => {
    beforeEach(() => {
        resetAvailableDownloads();
        global.fetch = jest.fn();
        jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('enables downloads listed in the API specification', async () => {
        global.fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(SPECS_WITH_DOWNLOADS) });

        await expect(getAvailableDownloads()).resolves.toEqual({ source: true, normalized: true });
    });

    it('disables downloads removed from the API specification', async () => {
        global.fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve('paths:\n  /api/validations/{uid}/results.csv:\n') });

        await expect(getAvailableDownloads()).resolves.toEqual({ source: false, normalized: false });
    });

    it('disables downloads if the specification can not be read', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 500 });

        await expect(getAvailableDownloads()).resolves.toEqual({ source: false, normalized: false });
    });

    it('reads the specification only once', async () => {
        global.fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(SPECS_WITH_DOWNLOADS) });

        await getAvailableDownloads();
        await getAvailableDownloads();

        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});

import getAvailableDownloads, { resetAvailableDownloads } from '../getAvailableDownloads';

const SPECS_WITH_DOWNLOADS = `
paths:
  /api/validations/{uid}/results.csv:
    get:
      summary: "Rapport"
  /api/validations/{uid}/files/source:
    get:
      summary: "Télécharger les données de source"
  /api/validations/{uid}/files/normalized:
    get:
      summary: "Télécharger les données normalisées"
`;

const SPECS_WITH_DISABLED_DOWNLOADS = `
paths:
  /api/validations/{uid}/results.csv:
    get:
      summary: "Rapport"
  /api/validations/{uid}/files/source:
    get:
      summary: "[Désactivé] Télécharger les données de source"
      deprecated: true
      x-disabled: true
  /api/validations/{uid}/files/normalized:
    get:
      summary: "[Désactivé] Télécharger les données normalisées"
      deprecated: true
      x-disabled: true
`;

describe('getAvailableDownloads', () => {
    beforeEach(() => {
        resetAvailableDownloads();
        global.fetch = jest.fn();
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    it('enables downloads listed in the API specification', async () => {
        global.fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(SPECS_WITH_DOWNLOADS) });

        await expect(getAvailableDownloads()).resolves.toEqual({ source: true, normalized: true });
    });

    it('disables downloads flagged as disabled in the API specification', async () => {
        global.fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(SPECS_WITH_DISABLED_DOWNLOADS) });

        await expect(getAvailableDownloads()).resolves.toEqual({ source: false, normalized: false });
    });

    it('disables downloads removed from the API specification (older API versions)', async () => {
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

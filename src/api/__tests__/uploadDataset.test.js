import uploadDataset from '../uploadDataset';

/**
 * Minimal XMLHttpRequest (jsdom would really send the request).
 */
class FakeXhr {
    constructor() {
        this.listeners = {};
        this.uploadListeners = {};
        this.upload = { addEventListener: (name, fn) => { this.uploadListeners[name] = fn; } };
        FakeXhr.last = this;
    }
    addEventListener(name, fn) { this.listeners[name] = fn; }
    open(method, url) { this.method = method; this.url = url; }
    send(body) { this.body = body; }
    respond(status, body) {
        this.status = status;
        this.responseText = body;
        this.listeners.load();
    }
}

describe('uploadDataset', () => {
    const originalXhr = global.XMLHttpRequest;

    beforeEach(() => {
        global.XMLHttpRequest = FakeXhr;
    });

    afterEach(() => {
        global.XMLHttpRequest = originalXhr;
    });

    it('sends the file and reports the progress', async () => {
        const file = new File(['PK'], 'PLU_2026.zip', { type: 'application/zip' });
        const onProgress = jest.fn();

        const promise = uploadDataset(file, onProgress);
        const xhr = FakeXhr.last;
        expect(xhr.method).toBe('POST');
        expect(xhr.url).toMatch(/\/validations\/$/);
        expect(xhr.body.get('dataset')).toBe(file);

        xhr.uploadListeners.progress({ lengthComputable: true, loaded: 1, total: 4 });
        expect(onProgress).toHaveBeenCalledWith(25);

        xhr.respond(201, JSON.stringify({ uid: 'abc' }));
        const response = await promise;
        expect(response.ok).toBe(true);
        expect(response.status).toBe(201);
        await expect(response.json()).resolves.toEqual({ uid: 'abc' });
    });

    it('returns the error responses (read by readJsonResponse)', async () => {
        const promise = uploadDataset(new File(['PK'], 'x.zip'));
        FakeXhr.last.respond(401, 'not json');

        const response = await promise;
        expect(response.ok).toBe(false);
        await expect(response.json()).rejects.toThrow();
    });

    it('rejects on network error', async () => {
        const promise = uploadDataset(new File(['PK'], 'x.zip'));
        FakeXhr.last.listeners.error();

        await expect(promise).rejects.toThrow('Erreur réseau');
    });
});

import readJsonResponse from '../readJsonResponse';
import { UNAUTHORIZED_EVENT } from '../authEvents';

describe('readJsonResponse', () => {
    it('returns the JSON body on success', async () => {
        const response = { ok: true, status: 201, json: () => Promise.resolve({ uid: 'abc' }) };

        await expect(readJsonResponse(response)).resolves.toEqual({ uid: 'abc' });
    });

    it('throws the message returned by the API on error', async () => {
        const response = { ok: false, status: 400, json: () => Promise.resolve({ message: 'Dataset filename is not valid' }) };

        await expect(readJsonResponse(response)).rejects.toThrow('Dataset filename is not valid');
    });

    it('throws the HTTP status if the error body is not JSON', async () => {
        const response = { ok: false, status: 502, json: () => Promise.reject(new SyntaxError('Unexpected token')) };

        await expect(readJsonResponse(response)).rejects.toThrow('Erreur HTTP 502');
    });

    it('notifies the application when the session expired (401)', async () => {
        const listener = jest.fn();
        window.addEventListener(UNAUTHORIZED_EVENT, listener);
        const response = { ok: false, status: 401, json: () => Promise.resolve({ message: 'Authentication required' }) };

        await expect(readJsonResponse(response)).rejects.toThrow('Vous devez vous connecter pour effectuer cette action');
        expect(listener).toHaveBeenCalledTimes(1);
        window.removeEventListener(UNAUTHORIZED_EVENT, listener);
    });
});

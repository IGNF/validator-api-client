import getCurrentUser, { AUTH_DISABLED } from '../getCurrentUser';

function mockResponse(status, body) {
    global.fetch.mockResolvedValue({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(body),
    });
}

describe('getCurrentUser', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    it('returns the user logged in', async () => {
        mockResponse(200, {
            enabled: true,
            authenticated: true,
            user: { name: 'jdoe', email: 'jdoe@example.org', is_admin: false },
            login_url: '/login',
            logout_url: '/logout',
        });

        await expect(getCurrentUser()).resolves.toEqual({
            loading: false,
            enabled: true,
            authenticated: true,
            user: { name: 'jdoe', email: 'jdoe@example.org', is_admin: false },
            loginUrl: '/login',
            logoutUrl: '/logout',
        });
        expect(global.fetch).toHaveBeenCalledWith(expect.stringMatching(/\/me$/));
    });

    it('returns an anonymous user', async () => {
        mockResponse(200, { enabled: true, authenticated: false, user: null, login_url: '/login', logout_url: '/logout' });

        const auth = await getCurrentUser();

        expect(auth.enabled).toBe(true);
        expect(auth.authenticated).toBe(false);
        expect(auth.user).toBeNull();
    });

    it('disables the authentication when disabled by the API', async () => {
        mockResponse(200, { enabled: false, authenticated: false, user: null, login_url: null, logout_url: null });

        await expect(getCurrentUser()).resolves.toEqual(AUTH_DISABLED);
    });

    it('disables the authentication with an older API (404)', async () => {
        mockResponse(404, { message: 'No route found' });

        await expect(getCurrentUser()).resolves.toEqual(AUTH_DISABLED);
    });
});

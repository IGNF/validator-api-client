import config from '../config';

/**
 * Authentication disabled (OIDC_ENABLED=0 or API without /api/me).
 */
export const AUTH_DISABLED = {
    loading: false,
    enabled: false,
    authenticated: false,
    user: null,
    loginUrl: null,
    logoutUrl: null
};

/**
 * Current user not loaded yet.
 */
export const AUTH_LOADING = { ...AUTH_DISABLED, loading: true };

/**
 * Returns the current user (GET /api/me), the session cookie being sent by the browser
 * (the API must be on the same origin, see docs/integration-application.md).
 *
 * @returns {Promise<{enabled: boolean, authenticated: boolean, user: ?{name: string, email: ?string, is_admin: boolean}, loginUrl: ?string, logoutUrl: ?string}>}
 */
async function getCurrentUser() {
    const response = await fetch(`${config.validatorApiUrl}/me`);
    if (!response.ok) {
        // older API (404) : no authentication
        return AUTH_DISABLED;
    }
    const data = await response.json();
    if (!data.enabled) {
        return AUTH_DISABLED;
    }
    return {
        loading: false,
        enabled: true,
        authenticated: !!data.authenticated,
        user: data.user || null,
        loginUrl: data.login_url,
        logoutUrl: data.logout_url
    };
}

export default getCurrentUser;

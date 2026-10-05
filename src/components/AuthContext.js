import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import getCurrentUser, { AUTH_DISABLED, AUTH_LOADING } from '../api/getCurrentUser';
import { UNAUTHORIZED_EVENT } from '../api/authEvents';

/**
 * Current user (see getCurrentUser), authentication disabled by default (outside of AuthProvider).
 */
const AuthContext = createContext(AUTH_DISABLED);

/**
 * Loads the current user for the application, and reloads it when the API answers 401 (session expired).
 */
export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(AUTH_LOADING);

    const refresh = useCallback(() => {
        return getCurrentUser().then(setAuth).catch((error) => {
            console.error(error);
            setAuth(AUTH_DISABLED);
        });
    }, []);

    useEffect(() => {
        refresh();
        window.addEventListener(UNAUTHORIZED_EVENT, refresh);
        return () => {
            window.removeEventListener(UNAUTHORIZED_EVENT, refresh);
        };
    }, [refresh]);

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

/**
 * Login URL bringing the user back to the current page.
 *
 * @param {{loginUrl: string}} auth
 */
export function getLoginHref(auth) {
    const target = window.location.pathname + window.location.search + window.location.hash;
    return `${auth.loginUrl}?_target_path=${encodeURIComponent(target)}`;
}

export default AuthContext;

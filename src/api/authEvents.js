/**
 * Event dispatched when the API answers 401 (session expired) : the current user is reloaded (see AuthProvider).
 */
export const UNAUTHORIZED_EVENT = 'validator:unauthorized';

export function notifyUnauthorized() {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}

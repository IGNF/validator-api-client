import config from '../config';
import readJsonResponse from './readJsonResponse';

/**
 * Lists the validations, most recent first (admins only).
 *
 * @param {object} params
 * @param {number} [params.page] starting from 1
 * @param {number} [params.limit] max 100
 * @param {string} [params.status] see StatusBadge
 * @param {string} [params.owner] identifier (sub) of the owner
 * @returns {Promise<{items: object[], total: number, page: number, limit: number}>}
 */
async function listValidations(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([name, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            query.set(name, value);
        }
    });
    const response = await fetch(`${config.validatorApiUrl}/validations/?${query.toString()}`);
    return readJsonResponse(response);
}

export default listValidations;

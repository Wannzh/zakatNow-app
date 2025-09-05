// src/api/auth.js
import api from './axios';

/**
 * Melakukan login ke backend.
 * @param {Object} payload - data login
 * @param {string} payload.email
 * @param {string} payload.password
 * @returns {Promise} axios response { token, user, ... }
 */
export const login = (payload) => {
  return api.post('/auth/login', payload);
};

/**
 * Registrasi user baru.
 * @param {Object} payload - data registrasi
 * @param {string} payload.email
 * @param {string} payload.password
 * @param {string} payload.username
 * @param {string} [payload.fullName]
 * @param {string} [payload.phoneNumber]
 * @param {string} [payload.address]
 * @returns {Promise} axios response
 */
export const register = (payload) => {
  return api.post('/auth/register', payload);
};

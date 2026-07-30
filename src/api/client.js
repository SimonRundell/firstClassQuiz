import axios from 'axios';
import { loadConfig } from './config';

/**
 * Returns a shared axios instance configured with the API base URL from
 * config.json and credentialed for the admin session cookie.
 *
 * @returns {Promise<import('axios').AxiosInstance>}
 */
let cachedClient = null;

export async function getClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const { apiBaseUrl } = await loadConfig();

  cachedClient = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true,
  });

  return cachedClient;
}

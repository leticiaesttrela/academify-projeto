import {
  storageTokenGet
} from '@/src/storage/storageToken';
import { API_URL } from '@env';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const api = axios.create({
  baseURL: API_URL.concat('/api/v1'),
});

api.interceptors.request.use(async (config) => {
  const token = await storageTokenGet();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosRetry(api, { retries: 4 });

export { api };


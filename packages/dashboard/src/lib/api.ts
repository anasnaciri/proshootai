import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (localStorage, cookies, etc.)
    const token = sessionStorage.getItem(
      `oidc.user:${import.meta.env.VITE_COGNITO_AUTHORITY}:${import.meta.env.VITE_COGNITO_CLIENT_ID}`,
    );

    if (token) {
      config.headers.Authorization = `${JSON.parse(token).id_token}`;
    }

    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  },
);

export const api = {
  get: async ({ url, config = {} }: { url: string; config?: any }) => {
    const response = await axiosInstance.get(url, config);
    return response.data;
  },

  post: async ({
    url,
    data,
    config = {},
  }: {
    url: string;
    data: any;
    config?: any;
  }) => {
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  },

  put: async ({
    url,
    data,
    config = {},
  }: {
    url: string;
    data: any;
    config?: any;
  }) => {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  },

  delete: async ({ url, config = {} }: { url: string; config?: any }) => {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  },

  patch: async ({
    url,
    data,
    config = {},
  }: {
    url: string;
    data: any;
    config?: any;
  }) => {
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  },
};

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { commonConstants } from '../components/Constants/CommonConstants';

export const baseURL = import.meta.env.VITE_BASE_URL as string;

export const createAxiosInstance = (baseURL: string): AxiosInstance => {
    const Bearer = 'Bearer';
    const instance = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        if (config && config.headers) {
            const authToken = sessionStorage.getItem(commonConstants.authToken);
            if (authToken) {
                config.headers['Authorization'] = `${Bearer} ${authToken}`;
            }
        }
        return config;
    });

    return instance;
};

export const createNonAuthAxiosInstance = (
    baseURL: string,
    contentType: string = 'application/json'
): AxiosInstance => {
    return axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': contentType,
        },
    });
};

export const createAuthAxiosInstance = (baseURL: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        if (config && config.headers) {
            const authToken = sessionStorage.getItem(commonConstants.authToken);
            if (authToken) {
                config.headers['Authorization'] = `Bearer ${authToken}`;
            }
        }
        return config;
    });

    return instance;
};

export const authData = createAxiosInstance(baseURL);
export const nonAuthData = createNonAuthAxiosInstance(baseURL);
export const multipartData = createNonAuthAxiosInstance(baseURL, 'multipart/form-data');
export const multipartDataWithToken = createAuthAxiosInstance(baseURL);

import axios from 'axios';
import { useLoadingStore } from '@/stores';

// Add a request interceptor
axios.interceptors.request.use(
    function (config: any) {
        // Do something before request is sent
        let token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        } else {
            config.headers.Authorization = '';
        }
        return config;
    },
    function (error: any) {
        // Do something with request error
        useLoadingStore().setLoading(false);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response: any) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error: any) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        useLoadingStore().setLoading(false);
        return Promise.reject(error);
    }
);

export class BaseApi {
    controllerName: string;
    API_URL: string;
    config: { headers: { 'Content-Type': string } };
    constructor(controllerName = '') {
        this.controllerName = controllerName;
        this.API_URL =
            `${import.meta.env.VITE_BASE_URL}/api/` + this.controllerName;
        this.config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    async getById(id: number) {
        let res = this.get(this.API_URL + `/${id}`);
        return res;
    }

    async get(url: string) {
        try {
            let response = await axios.get(url, this.config);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async getFile(url: string) {
        try {
            let response = await axios.get(url, {
                responseType: 'blob',
            });
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post(url: string, param: object) {
        try {
            let response = await axios.post(url, param, this.config);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put(url: string, param: object) {
        try {
            let response = await axios.put(url, param, this.config);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete(url: string) {
        try {
            let response = await axios.delete(url, this.config);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    handleResponse(response: any) {
        return response;
    }

    handleError(response: any) {
        return {
            status: response.response.status,
            data: response.response.data,
        };
    }
}

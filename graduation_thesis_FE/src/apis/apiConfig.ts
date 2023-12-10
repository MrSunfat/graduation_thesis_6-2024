import axios from 'axios';
import { useLoadingStore } from '@/stores';

const loadingStore = useLoadingStore();
// Add a request interceptor
axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        let token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        } else {
            config.headers.Authorization = '';
        }
        return config;
    },
    function (error) {
        // Do something with request error
        loadingStore.setLoading(false);
        return Promise.reject(error);
    }
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        loadingStore.setLoading(false);
        return Promise.reject(error);
    }
);

import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;

axios.interceptors.response.use(
    r => r,
    err => {
        if (!err.response) return Promise.reject(err);
        const { status, data } = err.response;
        if (status === 401) {
            Inertia.visit(route('login'));
            return Promise.reject(err);
        }
        if (status === 422 && data?.errors) {
            // Rejeter avec un format lisible pour les composants
            return Promise.reject({ validation: data.errors, original: err });
        }
        return Promise.reject(err);
    }
);

window.axios = axios;
export default axios;
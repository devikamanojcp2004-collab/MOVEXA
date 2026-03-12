import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,  // Sends HTTP-only cookie on every request automatically
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

import axios from "axios";

const CallApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

const CallApiWithAuth = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

CallApiWithAuth.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(
            process.env.NEXT_PUBLIC_SESSION_KEY!
        );
        const user = localStorage.getItem(process.env.NEXT_PUBLIC_USER_KEY!);
        if (!token || !user) {
            window.location.href = "/login";
            return Promise.reject(new Error("Unauthorized"));
        }

        const user_id = JSON.parse(user).user_id;
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["Client-Id"] = user_id;
        return config;
    },
    (error) => Promise.reject(error)
);

CallApiWithAuth.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status && error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export { CallApi, CallApiWithAuth };

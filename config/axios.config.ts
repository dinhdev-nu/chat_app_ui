import axios from "axios";


const CallApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
})

export default CallApi
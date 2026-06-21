import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5063"
})

export default api;

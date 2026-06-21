import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5267"
})

export default api;

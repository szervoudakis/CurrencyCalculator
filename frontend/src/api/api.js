import axios from "axios";

const api = axios.create({
  baseURL: "/api", // proxy το στέλνει στο symfony_nginx
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

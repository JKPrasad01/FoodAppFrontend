import axios from "axios";

const createInstance = ({ baseUrl }) => {
  return axios.create({
    baseURL: baseUrl,

    withCredentials: true,
  });
};

export const uniAPi = createInstance({
  baseUrl: import.meta.env.VITE_BASE_URL || "http://localhost:8080",
});

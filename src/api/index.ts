import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = process.env.REACT_APP_GPT_TOKEN;

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axios;

import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = process.env.REACT_APP_ACCESS_TOKEN;

    // if (token) {
    config.headers["Authorization"] =
      "Bearer " +
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3OTkwMjUyMSwiZXhwIjoxNjc5OTg4OTIxfQ._jCpqeVCE3K_A7jJfwHX5lvIyBMW-cwljJqN3DtQRWo";
    // }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axios;

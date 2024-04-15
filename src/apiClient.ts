import axios from "axios";

const apiKeys = [
  "f693083c-4816-48be-98f0-fe811da4b553",
  "d44a3e82-2ca9-4ae7-a3cd-81acf27efd60",
  '7b5e2481-5174-4434-b2e0-03ac46101c61'
];

let currentApiKeyIndex = 0;

const apiClient = axios.create({
  baseURL: "https://kinopoiskapiunofficial.tech/api/",
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["X-API-KEY"] = apiKeys[currentApiKeyIndex];
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the error status is 402 (payment required) and there is a backup API key
    if (error.response && error.response.status === 402 && apiKeys[currentApiKeyIndex + 1]) {
      // Use the next API key
      currentApiKeyIndex++;
      // Retry the request with the next API key
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

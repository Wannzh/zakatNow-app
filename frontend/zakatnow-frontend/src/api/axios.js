import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-zakatnow.alwanfdh.my.id/api',
});

api.interceptors.request.use(config => {
  const authString = localStorage.getItem('auth');
  if (authString) {
    try {
      const authData = JSON.parse(authString);
      const token = authData?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Gagal mem-parsing data auth dari localStorage:", error);
    }
  }
  
  return config;
});


export default api;

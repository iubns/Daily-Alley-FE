import axios from 'axios';

const AI_API_BASE_URL = 'http://daily-alley-api.iubns.net:7100/';

const aiAxiosInstance = axios.create({
  baseURL: AI_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // 응답 대시 시간 (30초)
  timeout: 30000, 
});

export default aiAxiosInstance;
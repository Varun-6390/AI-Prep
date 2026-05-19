import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/interview` : "http://localhost:3000/api/interview";

// Create an axios instance with withCredentials enabled
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor to add the token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const interviewService = {
  // Generate a new report
  // Expects formData with 'resume' (File), 'jobDescription', 'selfDescription'
  generateReport: async (formData) => {
    const response = await api.post(`/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get all reports for the user
  getAllReports: async () => {
    const response = await api.get(`/`);
    return response.data;
  },

  // Get a specific report by ID
  getReportById: async (id) => {
    const response = await api.get(`/report/${id}`);
    return response.data;
  },

  // Download Resume PDF
  downloadResume: async (id) => {
    const response = await api.post(
      `/resume/pdf/${id}`,
      {},
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};

export default interviewService;

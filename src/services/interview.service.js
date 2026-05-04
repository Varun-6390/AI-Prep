import axios from "axios";

const API_URL = "https://ai-prep-backend-nr2p.onrender.com/api/interview";

// Create an axios instance with withCredentials enabled
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

import axios from "axios";
const API_BASE = "http://localhost:8000";

export const getDashboard = () => axios.get(`${API_BASE}/dashboard/summary`).then(r => r.data);
export const getGraph = () => axios.get(`${API_BASE}/graph`).then(r => r.data);
export const askQuestion = (question) =>
  axios.post(`${API_BASE}/ask`, { question }).then(r => r.data);
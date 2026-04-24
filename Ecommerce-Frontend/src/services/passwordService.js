import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const sendResetPasswordLink = async (email) => {
  return await axios.post(`${API_BASE_URL}/forgot-password`, null, {
    params: { email },
  });
};

export const resetPassword = async (id, password) => {
  return await axios.put(`${API_BASE_URL}/reset-password`, null, {
    params: { id, password },
  });
};
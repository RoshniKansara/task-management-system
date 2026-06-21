import axios from "axios";

const API_URL = "https://task-management-backend-3ecl.onrender.com/auth";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    {
      email,
      password,
    }
  );

  return response.data;
};
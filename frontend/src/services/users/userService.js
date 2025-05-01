import axios from "axios";
import { USERS_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
const token = getUserFromStorage();
export const registerAPI = async ({ username,email, password }) => {
  const response = await axios.post(`${USERS_URL}/register`, {
    username,
    email,
    password,
  });
  return response.data;
}
export const loginAPI = async ({ email, password }) => {
  const response = await axios.post(`${USERS_URL}/login`, {
    email,
    password,
  });
  return response.data;
}
export const ProfileAPI = async () => {
  const response = await axios.get(`${USERS_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const UpdateProfileAPI= async (formData) => {
  const response = await axios.put(`${USERS_URL}/update-profile`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}


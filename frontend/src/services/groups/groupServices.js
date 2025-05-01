import axios from "axios";
import { GROUPS_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
const token = getUserFromStorage();
console.log("TOKEN FROM SERVICES", token);
export const getGroupsAPI = async () => {
  const response = await axios.get(`${GROUPS_URL}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("GROUPS", response.data);
  return response.data;
};
export const createGroupAPI = async (formData) => {
  const response = await axios.post(`${GROUPS_URL}/`,formData ,{
    headers: {
      content: "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getMembersAPI = async (groupId) => {
  const response = await axios.get(`${GROUPS_URL}/${groupId}/members`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("the members", response.data);
  return response.data;
  
};

export const joinGroupAPI = async (groupId) => {
  const response = await axios.post(`${GROUPS_URL}/${groupId}/join`,{},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getGroupByIdAPI = async (groupId) => {
  const response = await axios.get(`${GROUPS_URL}/${groupId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const leaveGroupAPI = async (groupId) => {
  const response = await axios.post(`${GROUPS_URL}/${groupId}/leave`,{},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
  
};


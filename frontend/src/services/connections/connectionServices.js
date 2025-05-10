import axios from "axios";
import { CONNECTIONS_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import {BASE_URL} from "../../utils/url";
const token = getUserFromStorage();
console.log("TOKEN FROM SERVICES", token);
export const getConnectionsAPI = async () => {
  const response = await axios.get(`${BASE_URL}/api/connections/myconnections`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("CONNECTIONS FROM CONNECTION SERVICES", response.data);
  return response.data;
};
export const getUserByIdAPI= async (userId) => {
    const response = await axios.get(`${BASE_URL}/api/connections/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
}

export const createConnectionAPI= async (userId) => {
  const response = await axios.post(`${BASE_URL}/api/connections/${userId}/connect`,{},{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const removeConnectionAPI= async (userId) => {
    const response = await axios.post(`${BASE_URL}/api/connections/${userId}/remove`,{},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
}

export const getPersonalMsgAPI= async (chatid) => {
  const response = await axios.get(`${CONNECTIONS_URL}/${chatid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export const sendPersonalMsgAPI= async (PersonalMsgData) => {
  const response = await axios.post(`${CONNECTIONS_URL}`,PersonalMsgData,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
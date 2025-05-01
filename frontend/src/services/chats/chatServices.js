import axios from "axios";
import { CHATS_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
const token = getUserFromStorage();
console.log("TOKEN FROM SERVICES", token);
export const getMessagesAPI = async (groupId) => {
  const response = await axios.get(`${CHATS_URL}/${groupId}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("CHATS", response.data);
  return response.data;

};
export const sendMessageAPI = async (messageData) => {
    const response = await axios.post(`${CHATS_URL}`, messageData,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  
  };


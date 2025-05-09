import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import PersonalChatArea from "./PersonalChatArea";
import { getUserByIdAPI } from "../../services/connections/connectionServices";
import { useEffect, useState } from "react";

const ChatSection = () => {
  const { chatId, userId} = useParams();
  console.log("CHAT ID FROM CHATSECTION", chatId);
  console.log("USER ID FROM CHATSECTION", userId);
  const context = useOutletContext();
  const [userInfo, setUserInfo] = useState(null);
  const [chatIbnfo, setChatInfo] = useState(null);
  if (!context) {
    console.error("Outlet context not available - check parent component");
    return <div>Loading...</div>;
  }

  const { onlineUsers, socket } = context;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserByIdAPI(userId);
        setUserInfo(data);
        console.log("USER INFO FROM USER CHAT SECTION", data);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };
    
    fetchUserInfo();
  }, [userId]);

  if (!userInfo) {
    return <div>Loading user information...</div>;
  }
  return (
    <PersonalChatArea
      userId={userId}
      chatId={chatId}
      onlineUsers={onlineUsers}
      description={userInfo.bio || ""}  
      userName={userInfo.username}
      profilePic={userInfo.profilePic}
      socket={socket}
    />
  );
};

export default ChatSection;
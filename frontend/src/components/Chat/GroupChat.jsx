import { useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import ChatArea from "./ChatArea";
import { getGroupByIdAPI } from "../../services/groups/groupServices";
import { useEffect, useState } from "react";

const GroupChat = () => {
  const { groupId } = useParams();
  const context = useOutletContext();
  const [groupInfo, setGroupInfo] = useState(null);
  
  // Handle case when context isn't available
  if (!context) {
    console.error("Outlet context not available - check parent component");
    return <div>Loading...</div>;
  }

  const { onlineUsers, socket } = context;

  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const data = await getGroupByIdAPI(groupId);
        setGroupInfo(data);
        console.log("GROUP INFO FROM GROUP CHAT", data);
        
      } catch (error) {
        console.error("Failed to fetch group info:", error);
      }
    };
    
    fetchGroupInfo();
  }, [groupId]);

  if (!groupInfo) {
    return <div>Loading group information...</div>;
  }

  return (
    <ChatArea
      groupId={groupId}
      onlineUsers={onlineUsers}
      description={groupInfo.description}
      groupName={groupInfo.name}
      profilePic={groupInfo.profilePic}
      socket={socket}
    />
  );
};

export default GroupChat;
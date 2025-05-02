import { useState, useEffect } from "react";
import Sidebar from "../NavBars/SideBar";
import io from "socket.io-client";
import { Outlet, useNavigate } from "react-router-dom";

const ENDPOINT = "https://gossipp.onrender.com";
const ENDPOINT1 = "https://gossipp.onrender.com";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    const userInfo = stored ? JSON.parse(stored) : null;
    const user = userInfo?.user; 
    
    const newSocket = io(ENDPOINT1, {
      auth: { user },
      transports: ["websocket"],
      withCredentials: true      
    });
    
    
    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });
    
    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
    
    newSocket.on("users-connected", (users) => {
      setOnlineUsers(users); 
    });
    
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const handleGroupSelect = (group) => {
    navigate(`/Gossipp/chats/${group._id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        onGroupSelect={handleGroupSelect} 
        isCollapsed={!isSidebarOpen}
        onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {/* Main content area with Outlet */}
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? "ml-0 md:ml-30" : "ml-0 md:ml-20"
      }`}>
        <Outlet context={{ onlineUsers, socket }} />
      </div>
    </div>
  );
};

export default Chat;
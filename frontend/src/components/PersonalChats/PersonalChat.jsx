import { useState, useEffect } from "react";
import PersonalSideBar from "../NavBars/PersonalSideBar";
import io from "socket.io-client";
import { Outlet, useNavigate, useParams } from "react-router-dom";
const ENDPOINT = "https://gossipp.onrender.com";

const PersonalChat = () => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { id: currentChatUserId } = useParams();

  useEffect(() => {
    const stored = localStorage.getItem("userInfo");
    const userInfo = stored ? JSON.parse(stored) : null;
    const user = userInfo?.user; 
    
    const newSocket = io(ENDPOINT, {
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

    newSocket.on("users in private chat", (users) => {
      setOnlineUsers(users);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !currentChatUserId) return;

    const stored = localStorage.getItem("userInfo");
    const userInfo = stored ? JSON.parse(stored) : null;
    const currentUser = userInfo?.user;

    if (!currentUser?._id) return;

    const payload = {
      userId1: currentUser._id,
      userId2: currentChatUserId
    };
    socket.emit("join private chat", payload);

    return () => {
      socket.emit("leave private chat", payload);
    };
  }, [socket, currentChatUserId]);

  const handleUserSelect = (user) => {
    navigate(`/Gossipp/connections/${user._id}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <PersonalSideBar 
        onUserSelect={handleUserSelect} 
        isCollapsed={!isSidebarOpen}
        onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
        onlineUsers={onlineUsers} 
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

export default PersonalChat;
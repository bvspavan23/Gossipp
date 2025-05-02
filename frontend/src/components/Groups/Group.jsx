import { useEffect, useState } from "react";
import {getGroupByIdAPI,joinGroupAPI,leaveGroupAPI,} from "../../services/groups/groupServices";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import AlertMessage from "../Alert/AlertMessage";

const GroupDetails = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const localuser = useSelector((state) => state.auth.user);
  const userId = localuser?.user?._id;

  const fetchGroup = async () => {
    try {
      const data = await getGroupByIdAPI(groupId);
      console.log("Group data from group component:", data);
      console.log("ADMIN FROM GROUP COMPONENT", data.admin);

      setGroup(data);
    } catch (err) {
      console.error("Error fetching group:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const handleJoinGroup = async () => {
    try {
      await joinGroupAPI(groupId);
      setAlert({ type: "success", message: "Joined the group successfully!" });
      fetchGroup();
    } catch (err) {
      setAlert({ type: "error", message: "Failed to join the group." });
      console.error("Error joining group:", err);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroupAPI(groupId);
      setAlert({ type: "success", message: "Left the group successfully!" });
      fetchGroup();
    } catch (err) {
      setAlert({ type: "error", message: "Failed to leave the group." });
      console.error("Error leaving group:", err);
    }
  };

  const isMember = group?.members?.some((member) => member._id === userId);

  if (loading)
    return <p className="text-center mt-10">Loading group details...</p>;
  if (!group)
    return <p className="text-center mt-10 text-red-500">Group not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto p-4"
    >
      <div className="flex flex-col items-center mb-6">
        {alert && (
          <div className="mb-4 w-full max-w-md">
            <AlertMessage type={alert.type} message={alert.message} />
          </div>
        )}

        {/* Group Avatar */}
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-2xl text-blue-600 font-bold">
          <img
          src={group.profilePic}
          alt={group.username}
          className="w-full h-full rounded-full object-cover mr-3"
        />
            {/* {group.name?.charAt(0)} */}
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 text-center">
          {group.name}
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-4 px-4">
          {group.description}
        </p>
        {!isMember ? (
          <div className="text-center mt-4">
            <p className="text-red-600 font-medium mb-2">
              You aren't a member in this group. Join to start gossiping!
            </p>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={handleJoinGroup}
            >
              Join Group
            </button>
          </div>
        ) : (
          <>
            <div className="w-full max-w-md mx-auto mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">
                Members ({group.members.length})
              </h3>
              <div className="space-y-3">
              {group.members.map((member) => {
  const isAdmin = member._id === group.admin._id;
  return (
    <div
      key={member._id}
      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
    >
      <div className="flex items-center">
        <img
          src={member.profilePic}
          alt={member.username}
          className="w-8 h-8 rounded-full object-cover mr-3"
        />
        <span className="font-medium">{member.username}</span>
      </div>
      <span
        className={`text-sm font-semibold px-2 py-1 rounded ${
          isAdmin
            ? "bg-yellow-300 text-yellow-800"
            : "bg-green-100 text-green-700"
        }`}
      >
        {isAdmin ? "Admin" : "Member"}
      </span>
    </div>
  );
})}

              </div>
            </div>

            <button
              className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              onClick={handleLeaveGroup}
            >
              Leave Group
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default GroupDetails;

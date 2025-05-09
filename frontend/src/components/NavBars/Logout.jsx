import { FiLogOut } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
const LogoutButton = ({ setIsProfileOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch(logoutAction());
    navigate("/");
    if (setIsProfileOpen) setIsProfileOpen(false);
  };
  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 w-full px-4 py-3 text-left hover:bg-gray-50 text-red-500"
    >
      <FiLogOut className="text-red-500" />
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
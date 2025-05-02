import { Link } from "react-router-dom";
import {FiUsers,FiGlobe,FiUserPlus,FiLogIn,FiMessageSquare,FiLock,FiUserCheck,FiActivity} from "react-icons/fi";
const Feature = ({
  title,
  text,
  icon: IconComponent,
  badgeText,
  badgeColor,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border hover:-translate-y-2 transition shadow-lg hover:shadow-xl">
      <div
        className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r from-[#fa7e1e] to-[#d62976] text-white`}
      >
        <IconComponent size={28} />
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {title}
        </h3>
        {badgeText && (
          <span
            className={`text-xs px-2 py-1 rounded-full bg-${badgeColor}-100 text-${badgeColor}-600`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <p className="text-gray-500 dark:text-gray-300">{text}</p>
    </div>
  );
};

const ChatMessage = ({ sender, message, time, isUser }) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-4 rounded-lg max-w-[80%] ${
          isUser
            ? "bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        <div className="text-sm font-bold mb-1">{sender}</div>
        <div>{message}</div>
        <div className="text-xs mt-1 opacity-70">{time}</div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <span className="text-6xl font-bold mb-4 flex justify-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#feda75] to-[#fa7e1e] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              G
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fa7e1e] to-[#d62976] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              o
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d62976] to-[#962fbf] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              s
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fa7e1e] to-[#d62976] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              s
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4f5bd5] to-[#feda75] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              i
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#feda75] to-[#fa7e1e] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              p
            </span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#fa7e1e] to-[#d62976] cursor-pointer inline-block scale-100 transition-transform duration-300 ease-in-out hover:scale-150">
              p
            </span>
          </span>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Where conversations come alive with vibe and joy 😉
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 space-y-6 mb-12 md:mb-0">
            <h1 className="text-4xl font-bold leading-tight text-gray-900 dark:text-white">
              Experience the{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#feda75] to-[#fa7e1e]">
                Ultimate
              </span>{" "}
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d62976] to-[#962fbf]">
                Chat Experience
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connect with friends in real-time with our vibrant, feature-rich
              messaging platform!
            </p>
            <div className="flex space-x-4">
              <Link to="/register">
                <button className="bg-gradient-to-r from-[#fa7e1e] to-[#d62976] hover:from-[#d62976] hover:to-[#962fbf] text-white px-8 py-3 rounded-full flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all">
                  <FiUserPlus />
                  <span>Get Started</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="border-2 border-[#4f5bd5] text-[#4f5bd5] hover:bg-[#4f5bd5] hover:bg-opacity-10 px-8 py-3 rounded-full flex items-center space-x-2 transition-all">
                  <FiLogIn />
                  <span>Sign In</span>
                </button>
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02] transition-transform">
              <div className="bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <FiUsers />
                  <span className="font-bold">Team Gossipp</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                    3 Online
                  </span>
                  <FiGlobe />
                </div>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto h-80">
                <ChatMessage
                  sender="Mr.Penguin"
                  message="I Love Penguins!"
                  time="10:30 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="Appuu"
                  message="They are sooo cute 🩷"
                  time="10:31 AM"
                  isUser={false}
                />
                <ChatMessage
                  sender="You"
                  message="Like You Onlyy 😁"
                  time="10:32 AM"
                  isUser={true}
                />
                <div className="text-center text-[#d62976] text-xs animate-pulse">
                  Appuu is typing...
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#feda75] to-[#d62976]">
                Powerful Features
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need for joyful, seamless communication with your
              favorite people
            </p>
          </div>
          <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Feature
              title="Secure Authentication"
              text="Register and login securely with email verification and encrypted passwords."
              icon={FiLock}
              badgeText="Secure"
              badgeColor="green"
            />
            <Feature
              title="Group Management"
              text="Create, join, or leave groups easily. Manage multiple conversations in one place."
              icon={FiUsers}
              badgeText="Real-time"
              badgeColor="blue"
            />
            <Feature
              title="Online Presence"
              text="See who's currently online and active in your groups in real-time."
              icon={FiUserCheck}
              badgeText="Live"
              badgeColor="green"
            />
            <Feature
              title="Typing Indicators"
              text="Know when others are typing with real-time typing indicators."
              icon={FiActivity}
              badgeText="Interactive"
              badgeColor="purple"
            />
            <Feature
              title="Instant Messaging"
              text="Send and receive messages instantly with real-time delivery and notifications."
              icon={FiMessageSquare}
              badgeText="Fast"
              badgeColor="orange"
            />
            <Feature
              title="Global Access"
              text="Access your chats from anywhere, anytime with persistent connections."
              icon={FiGlobe}
              badgeText="24/7"
              badgeColor="blue"
            />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-32 bg-gradient-to-r from-[#feda75] to-[#fa7e1e] p-10 rounded-xl flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 shadow-xl">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">
              Ready to join the fun?
            </h2>
            <p className="text-white text-opacity-90">
              Become part of our colorful community today!
            </p>
          </div>
          <Link to="/register">
            <button className="bg-white text-[#d62976] hover:bg-opacity-90 px-8 py-4 rounded-full flex items-center space-x-2 font-bold shadow-lg hover:scale-105 transition-transform">
              <FiUserPlus />
              <span>Create Free Account</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

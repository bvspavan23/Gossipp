import { Link } from "react-router-dom";
import { FiUsers, FiGlobe, FiUserPlus, FiLogIn, FiMessageSquare, FiLock, FiUserCheck, FiActivity } from "react-icons/fi";

const Feature = ({ title, text, icon: IconComponent, badgeText, badgeColor }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border hover:-translate-y-2 transition shadow-md">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white mb-4">
        <IconComponent size={28} />
      </div>
      <div className="flex items-center space-x-2 mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badgeText && (
          <span className={`text-xs px-2 py-1 rounded-full bg-${badgeColor}-100 text-${badgeColor}-600`}>
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
      <div className={`p-4 rounded-lg max-w-[80%] ${isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"}`}>
        <div className="text-sm font-bold mb-1">{sender}</div>
        <div>{message}</div>
        <div className="text-xs mt-1 opacity-70">{time}</div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 space-y-6 mb-12 md:mb-0">
            <h1 className="text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              <span className="relative text-blue-500">Gossipp</span> <br />
              <span className="text-blue-400">Chat App</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Experience seamless communication with real-time messaging, typing indicators, and online status!
            </p>
            <div className="flex space-x-4">
              <Link to="/register">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full flex items-center space-x-2">
                  <FiUserPlus />
                  <span>Get Started</span>
                </button>
              </Link>
              <Link to="/login">
                <button className="border border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-3 rounded-full flex items-center space-x-2">
                  <FiLogIn />
                  <span>Sign In</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="flex-1">
            <div className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Header */}
              <div className="bg-blue-500 p-4 flex justify-between items-center text-white">
                <div className="flex items-center space-x-2">
                  <FiUsers />
                  <span className="font-bold">Team Gossipp</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">3 Online</span>
                  <FiGlobe />
                </div>
              </div>

              {/* Messages */}
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
                <div className="text-center text-gray-400 text-xs">Appuu is typing...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Powerful Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need for seamless team collaboration
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
        <div className="mt-20 bg-blue-50 dark:bg-blue-900 p-10 rounded-xl flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ready to get started?</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join thousands of users already using our platform.
            </p>
          </div>
          <Link to="/register">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full flex items-center space-x-2">
              <FiUserPlus />
              <span>Create Free Account</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
 
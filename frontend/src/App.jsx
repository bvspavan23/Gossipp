import { useState } from "react";
import "./App.css";
import LandingPage from "./components/Home/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Forms/Login";
import Register from "./components/Forms/Register";
// import TestAuth from "./components/Auth/TestAuth";
import AuthRoute from "./components/Auth/AuthRoute";
// import PrivateNav from "./components/NavBars/PrivateNavbar";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Chat from "./components/Chat/Chat";
// import Members from "./components/Chat/members";
import Profile from "./components/user/Profile";
import EditProfileForm from "./components/Forms/UpdateProfile";
import GroupForm from "./components/Forms/CreateGroup";
import Group from "./components/Groups/Group";
import GroupChat from "./components/Chat/GroupChat";
import PersonInfo from "./components/PersonalChats/PersonInfo";
import ChatSection from "./components/PersonalChats/ChatSection";
import PersonalChat from "./components/PersonalChats/PersonalChat";
import './App.css';
function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.auth?.user);
  return (
    <>
<Router>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/profile" element={
      <AuthRoute>
        <Profile />
      </AuthRoute>
    } />
    <Route path="/update-profile" element={
      <AuthRoute>
      <EditProfileForm />
      </AuthRoute>
  } />
    <Route path="/create-group" element={
      <AuthRoute>
      <GroupForm />
      </AuthRoute>} />
    <Route path="/groups/:groupId" element={
      <AuthRoute>
        <Group />
      </AuthRoute>
    } />
      <Route path="/connections/:userId" element={
      <AuthRoute>
        <PersonInfo/>
      </AuthRoute>
    } />
    {/* NESTED CHAT ROUTES */}
    <Route path="/Gossipp/chats" element={
      <AuthRoute>
        <Chat />
      </AuthRoute>
      }>
      <Route path=":groupId" element={
        <AuthRoute>
        <GroupChat />
        </AuthRoute>} />
    </Route>
    {/* --------------- */}
    <Route path="/Gossipp/connections" element={
      <AuthRoute>
        <PersonalChat/>
      </AuthRoute>
      }>
      <Route path=":chatId/:userId" element={
        <AuthRoute>
        <ChatSection/>
        </AuthRoute>} />
    </Route>
  </Routes>
</Router>
    </>
  );
}

export default App;
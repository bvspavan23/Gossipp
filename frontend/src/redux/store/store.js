import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import chatReducer from "../slice/chatSlice";
import groupReducer from "../slice/groupSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    group: groupReducer,
  },
});
export default store;
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    activeGroup: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload;
    },
  },
});

export const { setMessages, addMessage, setActiveGroup } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;

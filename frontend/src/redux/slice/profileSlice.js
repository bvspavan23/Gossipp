import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: {
      username: "",
      email: "",
      profilepic: "",
    },
  },
  reducers: {
    setProfileAction: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setProfileAction } = profileSlice.actions;
const profileReducer=profileSlice.reducer
export default profileReducer;
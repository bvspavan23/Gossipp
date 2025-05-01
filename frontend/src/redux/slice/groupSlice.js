import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "Group",
  initialState: {
    Groups: [],
  },
  reducers: {
    setGroupAction: (state, action) => {
      state.Groups = action.payload;
    },
    createGroupAction: (state, action) => {
      const { name, description, admin, members, profilePic } = action.payload;
      state.Groups.push({
        name,
        description,
        admin,
        members,
        profilePic,
      });
    },
  },
});

export const { setGroupAction, createGroupAction } = groupSlice.actions;
const groupReducer = groupSlice.reducer;
export default groupReducer;

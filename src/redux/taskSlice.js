import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    emailTasksInbox: [],
    emailTasksTodo: [],
    emailTasksDone: [],
  },
  reducers: {
    setEmailTasksInbox: (state, action) => {
      state.emailTasksInbox = [...state.emailTasksInbox, ...action.payload];
    },
    setEmailTasksTodo: (state, action) => {
      state.emailTasksTodo = [...state.emailTasksTodo, ...action.payload];
    },
    setEmailTasksDone: (state, action) => {
      state.emailTasksDone = [...state.emailTasksDone, ...action.payload];
    },
  },
});
export default taskSlice.reducer;
export const { setEmailTasksInbox, setEmailTasksTodo, setEmailTasksDone } =
  taskSlice.actions;

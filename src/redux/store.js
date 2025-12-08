import { configureStore } from "@reduxjs/toolkit";
import threadReducer from "./threadSlice";
import taskReducer from "./taskSlice";
import { ta } from "zod/v4/locales";
const store = configureStore({
  reducer: {
    threads: threadReducer,
    tasks: taskReducer,
  },
});
export default store;

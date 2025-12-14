import { configureStore } from "@reduxjs/toolkit";
import threadReducer from "./threadSlice";
import taskReducer from "./taskSlice";
import searchReducer from "./searchSlice";

const store = configureStore({
  reducer: {
    threads: threadReducer,
    tasks: taskReducer,
    search: searchReducer,
  },
});
export default store;

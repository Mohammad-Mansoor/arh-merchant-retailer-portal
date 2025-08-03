import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slicers/counterSlicer";
import authReducer from "./slicers/authSlicer";
const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
  },
});

export default store;

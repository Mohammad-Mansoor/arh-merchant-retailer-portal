import { createSlice } from "@reduxjs/toolkit";
import { validateToken } from "../../utils/validateToken.js";

// Read and validate token once
const token = localStorage.getItem("token");
const validation = validateToken(token);

const initialState = {
  token: validation.valid ? token : null,
  user: validation.valid ? validation.payload : null,
  isAuthenticated: validation.valid,
  error: validation.valid ? null : validation.error,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const validation = validateToken(action.payload);

      if (validation.valid) {
        state.token = action.payload;
        state.user = validation.payload;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("token", action.payload);
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = validation.error;
        localStorage.removeItem("token");
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { loginSuccess, logout, setUser } = authSlice.actions;
export default authSlice.reducer;

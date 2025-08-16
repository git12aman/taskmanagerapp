import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Backend API endpoint for authentication
const API = 'http://localhost:5000/api/auth';

// REGISTER
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/register`, { email, password });
      // Optional: console.log("Register response data:", response.data);
      return response.data;
    } catch (error) {
      // Optional: console.log("Register error response:", error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Register failed.");
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/login`, { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed.");
    }
  }
);

// Redux slice for authentication
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, state => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Register failed.";
      })
      // Login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed.";
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

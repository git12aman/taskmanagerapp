import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:5000/api/tasks';

// Helper to attach JWT token
const getAxios = (getState) => {
  const token = getState().auth.token;
  return axios.create({
    baseURL: API,
    headers: { Authorization: `Bearer ${token}` } // ✅ fixed template string
  });
};

// Thunks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (params, { getState }) => {
  const api = getAxios(getState);
  const res = await api.get('', { params });
  return res.data;
});

export const fetchTask = createAsyncThunk('tasks/fetchTask', async (id, { getState }) => {
  const api = getAxios(getState);
  const res = await api.get(`/${id}`);
  return res.data;
});

export const createTask = createAsyncThunk('tasks/createTask', async (data, { getState, rejectWithValue }) => {
  try {
    const api = getAxios(getState);
    const formData = new FormData();
    for (const key in data) {
      if (key !== "documents") formData.append(key, data[key]);
    }
    if (data.documents) {
      for (let i = 0; i < data.documents.length; i++) {
        formData.append("documents", data.documents[i]);
      }
    }
    const res = await api.post('', formData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }, { getState }) => {
  const api = getAxios(getState);
  const formData = new FormData();
  for (const key in data) {
    if (key !== "documents") formData.append(key, data[key]);
  }
  if (data.documents) {
    for (let i = 0; i < data.documents.length; i++) {
      formData.append("documents", data.documents[i]);
    }
  }
  const res = await api.patch(`/${id}`, formData);
  return res.data;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { getState }) => {
  const api = getAxios(getState);
  await api.delete(`/${id}`);
  return id;
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    single: null,
    loading: false,
    error: null
  },
  reducers: {
    clearSingle: (state) => { state.single = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, state => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to fetch tasks.";
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.single = action.payload;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const idx = state.list.findIndex(t => t._id === action.payload._id);
        if (idx >= 0) state.list[idx] = action.payload;
        if (state.single && state.single._id === action.payload._id)
          state.single = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
        if (state.single && state.single._id === action.payload)
          state.single = null;
      });
  }
});
export const { clearSingle } = taskSlice.actions;
export default taskSlice.reducer;

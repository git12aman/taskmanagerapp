import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import taskReducer from './taskSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
  },
});

import { handleThunkError } from "@/app/hooks/handlingErr";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { INotification } from "@/app/dashboard/Components/Notification/Notification";

export interface NotificationState {
  notifications: INotification[];
  loading: boolean;
  error: unknown | null;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  error: null,
};

export const getNotificationsThunk = createAsyncThunk(
  "notifications/getNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/notification/");
      return data.result;
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const clearAllNotificationsThunk = createAsyncThunk(
  "notification/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.delete("/notification/");
      return data;
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<any>) => {
      if (!Array.isArray(state.notifications)) {
        state.notifications = [];
      }
      
      state.notifications.unshift(action.payload);
      
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationsThunk.fulfilled, (state, action) => {
        state.notifications = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
        state.error = null;
      })
      .addCase(clearAllNotificationsThunk.fulfilled, (state) => {
        state.notifications = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(clearAllNotificationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearAllNotificationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
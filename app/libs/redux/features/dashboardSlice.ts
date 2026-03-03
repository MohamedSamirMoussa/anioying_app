import { handleThunkError } from "@/app/hooks/handlingErr";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { IUser } from "@/app/types/auth.types";
import { LeaderboardUser } from "@/app/leaderboard/page";

export interface IMCServer {
  id: string;
  name: string;
  port?: number;
  usage: {
    cpu: string | number;
    memory: string | number;
    disk: string | number;
    status: string;
  };
}

export enum BlockEnum {
  block = "block",
  unblock = "unblock",
}

export interface MCServerUsage {
  id: string;
  name: string;
  node: string;
  usage: {
    status: string;
    cpu: string;
    memory: string;
    disk: string;
    diskPercent?: string;
    network_rx: string;
    network_tx: string;
  };
}

export interface IUserDashboard {
  webUsers: IUser[];
  gameUsers: LeaderboardUser[];
}

export interface DashboardState {
  users: IUserDashboard;
  mcServers: MCServerUsage[];
  loading: boolean;
  error: null | any;
}

const initialState: DashboardState = {
  users: {
    webUsers: [],
    gameUsers: [],
  },
  mcServers: [],
  loading: false,
  error: null,
};

/* -------------------------------- THUNKS -------------------------------- */

export const getAllUsersForAdmin = createAsyncThunk(
  "users/dashboard",

  async (month: string | undefined, { rejectWithValue }) => {
    try {
      const url = month
        ? `/auth/getAllUsers?month=${month}`
        : "/auth/getAllUsers";
      const { data } = await api.get(url);

      return data.result;
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const blockThunk = createAsyncThunk(
  "dashboard/blockUser",
  async (
    { userId, block }: { userId: string; block: string },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch(`/auth/block/${userId}`, { block });
      return { userId, block, message: data.message };
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const deleteServerThunk = createAsyncThunk(
  "dashboard/deleteServer",
  async (serverName: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(
        `/leaderboard/?serverName=${serverName}`,
      );
      return { serverName, data };
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const toggleSupporterThunk = createAsyncThunk(
  "dashboard/toggleSupporter",
  async (username: string, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/leaderboard/${username}`);
      return { username, data };
    } catch (err: unknown) {
      return handleThunkError(err, rejectWithValue);
    }
  },
);

export const giveAdminPermissionThunk = createAsyncThunk(
  "giveAdmin/dashboard",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/auth/give-admin/${userId}`);

      return data;
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);



/* -------------------------------- SLICE -------------------------------- */

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsersForAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllUsersForAdmin.fulfilled,
        (state, action: PayloadAction<IUserDashboard>) => {
          state.users = action.payload;
          state.loading = false;
          state.error = null;
        },
      )
      .addCase(getAllUsersForAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockThunk.fulfilled, (state, action) => {
        const { userId, block } = action.payload;
        const user = state.users.webUsers.find((u: any) => u._id === userId);
        if (user) {
          user.isBlocked = block;
        }
        state.loading = false;
      })
      .addCase(blockThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteServerThunk.fulfilled, (state, action) => {
        state.mcServers = state.mcServers.filter(
          (s) => s.name !== action.payload.serverName,
        );
      })
      .addCase(toggleSupporterThunk.fulfilled, (state, action) => {
        // بناءً على الـ Log بتاعك: البيانات موجودة جوه action.payload.data
        const result = action.payload.data?.result;

        if (result) {
          const { newStatus, newName } = result;
          const targetUsername = action.meta.arg; // 'xmirinda'

          state.users.gameUsers = state.users.gameUsers.map((player) => {
            if (player.username === targetUsername) {
              return {
                ...player,
                isSupported: {
                  status: newStatus,
                  name: newName,
                },
              };
            }
            return player;
          });
        }
      })
      .addCase(toggleSupporterThunk.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(giveAdminPermissionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(giveAdminPermissionThunk.fulfilled, (state, action) => {
        state.loading = false;

        const updatedUser = action.payload.result;
        const userIndex = state.users.webUsers.findIndex(
          (u) => u._id === updatedUser._id,
        );

        if (userIndex !== -1) {
          state.users.webUsers[userIndex].role = updatedUser.role;
        }
      })
      .addCase(giveAdminPermissionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;

import { createAsyncThunk, createSlice, UnknownAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { IConfirmInterface } from "@/app/confirmPassword/page";
import { IResetPass } from "@/app/newPassword/page";
import { IFormValues } from "@/app/auth/page";
import { handleThunkError } from "@/app/hooks/handlingErr";

interface IUser {
  id: string;
  username: string;
  email: string;
  gender?: string;
  [key: string]: any;
}

export interface IAuthState {
  user: IUser | null;
  loading: boolean;
  error: any;
  isLogged: boolean;
  discordUrl: string | null;
  token: string;
}

const initialState: IAuthState = {
  user: null,
  loading: false,
  error: null,
  isLogged: false,
  discordUrl: null,
  token: "",
};

export const loginThunk = createAsyncThunk<
  any,
  { email: string; password: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (error: unknown) {
    return handleThunkError(error, rejectWithValue);
  }
});

export const confirmEmailThunk = createAsyncThunk<any, IConfirmInterface>(
  "auth/confirm-email",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/confirm-email", values);
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const registerThunk = createAsyncThunk<any, IFormValues>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);

      return response.data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const forgetPasswordThunk = createAsyncThunk<any, { email: string }>(
  "forgetPassword/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/forget-password", values);
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const confirmPasswordThunk = createAsyncThunk<any, IConfirmInterface>(
  "confirmPassword/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/confirm-password", values);

      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);
export const newPasswordThunk = createAsyncThunk<any, IResetPass>(
  "resetPassword/auth",
  async (values, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/reset-password", values);

      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const signinWithGoogleThunk = createAsyncThunk<any, { token: string }>(
  "signinWithGoogle/auth",
  async ({ token }, { rejectWithValue }) => {
    try {
      // بنبعت الـ token بس في الـ body
      const { data } = await api.post("/auth/google-login", { token });
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const getDiscordRedirect = createAsyncThunk<any, any>(
  "auth/getDiscordRedirect",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/discord");
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const checkAuthThunk = createAsyncThunk<any, void>(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      // تغيير إلى get
      const { data } = await api.get("/auth/check-auth");
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const resendOtpThunk = createAsyncThunk<any, { email: string }>(
  "resendOtp/auth",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/resend-otp", { email });

      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const logoutThunk = createAsyncThunk<any, any>(
  "auth/logout",
  async (_, { rejectWithValue }: { rejectWithValue?: any }) => {
    try {
      const { data } = await api.post(
        "/auth/logout",
        {},
        { withCredentials: true },
      );
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);



const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLogged = false;
      state.user = null;
    },
    login(state) {
      state.isLogged = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload.result || action.payload;
        state.isLogged = true;
        state.error = null;
      })
      .addCase(signinWithGoogleThunk.fulfilled, (state, action) => {
        state.user = action.payload.result || action.payload;
        state.isLogged = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.user = action.payload.result || action.payload;
        state.isLogged = true;
      })
      // عند نجاح تسجيل الخروج يدوياً
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isLogged = false;
        state.token = "";
      })

      // المشغلات العامة (Matchers)
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action: UnknownAction) =>
          action.type.endsWith("/fulfilled") ||
          action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        },
      )
      .addMatcher(
        (action: UnknownAction) => action.type.endsWith("/rejected"),
        (state, action: any) => {
          state.error = action.payload;

          // إذا فشل فحص الجلسة الدوري أو أي طلب محمي (بسبب الـ Interceptor)
          // الـ Interceptor سينادي دالة الـ logout العادية (التي صفرناها فوق)
          if (action.type.includes("checkAuth")) {
            state.isLogged = false;
            state.user = null;
          }
        },
      );
  },
});

export const { logout, login } = authSlice.actions;
export default authSlice.reducer;

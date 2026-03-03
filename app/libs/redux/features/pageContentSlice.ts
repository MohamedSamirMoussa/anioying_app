import { handleThunkError } from "@/app/hooks/handlingErr";
import { IPageContent } from "@/app/types/auth.types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const initialState: IPageContent = {
  sectionData: {},
  loading: false,
  error: null,
};

// 🔹 GET
export const getPageContentThunk = createAsyncThunk(
  "pageContent/get",
  async (sectionName: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/dashboard/${sectionName}`, {
        withCredentials: true,
      });

      return { sectionName, result: data.result };
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

// 🔹 UPDATE
export const updatePageContentThunk = createAsyncThunk(
  "pageContent/update",
  async (
    { sectionName, values }: { sectionName: string; values: any },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.put(`/dashboard/${sectionName}`, values);

      return { sectionName, result: data.result };
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

const pageContentSlice = createSlice({
  name: "pageContent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getPageContentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPageContentThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.sectionData[action.payload.sectionName] =
          action.payload.result.section;
      })
      .addCase(getPageContentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE
      .addCase(updatePageContentThunk.fulfilled, (state, action) => {
        state.sectionData[action.payload.sectionName] =
          action.payload.result.section;
      });
  },
});

export default pageContentSlice.reducer;

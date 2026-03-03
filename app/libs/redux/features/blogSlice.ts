import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import { handleThunkError } from "@/app/hooks/handlingErr";
import { IUser } from "@/app/types/auth.types";

export interface IBlog {
  _id: string;
  title: string;
  description: string;
  image: {
    secure_url: string;
  };
  createdAt: string;
  [key: string]: any;
  userId: Partial<IUser>;
}

interface IBlogState {
  blog: IBlog[];
  loading: boolean;
  error: any;
}

const initialState: IBlogState = {
  blog: [],
  loading: false,
  error: null,
};

// --- Thunks ---

export const createBlogThunk = createAsyncThunk(
  "blog/createBlog",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/blog/create-blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const getBlogThunk = createAsyncThunk(
  "blog/getBlogs",
  async (month: string | undefined = undefined, { rejectWithValue }) => {
    try {
      const url = month ? `/blog?month=${month}` : "/blog";
      const { data } = await api.get(url);
      return data;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const updateBlogThunk = createAsyncThunk(
  "update/blog",
  async (
    { blogId, values }: { blogId: string; values: any },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.patch(`/blog/${blogId}`, values);
      return data;
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const deleteBlogThunk = createAsyncThunk(
  "delete/blog",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/blog/${id}`);

      return { id, data };
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

// --- Slice ---

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearBlogError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogThunk.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.blog =
          action.payload?.result ||
          action.payload?.blog ||
          action.payload ||
          [];
        state.error = null;
      })
      .addCase(getBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createBlogThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = null;

          const newBlog = action.payload.result.populatedBlog;

          if (newBlog) {
            state.blog = [newBlog, ...state.blog];
          }
        },
      )
      .addCase(createBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateBlogThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = null;
          const updateBlog = action.payload.result.updatedBlog;
          if (updateBlog) {
            state.blog = state.blog.map((b) => {
              if (b._id === updateBlog._id) {
                return updateBlog;
              }
              return b;
            });
          }
        },
      )
      .addCase(updateBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBlogThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.blog = state.blog.filter(
          (blog) => blog._id !== action.payload.id,
        );
      })
      .addCase(deleteBlogThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBlogThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;

import axios from "axios";

export const handleThunkError = (error: unknown, rejectWithValue: any) => {
  if (axios.isAxiosError(error)) {
    return rejectWithValue(error.response?.data || error.message);
  }
  return rejectWithValue((error as Error).message || "An unexpected error occurred");
};
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { IDonate } from "@/app/Components/Donate/Donate";
import { handleThunkError } from "@/app/hooks/handlingErr";

interface DonateState {
  donations: any[];
  isLoading: boolean;
  error: any;
  orderData: any;
  totalRevenue: number;
}

const initialState: DonateState = {
  donations: [],
  isLoading: false,
  error: null,
  orderData: null,
  totalRevenue: 0,
};

export const getAllDonationsThunk = createAsyncThunk(
  "all/donates",
  async (month: string | undefined = undefined, { rejectWithValue }) => {
    try {

      const url = month ? `/checkout?month=${month}` : "/checkout/";

      const { data } = await api.get(url);

      return data;
    } catch (error) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const donateWithPaypalThunk = createAsyncThunk(
  "donate/paypal",
  async (paymentData: IDonate, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/checkout/paypal", paymentData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.result;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

export const captureWithPaypalThunk = createAsyncThunk<any, string>(
  "paypal/capture",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/checkout/paypal/${orderId}`);
      return data.result;
    } catch (error: unknown) {
      return handleThunkError(error, rejectWithValue);
    }
  },
);

const donateSlice = createSlice({
  name: "donate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(donateWithPaypalThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(donateWithPaypalThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
      })
      .addCase(donateWithPaypalThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(captureWithPaypalThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(captureWithPaypalThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderData = action.payload;
        if (action.payload.totalRevenue) {
          state.totalRevenue = action.payload.totalRevenue;
        }
      })
      .addCase(captureWithPaypalThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getAllDonationsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllDonationsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
       const { allDonations, totalRevenue } = action.payload.result || action.payload;

        state.donations = allDonations || []; 
        state.totalRevenue = totalRevenue || 0;
      })
      .addCase(getAllDonationsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default donateSlice.reducer;

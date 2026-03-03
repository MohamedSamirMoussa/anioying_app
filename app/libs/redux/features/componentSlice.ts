import { createSlice } from "@reduxjs/toolkit";

// features/componentsSlice.ts
const componentsSlice = createSlice({
  name: "components",
  initialState: {
    items: [], 
    searchQuery: "",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = componentsSlice.actions;
export default componentsSlice.reducer;

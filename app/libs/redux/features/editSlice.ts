import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IEdit {
  isEditing: boolean | string;
  editingSection?: string | null;
}

const initialState: IEdit = {
  isEditing: false,
  editingSection: null,
};

const editSlice = createSlice({
  name: "edit",
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean | string | null>) => {
      state.isEditing = action.payload as string | boolean;
    },
    setSectionName: (state, action: PayloadAction<string | null>) => {
      state.editingSection = action.payload;
    },
    toggleEditing: (state) => {
      state.isEditing = !state.isEditing;
    },
  },
});

export const { setEditing, toggleEditing, setSectionName } = editSlice.actions;
export default editSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { themes as defaultThemes } from "@/app/hooks/themes";

interface ThemeProps {
  name?: string;
  players?: string;
  version?: string;
  color?: string;
  shadowColor?: string;
  hoverColor?: string;
  primaryColor?: string;
  gradient?: string;
  image: any;
  backgroundClip?: string;
  WebkitTextFillColor?: string;
}

export interface ServerState {
  activeServer: string;
  themes: Record<string, ThemeProps>;
}

const initialState: ServerState = {
  activeServer: "1",
  themes: defaultThemes,  
};

export const themeSlice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setActiveServer: (state, action: PayloadAction<string>) => {
      state.activeServer = action.payload;
    },

    updateTheme: (
      state,
      action: PayloadAction<{
        serverKey: string;
        values: Partial<ThemeProps>;
      }>
    ) => {
      const { serverKey, values } = action.payload;

      state.themes[serverKey] = {
        ...state.themes[serverKey],
        ...values,
      };
    },
  },
});

export const { setActiveServer, updateTheme } = themeSlice.actions;
export default themeSlice.reducer;

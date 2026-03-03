import { configureStore, combineReducers } from "@reduxjs/toolkit";
import auth from "./features/authSlice";
import theme from "./features/themeSlice";
import leaderboard from "./features/leaderboardSlice";
import donate from "./features/donateSlice";
import blogs from "./features/blogSlice";
import edit from "./features/editSlice";
import dashboard from "./features/dashboardSlice";
import notification from "./features/notificationSlice";
import pageContent from "./features/pageContentSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
const persistConfig = {
  key: "anoing_v4",
  version:4,
  storage,
  migrate: (state: any) => {
    if (state && state.theme && !state.theme.themes) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(state);
  },
  whitelist: ["auth", "theme", "leaderboard", "donate", "blogs", "pageContent" , "edit" , "dashboard" , "notification"],
};

const appReducer = combineReducers({
  auth,
  theme,
  leaderboard,
  donate,
  blogs,
  pageContent,
  edit,
  dashboard,
  notification
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout" || action.type === "auth/logout/fulfilled") {
    storage.removeItem("persist:anoing_v3");
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import axios from "axios";
import toast from "react-hot-toast";
import { AppDispatch } from "../redux/store";
import { logout } from "../redux/features/authSlice";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACK_END_URI}/api/v1`,
  withCredentials: true,
});

let isToastActive = false;

export const setupApiInterceptors = (dispatch: AppDispatch) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;
      const message = error.response?.data?.errMessage || error.response?.data?.error || "";

      if (status === 401 || message.toLowerCase().includes("expired")) {
        const isAuthPage = window.location.pathname.includes("/auth");

        if (typeof window !== "undefined" && !isAuthPage) {
          const { persistor } = await import("../redux/store");

          if (!isToastActive) {
            isToastActive = true;
            dispatch(logout()); 

            await persistor.purge();
            document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            localStorage.clear();

            toast.error("Your session has ended. Please login.");

            setTimeout(() => {
              isToastActive = false;
              window.location.href = '/auth'
            }, 1500);
          }
        }
      }
      return Promise.reject(error);
    },
  );
};

export default api;
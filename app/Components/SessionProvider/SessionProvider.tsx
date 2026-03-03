"use client";
import { checkAuthThunk } from "@/app/libs/redux/features/authSlice";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SessionMonitor() {
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const isLogged = user?.isLogged || !!user;

  useEffect(() => {
    if (!isLogged) return;

    const verifySession = async () => {
      const res = await dispatch(checkAuthThunk(undefined));

      if (res.type.includes("rejected")) {
        console.log("CheckAuth Failed Payload:", res.payload);
      }
    };

    const timeoutId = setTimeout(verifySession, 3000);

    const interval = setInterval(verifySession, 60000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [isLogged, dispatch]);

  return null;
}

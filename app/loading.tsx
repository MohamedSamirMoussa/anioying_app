"use client"
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { SyncLoader  } from "react-spinners";

const Page = () => {
  const activeTab =
    useSelector((state: RootState) => state.theme.activeServer);
  const currentTheme = themes[activeTab];

  return (
    <div className="h-screen max-w-full flex justify-center items-center bg-[#12121a] z-[999999999] fixed top-0 left-0 right-0 bottom-0">
      <SyncLoader   color={currentTheme.color} />
    </div>
  );
};

export default Page;

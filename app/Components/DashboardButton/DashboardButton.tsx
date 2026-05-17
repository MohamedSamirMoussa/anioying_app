import { RootState } from "@/app/libs/redux/store";
import { RoleEnum } from "@/app/types/auth.types";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

const DashboardButton = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const hasPermission =
    user?.role === RoleEnum.admin ||
    user?.role === RoleEnum.super;

  if (!hasPermission) return null;

  return (
    <div className="fixed top-10 left-10 z-50">
      <Link
        href="/dashboard"
        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white shadow-lg transition-all duration-300 hover:bg-blue-600 hover:scale-110 animate-floating"
      >
        <FontAwesomeIcon icon={faChartLine} className="text-lg" />

        <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/80 text-white text-xs rounded py-1 px-2 whitespace-nowrap pointer-events-none">
          Dashboard
        </span>
      </Link>
    </div>
  );
};

export default DashboardButton;
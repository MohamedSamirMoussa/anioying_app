"use client";

import Blogs from "@/app/Components/Blogs/Blogs";
import { themes } from "@/app/hooks/themes";
import { getBlogThunk } from "@/app/libs/redux/features/blogSlice";
import {
  getAllUsersForAdmin,
  IMCServer,
} from "@/app/libs/redux/features/dashboardSlice";
import { getAllDonationsThunk } from "@/app/libs/redux/features/donateSlice";
import { AppDispatch } from "@/app/libs/redux/store";
import { IUser } from "@/app/types/auth.types";
import {
  faCalendar,
  faHandHoldingHeart,
  faHome,
  faImages,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { memo, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

export interface DashboardProps {
  setActiveTab?: (tab: string) => void;
  users?: {
    webUsers: IUser[];
    gameUsers: IUser[];
  };
  totalRevenue: number;
  activeServer: string; // المعرف القادم من الـ Selector
  blog?: any[];
  isLogged?: boolean;
  user?: IUser;
  mcServers?: IMCServer[]; // المصفوفة الفعلية
}

// --- Logic Helpers ---

const timeAgo = (dateString: string) => {
  if (!dateString) return "...";
  const seconds = Math.floor(
    (new Date().getTime() - new Date(dateString).getTime()) / 1000,
  );
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const formatToGB = (mbValue: any) => {
  if (!mbValue) return "0 GB";
  const numericValue =
    typeof mbValue === "string"
      ? parseFloat(mbValue.replace(/[^\d.-]/g, ""))
      : mbValue;
  if (isNaN(numericValue)) return "0 GB";
  return `${(numericValue / 1024).toFixed(2)} GB`;
};

const calculatePercent = (value: any, type: "cpu" | "mem" | "disk") => {
  if (!value) return "0%";
  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d.-]/g, ""))
      : value;
  if (isNaN(num)) return "0%";

  if (type === "cpu") return `${Math.min(num, 100)}%`;

  const limits = { mem: 16384, disk: 102400 };
  const limit = type === "mem" ? limits.mem : limits.disk;
  return `${Math.min((num / limit) * 100, 100)}%`;
};

// --- Components ---

const Dashboard = memo(
  ({
    setActiveTab,
    users,
    totalRevenue,
    activeServer,
    blog,
    isLogged,
    user,
    mcServers,
  }: DashboardProps) => {
    const server = useMemo(() => {
      if (!mcServers || !activeServer) return null;

      // 1. نجيب بيانات الثيم المختار
      const currentTheme = themes[activeServer];

      const targetId = currentTheme?.id;
      const targetName = currentTheme?.name;

      return mcServers.find(
        (s) =>
          s.id === targetId ||
          s.id === activeServer ||
          s.name?.toLowerCase() === targetName?.toLowerCase(),
      );
    }, [mcServers, activeServer]);

    const dispatch: AppDispatch = useDispatch();
    const webUsers = users?.webUsers || [];
    const gameUsers = users?.gameUsers || [];
    const theme = themes[activeServer] || themes["default"];
    const onlineCount =
      gameUsers?.filter((u: IUser) => u.is_online).length || 0;
    const [selectedMonth, setSelectedMonth] = useState<string>("This Month");

    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const month = e.target.value;
      if (month) {
        setSelectedMonth(month);
        dispatch(getAllUsersForAdmin(month));
        dispatch(getBlogThunk(month));
        dispatch(getAllDonationsThunk(month));
      }
    };

    return (
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 text-white font-orbitron">
            <span
              className="w-10 h-10 flex justify-center items-center text-xl rounded-xl shadow-lg"
              style={{ background: theme.gradient }}
            >
              <FontAwesomeIcon icon={faHome} />
            </span>
            <h3 className="font-bold text-2xl tracking-wider">Dashboard</h3>
          </div>
          <div className="relative group">
            <input
              type="month"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleMonthChange}
              onClick={(e) => (e.currentTarget as any).showPicker()}
            />
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm flex items-center gap-4 group-hover:bg-white/10 transition-all min-w-[140px] justify-between">
              <span className="text-white/50 font-medium">{selectedMonth}</span>
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-white/30 text-base"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={faUsers}
              label="Total Players"
              value={gameUsers.length}
              theme={theme}
              extra={`${onlineCount} Online`}
            />
            <StatCard
              icon={faImages}
              label="Total Posts"
              value={blog?.length || 0}
              theme={theme}
            />
            <StatCard
              icon={faHandHoldingHeart}
              label="Total Donations"
              value={`$${totalRevenue}`}
              theme={theme}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Posts */}
            <div className="bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col h-[500px]">
              <div className="flex justify-between items-center mb-4 text-white">
                <p className="font-semibold">Recent Posts</p>
                <Link
                  href="/gallery"
                  className="text-xs opacity-50 hover:opacity-100"
                >
                  View All
                </Link>
              </div>
              <div
                className="overflow-y-auto scrollbar-thin 
               scrollbar-thumb-white/20 
               scrollbar-track-white/5 
               hover:scrollbar-thumb-white/40 
               scrollbar-thumb-rounded-full 
               scrollbar-track-rounded-full transition-all px-2 pb-10"
              >
                <Blogs
                  theme={theme}
                  isLogged={isLogged}
                  blogs={blog}
                  user={user}
                />
              </div>
            </div>

            {/* Users & Server Monitoring */}
            <div className="flex flex-col gap-6">
              <div className="bg-black/20 p-5 rounded-2xl border border-white/5 text-white">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-semibold">Last Sign in</p>
                  <button
                    onClick={() => {
                      if (setActiveTab) {
                        setActiveTab("Users");
                      }
                    }}
                    className="text-xs bg-white/5 px-3 py-1 rounded-full"
                  >
                    View All
                  </button>
                </div>
                <ul
                  className="space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin 
               scrollbar-thumb-white/20 
               scrollbar-track-white/5 
               hover:scrollbar-thumb-white/40 
               scrollbar-thumb-rounded-full 
               scrollbar-track-rounded-full"
                >
                  {webUsers.slice(0, 5).map((u: IUser) => (
                    <li
                      key={u._id}
                      className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex justify-center items-center text-xs text-white"
                          style={{ background: theme.gradient }}
                        >
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold">{u.username}</p>
                          <p className="opacity-40">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] opacity-40">
                        {timeAgo(u.createdAt)}
                      </span>
                    </li>
                  ))}
                  {webUsers.slice(0, 5).map((u: IUser) => (
                    <li
                      key={u._id}
                      className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-lg flex justify-center items-center text-xs text-white"
                          style={{ background: theme.gradient }}
                        >
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <div className="text-xs">
                          <p className="font-bold">{u.username}</p>
                          <p className="opacity-40">{u.email}</p>
                        </div>
                      </div>
                      <span className="text-[10px] opacity-40">
                        {timeAgo(u.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Server Stats Section */}
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-5 h-full text-white">
                <span className="font-semibold py-3 font-orbitron tracking-widest block">
                  Server : {server?.name || "N/A"}
                </span>
                <p className="font-semibold mb-2">System Resources</p>

                <ProgressBar
                  label="CPU Usage"
                  displayValue={server?.usage?.cpu || "0%"}
                  percentValue={calculatePercent(server?.usage?.cpu, "cpu")}
                  gradient={theme.gradient}
                />

                <ProgressBar
                  label="RAM Usage"
                  displayValue={formatToGB(server?.usage?.memory)}
                  percentValue={calculatePercent(server?.usage?.memory, "mem")}
                  gradient={theme.gradient}
                />

                <ProgressBar
                  label="Disk Usage"
                  displayValue={formatToGB(server?.usage?.disk)}
                  percentValue={calculatePercent(server?.usage?.disk, "disk")}
                  gradient={theme.gradient}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

const StatCard = ({ icon, label, value, theme, extra }: any) => (
  <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between text-white">
    <div className="flex items-center gap-4">
      <span
        className="w-12 h-12 flex justify-center items-center text-xl rounded-2xl text-white shadow-inner"
        style={{ background: theme.gradient }}
      >
        <FontAwesomeIcon icon={icon} />
      </span>
      <div>
        <p className="text-white/40 text-[10px] uppercase tracking-widest">
          {label}
        </p>
        <p className="text-xl font-bold font-orbitron">{value}</p>
      </div>
    </div>
    {extra && (
      <div className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded-md">
        {extra}
      </div>
    )}
  </div>
);

// --- ProgressBar Logic Fixed ---
const ProgressBar = ({
  label,
  displayValue,
  percentValue,
  sub,
  gradient,
}: any) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] uppercase tracking-tighter">
        <span>
          {label} <span className="opacity-30 ml-2">{sub}</span>
        </span>
        <span className="font-bold font-orbitron text-white">
          {displayValue}
        </span>
      </div>
      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{ width: percentValue, background: gradient }} // percentValue هو دائماً %
        />
      </div>
    </div>
  );
};

Dashboard.displayName = "Dashboard";
export default Dashboard;

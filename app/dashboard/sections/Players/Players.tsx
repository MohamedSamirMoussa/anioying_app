import { themes } from "@/app/hooks/themes";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  IUserDashboard,
  toggleSupporterThunk,
} from "@/app/libs/redux/features/dashboardSlice";
import toast from "react-hot-toast";

const LeaderboardCard = React.lazy(
  () => import("@/app/Components/LeaderboardCard/LeaderboardCard"),
);

interface UsersComponentProps {
  users: IUserDashboard;
}

const Players = ({ users }: UsersComponentProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { activeServer } = useSelector((s: RootState) => s.theme);
  
  if (!users) return null;

  const gameUsers = users.gameUsers;
  const currentTheme = themes[activeServer] || themes["1"];

  const handleToggleSupporter = async (
    username: string,
  ) => {
    const loading = toast.loading(`Updating ${username} status...`);
    try {
      const res = await dispatch(toggleSupporterThunk(username)).unwrap();
      
      toast.success(`Status updated for ${username}! 👑`, { id: loading });
    } catch (err: any) {
      toast.error(err.message || "Failed to update status", { id: loading });
    }
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="my-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="w-14 h-14 flex justify-center items-center rounded-2xl text-2xl shadow-lg transition-all duration-500"
            style={{ 
                background: currentTheme.gradient,
                boxShadow: `0 0 20px ${currentTheme.shadowColor}` 
            }}
          >
            <FontAwesomeIcon icon={faUsers} className="text-white" />
          </span>
          <p className="text-3xl font-bold font-orbitron text-white tracking-tight">
            All Players
          </p>
        </div>

        {/* زر المتجر - ممكن تخليه يفتح لينك خارجي بدل Toggle */}
        <button
          
          className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-orbitron text-[10px] hover:bg-white/10 transition-all active:scale-95"
        >
          Store Support
        </button>
      </div>

      {/* Leaderboard Table Container */}
      <div className="p-6 lg:p-12 h-full w-full bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* تأثير توهج خلفي خفيف */}
        <div 
          className="absolute -top-20 -right-20 w-64 h-64 blur-[100px] rounded-full opacity-10 pointer-events-none"
          style={{ backgroundColor: currentTheme.color }}
        />

        <React.Suspense fallback={<div className="text-white font-orbitron animate-pulse p-10">Syncing with database...</div>}>
          <LeaderboardCard
            filteredLeaderboard={gameUsers}
            currentTheme={currentTheme}
            onToggleSupporter={handleToggleSupporter} 
          />
        </React.Suspense>
      </div>
    </div>
  );
};

export default Players;
"use client";

import { themes } from "@/app/hooks/themes";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import {
  faUsers,
  faUserShield,
  faUserAltSlash,
  faCalendarAlt,
  faUser,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import {
  BlockEnum,
  blockThunk,
  IUserDashboard,
  giveAdminPermissionThunk,
} from "@/app/libs/redux/features/dashboardSlice";
import toast from "react-hot-toast";
import { RoleEnum } from "@/app/types/auth.types";

interface UsersComponentProps {
  users: IUserDashboard;
}

const Users = ({ users }: UsersComponentProps) => {
  const dispatch: AppDispatch = useDispatch();
  const webUsers = users?.webUsers;
  const { activeServer } = useSelector((s: RootState) => s.theme);
  const currentTheme = themes[activeServer];
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.dashboard);

  // منطق الحظر / فك الحظر
  const handleToggleBlock = async (userId: string, currentStatus: string) => {
    const block =
      currentStatus === BlockEnum.block ? BlockEnum.unblock : BlockEnum.block;

    const res = await dispatch(blockThunk({ userId, block }));

    if (res.meta.requestStatus === "fulfilled") {
      toast.success(res.payload.message);
    } else {
      toast.error(res.payload.errMessage || "Failed to update block status");
    }
  };

  // منطق ترقية المستخدم لـ Admin
  const handleRoleUpgrade = async (userId: string) => {
    if (
      window.confirm("Are you sure you want to promote this user to Admin?")
    ) {


      const res = await dispatch(giveAdminPermissionThunk(userId));
      
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("User promoted to Admin successfully!");
      } else {
        toast.error(res.payload?.errMessage || "Promotion failed");
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between bg-white/5 p-6 rounded-3xl backdrop-blur-md border border-white/10 shadow-xl">
        <div className="flex items-center gap-5">
          <div
            className="w-14 h-14 flex justify-center items-center rounded-2xl text-2xl shadow-lg transition-transform hover:scale-110"
            style={{ background: currentTheme.gradient }}
          >
            <FontAwesomeIcon icon={faUsers} className="text-white" />
          </div>
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest">
              Management
            </p>
            <h2 className="text-4xl font-extrabold text-white">All Users</h2>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-white/50 text-sm">Total Web Users</p>
          <p className="text-2xl font-mono font-bold text-white">
            {webUsers?.length || 0}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/70 uppercase text-[10px] tracking-widest font-bold">
                <th className="px-8 py-5">User Info</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5">Current Role</th>
                <th className="px-8 py-5 text-right">Access Control</th>
                {currentUser?.role === RoleEnum.super && (
                  <th className="px-8 py-5 text-right">Privileges</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {webUsers?.map((user) => {
                const isUserBlocked = user.isBlocked === BlockEnum.block;
                const isMe = user._id === currentUser?._id;
                const isSuperAdmin = currentUser?.role === RoleEnum.super;

                return (
                  <tr
                    key={user._id}
                    className="group hover:bg-white/[0.03] transition-colors duration-200"
                  >
                    {/* User Info */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-white/10 ${isMe ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black" : ""}`}
                          style={{
                            background: isMe
                              ? currentTheme.gradient
                              : "rgba(255,255,255,0.1)",
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-semibold flex items-center gap-2">
                            {user.username}
                            {isMe && (
                              <span className="text-[9px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">
                                YOU
                              </span>
                            )}
                          </span>
                          <span className="text-white/40 text-xs">
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-white/60 text-sm">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-xs opacity-40"
                        />
                        {new Date(user.createdAt).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="px-8 py-5">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          user.role === RoleEnum.super
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                            : user.role === RoleEnum.admin
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                              : "bg-white/5 text-white/40 border-white/10"
                        }`}
                      >
                        <FontAwesomeIcon icon={faUser} className="text-[8px]" />
                        {user.role}
                      </div>
                    </td>

                    {/* Block Action */}
                    <td className="px-8 py-5 text-right">
                      {!isMe && (
                        <button
                          onClick={() =>
                            handleToggleBlock(user._id, user.isBlocked)
                          }
                          disabled={loading || user.role === RoleEnum.super}
                          className={`px-5 py-2 rounded-xl font-bold text-[10px] tracking-tight transition-all duration-300 disabled:opacity-20
                            ${
                              isUserBlocked
                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white"
                                : "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white"
                            }`}
                        >
                          <FontAwesomeIcon
                            icon={isUserBlocked ? faUserShield : faUserAltSlash}
                            className="mr-2"
                          />
                          {isUserBlocked ? "ACTIVATE" : "BLOCK"}
                        </button>
                      )}
                    </td>

                    {/* Privilege Management (SuperAdmin Only) */}
                    {isSuperAdmin && (
                      <td className="px-8 py-5 text-right">
                        {!isMe && user.role !== RoleEnum.super && (
                          <button
                            onClick={() => handleRoleUpgrade(user._id)}
                            disabled={loading}
                            className={`px-5 py-2 rounded-xl font-bold text-[10px] tracking-tight transition-all duration-300 active:scale-95 shadow-lg
          ${
            user.role === RoleEnum.admin
              ? "bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white"
              : "bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-white"
          }`}
                          >
                            <span className="flex items-center justify-center gap-2">
                              <FontAwesomeIcon
                                icon={
                                  user.role === RoleEnum.admin
                                    ? faUserAltSlash
                                    : faArrowUp
                                }
                              />
                              {user.role === RoleEnum.admin
                                ? "REVOKE ADMIN"
                                : "GIVE ADMIN"}
                            </span>
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;

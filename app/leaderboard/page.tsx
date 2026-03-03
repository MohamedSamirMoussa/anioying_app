"use client";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { AppDispatch, RootState } from "../libs/redux/store";
import { themes } from "../hooks/themes";
const LiveSearch = React.lazy(
  () => import("../Components/LiveSearch/LiveSearch"),
);
import { setActiveServer } from "../libs/redux/features/themeSlice";
import { SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faInfo,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { getLeaderboardThunk } from "../libs/redux/features/leaderboardSlice";
import { createSocket } from "../hooks/createSocket";
import LeaderboardCard from "../Components/LeaderboardCard/LeaderboardCard";
import ServerTabs from "../Components/ServerTabs/ServerTabs";

export interface LeaderboardUser {
  username: string;
  is_online: boolean;
  playTime: { hours: number; minutes: number; seconds: number };
  lastSeen: string | null;
  avatar?: string;
  _id?: string;
  isSupported?: {
    status: boolean;
    name?: string;
  };
}

/* -------------------- Component -------------------- */
export default function Leaderboard() {
  const dispatch: AppDispatch = useDispatch();
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer,
  );

  const currentTheme = themes[activeServer];
  const socketRef = useRef<Socket | null>(null);

  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalPages, setTotalPages] = useState(1);

  /* -------------------- Socket Init -------------------- */
  useEffect(() => {
    if (socketRef.current) return;
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("select_server", { serverName: activeServer, page, limit });
    });

    socket.on("leaderboard_updates", (data) => {
      if (data.serverName !== activeServer.toLowerCase()) return;
      setLeaderboard(data.leaderboard);
      setOnlineCount(data.onlineCount);
      setTotalPages(data.pagination.totalPages);
      setTotalPlayers(data.pagination.totalPlayers);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeServer, page]);

  useEffect(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", {
        serverName: activeServer,
        page,
        limit,
      });
    }
    dispatch(getLeaderboardThunk(activeServer));
  }, [activeServer, page, dispatch]);

  /* -------------------- Filtering Logic -------------------- */
  const filteredLeaderboard = leaderboard.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleServerButtonClick = (serverKey: string) => {
    setPage(1);
    dispatch(setActiveServer(serverKey));
  };

  return (
    <div className="leaderboard-container min-h-screen md:w-[70%] xl:w-[60%] mx-auto py-20 px-4">
      <div className="py-10">
        <div className="tabs-container flex flex-col lg:flex-row items-center p-6 rounded-3xl bg-[#ffffff05] border border-[#ffffff10] gap-8 backdrop-blur-md">
          <div className="right lg:w-1/2">
            <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-white">
              Playtime Leaderboard
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span
                style={{ color: currentTheme.color }}
                className="font-orbitron font-bold text-lg"
              >
                {totalPlayers} players
              </span>
              <span className="text-sm text-green-400 font-bold">
                {onlineCount} online
              </span>
            </div>
          </div>

          <div className="left flex flex-col items-center gap-6 z-50 lg:w-1/2">
            <LiveSearch
              currentTheme={currentTheme}
              onSearch={(val) => setSearchTerm(val)}
            />

            <ServerTabs
              handleServerButtonClick={handleServerButtonClick}
              activeServer={activeServer}
            />
          </div>
        </div>
      </div>

      {loading && leaderboard.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <SyncLoader color={currentTheme.color} />
        </div>
      ) : filteredLeaderboard.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No players found matching {searchTerm}
          </p>
        </div>
      ) : (
        <>
          <LeaderboardCard
            page={page}
            filteredLeaderboard={filteredLeaderboard}
            currentTheme={currentTheme}
            limit={limit}
          />

          {!searchTerm && (
            <div className="flex justify-center items-center gap-6 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-white text-sm">
                Page {page} / {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-white/10 rounded-lg text-white disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <div className="leaderboard-footer my-5 py-8 px-6 rounded-2xl flex flex-col lg:flex-row items-center gap-5 bg-[##111119] z-50 border-2 border-white/5">
        <div className="desc w-full flex items-center gap-3 lg:w-2/3 bg-[#00000033] p-3 rounded-2xl border border-white/5 hover:-translate-y-2 transition-all duration-300">
          <span
            className="w-8 h-8 rounded-full p-2 flex justify-center items-center"
            style={{ background: currentTheme.gradient }}
          >
            <FontAwesomeIcon icon={faInfo} />
          </span>
          <h3 className="text-white lg:text-xl">
            Playtime is tracked automatically. Play more to climb the ranks!
          </h3>
        </div>
        <div
          className="all-players gap-2 flex items-center justify-center lg:flex-col w-full py-3 text-2xl lg:w-1/3 bg-[#00000033] p-3 rounded-2xl border border-white/5"
          style={{ color: currentTheme.color }}
        >
          <FontAwesomeIcon icon={faUsers} />
          <span>{totalPlayers} Players</span>
        </div>
        <div
          className="showing text-2xl gap-2 flex items-center justify-center lg:flex-col w-full lg:w-1/3 bg-[#00000033] p-3 rounded-2xl border border-white/5"
          style={{ color: currentTheme.color }}
        >
          <div>
            <FontAwesomeIcon icon={faChartLine} /> {onlineCount}
          </div>
          <span>Online</span>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import Image from "next/image";
import {
  faBoxOpen,
  faCheck,
  faCopy,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import { setActiveServer } from "@/app/libs/redux/features/themeSlice";
import { themes } from "@/app/hooks/themes";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { useEffect, useRef, useState } from "react";
import { getLeaderboardThunk } from "@/app/libs/redux/features/leaderboardSlice";
import { Socket } from "socket.io-client";

import { LeaderboardUser } from "./../../leaderboard/page";
import { getPageContentThunk } from "@/app/libs/redux/features/pageContentSlice";
import {
  setEditing,
  setSectionName,
} from "@/app/libs/redux/features/editSlice";
import dynamic from "next/dynamic";
import useSectionEditor from "@/app/hooks/useSectionEditor";
import { createSocket } from "@/app/hooks/createSocket";
import ServerTabs from "../ServerTabs/ServerTabs";
import toast from "react-hot-toast";

const HomeSlider = dynamic(() => import("@/app/Components/HomeSlider/Slider"), {
  ssr: false,
  loading: () => (
    <div className="flex gap-2 items-center justify-center bg-white/5 rounded-xl animate-pulse" />
  ),
});

const Home = () => {
  const dispatch: AppDispatch = useDispatch();

  // --- UI States ---
  const [copied, setCopied] = useState<boolean>(false);
  // --- Socket & Leaderboard States ---
  const socketRef = useRef<Socket | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<
    LeaderboardUser[]
  >([]);

  // --- Redux Selectors ---
  const { activeServer } = useSelector((state: RootState) => state.theme);
  const { sectionData } = useSelector((state: RootState) => state.pageContent);
  const currentTheme = themes[activeServer] || themes["3"];

  const section = sectionData["home"];

  // -------------------- Socket.IO Setup --------------------
  useEffect(() => {
    if (socketRef.current) return;

    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("select_server", { serverName: activeServer });
    });

    socket.on("leaderboard_updates", (data) => {
      if (data.serverName !== activeServer.toLowerCase()) return;

      setOnlineCount(data.onlineCount);
      setTotalPlayers(data.pagination.totalPlayers);
      setLeaderboardPlayers(data.leaderboard);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [activeServer]);

  // -------------------- Initial Data Fetching --------------------
  useEffect(() => {
    dispatch(getPageContentThunk("home"));
  }, [dispatch]);

  // -------------------- Server Change Handling --------------------
  useEffect(() => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", { serverName: activeServer });
    }
    dispatch(getLeaderboardThunk(activeServer));
  }, [activeServer, dispatch]);

  const handleTabChange = (tabName: string) => {
    dispatch(setActiveServer(tabName));
    if (socketRef.current?.connected) {
      socketRef.current.emit("select_server", tabName);
    }
    dispatch(getLeaderboardThunk(tabName));
  };

  // -------------------- Handlers --------------------
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      return toast.error(err.message || "Failed to copy");
    }
  };

  // -------------------- Formik Setup --------------------
  const { formik, isEditing, isSectionActive } = useSectionEditor({
    sectionName: "home",
    initialValues: {
      servers: section?.servers || {},
    },
  });

  // -------------------- Current Server Data Extraction --------------------
  const currentData = formik.values.servers?.[activeServer] || {};
  const displayTitle = currentData.title || "Anoing";
  const displaySubTitle = currentData.subTitle || "Close Friends";
  const displayDesc =
    currentData.description || "Your Ultimate Minecraft Adventure Awaits";
  const displayIp =
    currentData.ipAddress ||
    `play.${currentTheme.name?.toLowerCase() || "anoing"}.com`;
  const displayVersion = currentData.version || "1.20.4";
  const displayShowIP = currentData.showIP !== false;
  const displayDiscoverText = currentData.discoverText || "discover more";

  if (!sectionData) return null;

  // -------------------- Render --------------------
  return (
    <div id="home" className="my-35 py-35 md:my-0 md:pt-0">
      {/* ----------------- Edit Controls ----------------- */}
      {isEditing && !isSectionActive && (
        <button
          className="bg-red-600 text-white rounded px-4 py-2 fixed top-2 left-2 z-50 hover:bg-red-700 transition-colors"
          onClick={() => {
            dispatch(setEditing(false));
            dispatch(setSectionName(null));
            formik.resetForm();
          }}
        >
          Exit Live Edit
        </button>
      )}

      <div className="absolute top-5 right-5 z-50 flex gap-2 p-3">
        {isEditing && !isSectionActive && (
          <button
            className="bg-blue-600/80 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow-xl backdrop-blur-sm transition-all text-sm font-bold"
            onClick={() => dispatch(setSectionName("home"))}
          >
            Edit Home ({currentTheme.name})
          </button>
        )}

        {isSectionActive && (
          <div className="flex gap-2 bg-black/60 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-1.5 rounded-xl transition-all text-xs font-bold"
              onClick={() => {
                dispatch(setSectionName(null));
                formik.resetForm();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500/80 hover:bg-green-500 text-white px-4 py-1.5 rounded-xl transition-all text-xs font-bold"
              onClick={() => formik.handleSubmit()}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* ----------------- Main Content ----------------- */}
      <div className="container lg:w-[65%] min-h-screen mx-auto flex flex-col md:flex-row gap-10 lg:gap-5 justify-center items-center px-4 py-10 lg:py-0">
        {/* Modpack Image */}
        <figure className="relative transition-all duration-500 ease-in-out animate-floating w-[60%] md:w-[40%] lg:w-3/6 flex-shrink-0">
          <Image
            key={currentTheme.name}
            src={currentTheme.image}
            alt={`${currentTheme.name} modpack`}
            width={300}
            height={300}
            priority
            className="drop-shadow-2xl transition-opacity duration-300 w-full h-full mx-auto"
          />
        </figure>

        <div className="description w-full lg:flex-1 min-w-0 text-center lg:text-left">
          <h1 className="font-orbitron flex flex-col justify-center">
            {/* Title */}
            <span
              key={`title-${activeServer}-${String(isSectionActive)}`}
              contentEditable={isSectionActive as boolean}
              suppressContentEditableWarning
              onBlur={(e) =>
                formik.setFieldValue(
                  `servers.${activeServer}.title`,
                  e.currentTarget.textContent || "",
                )
              }
              className={`lg:text-8xl text-7xl py-2 font-extrabold transition-all duration-300 w-full ${
                isSectionActive
                  ? "outline-1 px-2 outline-amber-400 pb-7 rounded-2xl"
                  : "outline-0"
              }`}
              style={{
                backgroundImage: currentTheme?.gradient,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {displayTitle}
            </span>

            {/* SubTitle / Close Friends */}
            <span
            
              className={`close h-fit transition-colors duration-300 translate-x-37 translate-y-17.5 lg:translate-x-47 lg:translate-y-23.5 z-0`}
              style={{
                backgroundImage: currentTheme?.gradient,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {displaySubTitle}
            </span>
          </h1>

          {/* Description */}
          <p
            key={`desc-${activeServer}-${String(isSectionActive)}`}
            contentEditable={isSectionActive as boolean}
            suppressContentEditableWarning
            className={`${
              isSectionActive
                ? "outline-1 outline-amber-300 my-3 px-2 cursor-text rounded-2xl py-2 cursor-text"
                : "outline-0"
            } transition-all duration-300`}
            onBlur={(e) => {
              formik.setFieldValue(
                `servers.${activeServer}.description`,
                e.currentTarget.textContent || "",
              );
            }}
            style={{ color: currentTheme.color }}
          >
            {displayDesc}
          </p>

          <div className="servers my-3">
            {/* Server Tabs */}
            <div className="my-3 w-full">
              <ServerTabs
                activeServer={activeServer}
                handleServerButtonClick={handleTabChange}
                leaderboardPlayers={leaderboardPlayers}
                isSectionActive={isSectionActive as boolean}
                formik={formik}
              />
            </div>

            {/* Server Info: Online / Version */}
            <div className="my-3 flex justify-center items-center gap-2">
              <div className="players rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333] hover:-translate-y-0.5 transition-all duration-300 brightness-70 hover:brightness-105">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faUsers} className="text-3xl" />
                </span>
                <p className="flex flex-col">
                  <span className="text-white">
                    {onlineCount}/{totalPlayers}
                  </span>
                  <span className="text-gray-400 text-[12px]">
                    Online Players
                  </span>
                </p>
              </div>

              <div className="mod rounded-xl p-2 w-full flex items-center gap-2 bg-[#222] border border-[#333] hover:-translate-y-0.5 transition-all duration-300 brightness-70 hover:brightness-105">
                <span style={{ color: currentTheme.color }}>
                  <FontAwesomeIcon icon={faBoxOpen} className="text-3xl" />
                </span>
                <p className="flex flex-col">
                  <span className="text-gray-400 text-sm">version:</span>
                  <span
                    key={`version-${activeServer}-${String(isSectionActive)}`}
                    contentEditable={isSectionActive as boolean}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      formik.setFieldValue(
                        `servers.${activeServer}.version`,
                        e.currentTarget.textContent || "",
                      );
                    }}
                    className={`${isSectionActive ? "border-dashed border-2 border-green-500 rounded-2xl px-2 py-1 focus:outline-0 cursor-text" : ""}`}
                  >
                    {displayVersion}
                  </span>
                </p>
              </div>
            </div>

            {/* Copy IP Input */}
            <div className="my-3 relative group hover:-translate-y-0.5 transition-all duration-300 brightness-70 hover:brightness-105">
              {/* زر التحكم (Toggle) - يظهر فقط وقت التعديل */}
              {isSectionActive && (
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue(
                      `servers.${activeServer}.showIP`,
                      !displayShowIP,
                    );
                  }}
                  className={`mb-2 text-[10px] uppercase tracking-wider font-black px-3 py-1 rounded-lg transition-all border ${
                    displayShowIP
                      ? "bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20"
                      : "bg-orange-500/10 text-orange-500 border-orange-500/50 hover:bg-orange-500/20"
                  }`}
                >
                  {displayShowIP ? "👁️ Public Mode" : "🚧 Coming Soon Mode"}
                </button>
              )}

              <div
                className={`relative group transition-all duration-300 ${isSectionActive ? "hover:-translate-y-0.5" : ""}`}
              >
                {/* الـ Input الرئيسي */}
                <input
                  key={`ipAddress-${activeServer}-${String(isSectionActive)}`}
                  type="text"
                  value={displayShowIP ? displayIp : "Coming Soon..."}
                  readOnly={!isSectionActive || !displayShowIP}
                  disabled={!isSectionActive || !displayShowIP}
                  onChange={(e) => {
                    formik.setFieldValue(
                      `servers.${activeServer}.ipAddress`,
                      e.target.value,
                    );
                  }}
                  className={`w-full py-4 px-4 ip rounded-xl font-mono text-sm transition-all duration-300 
                    ${
                      displayShowIP
                        ? "bg-[#1a1a1a] text-gray-300 border border-transparent"
                        : "bg-orange-500/5 text-orange-500/60 border border-orange-500/20 text-center italic tracking-widest"
                    }
                    ${isSectionActive && displayShowIP ? "cursor-text border-dashed !border-green-500" : "cursor-default"}
                  `}
                />

                {/* زر النسخ - يتعطل ويختفي لو في وضع Coming Soon أو وضع التعديل */}
                {displayShowIP && !isSectionActive && (
                  <button
                    type="button"
                    onClick={() => handleCopy(displayIp)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#333] rounded-lg transition-all duration-300 text-gray-400 hover:text-white"
                    title="Copy IP Address"
                  >
                    {copied ? (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="text-green-500"
                      />
                    ) : (
                      <FontAwesomeIcon icon={faCopy} />
                    )}
                  </button>
                )}

                {/* إشعار الـ Copied */}
                {copied && (
                  <span className="absolute -top-8 right-0 text-xs font-bold text-green-500 animate-bounce">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="flex items-center">
              <div className="my-1 max-w-max">
                <HomeSlider leaderboard={leaderboardPlayers} />
              </div>
            </div>

            {/* Discover More */}
            <div className="discover my-3 flex justify-center items-center hover:-translate-y-0.5 transition-all duration-300 brightness-90 hover:brightness-110">
              <Link
                href={isSectionActive ? "#" : "#about"}
                onClick={(e) => isSectionActive && e.preventDefault()}
                className="rounded-3xl font-orbitron tracking-widest uppercase font-semibold w-full text-center py-4 shadow-lg transition-all duration-500 block"
                style={{
                  backgroundImage: currentTheme?.gradient,
                  boxShadow: `0 10px 30px -10px ${currentTheme.shadowColor}`,
                }}
              >
                <span
                  key={`discoverText-${activeServer}-${String(isSectionActive)}`}
                  contentEditable={isSectionActive as boolean}
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    formik.setFieldValue(
                      `servers.${activeServer}.discoverText`,
                      e.currentTarget.textContent || "",
                    );
                  }}
                  className={`inline-block transition-all duration-300 ${
                    isSectionActive
                      ? "border-2 border-dashed border-green-400 bg-black/20 px-4 py-1 rounded-xl outline-none cursor-text"
                      : "cursor-pointer"
                  }`}
                >
                  {displayDiscoverText}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

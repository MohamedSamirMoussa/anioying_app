"use client";
import {
  faHardDrive,
  faMemory,
  faMicrochip,
  faServer,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { themes } from "@/app/hooks/themes";
import { setActiveServer } from "@/app/libs/redux/features/themeSlice";
import {
  deleteServerThunk,
  IMCServer,
} from "@/app/libs/redux/features/dashboardSlice";
import toast from "react-hot-toast";

interface ServersProps {
  mcServers: IMCServer[];
}

const Servers = ({ mcServers }: ServersProps) => {
  const dispatch: AppDispatch = useDispatch();
  const { activeServer } = useSelector((s: RootState) => s.theme);

  const currentTheme = themes[activeServer] || themes["1"];

  const cleanName = (name: string) =>
    name
      ? name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .trim()
      : "";

  const extractNumber = (val: string | number) => {
    if (typeof val === "number") return val;
    return parseFloat(val?.toString().replace(/[^\d.-]/g, "")) || 0;
  };

  const getSafeNumber = (val: any) => {
    const num = extractNumber(String(val || "0"));
    return isNaN(num) ? 0 : num;
  };

  const currentStats = Array.isArray(mcServers)
    ? mcServers.find((s: any) => {
        const apiName = cleanName(s.name);
        const themeName = cleanName(currentTheme.name as string);
        return apiName.includes(themeName) || themeName.includes(apiName);
      })
    : null;

  const diskUsage = getSafeNumber(currentStats?.usage?.disk);
  const memUsage = getSafeNumber(currentStats?.usage?.memory);
  const cpuUsage = getSafeNumber(currentStats?.usage?.cpu);

  const MAX_DISK_MB = 102400;
  const MAX_MEM_MB = 16384;

  const statsConfig = [
    {
      label: "Disk Space",
      val: (diskUsage / 1024).toFixed(2) + " GB",
      pct: (diskUsage / MAX_DISK_MB) * 100,
      icon: faHardDrive,
    },
    {
      label: "Memory RAM",
      val: (memUsage / 1024).toFixed(2) + " GB",
      pct: (memUsage / MAX_MEM_MB) * 100,
      icon: faMemory,
    },
    {
      label: "CPU Performance",
      val: `${cpuUsage.toFixed(1)}%`,
      pct: cpuUsage,
      icon: faMicrochip,
    },
  ];

  const handleDeleteByName = async (serverDisplayName: string) => {
    const themeKey = Object.keys(themes).find(
      (key) =>
        cleanName(themes[key].name || "") === cleanName(serverDisplayName),
    );

    if (!themeKey) {
      toast.error(`Could not identify Node ID for: ${serverDisplayName}`);
      return;
    }

    const confirmed = window.confirm(
      `🚨 WARNING: You are about to wipe all data for [${serverDisplayName}] (Node ID: ${themeKey}). This action is irreversible. Proceed?`,
    );

    if (confirmed) {
      const loadingToast = toast.loading(`Wiping data for node ${themeKey}...`);
      try {
        await dispatch(deleteServerThunk(themeKey)).unwrap();
        toast.success(`${serverDisplayName} data wiped successfully! ✅`, {
          id: loadingToast,
        });
      } catch (err: any) {
        toast.error(`Wipe failed: ${err.message || "Unknown error"}`, {
          id: loadingToast,
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="my-5 flex items-center gap-4">
        <span
          className="w-14 h-14 flex justify-center items-center rounded-2xl text-2xl transition-all duration-500 shadow-xl"
          style={{ background: currentTheme.gradient }}
        >
          <FontAwesomeIcon icon={faServer} className="text-white" />
        </span>
        <p className="text-3xl font-bold font-orbitron text-white tracking-tight">
          Nodes Monitor
        </p>
      </div>

      <div className="p-6 lg:p-10 h-full w-full bg-white/[0.05] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="header">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div className="space-y-1">
              <h3 className="font-bold text-4xl text-white font-orbitron tracking-tight">
                {currentTheme.name}
              </h3>
              <p className="text-sm font-medium">
                {currentStats ? (
                  <span className="text-green-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live Connection (Node ID: {activeServer})
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                    Waiting for data stream...
                  </span>
                )}
              </p>
            </div>

            <select
              className="w-full md:w-64 bg-black/40 border border-white/10 text-white px-4 py-3 rounded-2xl outline-none font-orbitron text-xs cursor-pointer hover:border-white/30 transition-all"
              value={activeServer}
              onChange={(e) => dispatch(setActiveServer(e.target.value))}
            >
              {Object.keys(themes).map((key) => (
                <option key={key} value={key} className="bg-[#1a1a1a]">
                  {themes[key].name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {currentStats ? (
              statsConfig.map((stat, i) => (
                <div
                  key={i}
                  className="bg-black/40 p-6 flex flex-col gap-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-5">
                    <span
                      className="rounded-2xl text-2xl p-4 w-16 h-16 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300"
                      style={{ background: currentTheme.gradient }}
                    >
                      <FontAwesomeIcon
                        icon={stat.icon}
                        className="text-white"
                      />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-white/30 text-[10px] uppercase font-black">
                        {stat.label}
                      </span>
                      <p className="text-white text-2xl font-bold font-orbitron">
                        {stat.val || "0.00"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 relative">
                    <div
                      className="h-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${Math.max(0, Math.min(stat.pct || 0, 100))}%`,
                        background: currentTheme.gradient,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 lg:col-span-3 py-20 flex flex-col items-center justify-center bg-black/20 rounded-[2rem] border-2 border-dashed border-white/5 animate-pulse text-white/20 font-orbitron tracking-widest">
                INITIALIZING LIVE STREAM...
              </div>
            )}
          </div>
        </div>

        <div className="body bg-black/40 w-full mt-10 p-6 rounded-[2rem] border border-white/5">
          <h4 className="mb-6 ps-2 font-bold font-orbitron text-sm text-white/50 tracking-widest uppercase">
            Active Node Details
          </h4>
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/20">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-white/40 font-orbitron text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4 font-semibold border-b border-white/10">
                    Node Name
                  </th>
                  <th className="px-6 py-4 font-semibold border-b border-white/10">
                    Address
                  </th>
                  <th className="px-6 py-4 font-semibold border-b border-white/10">
                    Status
                  </th>
                  <th className="px-6 py-4 font-semibold border-b border-white/10 text-center">
                    Wipe Data
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {mcServers?.map((serv, index) => (
                  <tr
                    key={index}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 text-white font-medium font-orbitron">
                      {serv.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-white/50 font-mono">{`cf2.anoing.com:${serv.port}`}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 ${serv.usage.status === "running" ? "text-green-500 border border-green-500/20 bg-green-500/10" : "text-red-500 border border-red-500/20 bg-red-500/10"} rounded-full text-[10px] font-bold uppercase`}
                      >
                        {serv?.usage?.status || "Online"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteByName(serv.name)}
                        className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 transition-all transform hover:scale-110 border border-red-500/0 hover:border-red-500/30"
                        title="Wipe Server Data"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servers;

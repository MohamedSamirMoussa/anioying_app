import { ThemeProps } from "@/app/hooks/themes";
import { LeaderboardUser } from "@/app/leaderboard/page";
import {
  faCircleDot,
  faCrown,
  faGem,
  faHeart,
  faSeedling,
  faShield,
  faStar,
  faTrophy,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { usePathname } from "next/navigation";

/* -------------------- Helpers -------------------- */
const getRankIcon = (hours: number) => {
  if (hours < 10) return faCircleDot;
  if (hours < 24) return faSeedling;
  if (hours < 50) return faUserCheck;
  if (hours < 150) return faStar;
  if (hours < 350) return faGem;
  if (hours < 700) return faShield;
  if (hours < 1500) return faTrophy;
  return faCrown;
};

const getRankColor = (hours: number): string => {
  if (hours < 10) return "#808080";
  if (hours < 24) return "#00FF00";
  if (hours < 50) return "#0000FF";
  if (hours < 150) return "#00FFFF";
  if (hours < 350) return "#800080";
  if (hours < 700) return "#FFA500";
  if (hours < 1500) return "#FFD700";
  return "#FF0000";
};

const getRankName = (hours: number): string => {
  if (hours < 10) return "Visitor";
  if (hours < 24) return "Newcomer";
  if (hours < 50) return "Regular";
  if (hours < 150) return "Dedicated";
  if (hours < 350) return "Trusted";
  if (hours < 700) return "Veteran";
  if (hours < 1500) return "Legend";
  return "Immortal";
};

const formatPlayTime = (totalHours: number, minutes: number): string => {
  const days = Math.floor(totalHours / 24);
  const hours = Math.floor(totalHours % 24);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

const formatLastSeen = (dateStr: string | Date): string => {
  const now = new Date();
  const lastSeen = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  const diffMs = now.getTime() - lastSeen.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);
  let result = "";
  if (diffDays > 0) result += `${diffDays}d `;
  if (diffHours > 0) result += `${diffHours}h `;
  result += `${diffMinutes}m`;
  return result + " ago";
};

/* -------------------- Main Component -------------------- */
const LeaderboardCard = ({
  filteredLeaderboard,
  page = 1,
  currentTheme,
  limit = 8,
  onToggleSupporter,
}: {
  filteredLeaderboard: LeaderboardUser[];
  page?: number;
  currentTheme: ThemeProps;
  limit?: number;
  onToggleSupporter?: (username: string) => void;
}) => {
  const pathname: string = usePathname();
  const isAdminPage = pathname === "/dashboard";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
      {filteredLeaderboard.map((user: LeaderboardUser, index: number) => {
        const totalHours = user.playTime?.hours || 0;
        const minutes = user.playTime?.minutes || 0;
        const rankColor = getRankColor(totalHours);
        const rankName = getRankName(totalHours);
        const isPremium = user.isSupported?.status;

        return (
          <div key={user._id || index} className="player-card relative group">
            <div
              className={`inner p-[1px] rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                index === 0 && page === 1
                  ? "hover:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                  : ""
              }`}
              style={{
                background:
                  index === 0 && page === 1
                    ? `linear-gradient(180deg, #ffd70036, transparent)`
                    : `linear-gradient(180deg, ${currentTheme.color}40, transparent)`,
              }}
            >
              <div className="bg-[#0b0b0b] rounded-2xl p-5 flex flex-col gap-4">
                {/* Header: Avatar + Info + Actions */}
                <div className="header flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="relative bg-white/5 rounded-xl overflow-hidden border border-white/10 p-1">
                      <Image
                        src={
                          user.avatar ||
                          `https://mc-heads.net/avatar/${user.username}/64`
                        }
                        alt={user.username}
                        width={52}
                        height={52}
                        className="rounded-lg object-contain"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold font-orbitron text-sm tracking-wide">
                          {user.username}
                        </h3>
                        {isPremium && (
                          <FontAwesomeIcon
                            icon={faCrown}
                            className="text-amber-400 text-[10px] animate-pulse"
                          />
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span
                          className="text-[9px] uppercase px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-white/5"
                          style={{
                            backgroundColor: `${rankColor}15`,
                            color: rankColor,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={getRankIcon(totalHours)}
                            className="text-[10px]"
                          />
                          {rankName}
                        </span>

                        {isPremium && (
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded-md font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            <FontAwesomeIcon icon={faHeart} className="mr-1" />
                            Supporter
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Admin Action Button (The Toggle) */}
                  <div className="flex flex-col items-end gap-3">
                    <span className="text-white text-[15px] font-black font-orbitron italic">
                      #{index + 1 + (page - 1) * limit}
                    </span>

                    <button
                      disabled={!isAdminPage}
                      onClick={() =>
                        onToggleSupporter?.(user.username)
                      }
                      className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-300 transform active:scale-90 ${
                        isPremium
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                          : "bg-white/5 border-white/10 text-white/20 hover:text-white hover:border-white/30 hover:bg-white/10"
                      }`}
                      title={
                        isPremium
                          ? "Click to remove supporter status"
                          : "Click to grant supporter status"
                      }
                    >
                      <FontAwesomeIcon
                        icon={faCrown}
                        className={isPremium ? "text-sm" : "text-xs opacity-50"}
                      />
                    </button>
                  </div>
                </div>

                {/* Body: Playtime + Status */}
                <div className="body flex justify-between items-end mt-2">
                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-[0.2em] mb-1 font-bold">
                      Accumulated Time
                    </p>
                    <p className="text-white font-orbitron text-base font-bold">
                      {formatPlayTime(totalHours, minutes)}
                    </p>
                  </div>

                  <div className="status flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${user.is_online ? "bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" : "bg-red-500/50"}`}
                    />
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">
                      {user.is_online
                        ? "Active Now"
                        : formatLastSeen(user.lastSeen || new Date())}
                    </span>
                  </div>
                </div>

                {/* Progress toward next milestone (Fixed at 1500h for Legend) */}
                <div className="relative w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((totalHours / 1500) * 100, 100)}%`,
                      background: currentTheme.gradient,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardCard;

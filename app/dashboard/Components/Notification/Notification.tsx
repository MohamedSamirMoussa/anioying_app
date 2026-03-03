import { clearAllNotificationsThunk } from "@/app/libs/redux/features/notificationSlice";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { faBell, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
export interface INotification {
  message: string;
  type?: string;
  createdAt?: string | Date;
}
interface NotificationProps {
  notifications: INotification[];
}
const Notification = ({ notifications }: NotificationProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [hideDropMenu, setHideDropMenu] = useState<boolean>(false);
  const { loading } = useSelector((s: RootState) => s.notification);

  const toggleDropMenu = () => setHideDropMenu(!hideDropMenu);
  const handleClearNotification = async () => {
    const res = await dispatch(clearAllNotificationsThunk(undefined));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(res.payload.message);
    } else {
      toast.success(res.payload.errMessage || res.payload.message);
    }
  };

  return (
    <div className="notification relative">
      <button
        onClick={toggleDropMenu}
        className="text-gray-400 hover:text-white transition-colors relative p-2"
      >
        <FontAwesomeIcon icon={faBell} className="text-xl" />
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#1A1A2E]"></span>
        )}
      </button>

      {/* Dropdown Menu */}
      <div
        className={`
              drop-menu absolute right-0 mt-3 w-72 bg-[#1A1A2E] border border-white/10 rounded-xl shadow-2xl z-50
              transition-all duration-300 origin-top-right
              ${!hideDropMenu ? "opacity-0 invisible scale-95 translate-y-[-10px]" : "opacity-100 visible scale-100 translate-y-0"}
            `}
      >
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Notifications</h3>
          <button
            onClick={handleClearNotification}
            disabled={loading}
            className={`
    flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium
    border border-red-500/30 bg-red-500/10 text-red-500
    hover:bg-red-500 hover:text-white transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
            ${loading && "animate-spin"}}`}
          >
            <FontAwesomeIcon icon={faTrash} />
            Clear
          </button>
        </div>

        <ul
          className="max-h-80 overflow-y-auto scrollbar-thin 
               scrollbar-thumb-white/20 
               scrollbar-track-white/5 
               hover:scrollbar-thumb-white/40 
               scrollbar-thumb-rounded-full 
               scrollbar-track-rounded-full transition-all px-2 pb-10"
        >
          {notifications.length > 0 ? (
            notifications.map((notif: any, index: number) => (
              <li
                key={notif._id || index}
                className="px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0 text-white"
              >
                <p className="text-sm text-gray-300">{notif.message}</p>
                <span className="text-[10px] text-gray-500">
                  {new Date(
                    notif.createdAt || notif.timestamp,
                  ).toLocaleString()}
                </span>
              </li>
            ))
          ) : (
            <li className="px-4 py-8 text-center text-gray-500 text-xs">
              No notifications yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Notification;

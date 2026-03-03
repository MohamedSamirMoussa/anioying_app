import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Notification from "../Notification/Notification";
import Searchbar from "../Searchbar/Searchbar";
import { useState } from "react";
import { logoutThunk } from "@/app/libs/redux/features/authSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Nav = ({ setActiveTab }: { setActiveTab: (tabId: string) => void }) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const { notifications } = useSelector(
    (state: RootState) => state.notification,
  );

  const { user } = useSelector((state: RootState) => state.auth);

  const handleDropMenu = () => {
    setHidden(!hidden);
  };

  const handleLogout = async () => {
    const res = await dispatch(logoutThunk(undefined));


    if (res.meta.requestStatus === "fulfilled") {
      toast.success(res.payload.message);
      router.push("/");
    }
  };

  return (
    <div className="w-[90%] mx-auto flex items-center justify-between py-4">
      {/* Search Section */}
      <div className="left">
        <Searchbar setActiveTab={setActiveTab} />
      </div>

      <div className="right flex items-center gap-6 justify-end">
        {/* Notification Bell Section */}
        <Notification notifications={notifications} />

        {/* Profile Section */}
        <div className="relative">
          {/* Profile Section */}
          <div
            className="profile flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer"
            onClick={handleDropMenu}
          >
            <span className="text-sm text-gray-400 hidden md:block">
              Hey, <b className="text-white">{user?.username}</b>
            </span>
            <button className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
              {user?.username?.charAt(0).toUpperCase()}
            </button>
          </div>

          {/* Drop Menu */}
          <div
            className={`${
              hidden
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            } z-[999] transition-all duration-300 drop-menu absolute top-12 right-0 bg-[#121212] border border-white/10 p-3 rounded-2xl shadow-2xl min-w-[120px]`}
          >
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;

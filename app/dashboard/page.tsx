"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  lazy,
  Suspense,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../libs/redux/store";

// Actions
import { getAllUsersForAdmin } from "@/app/libs/redux/features/dashboardSlice";
import { getAllDonationsThunk } from "@/app/libs/redux/features/donateSlice";
import {
  addNotification,
  getNotificationsThunk,
} from "../libs/redux/features/notificationSlice";

// Components & Icons
import Sidebar from "./Components/Sidebar";
import Nav from "./Components/Nav/Nav";
import { IUser } from "../types/auth.types";
import { createSocket } from "../hooks/createSocket";
import toast from "react-hot-toast";
import { Socket } from "socket.io-client";
import Loader from "../Loader/Loader";

// Interfaces
interface IMCServer {
  id: string;
  name: string;
  status: string;
  usage: any;
}

// Lazy Loading Components for better performance
const Dashboard = lazy(() => import("./sections/Dashboard/Dashboard"));
const EditSite = lazy(() => import("./sections/EditSite/EditSite"));
const Users = lazy(() => import("./sections/Users/Users"));
const Players = lazy(() => import("./sections/Players/Players"));
const Gallery = lazy(() => import("./sections/Gallery/Gallery"));
const Servers = lazy(() => import("./sections/Servers/Servers"));
const Donations = lazy(() => import("./sections/Donation/Donation"));

export default function DashboardPage() {
  const dispatch: AppDispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const socketRef = useRef<Socket | null>(null);
  const [mcServers, setMcServers] = useState<IMCServer[]>([]);

  // Selectors
  const { activeServer } = useSelector((s: RootState) => s.theme);
  const { user, isLogged } = useSelector((s: RootState) => s.auth);
  const { blog } = useSelector((s: RootState) => s.blogs);
  const { users } = useSelector((s: RootState) => s.dashboard);
  const { totalRevenue, donations } = useSelector((s: RootState) => s.donate);

  /*----------------------------- SOCKET IO --------------------------------*/
  useEffect(() => {
    dispatch(getNotificationsThunk());
    const socket = createSocket("/dashboard");
    socketRef.current = socket;

    socket.on("new_notification", (data: { message: string; type: string }) => {
      dispatch(addNotification(data));
      toast.success(data.message, {
        icon: data.type === "NEW_DONATION" ? "💰" : "🔔",
        style: { 
            background: "#12121A", 
            color: "#fff", 
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.1)" 
        },
      });
      
      if (data.type === "NEW_DONATION") {
          dispatch(getAllDonationsThunk());
      }
    });

    socket.on("server_stats_update", (data: IMCServer[]) => setMcServers(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  /*----------------------------- INITIAL FETCH -----------------------------*/
  useEffect(() => {
    dispatch(getAllUsersForAdmin());
    dispatch(getAllDonationsThunk());
  }, [dispatch]);

  /*----------------------------- RENDER LOGIC -----------------------------------*/

  const ActiveSection = useMemo((): ReactNode => {
    return (
      <Suspense fallback={<Loader />}>
        {(() => {
          switch (activeTab) {
            case "Dashboard":
              return (
                <Dashboard
                  setActiveTab={setActiveTab}
                  activeServer={activeServer}
                  isLogged={isLogged}
                  user={user as IUser}
                  blog={blog}
                  totalRevenue={totalRevenue}
                  mcServers={mcServers}
                  users={users as any}
                />
              );
            case "EditSite":
              return <EditSite />;
            case "Users":
              return <Users users={users} />;
            case "Players":
              return <Players users={users} />;
            case "Gallery":
              return (
                <Gallery
                  user={user as IUser}
                  blogs={blog}
                  isLogged={isLogged}
                />
              );
            case "Servers":
              return <Servers mcServers={mcServers} />;
            case "Donations":
              return <Donations donations={donations} totalRevenue={totalRevenue} />;
            default:
              return null;
          }
        })()}
      </Suspense>
    );
  }, [
    activeTab,
    users,
    totalRevenue,
    donations, 
    activeServer,
    blog,
    isLogged,
    user,
  ]);

  return (
    <div className="flex h-screen w-full bg-[#0A0A0F] text-white overflow-hidden bg-[radial-gradient(circle_at_top_left,#1A1A2E,transparent)]">
      {/* Sidebar - Fixed width */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Navigation */}
        <Nav setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 
                       scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent 
                       hover:scrollbar-thumb-white/20 transition-all duration-300">
          
          <div className="max-w-[1500px] mx-auto transition-all duration-500">
            {ActiveSection}
          </div>
        </main>
      </div>
    </div>
  );
}
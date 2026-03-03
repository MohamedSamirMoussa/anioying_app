"use client";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import {
  faPen,
  faServer,
  faUser,
  faImage,
  faMoneyBill,
  faUsers,
  faHome,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSelector } from "react-redux";

const tabs = [
  { name: "Dashboard", icon: faHome },
  { name: "EditSite", icon: faPen },
  { name: "Servers", icon: faServer },
  { name: "Players", icon: faUser },
  { name: "Gallery", icon: faImage },
  { name: "Donations", icon: faMoneyBill },
  { name: "Users", icon: faUsers },
];

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: Props) {
  const { activeServer } = useSelector((s: RootState) => s.theme);
  const theme = themes[activeServer];

  return (
    <div className="w-64 shadow-lg">
      <div className="container w-[90%] mx-auto py-2">
        <Link
        href={'/'}
          className="text-6xl font-extrabold text-center font-orbitron"
          style={{
            backgroundImage: theme?.gradient,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Anoing
        </Link>
        {/* <p className="text-[#E8E8E8]">Menu<p> */}
        <ul className="mt-4">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <button
                onClick={() => setActiveTab(tab.name)}
                className={`my-3 w-full rounded-2xl outline-1 outline-white/10 px-4 py-3 text-left transition-colors font-orbitron font-bold tracking-wider ${
                  activeTab === tab.name
                    ? "bg-black/30 text-white"
                    : "hover:bg-black/20 text-white/50"
                }`}
              >
                <span className="flex justify-between items-center">
                  <span>
                    <FontAwesomeIcon icon={tab.icon} className="mr-3" />
                    {tab.name}
                  </span>
                  {activeTab === tab.name && (
                    <FontAwesomeIcon icon={faAngleRight} />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

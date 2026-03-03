import {
  faChartLine,
  faEdit,
  faImages,
  faSearch,
  faUsers,
  faServer,
  faDonate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";

const ALL_COMPONENTS = [
  { id: "Dashboard", label: "Dashboard", icon: faChartLine },
  { id: "EditSite", label: "Edit Site Settings", icon: faEdit },
  { id: "Users", label: "Users Management", icon: faUsers },
  { id: "Players", label: "Players Management", icon: faUsers },
  { id: "Gallery", label: "Edit gallery", icon: faImages },
  { id: "Servers", label: "Explore Your Servers", icon: faServer },
  { id: "Donations", label: "Explore Your Donations", icon: faDonate },
];

const Searchbar = ({
  setActiveTab,
}: {
  setActiveTab: (tabId: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredTabs = useMemo(() => {
    return ALL_COMPONENTS.filter((tab) =>
      tab.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="relative">
      <form className="search-input">
        <div className="flex justify-center items-center gap-2 bg-black/30 py-3 px-5 rounded-2xl">
          <label htmlFor="search-components">
            <FontAwesomeIcon icon={faSearch} />
          </label>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search About Components"
            className="bg-transparent outline-none text-white"
          />
        </div>
      </form>

      {/* قائمة نتائج البحث اللحظية */}
      {searchQuery && (
        <div className="absolute top-full left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl mt-2 z-50 overflow-hidden shadow-2xl">
          {filteredTabs.length > 0 ? (
            filteredTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as string); // نقل اليوزر للصفحة
                  setSearchQuery(""); // تصغير القائمة
                }}
                className="w-full text-left p-3 hover:bg-white/10 text-white border-b border-white/5 last:border-0 flex items-center gap-3"
              >
                <FontAwesomeIcon icon={tab.icon} className="text-gray-400" />
                {tab.label}
              </button>
            ))
          ) : (
            <div className="p-3 text-gray-500 text-center">
              No components found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;

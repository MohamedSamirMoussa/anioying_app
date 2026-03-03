"use client";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ScrollTop = () => {
  const [hidden, setHidden] = useState<boolean>(false);
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer,
  );
  const theme = themes[activeTab] ;
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-10 end-10 z-[50] animate-floating scroll">
      <button
        type="button"
        onClick={handleScroll}
        className={`
    ${hidden ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-5"} 
    text-white w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg
  `}
        style={{ background: theme.gradient }}
      >
        <FontAwesomeIcon icon={faAngleUp} />
      </button>
    </div>
  );
};

export default ScrollTop;

"use client";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { useSelector } from "react-redux";
import Slider from "react-slick";

const ServerTabs = ({
  activeServer,
  handleServerButtonClick,
  isSectionActive = false,
  formik,
}: {
  activeServer: string;
  handleServerButtonClick: (serverKey: string) => void;
  leaderboardPlayers?: any[];
  isSectionActive?: boolean;
  formik?: any;
}) => {
  const { sectionData } = useSelector((state: RootState) => state.pageContent);
  const homeSection = sectionData["home"];
  const serverKeys = Object.keys(themes);

  const settings = {
    dots: false,
    infinite: serverKeys.length > 3,
    speed: 800,
    autoplay: !isSectionActive,
    autoplaySpeed: 1800,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    draggable: !isSectionActive,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.2,
          centerPadding: "15px",
        },
      },
    ],
  };

  return (
    <div className="w-full  tabs rounded-2xl relative transition-all duration-300 brightness-70 hover:brightness-105">
      <div className="px-1 md:px-2">
        <Slider {...settings} className="server-tabs-slick select-none">
          {serverKeys.map((serverKey) => {
            const isActive = activeServer === serverKey;
            const tabTheme = themes[serverKey];

            const displayName =
              formik?.values?.servers?.[serverKey]?.serverName ||
              homeSection?.servers?.[serverKey]?.serverName ||
              tabTheme.name;

            return (
              <div
                key={serverKey}
                className="outline-none py-3 px-1.5 md:px-2 w-full"
              >
                <button
                  type="button"
                  onClick={() =>
                    !isSectionActive && handleServerButtonClick(serverKey)
                  }
                  className={`relative flex items-center justify-center w-full gap-2 px-2 py-2 rounded-xl font-orbitron hover:-translate-y-0.5 transition-all duration-300 transform ${
                    isActive
                      ? "scale-105 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] brightness-110 z-10"
                      : "brightness-50 hover:brightness-90 opacity-80"
                  } ${isSectionActive ? "cursor-text border border-dashed border-white/20" : "cursor-pointer active:scale-95"}`}
                  style={{
                    background: isActive
                      ? tabTheme.gradient
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span
                    key={`tabName-${serverKey}-${String(isSectionActive)}`}
                    contentEditable={isSectionActive}
                    suppressContentEditableWarning
                    suppressHydrationWarning
                    onBlur={(e) => {
                      if (isSectionActive && formik) {
                        const newName = e.currentTarget.textContent || "";
                        formik.setFieldValue(
                          `servers.${serverKey}.serverName`,
                          newName,
                        );
                      }
                    }}
                    className={`text-white text-xs md:text-sm lg:text-base font-black capitalize tracking-wider outline-none whitespace-nowrap  ${
                      isSectionActive
                        ? "bg-black/20 px-2 py-0.5 rounded border-b border-white/50 min-w-[50px]"
                        : ""
                    }`}
                  >
                    {displayName}
                  </span>
                </button>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default ServerTabs;

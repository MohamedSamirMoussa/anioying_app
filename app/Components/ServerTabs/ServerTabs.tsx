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
  const { sectionData } = useSelector(
    (state: RootState) => state.pageContent,
  );

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
          slidesToShow: 2.5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.5,
          centerMode: true,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "10px",
        },
      },
    ],
  };

  return (
    <div className="w-full tabs rounded-2xl relative transition-all duration-300">
      <div className="px-2 sm:px-3">
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
                className="outline-none py-2 px-1 w-full"
              >
                <button
                  type="button"
                  onClick={() =>
                    !isSectionActive &&
                    handleServerButtonClick(serverKey)
                  }
                  className={`relative flex items-center justify-center w-full min-h-[52px]
                  gap-2 px-3 py-3 rounded-xl font-orbitron
                  transition-all duration-300 transform
                  ${
                    isActive
                      ? "scale-[1.02] shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] brightness-110 z-10"
                      : "brightness-75 opacity-90"
                  }
                  ${
                    isSectionActive
                      ? "cursor-text border border-dashed border-white/20"
                      : "cursor-pointer active:scale-95 hover:-translate-y-0.5"
                  }`}
                  style={{
                    background: isActive
                      ? tabTheme.gradient
                      : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span
                    key={`tabName-${serverKey}-${String(
                      isSectionActive,
                    )}`}
                    contentEditable={isSectionActive}
                    suppressContentEditableWarning
                    suppressHydrationWarning
                    onBlur={(e) => {
                      if (isSectionActive && formik) {
                        const newName =
                          e.currentTarget.textContent || "";

                        formik.setFieldValue(
                          `servers.${serverKey}.serverName`,
                          newName,
                        );
                      }
                    }}
                    className={`text-white text-[11px] sm:text-sm lg:text-base
                    font-black capitalize tracking-wide outline-none
                    whitespace-nowrap overflow-hidden text-ellipsis max-w-full
                    ${
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
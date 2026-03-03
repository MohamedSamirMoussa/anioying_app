"use client";
import { LeaderboardUser } from "@/app/leaderboard/page";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";

interface HomeSliderProps {
  leaderboard: Partial<LeaderboardUser[]>;
}

function HomeSlider({ leaderboard }: HomeSliderProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onlinePlayers = leaderboard.filter((user) => user?.is_online);

  const settings = {
    className: "start",
    centerMode: false,
    infinite: onlinePlayers.length > 4,
    slidesToShow: Math.min(onlinePlayers.length, 4) || 1,
    swipeToSlide: true,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(onlinePlayers.length, 3) },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: Math.min(onlinePlayers.length, 2) },
      },
    ],
  };

  if (!leaderboard || leaderboard.length === 0) {
    return <div className="" />;
  }

  if (!isMounted || onlinePlayers.length === 0) return null;

  return (
    <div className="slider-container w-full max-w-[650px] mx-auto text-white overflow-hidden">
      <Slider {...settings}>
        {onlinePlayers.map((user) => (
          <div key={user?._id || user?.username} className="px-2 outline-none">
            <div className="flex p-2 gap-3 justify-between items-center bg-[#ffffff03] backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-500 group cursor-pointer">
              <div className="relative flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-white/10 group-hover:border-green-500/50 transition-colors duration-500">
                <Image
                  src={
                    user?.avatar ||
                    `https://mc-heads.net/avatar/${user?.username}/64`
                  }
                  fill
                  alt={user?.username || ""}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <span className="text-[11px] font-orbitron truncate flex-1 font-semibold tracking-wider text-gray-400 group-hover:text-white transition-colors duration-300">
                {user?.username}
              </span>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default HomeSlider;

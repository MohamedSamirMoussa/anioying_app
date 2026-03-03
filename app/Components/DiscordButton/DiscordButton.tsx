"use client";
import Image from "next/image";
import discord from "../../../public/discord.png";
import { useDispatch  } from "react-redux";
import { getDiscordRedirect } from "@/app/libs/redux/features/authSlice";
import toast from "react-hot-toast";
import { AppDispatch } from "@/app/libs/redux/store";


const DiscordButton = () => {
  const dispatch:AppDispatch = useDispatch();


  const handleDiscordBtn = async () => {
    const res = await dispatch(getDiscordRedirect(undefined));

    if (res.payload?.result) {
      window.location.href = res.payload.result.discordUrl;
      toast.success("Login successfully")
    }
  };

  return (
    <button
      type="button"
      onClick={handleDiscordBtn}
      className="group relative w-full flex items-center justify-center gap-3 rounded-2xl px-2 py-2 bg-white/5 transition-all duration-300 border border-white/10 hover:border-white/20 overflow-hidden"
    >

      <div className="relative flex items-center gap-3">
        <Image
          src={discord}
          alt="discord icon"
          width={20}
          height={20}
          className="transition-transform duration-300 group-hover:scale-110"
          quality={75}
        />
        <span className="text-sm sm:text-base font-bold tracking-wide text-gray-200 group-hover:text-white">
          Continue with Discord
        </span>
      </div>
    </button>
  );
};

export default DiscordButton;
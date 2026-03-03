"use client";
import Blogs from "@/app/Components/Blogs/Blogs";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { IUser } from "@/app/types/auth.types";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useSelector } from "react-redux";
export interface GalleryProps {
  blogs?: any[]; // أو النوع المخصص للـ Blog إذا كان لديك
  user?: IUser;
  isLogged?: boolean;
}
const Gallery = ({ blogs, user, isLogged }: GalleryProps) => {
  const { activeServer } = useSelector((s: RootState) => s.theme);
  const theme = themes[activeServer] || themes["1"];

  return (
    <div className="w-full min-h-screen overflow-x-hidden space-y-6 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex items-center gap-4 group mb-8">
        <span
          className="w-14 h-14 flex-shrink-0 flex justify-center items-center rounded-2xl text-2xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ background: theme.gradient }}
        >
          <FontAwesomeIcon icon={faImages} />
        </span>
        <div>
          <h2 className="text-3xl font-bold text-white font-orbitron tracking-tight">
            Edit Gallery
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Manage and update your visual content with live nodes
          </p>
        </div>
      </div>

      {/* Content Container */}
      {/* أزلنا الـ overflow-hidden هنا للسماح للقوائم المنسدلة بالظهور */}
      <div className="relative p-6 lg:p-10 w-full bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl transition-all">
        <Blogs blogs={blogs} theme={theme} user={user} isLogged={isLogged} />
      </div>
    </div>
  );
};

export default Gallery;

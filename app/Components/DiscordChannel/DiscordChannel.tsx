"use client";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { setSectionName } from "@/app/libs/redux/features/editSlice";
import useSectionEditor from "@/app/hooks/useSectionEditor";
import React from "react";

const DiscordChannel = () => {
  const dispatch = useDispatch();

  const { activeServer } = useSelector((state: RootState) => state.theme);
  const theme = themes[activeServer] || themes["1"];

  const { sectionData } = useSelector((state: RootState) => state.pageContent);
  const section = sectionData?.["discord"];

  const { formik, isSectionActive, isEditing } = useSectionEditor({
    sectionName: "discord",
    initialValues: {
      globalTitle: section?.globalTitle || "Join Our Amazing Community",
      desc:
        section?.desc ||
        "Connect with fellow adventurers, share your epic builds, find teammates, or get help. Our Discord is the heart of Anoing!",
      discordLink: section?.discordLink || "",
      comingSoonText: section?.comingSoonText || "Coming Soon...",
    },
  });

  const editStyle = isSectionActive
    ? "outline-dashed outline-2 outline-amber-400/60 bg-white/5 rounded-2xl transition-all duration-300 px-4 py-2 cursor-text shadow-lg"
    : "transition-all duration-300 outline-none border-none";

  if (!sectionData)
    return (
      <div className="py-20 text-center text-white font-orbitron animate-pulse">
        Loading Discord Section...
      </div>
    );

  return (
    <div className="py-15 text-center relative group min-h-[400px] flex items-center overflow-hidden">
      {/* 🛠️ Edit Controls */}
      <div className="absolute top-5 right-5 z-[100] flex gap-2">
        {isEditing && !isSectionActive && (
          <button
            onClick={() => dispatch(setSectionName("discord"))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl transition-all hover:scale-105"
          >
            Edit Discord
          </button>
        )}

        {isSectionActive && (
          <div className="flex gap-2 bg-black/80 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl animate-in zoom-in duration-200">
            <button
              onClick={() => {
                dispatch(setSectionName(null));
                formik.resetForm();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                formik.handleSubmit();
                dispatch(setSectionName(null));
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="container w-[80%] mx-auto flex flex-col justify-center items-center gap-5 relative z-10">
        {/* 🏷️ Main Title (globalTitle) */}
        <div className="flex justify-center items-center w-full">
          <h1
            key={`title-${isSectionActive}`}
            contentEditable={isSectionActive as boolean}
            suppressContentEditableWarning
            onBlur={(e) =>
              formik.setFieldValue(
                "globalTitle",
                e.currentTarget.textContent || "",
              )
            }
            className={`${editStyle} lg:text-7xl md:text-5xl text-4xl font-black font-orbitron text-center relative py-3 flex flex-col justify-center items-center leading-tight transition-transform duration-500`}
            style={{
              backgroundImage: theme?.gradient,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {formik.values.globalTitle}
            <span
              className="my-4 w-24 h-[2px] transition-all duration-300"
              style={{ background: theme.gradient }}
            ></span>
          </h1>
        </div>

        {/* 📝 Description */}
        <p
          key={`desc-${isSectionActive}`}
          contentEditable={isSectionActive as boolean}
          suppressContentEditableWarning
          onBlur={(e) =>
            formik.setFieldValue("desc", e.currentTarget.textContent || "")
          }
          className={`text-gray-300 max-w-2xl leading-relaxed text-lg font-roboto transition-all duration-300 ${
            isSectionActive
              ? "bg-white/5 p-6 rounded-2xl outline-dashed outline-1 outline-white/20"
              : ""
          }`}
        >
          {formik.values.desc}
        </p>

        <div className="w-full flex flex-col items-center gap-6 mt-8">
          {/* ⏳ Coming Soon Mode */}
          {!formik.values.discordLink && (
            <h2
              key={`soon-${isSectionActive}`}
              contentEditable={isSectionActive as boolean}
              suppressContentEditableWarning
              onBlur={(e) =>
                formik.setFieldValue(
                  "comingSoonText",
                  e.currentTarget.textContent || "",
                )
              }
              className={`lg:text-8xl md:text-6xl text-5xl font-orbitron font-bold uppercase tracking-tighter transition-all duration-300 ${
                isSectionActive
                  ? "outline-dashed outline-2 outline-indigo-400 px-6 rounded-xl"
                  : ""
              }`}
              style={{
                backgroundImage: theme.gradient,
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {formik.values.comingSoonText}
            </h2>
          )}

          {/* 🔗 Discord Button (Visible only when not editing and link exists) */}
          {formik.values.discordLink && !isSectionActive && (
            <a
              href={formik.values.discordLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-12 py-5 rounded-2xl font-black text-xl font-orbitron transition-all shadow-[0_15px_40px_rgba(88,101,242,0.4)] hover:scale-110 active:scale-95 uppercase tracking-widest flex items-center gap-3 animate-bounce-subtle"
            >
              Join Our Discord
            </a>
          )}

          {/* ⚙️ Link Editor (Only visible in edit mode) */}
          {isSectionActive && (
            <div className="w-full max-w-md p-6 bg-indigo-950/40 border border-indigo-500/30 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
              <label className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] block mb-3 ml-1">
                Discord Invite URL
              </label>
              <input
                type="text"
                value={formik.values.discordLink}
                onChange={(e) =>
                  formik.setFieldValue("discordLink", e.target.value)
                }
                className="w-full p-4 bg-black/60 border border-white/10 rounded-2xl text-white text-center text-sm outline-none focus:border-indigo-500 focus:ring-4 ring-indigo-500/10 transition-all font-mono"
                placeholder="https://discord.gg/your-invite"
              />
              <p className="text-[10px] text-gray-500 mt-4 italic text-center leading-snug">
                {formik.values.discordLink
                  ? "✅ Link is active. The 'Join' button will be visible to users."
                  : "ℹ️ Link is empty. 'Coming Soon' text will be displayed."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscordChannel;

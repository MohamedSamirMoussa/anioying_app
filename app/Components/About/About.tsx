"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { themes } from "@/app/hooks/themes";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import useSectionEditor from "@/app/hooks/useSectionEditor";
import { getPageContentThunk } from "@/app/libs/redux/features/pageContentSlice";
import { useEffect } from "react";
import { setSectionName } from "@/app/libs/redux/features/editSlice";

const About = () => {
  const dispatch: AppDispatch = useDispatch();

  const activeTab = useSelector((state: RootState) => state.theme.activeServer);
  const theme = themes[activeTab] || themes["3"];

  const sectionData = useSelector(
    (state: RootState) => state.pageContent.sectionData["about"],
  );

  useEffect(() => {
    dispatch(getPageContentThunk("about"));
  }, [dispatch]);

  const { isEditing, formik, isSectionActive } = useSectionEditor({
    sectionName: "about",
    initialValues: {
      servers: sectionData?.servers || {},
    },
  });

  const currentServerData = formik.values.servers?.[activeTab] || {};
  const displayTitle =
    currentServerData.title || `Welcome to Anoing`;
  const displayDesc =
    currentServerData.description ||
    "Dive into the definitive modded experience on Anoing1 Servers ! Explore an incredible array of mods, traverse breathtaking dimensions, master complex magic, build technological marvels, andconquer epic bosses. Our server runs on optimized hardware (Ryzen 7\ 7800X3D | 64GB DDR5) for a seamless, lag-free ATM 10 odyssey!";
  const displayLinkText = currentServerData.linkText || "How To join";

  const editStyle = isSectionActive
    ? "outline-dashed outline-2 outline-amber-400/60 bg-white/5 rounded-2xl transition-all duration-300 px-4 py-2 cursor-text"
    : "transition-all duration-300 outline-none border-none";

  return (
    <div id="about" className="mt-20 md:mt-0 relative group">
      <div className="absolute top-5 right-5 z-50 flex gap-2 p-3">
        {isEditing && !isSectionActive && (
          <button
            className="bg-blue-600/80 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow-xl backdrop-blur-sm transition-all text-sm font-bold"
            onClick={() => dispatch(setSectionName("about"))}
          >
            Edit About ({theme.name})
          </button>
        )}

        {isSectionActive && (
          <div className="flex gap-2 bg-black/60 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-1.5 rounded-xl transition-all text-xs font-bold"
              onClick={() => {
                dispatch(setSectionName(null));
                formik.resetForm();
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500/80 hover:bg-green-500 text-white px-4 py-1.5 rounded-xl transition-all text-xs font-bold"
              onClick={() => formik.handleSubmit()}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="container w-[80%] lg:w-[60%] h-screen m-auto flex justify-center items-center">
        <div className="about-description flex flex-col justify-center items-center gap-6 py-3">
          <h1
            key={`title-${activeTab}-${String(isSectionActive)}`}
            contentEditable={isSectionActive as boolean}
            suppressContentEditableWarning
            onBlur={(e) =>
              formik.setFieldValue(
                `servers.${activeTab}.title`,
                e.currentTarget.textContent || "",
              )
            }
            className={`${editStyle} lg:text-7xl text-5xl font-black font-orbitron text-center relative py-3 flex flex-col justify-center items-center leading-tight hover:scale-105`}
            style={{
              backgroundImage: theme?.gradient,
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {displayTitle}
            <span
              className="my-4 w-[20%] h-[2px] transition-all duration-300"
              style={{ background: theme.gradient }}
            ></span>
          </h1>

          {/* 🎯 الوصف */}
          <p
            key={`desc-${activeTab}-${String(isSectionActive)}`}
            contentEditable={isSectionActive as boolean}
            suppressContentEditableWarning
            onBlur={(e) =>
              formik.setFieldValue(
                `servers.${activeTab}.description`,
                e.currentTarget.textContent || "",
              )
            }
            className={`${editStyle} text-gray-200 text-center text-lg md:text-xl max-w-3xl leading-relaxed`}
          >
            {displayDesc}
          </p>

          <div className="mt-4">
            <Link
              href={"#community"}
              onClick={(e) => isSectionActive && e.preventDefault()}
              className={`inline-block rounded-full px-10 py-4 font-orbitron font-black text-white transition-all duration-300 shadow-xl hover:scale-110 active:scale-95 ${isSectionActive ? "cursor-default" : ""}`}
              style={{ backgroundImage: theme.gradient }}
            >
              <span
                key={`linkText-${activeTab}-${String(isSectionActive)}`}
                contentEditable={isSectionActive as boolean}
                suppressContentEditableWarning
                className={`${isSectionActive ? "border-b-2 border-white/50 px-2 cursor-text" : ""}`}
                onBlur={(e) =>
                  formik.setFieldValue(
                    `servers.${activeTab}.linkText`,
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {displayLinkText}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

"use client";
import "./Footer.css";
import { themes } from "@/app/hooks/themes";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import { faCode, faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux"; 
import { usePathname } from "next/navigation";
import useSectionEditor from "@/app/hooks/useSectionEditor";
import { setSectionName } from "@/app/libs/redux/features/editSlice";
import { useEffect } from "react";
import { getPageContentThunk } from "@/app/libs/redux/features/pageContentSlice";

const Footer = () => {
  const dispatch:AppDispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.theme.activeServer);
  const theme = themes[activeTab] || themes["1"];
  const pathname = usePathname();
  
  const section = useSelector(
    (state: RootState) => state.pageContent.sectionData,
  );

    useEffect(() => {
    dispatch(getPageContentThunk("footer"));
  }, [dispatch]);

  const sectionData = section?.["footer"];

  const { isEditing, formik, isSectionActive } = useSectionEditor({
    sectionName: "footer",
    initialValues: {
      globalTitle: sectionData?.globalTitle || "Anoing",
      desc: sectionData?.desc || "Legendary Adventures Begin Here",
      descFooter: sectionData?.descFooter || "© 2026 Anoing • Crafted with",
    },
  });

  const editStyle = isSectionActive
    ? "outline-dashed outline-2 outline-amber-400/60 bg-white/5 rounded-xl transition-all duration-300 px-3 py-1 cursor-text shadow-[0_0_15px_rgba(251,191,36,0.2)]"
    : "transition-all duration-300 outline-none border-none";

  if (pathname === "/dashboard") return null;

  return (
    <footer
      style={{
        background: "linear-gradient(to right, #0A0A14, #08080F)",
      }}
      className="py-20 mt-0 relative overflow-hidden"
    >
      {/* 🛠️ Edit Controls */}
      <div className="absolute top-5 right-5 z-[100] flex gap-2">
        {isEditing && !isSectionActive && (
          <button
            onClick={() => dispatch(setSectionName("footer"))}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Edit Footer
          </button>
        )}

        {isSectionActive && (
          <div className="flex gap-2 bg-black/80 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
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

      <div className="w-[90%] mx-auto flex flex-col justify-center items-center py-10">
        
        {/* 🏷️ Footer Title (globalTitle) */}
        <h3
          key={`footer-title-${isSectionActive}`}
          contentEditable={isSectionActive  as boolean}
          suppressContentEditableWarning
          onBlur={(e) =>
            formik.setFieldValue("globalTitle", e.currentTarget.textContent || "")
          }
          className={`${editStyle} font-bold text-5xl font-orbitron hover:scale-105 transition-all duration-300 flex flex-col justify-center items-center`}
          style={{
            backgroundImage: theme.gradient,
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {formik.values.globalTitle}
          <span
            className="my-2 relative w-[40%] transition-all duration-300"
            style={{
              background: "linear-gradient(to right, transparent, " + theme.color + "55, transparent)",
              height: "2px",
            }}
          ></span>
        </h3>

        {/* 📝 Secondary Description */}
        <p
          key={`footer-desc-${isSectionActive}`}
          contentEditable={isSectionActive  as boolean}
          suppressContentEditableWarning
          onBlur={(e) =>
            formik.setFieldValue("desc", e.currentTarget.textContent || "")
          }
          className={`${editStyle} opacity-50 text-white py-5 text-center max-w-lg font-roboto`}
        >
          {formik.values.desc}
        </p>

        {/* ⚖️ Copyright & Credits */}
        <div className="text-[14px] md:text-lg text-white flex flex-wrap justify-center items-center gap-2 mt-4">
          <span
            key={`footer-copy-${isSectionActive}`}
            contentEditable={isSectionActive as boolean}
            suppressContentEditableWarning
            onBlur={(e) =>
              formik.setFieldValue("descFooter", e.currentTarget.textContent || "")
            }
            className={`${editStyle} opacity-80`}
          >
            {formik.values.descFooter}
          </span>
          
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <FontAwesomeIcon
                icon={faHeart}
                className="mx-1 transition-transform hover:scale-125"
                style={{ color: theme.color }}
              />
            </span>
            <span className="opacity-80">And</span>
            <span className="flex items-center">
              <FontAwesomeIcon 
                icon={faCode} 
                className="mx-1 text-indigo-400 transition-transform hover:rotate-12" 
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
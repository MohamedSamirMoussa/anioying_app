"use client";
import { themes } from "@/app/hooks/themes";
import useSectionEditor from "@/app/hooks/useSectionEditor";
import { setSectionName } from "@/app/libs/redux/features/editSlice";
import { AppDispatch, RootState } from "@/app/libs/redux/store";
import {
  faDownload,
  faMicrophone,
  faMusic,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { FieldArray, FormikProvider } from "formik";
import { getPageContentThunk } from "@/app/libs/redux/features/pageContentSlice";
import { useEffect } from "react";

const OptionalMods = () => {
  const dispatch: AppDispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.theme.activeServer);
  const theme = themes[activeTab] || themes["3"];
  useEffect(() => {
    dispatch(getPageContentThunk("optionalMods"));
  }, [dispatch]);
  const sectionData = useSelector(
    (state: RootState) => state.pageContent.sectionData["optionalMods"],
  );

  const { isEditing, formik, isSectionActive } = useSectionEditor({
    sectionName: "optionalMods",
    initialValues: {
      servers: sectionData?.servers || {},
    },
  });

  // الوصول لمصفوفة المودات الخاصة بالسيرفر الحالي
  const currentServerMods = formik.values.servers?.[activeTab]?.mods || [];

  const displayTitle =
    formik.values.servers?.[activeTab]?.title || "Optional Mods";
  const displayDesc =
    formik.values.servers?.[activeTab]?.description ||
    "Enhance your experience with these client-side mods!";

  const editStyle = isSectionActive
    ? "outline-dashed outline-2 outline-amber-400/60 bg-white/5 rounded-xl transition-all duration-300 px-3 py-1 cursor-text"
    : "transition-all duration-300 outline-none border-none";

  return (
    <FormikProvider value={formik}>
      <div className="relative group" id="op">
        {/* ----------------- Edit Buttons (Control UI) ----------------- */}
        <div className="absolute top-5 right-5 z-50 flex gap-2">
          {isEditing && !isSectionActive && (
            <button
              className="bg-blue-600/80 hover:bg-blue-600 text-white px-5 py-2 rounded-full shadow-xl backdrop-blur-sm transition-all text-sm font-bold"
              onClick={() => dispatch(setSectionName("optionalMods"))}
            >
              Edit {theme.name} Mods
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

        <div className="md:w-[80%] lg:w-[70%] mx-auto min-h-screen py-20 flex flex-col justify-center">
          {/* Header Section */}
          <div className="text-center mb-16 about-description">
            <div className="flex flex-col justify-center items-center">
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
                className={`${editStyle} lg:text-7xl text-5xl font-black font-orbitron text-center relative py-3 leading-tight hover:scale-105 inline-block`}
                style={{
                  backgroundImage: theme?.gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {displayTitle}
              </h1>
              <span
                className="my-4 w-16 h-[3px] transition-all duration-300"
                style={{ background: theme.gradient }}
              ></span>
            </div>

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
              className={`text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-4 ${editStyle}`}
            >
              {displayDesc}
            </p>
          </div>

          {/* Dynamic Cards Section */}
          <FieldArray
            name={`servers.${activeTab}.mods`}
            render={(arrayHelpers) => (
              <>
                <div className="grid md:grid-cols-2 gap-8 px-4 w-[80%] mx-auto">
                  {currentServerMods.map((mod: any, index: number) => (
                    <div
                      key={`card-${index}-${activeTab}`}
                      className={`relative flex flex-col p-8 border border-white/10 rounded-[2rem] bg-white/[0.02] backdrop-blur-sm transition-all duration-500 ${isSectionActive ? "scale-[0.98] border-amber-500/30" : "hover:bg-white/[0.05]"}`}
                    >
                      {/* Delete Button */}
                      {isSectionActive && (
                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white w-8 h-8 rounded-full shadow-lg z-20 flex items-center justify-center transition-transform hover:scale-110"
                        >
                          <FontAwesomeIcon icon={faTrash} size="xs" />
                        </button>
                      )}

                      <div className="mb-6">
                        <div
                          className="mb-4 inline-flex p-3 rounded-2xl bg-white/5"
                          style={{ color: theme.color }}
                        >
                          <FontAwesomeIcon
                            icon={index % 2 === 0 ? faMicrophone : faMusic}
                            className="text-2xl"
                          />
                        </div>

                        <h2
                          contentEditable={isSectionActive as boolean}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            formik.setFieldValue(
                              `servers.${activeTab}.mods.${index}.title`,
                              e.currentTarget.textContent || "",
                            )
                          }
                          className={`text-2xl font-orbitron font-bold mb-3 block ${editStyle}`}
                          style={{ color: theme.color }}
                        >
                          {mod.title || "Simple Voice Chat"}
                        </h2>

                        <p
                          contentEditable={isSectionActive as boolean}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            formik.setFieldValue(
                              `servers.${activeTab}.mods.${index}.description`,
                              e.currentTarget.textContent || "",
                            )
                          }
                          className={`text-gray-400 text-sm leading-relaxed ${editStyle}`}
                        >
                          {mod.description ||
                            "Adds proximity voice chat to Minecraft. Communicate with nearby players easily and immersively!"}
                        </p>
                      </div>

                      <div className="mt-auto space-y-4">
                        <Link
                          href={isSectionActive ? "#" : mod.link?.url || "#"}
                          target={isSectionActive ? "_self" : "_blank"}
                          onClick={(e) => isSectionActive && e.preventDefault()}
                          className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-white transition-all shadow-lg active:scale-95 hover:brightness-110"
                          style={{ backgroundImage: theme.gradient }}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          <span
                            contentEditable={isSectionActive as boolean}
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              formik.setFieldValue(
                                `servers.${activeTab}.mods.${index}.link.text`,
                                e.currentTarget.textContent || "",
                              )
                            }
                            className={
                              isSectionActive ? "border-b border-white/40" : ""
                            }
                          >
                            {mod.link?.text || "Download from CurseForge"}
                          </span>
                        </Link>

                        {isSectionActive && (
                          <input
                            type="text"
                            value={mod.link?.url || ""}
                            onChange={(e) =>
                              formik.setFieldValue(
                                `servers.${activeTab}.mods.${index}.link.url`,
                                e.target.value,
                              )
                            }
                            placeholder="CurseForge/Direct URL..."
                            className="w-full text-[10px] p-2 rounded-xl bg-black/40 border border-white/10 text-amber-200 outline-none focus:border-amber-500/50 transition-colors"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Card Button */}
                {isSectionActive && (
                  <div className="mt-12 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                      type="button"
                      onClick={() =>
                        arrayHelpers.push({
                          title: "New Mod Name",
                          description:
                            "Enter a short description of the mod functions here.",
                          link: { text: "Download Now", url: "" },
                        })
                      }
                      className="group flex items-center gap-3 px-10 py-4 rounded-3xl border-2 border-dashed border-white/20 text-white/40 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 hover:bg-amber-500/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-colors">
                        <FontAwesomeIcon icon={faPlus} />
                      </div>
                      <span className="font-bold font-orbitron tracking-wider">
                        ADD NEW MOD CARD
                      </span>
                    </button>
                  </div>
                )}
              </>
            )}
          />
        </div>
      </div>
    </FormikProvider>
  );
};

export default OptionalMods;

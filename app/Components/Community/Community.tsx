"use client";
import { themes } from "@/app/hooks/themes";
import { useSelector, useDispatch } from "react-redux";
import "./Community.css";
import { RootState, AppDispatch } from "@/app/libs/redux/store";
import useSectionEditor from "@/app/hooks/useSectionEditor";
import { setSectionName } from "@/app/libs/redux/features/editSlice";
import {  useEffect, useMemo } from "react";
import { FieldArray, FormikProvider } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getPageContentThunk } from "@/app/libs/redux/features/pageContentSlice";

const Community = () => {
  const dispatch: AppDispatch = useDispatch();
  const { activeServer } = useSelector((state: RootState) => state.theme);
  const theme = themes[activeServer] || themes["1"];

  useEffect(() => {
    dispatch(getPageContentThunk("community"));
  }, [dispatch]);

  const section = useSelector(
    (state: RootState) => state.pageContent.sectionData,
  );
  const sectionData = section["community"];
  const homeSection = section["home"];

  const currentIP = useMemo(() => {
    const homeServerData = homeSection?.servers?.[activeServer];
    const isVisible = homeServerData?.showIP ?? true;

    if (!isVisible) return "Coming Soon...";
    return homeServerData?.ipAddress || "play.anoing.com";
  }, [homeSection, activeServer]);

  const defaultSteps = [
    {
      title: "Get a Launcher",
      description: "Download and install a modded Minecraft launcher.",
    },
    {
      title: "Find Modpack",
      description: "Search for All The Mods 10 in your launcher.",
    },
    {
      title: "Install Modpack",
      description: "Click Install and wait for the files to download.",
    },
    {
      title: "Allocate RAM",
      description:
        "ATM10 is hefty! Allocate at least 8-10GB RAM for smooth play.",
    },
    {
      title: "Launch & Add Server",
      description: "Launch Minecraft, Go to Multiplayer, and Click Add Server.",
    },
  ];

  const { isEditing, formik, isSectionActive } = useSectionEditor({
    sectionName: "community",
    initialValues: {
      servers: sectionData?.servers || {
        [activeServer]: {
          title: "Join Our Community",
          steps: defaultSteps,
        },
      },
    },
  });

  const currentServerFormik = formik.values.servers?.[activeServer] || {};
  const steps = currentServerFormik.steps || [];
  const displayTitle = currentServerFormik.title || "Join Our Community";

  const disableEditingMode = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    window.getSelection()?.removeAllRanges();
    dispatch(setSectionName(null));
  };

  const editStyle = isSectionActive
    ? "outline-dashed outline-2 outline-amber-400/60 bg-white/5 rounded-xl transition-all duration-300 px-3 py-1 cursor-text shadow-[0_0_15px_rgba(251,191,36,0.1)]"
    : "transition-all duration-300 outline-none border-none";

  return (
    <FormikProvider value={formik}>
      <div id="community" className="relative min-h-screen">
        {/* 🛠️ Edit Controls */}
        <div className="absolute top-5 right-5 z-[100] flex gap-2">
          {isEditing && !isSectionActive && (
            <button
              onClick={() => dispatch(setSectionName("community"))}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl transition-all hover:scale-105"
            >
              Edit How to Join
            </button>
          )}

          {isSectionActive && (
            <div className="flex gap-2 bg-black/80 p-2 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
              <button
                onClick={() => {
                  disableEditingMode();
                  formik.resetForm();
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  disableEditingMode();
                  formik.handleSubmit();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center py-20">
          <div className="desc w-full flex justify-center flex-col items-center gap-5">
            {/* 🏷️ Title (Per Server) */}
            <div className="flex justify-center items-center">
              <h1
                key={`title-${activeServer}-${isSectionActive}`}
                contentEditable={isSectionActive as boolean}
                suppressContentEditableWarning
                onBlur={(e) =>
                  formik.setFieldValue(
                    `servers.${activeServer}.title`,
                    e.currentTarget.textContent || "",
                  )
                }
                className={`${editStyle} lg:text-7xl text-5xl font-black font-orbitron text-center relative py-3 flex flex-col justify-center items-center leading-tight`}
                style={{
                  backgroundImage: theme?.gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                {displayTitle}
                <span
                  className="my-4 w-[10%] h-[2px] transition-all duration-300"
                  style={{ background: theme.gradient }}
                ></span>
              </h1>
            </div>

            {/* 🎯 Steps Grid (Per Server) */}
            <FieldArray
              name={`servers.${activeServer}.steps`}
              render={(arrayHelpers) => (
                <div className="w-full max-w-6xl mx-auto py-10 px-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {steps.map((step: any, index: number) => (
                      <div
                        key={`step-${activeServer}-${index}`}
                        className={`group relative p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 flex flex-col h-full ${
                          isSectionActive
                            ? "ring-2 ring-amber-400/30 shadow-lg"
                            : "hover:bg-white/10"
                        }`}
                      >
                        {isSectionActive && (
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                            className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white w-8 h-8 rounded-full shadow-lg z-20 flex items-center justify-center transition-transform hover:scale-110"
                          >
                            <FontAwesomeIcon icon={faTrash} size="xs" />
                          </button>
                        )}

                        <div className="flex gap-4 items-center mb-4">
                          <span
                            className="w-10 h-10 flex items-center justify-center rounded-full text-white font-black text-xl shadow-lg shrink-0"
                            style={{ backgroundImage: theme.gradient }}
                          >
                            {index + 1}
                          </span>
                          <h3
                            contentEditable={isSectionActive as boolean}
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              formik.setFieldValue(
                                `servers.${activeServer}.steps.${index}.title`,
                                e.currentTarget.textContent || "",
                              )
                            }
                            className={`text-xl font-orbitron font-bold tracking-tight outline-none ${editStyle}`}
                            style={{ color: theme.color }}
                          >
                            {step.title}
                          </h3>
                        </div>

                        <p
                          contentEditable={isSectionActive as boolean}
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            formik.setFieldValue(
                              `servers.${activeServer}.steps.${index}.description`,
                              e.currentTarget.textContent || "",
                            )
                          }
                          className={`text-gray-400 font-roboto leading-relaxed text-sm group-hover:text-white transition-colors outline-none h-full ${editStyle}`}
                        >
                          {step.description}
                        </p>
                      </div>
                    ))}

                    {/* 🚀 Auto-generated IP Card */}
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-dashed border-white/20 flex flex-col h-full opacity-80">
                      <div className="flex gap-4 items-center mb-4">
                        <span
                          className="w-10 h-10 flex items-center justify-center rounded-full text-white font-black text-xl shrink-0"
                          style={{ background: theme.gradient }}
                        >
                          {steps.length + 1}
                        </span>
                        <h3
                          className="text-xl font-orbitron font-bold"
                          style={{ color: theme.color }}
                        >
                          Server Info
                        </h3>
                      </div>
                      <p className="text-gray-400 text-sm font-roboto">
                        Server:{" "}
                        <span className="text-white font-bold">
                          {theme.name}
                        </span>
                        <br />
                        IP:{" "}
                        <span
                          className="font-bold tracking-wider"
                          style={{ color: theme.color }}
                        >
                          {currentIP}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* ➕ Add Step Button */}
                  {isSectionActive && (
                    <div className="mt-12 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          arrayHelpers.push({
                            title: "New Step",
                            description: "New instruction details...",
                          })
                        }
                        className="group flex items-center gap-3 px-10 py-4 rounded-3xl border-2 border-dashed border-white/20 text-white/40 hover:border-amber-500 hover:text-amber-500 transition-all duration-300 hover:bg-amber-500/5"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                        <span className="font-bold font-orbitron tracking-widest uppercase text-sm">
                          Add Step
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </FormikProvider>
  );
};

export default Community;

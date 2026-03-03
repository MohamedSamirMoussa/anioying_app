"use client";
import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../libs/redux/store";
import { themes } from "../hooks/themes";
import Link from "next/link";
import Image from "next/image";
import one from "../../public/1.png";
import two from "../../public/2.png";
import three from "../../public/3.png";
import four from "../../public/5.png";
import five from "../../public/6.png";
import six from "../../public/7.png";
import seven from "../../public/8.png";
import "./gallery.css";
import memories from "../../public/Memories.png";
import useSectionEditor from "../hooks/useSectionEditor";
import { IUser } from "../types/auth.types";
import { setEditing, setSectionName } from "../libs/redux/features/editSlice";

// Lazy loading components
const CreateBlog = React.lazy(
  () => import("../Components/CreateBlog/CreateBlog"),
);
const Blogs = React.lazy(() => import("../Components/Blogs/Blogs"));

const Page = () => {
  // --- Selectors ---
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer,
  );
  const theme = themes[activeServer];

  const { user } = useSelector((state: RootState) => state.auth);

  const isLogged = user?.isLogged;
  const { sectionData } = useSelector((state: RootState) => state.pageContent);
  const blogs = useSelector((s: RootState) => s.blogs.blog);

  // --- Section Editor Hook ---
  const { formik, isSectionActive, isEditing, dispatch } = useSectionEditor({
    sectionName: "gallery",
    initialValues: {
      showImages: sectionData?.gallery?.showImages ?? true,
    },
  });

  const shouldShowImages = formik.values.showImages || isSectionActive;

  return (
    <div className="gallery min-h-screen pt-10 relative mb-50 overflow-hidden">
      <div className="container w-[90%] mx-auto">
        <div className="inners">
          <section className="join-us my-8 ">
            <div className="inner mx-auto">
              <div className="headers text-center relative">
                <div className="inner">
                  <h1
                    className="text-5xl md:text-8xl font-bold font-orbitron py-10 md:py-0"
                    style={{
                      backgroundImage: theme.gradient,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    A place to share your memories
                  </h1>

                  {/* --- التحكم في ظهور السيكشن (فقط للأدمن) --- */}
                  {isEditing && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4">
                        {/* قسم الـ Toggle */}
                        <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-[12px] uppercase tracking-wider font-bold text-gray-400">
                            Showcase
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              formik.setFieldValue(
                                "showImages",
                                !formik.values.showImages,
                              )
                            }
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 ${
                              formik.values.showImages
                                ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                : "bg-zinc-700"
                            }`}
                          >
                            <span
                              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                                formik.values.showImages
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>

                        {/* زراير الأكشن */}
                        <div className="flex items-center gap-2 pr-2">
                          {formik.dirty && (
                            <button
                              onClick={() => formik.handleSubmit()}
                              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                            >
                              SAVE CHANGES
                            </button>
                          )}

                          <button
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all border border-red-500/20"
                            onClick={() => {
                              dispatch(setEditing(false));
                              dispatch(setSectionName(null));
                              formik.resetForm();
                            }}
                          >
                            EXIT EDITOR
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {shouldShowImages && (
                    <div
                      className={`group group-img hidden lg:grid lg:grid-cols-7 scale-110 hover:scale-115 transition-all duration-700 py-24 relative
                        ${!formik.values.showImages ? "opacity-25 grayscale blur-[2px] pointer-events-none" : "opacity-100"}`}
                    >
                      {/* Glow Background */}
                      <div
                        className="absolute inset-0 blur-[200px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full -z-10"
                        style={{ background: theme.gradient }}
                      ></div>

                      {/* Images Logic */}
                      <div className="relative h-64 md:translate-x-30 lg:translate-x-60 transition-all duration-300 rotate-[12deg] group-hover:rotate-[-10deg]">
                        <Image
                          src={blogs[0]?.image?.secure_url || seven}
                          alt="img-7"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="relative h-64 md:translate-x-20 lg:translate-x-40 transition-all duration-300 group-hover:rotate-[-10deg]">
                        <Image
                          src={blogs[1]?.image?.secure_url || five}
                          alt="img-5"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="relative h-64 md:translate-x-10 lg:translate-x-20 transition-all duration-300 group-hover:rotate-[-10deg]">
                        <Image
                          src={blogs[2]?.image?.secure_url || two}
                          alt="img-2"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="relative h-64 z-10 transition-transform duration-300 scale-125">
                        <Image
                          src={blogs[3]?.image?.secure_url || three}
                          alt="img-3"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="relative h-64 md:-translate-x-10 lg:-translate-x-20 z-20 transition-all duration-300 group-hover:rotate-[8deg]">
                        <Image
                          src={blogs[4]?.image?.secure_url || one}
                          alt="img-1"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="relative h-64 md:-translate-x-20 lg:-translate-x-40 z-30 transition-all duration-300 group-hover:rotate-[8deg]">
                        <Image
                          src={blogs[5]?.image?.secure_url || four}
                          alt="img-4"
                          fill
                          className="object-contain"
                        />
                      </div>

                      <div className="relative h-64 md:-translate-x-30 lg:-translate-x-60 z-40 transition-all duration-300 rotate-[-12deg] group-hover:rotate-[8deg]">
                        <Image
                          src={blogs[6]?.image?.secure_url || six}
                          alt="img-6"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* زرار الـ Join Us أو Create Blog */}
                <div className="mt-10">
                  {!isLogged ? (
                    <div className="join-us-btn mt-8">
                      <Link
                        href="/auth"
                        style={{ background: theme.gradient }}
                        className="px-8 py-4 text-xl md:text-2xl tracking-wider rounded-2xl text-white font-bold font-orbitron uppercase transition-all duration-300 inline-block hover:brightness-110 hover:scale-105 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)] active:scale-95"
                      >
                        Join us
                      </Link>
                    </div>
                  ) : (
                    <Suspense
                      fallback={
                        <div className="h-10 w-20 bg-white/5 animate-pulse rounded-xl" />
                      }
                    >
                      <CreateBlog theme={theme} isLogged={isLogged} />
                    </Suspense>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Blogs Section */}
          <section className="mt-20">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-80 bg-white/5 animate-pulse rounded-3xl"
                    />
                  ))}
                </div>
              }
            >
              <Blogs
                theme={theme}
                isLogged={isLogged}
                blogs={blogs}
                user={user as IUser}
              />
            </Suspense>
          </section>
        </div>
      </div>

      {/* --- Background Memories Images --- */}
      <div className="fixed hidden xl:block inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 xl:translate-x-200 2xl:translate-x-230 2xl:translate-y-0 opacity-50">
          <Image src={memories} alt="memories" priority />
        </div>
        <div className="absolute top-0 left-0 xl:-translate-x-20 xl:translate-y-50 2xl:-translate-x-15 2xl:translate-y-15 opacity-50">
          <Image src={memories} alt="memories" priority />
        </div>
        {/* ... بقية صور الخلفية ... */}
        <div className="absolute top-0 left-0 bottom-0 hidden 2xl:block right-0 xl:translate-y-80 xl:translate-x-80 2xl:translate-x-140 2xl:translate-y-125 opacity-30">
          <Image src={memories} alt="memories" />
        </div>
        <div className="absolute bottom-0 right-0 xl:translate-x-180 xl:-translate-y-20 2xl:translate-x-150 2xl:-translate-y-30 opacity-40">
          <Image src={memories} alt="memories" />
        </div>
        <div className="absolute bottom-0 left-0 xl:-translate-x-150  2xl:-translate-x-165 2xl:-translate-y-5 opacity-40">
          <Image src={memories} alt="memories" />
        </div>
      </div>
    </div>
  );
};

export default Page;

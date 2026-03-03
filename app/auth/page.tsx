"use client";
import "./auth.css";
import Image from "next/image";
import * as Yup from "yup";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import two from "../../public/two.png";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FormikHelpers, useFormik } from "formik";
const Register = React.lazy(() => import("../Components/Register/Register"));
const GoogleButton = React.lazy(
  () => import("../Components/GoogleButton/GoogleButton"),
);
const DiscordButton = React.lazy(
  () => import("../Components/DiscordButton/DiscordButton"),
);
const Login = React.lazy(() => import("../Components/Login/Login"));
import { loginThunk, registerThunk } from "../libs/redux/features/authSlice";
import { themes } from "../hooks/themes";
import { RootState, AppDispatch } from "../libs/redux/store";
import memories from "../../public/Memories.png";
export interface IFormValues {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
  gender?: string;
}

const initialValues: IFormValues = {
  email: "",
  password: "",
  username: "",
  confirmPassword: "",
  gender: "",
};

const TABS = {
  SIGN_IN: "Sign in",
  SIGN_UP: "Sign up",
} as const;

export type TabType = (typeof TABS)[keyof typeof TABS];

const loginSchema = Yup.object({
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string().required("Password is required"),
});

const registerSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^[aA-Zz](?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must start with an uppercase letter and contain letters, numbers, and special characters",
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  gender: Yup.string().required("Gender is required"),
});

const Page = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TABS.SIGN_IN);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user } = useSelector((s: RootState) => s.auth);
  const isLogged = user?.isLogged
  const active = useSelector(
    (state: RootState) => state.theme.activeServer || "Vanilla",
  );
  const theme = themes[active];

  useEffect(() => {
    if (isLogged) {
      router.push("/");
    }
  }, [isLogged, router]);

  const handleSubmit = async (
    values: IFormValues,
    helpers: FormikHelpers<IFormValues>,
  ) => {
    try {
      let submitData;

      if (activeTab === TABS.SIGN_IN) {
        submitData = {
          email: values.email,
          password: values.password,
        };
      } else {
        submitData = {
          username: values.username,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          gender: values.gender,
        };
      }

      const thunk = activeTab === TABS.SIGN_IN ? loginThunk : registerThunk;
      const redirectPath = activeTab === TABS.SIGN_IN ? "/" : "/confirmEmail";

      const result = await dispatch(thunk(submitData as any));

      if (thunk.rejected.match(result)) {
        const payload = result.payload as any;
        const errorMessage =
          payload?.cause?.cause?.[0]?.issues?.[0]?.message ||
          payload?.errMessage ||
          "Authentication failed";

        toast.error(errorMessage);
        helpers.setSubmitting(false);
        return;
      }

      /* ✅ FULFILLED */
      if (thunk.fulfilled.match(result)) {
        toast.success((result.payload as any)?.message || "Success!");
        helpers.resetForm();
        helpers.setSubmitting(false);

        setTimeout(() => {
          router.push(redirectPath);
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred.");
      helpers.setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema: activeTab === TABS.SIGN_IN ? loginSchema : registerSchema,
    onSubmit: handleSubmit,
  });

  const handleTabs = (tab: TabType) => {
    formik.resetForm();
    setActiveTab(tab);
  };

  if (isLogged) return null;

  return (
    <div className="auth text-white min-h-screen flex items-center mt-22">
      {/* ... بقية كود الـ UI كما هو ... */}
      <div className="container w-[90%] m-auto grid lg:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="img w-full lg:translate-y-65 lg:-translate-x-15 xl:-translate-x-30 xl:translate-y-50 2xl:-translate-x-55 2xl:translate-y-40 hidden lg:flex -z-1">
          <figure className="relative transition-all duration-700 w-full">
            <div
              className="absolute inset-0 blur-[120px] opacity-20 rounded-full -z-10"
              style={{ background: theme.gradient }}
            ></div>
            <Image
              src={two}
              alt="minecraft-char"
              width={1200}
              height={1200}
              quality={75}
              priority
              className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            />
          </figure>
        </div>

        {/* RIGHT FORM */}
        <div className="inputs-group flex flex-col w-full">
          <div className="tabs border border-white/10 w-full flex p-1.5 rounded-2xl bg-white/5 backdrop-blur-sm ">
            {Object.values(TABS).map((tab) => (
              <button
                key={tab}
                type="button"
                className="flex-1 text-center rounded-xl py-3 text-sm sm:text-base transition-all duration-500 font-bold uppercase tracking-wider"
                style={{
                  background:
                    activeTab === tab ? theme.gradient : "transparent",
                  color: activeTab === tab ? "#000" : "#fff",
                  boxShadow:
                    activeTab === tab
                      ? `0 4px 15px ${theme.shadowColor}`
                      : "none",
                }}
                onClick={() => handleTabs(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="description mb-5">
            <h1
              className="text-4xl md:text-5xl font-black font-orbitron leading-tight"
              style={{
                backgroundImage: theme?.gradient,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              ENTER YOUR UNIVERSE
            </h1>
            <p className="text-gray-400">
              {activeTab === TABS.SIGN_IN
                ? "Sign in to continue where your story left off."
                : "Sign up to create your universe account."}
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
            <React.Suspense
              fallback={
                <div className="h-40 flex items-center justify-center">
                  Loading...
                </div>
              }
            >
              {activeTab === TABS.SIGN_IN ? (
                <Login formik={formik} activeTab={activeTab} />
              ) : (
                <Register formik={formik} activeTab={activeTab} />
              )}
            </React.Suspense>

            <button
              type="submit"
              disabled={!formik.isValid || !formik.dirty || formik.isSubmitting}
              className="w-full rounded-2xl py-4 font-orbitron font-bold tracking-[0.2em] uppercase text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
              style={{
                background: theme.gradient,
                boxShadow: `0 8px 25px -5px ${theme.shadowColor}`,
              }}
            >
              {formik.isSubmitting ? "Processing..." : activeTab}
            </button>

            {/* ... OR Divider and Social Buttons ... */}
            <div className="relative flex items-center ">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="mx-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <div className="flex flex-col justify-center items-center gap-4">
              <div className="w-full">
                <GoogleButton />
              </div>
              <div className="w-full">
                <DiscordButton />
              </div>
            </div>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            {activeTab === TABS.SIGN_IN ? "New explorer?" : "Already a member?"}
            <button
              type="button"
              onClick={() =>
                handleTabs(
                  activeTab === TABS.SIGN_IN ? TABS.SIGN_UP : TABS.SIGN_IN,
                )
              }
              className="ml-2 font-bold transition-colors"
              style={{ color: theme.color }}
            >
              {activeTab === TABS.SIGN_IN ? "Create an account" : "Log in here"}
            </button>
          </p>
        </div>
      </div>

      <div className="fixed top-0 right-0 -z-10 translate-x-225 -translate-y-10">
        <Image src={memories} alt="memories" />
      </div>
      <div className="fixed top-0 left-0 -z-10 -translate-x-24 translate-y-40">
        <Image src={memories} alt="memories" />
      </div>
      <div className="fixed top-0 left-0 -z-10 translate-x-30 translate-y-95">
        <Image src={memories} alt="memories" />
      </div>
      <div className="fixed top-0 left-0 -z-10 translate-x-10 translate-y-145">
        <Image src={memories} alt="memories" />
      </div>
    </div>
  );
};

export default Page;

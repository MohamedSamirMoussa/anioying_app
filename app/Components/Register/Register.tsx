"use client";
import Image from "next/image";
import emailIcon from "../../../public/email.png";
import lockIcon from "../../../public/lock.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEye,
  faEyeSlash,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FormikProps } from "formik";
import { useState } from "react";
import { IFormValues, TabType } from "@/app/auth/page";
import { useSelector } from "react-redux";
import { themes } from "@/app/hooks/themes";
import { RootState } from "@/app/libs/redux/store";

interface RegisterProps {
  formik: FormikProps<IFormValues>;
  activeTab: TabType;
}

const TABS = {
  SIGN_IN: "Sign in",
  SIGN_UP: "Sign up",
} as const;

const Register = ({ formik, activeTab }: RegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const activeServer = useSelector((state: RootState) => state.theme.activeServer);
  const theme = themes[activeServer];

  if (activeTab !== TABS.SIGN_UP) return null;

  const showError = (field: keyof IFormValues) =>
    formik.touched[field] && formik.errors[field];

  const passwordChecks = {
    length: formik.values.password.length >= 8,
    uppercase: /[A-Z]/.test(formik.values.password),
    number: /\d/.test(formik.values.password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  return (
    <div className="register flex flex-col w-full gap-2">
      {/* Username Field */}
      <div className="field-group w-full">
        <div
          className="group rounded-2xl w-full flex items-center bg-white/5 border transition-all duration-300 focus-within:ring-1"
          style={{
            borderColor: showError("username")
              ? "#ef4444"
              : formik.values.username
                ? theme.color
                : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="pl-4 pr-2">
            <FontAwesomeIcon
              icon={faUser}
              style={{
                color: showError("username")
                  ? "#ef4444"
                  : formik.values.username
                    ? theme.color
                    : "#6b7280",
              }}
              className="text-lg transition-colors"
            />
          </div>
          <input
            type="text"
            id="username"
            placeholder="Username"
            {...formik.getFieldProps("username")}
            className="w-full px-4 py-4 bg-transparent outline-none text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="field-group w-full">
        <div
          className="group rounded-2xl w-full flex items-center bg-white/5 border transition-all duration-300 focus-within:ring-1"
          style={{
            borderColor: showError("email")
              ? "#ef4444"
              : formik.values.email
                ? theme.color
                : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="pl-4 pr-2">
            <Image
              src={emailIcon}
              alt="email"
              width={20}
              className="brightness-200"
            />
          </div>
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            {...formik.getFieldProps("email")}
            className="w-full px-4 py-4 bg-transparent outline-none text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="field-group w-full">
        <div
          className="group rounded-2xl w-full flex items-center bg-white/5 border transition-all duration-300 focus-within:ring-1"
          style={{
            borderColor: showError("password")
              ? "#ef4444"
              : formik.values.password
                ? theme.color
                : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="pl-4 pr-2">
            <Image
              src={lockIcon}
              alt="lock"
              width={20}
              className="brightness-200"
            />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
            className="w-full px-4 py-4 bg-transparent outline-none text-white placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-500"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* Password Strength Indicator (ثيم ديناميكي) */}
        {formik.values.password && (
          <div className="mt-2 px-1">
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(passwordStrength / 3) * 100}%`,
                  background:
                    passwordStrength === 3 ? theme.gradient : theme.color,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="field-group w-full">
        <div
          className="group rounded-2xl w-full flex items-center bg-white/5 border transition-all duration-300 focus-within:ring-1"
          style={{
            borderColor: showError("confirmPassword")
              ? "#ef4444"
              : formik.values.confirmPassword &&
                  formik.values.password === formik.values.confirmPassword
                ? "#22c55e"
                : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="pl-4 pr-2">
            <Image
              src={lockIcon}
              alt="lock"
              width={20}
              className="brightness-200"
            />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Confirm Password"
            {...formik.getFieldProps("confirmPassword")}
            className="w-full px-4 py-4 bg-transparent outline-none text-white placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="pr-4 text-gray-500"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
      </div>

      {/* Gender Selection (ثيم ديناميكي) */}
      <div className="field-group w-full relative">
        <select
          id="gender"
          {...formik.getFieldProps("gender")}
          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-white appearance-none transition-all focus:border-white/30"
          style={{
            borderColor: formik.values.gender
              ? theme.color
              : "rgba(255,255,255,0.1)",
          }}
        >
          <option value="" className="bg-black">
            Select Gender
          </option>
          <option value="male" className="bg-black">
            Male
          </option>
          <option value="female" className="bg-black">
            Female
          </option>
        </select>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs"
        />
      </div>

      {/* عرض الأخطاء المجمعة (اختياري) */}
      {Object.keys(formik.errors).length > 0 && formik.submitCount > 0 && (
        <p className="text-red-500 text-xs text-center font-bold uppercase tracking-widest">
          Please check all fields
        </p>
      )}
    </div>
  );
};

export default Register;

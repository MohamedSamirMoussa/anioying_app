"use client";
import Image from "next/image";
import emailIcon from "@/public/email.png";
import lockIcon from "@/public/lock.png";
import { useSelector } from "react-redux";
import { themes } from "@/app/hooks/themes";
import Link from "next/link";
import { FormikProps } from "formik";
import { IFormValues } from "@/app/auth/page";
import { RootState } from "@/app/libs/redux/store";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = ({
  formik,
  activeTab,
}: {
  formik: FormikProps<IFormValues>;
  activeTab: string;
}) => {
    const [showPassword, setShowPassword] = useState(false);
  
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer,
  );
  const theme = themes[activeServer] ;

  if (activeTab !== "Sign in") return null;

  const showError = (field: keyof IFormValues) =>
    formik.touched[field] && formik.errors[field];
  const passwordChecks = {
    length: formik.values.password.length >= 8,
    uppercase: /[A-Z]/.test(formik.values.password),
    number: /\d/.test(formik.values.password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  return (
    <div className="login flex flex-col w-full">
      {/* Email Input Group */}
      <div className="w-full mb-4">
        <div
          className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
          style={{
            // تغيير لون الحدود عند التركيز (Focus) بناءً على الثيم
            borderColor:
              formik.touched.email && !formik.errors.email
                ? theme.color
                : "rgba(255,255,255,0.1)",
          }}
        >
          <label
            htmlFor="email"
            className="pl-4 pr-2 opacity-50 group-focus-within:opacity-100 transition-opacity"
          >
            <Image
              src={emailIcon}
              alt="email icon"
              width={20}
              className="brightness-200"
            />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email Address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl"
          />
        </div>
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
            {formik.errors.email}
          </p>
        )}
      </div>

      {/* Password Input Group */}
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

      {/* Forgot Password Link */}
      <div className="flex justify-end mb-4">
        <Link
          href="/forgetPassword"
          className="text-xs text-gray-500 hover:text-white transition-colors"
          style={{ color: theme.color + "CC" }} // تقليل شفافية اللون قليلاً
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
};

export default Login;

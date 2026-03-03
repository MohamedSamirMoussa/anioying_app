"use client";
import { FormikHelpers, useFormik } from "formik";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { themes } from "../hooks/themes";
import Image from "next/image";
import emailIcon from "../../public/email.png";
import { newPasswordThunk } from "../libs/redux/features/authSlice";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { AppDispatch, RootState } from "../libs/redux/store";
import { useDispatch, useSelector } from "react-redux";

export interface IResetPass {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const initialValues: IResetPass = {
  email: "",
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  newPassword: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[A-Z]/,
      "Password must start with an uppercase letter and contain letters, numbers, and special characters",
    )
    .matches(/\d/, "Password must contain at least one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPasswordPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer,
  );
  const theme = themes[activeServer];
  const onSubmit = async (
    values: IResetPass,
    { resetForm, setSubmitting }: FormikHelpers<IResetPass>,
  ) => {
    setSubmitting(true);

    const result = await dispatch(newPasswordThunk(values));

    /* ❌ ERROR */
    if (newPasswordThunk.rejected.match(result)) {
      const errorMessage =
        (result.payload as any)?.cause?.cause?.[0]?.issues?.[0]?.message ||
        (result.payload as any)?.errMessage ||
        "Failed to reset password";

      toast.error(errorMessage);
      setSubmitting(false);
      return;
    }

    /* ✅ SUCCESS */
    if (newPasswordThunk.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Password reset successfully");
      resetForm();
      setSubmitting(false);
      router.push("/auth");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="auth text-white py-8 md:py-12 lg:py-20 xl:py-0">
      <div className="container w-[90%] sm:w-[85%] md:w-[80%] m-auto min-h-screen flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-10">
        <div className="inputs-group flex flex-col gap-4 md:gap-6 justify-center items-center w-full lg:w-1/2 max-w-lg mx-auto">
          {/* Description */}
          <div className="description w-full px-2">
            <h1
              className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-bold font-orbitron text-center"
              style={{
                backgroundImage: theme.gradient,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Reset your Password
            </h1>
          </div>

          {/* Form */}
          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-4 md:gap-5"
            noValidate
          >
            <div className="login flex flex-col justify-center items-center">
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
              <div className="w-full mb-4">
                <div
                  className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
                  style={{
                    // تغيير لون الحدود عند التركيز (Focus) بناءً على الثيم
                    borderColor:
                      formik.touched.newPassword && !formik.errors.newPassword
                        ? theme.color
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  <label
                    htmlFor="password"
                    className="pl-4 pr-2 opacity-50 group-focus-within:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faLock} />
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    placeholder="New Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.newPassword}
                    className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl"
                  />
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>
              <div className="w-full mb-4">
                <div
                  className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
                  style={{
                    // تغيير لون الحدود عند التركيز (Focus) بناءً على الثيم
                    borderColor:
                      formik.touched.confirmPassword &&
                      !formik.errors.confirmPassword
                        ? theme.color
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  <label
                    htmlFor="password"
                    className="pl-4 pr-2 opacity-50 group-focus-within:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faLock} />
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl"
                  />
                </div>
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>
            </div>

            <div className="btn w-full mt-2 mb-1">
              <button
                type="submit"
                disabled={
                  formik.isSubmitting || !formik.isValid || !formik.dirty
                }
                className="w-full rounded-2xl px-4 py-3 sm:py-4 font-orbitron font-bold tracking-wide text-white disabled:opacity-30 "
                style={{
                  background: theme.gradient,
                }}
              >
                {formik.isSubmitting ? "Resetting..." : "Reset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

"use client";
import { useState, useEffect } from "react";
import { FormikHelpers, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { themes } from "../hooks/themes";
import Image from "next/image";
import emailIcon from "../../public/email.png";
import {
  confirmPasswordThunk,
  resendOtpThunk,
} from "../libs/redux/features/authSlice";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faSync } from "@fortawesome/free-solid-svg-icons";
import { AppDispatch, RootState } from "../libs/redux/store";

export interface IConfirmInterface {
  email: string;
  otp: string;
}

const initialValues: IConfirmInterface = {
  email: "",
  otp: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

const Page = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [timer, setTimer] = useState(0);

  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer ,
  );
  const theme = themes[activeServer] ;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const onSubmit = async (
    values: IConfirmInterface,
    { resetForm }: FormikHelpers<IConfirmInterface>,
  ) => {
    const result = await dispatch(confirmPasswordThunk(values));
    if (result.meta.requestStatus === "rejected") {
      // default message
      let errorMessage;

      // Zod validation error
      const zodMessage =
        result?.payload?.cause?.cause?.[0]?.issues?.[0]?.message;

      if (zodMessage) {
        errorMessage = zodMessage;
      }
      // backend custom error
      else if (result?.payload?.errMessage) {
        errorMessage = result.payload.errMessage;
      }

      toast.error(errorMessage);
      return;
    }

    resetForm();
    toast.success(result.payload?.message || "Email verified!");
    router.push("/newPassword");
  };

  const handleResendOtp = async () => {
    if (!formik.values.email) {
      toast.error("Please enter your email first");
      return;
    }

    const result = await dispatch(
      resendOtpThunk({ email: formik.values.email }),
    );

    if (resendOtpThunk.fulfilled.match(result)) {
      toast.success(
        (result.payload as any)?.message || "New OTP sent to your email",
      );
      setTimer(60);
      return;
    }

    if (resendOtpThunk.rejected.match(result)) {
      const errorMessage =
        (result?.payload as any)?.cause?.cause?.[0]?.issues?.[0]?.message ||
        (result?.payload as any)?.errMessage ||
        "Failed to resend OTP";

      toast.error(errorMessage);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <div className="auth text-white py-8 md:py-12 lg:py-20 xl:py-0">
      <div className="container w-[90%] sm:w-[85%] md:w-[80%] m-auto min-h-screen flex flex-col lg:flex-row justify-center items-center gap-6 md:gap-8 lg:gap-10">
        <div className="inputs-group flex flex-col gap-4 md:gap-6 justify-center items-center w-full lg:w-1/2 max-w-lg mx-auto">
          <div className="description w-full px-2">
            <h1
              className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-bold font-orbitron text-center"
              style={{
                backgroundImage: theme.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Verify to Reset Password
            </h1>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="w-full flex flex-col gap-4 md:gap-5"
            noValidate
          >
            <div className="login flex flex-col justify-center items-center">
              {/* Email Input */}
              <div className="w-full mb-4">
                <div
                  className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
                  style={{
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
                    {...formik.getFieldProps("email")}
                    placeholder="Email Address"
                    className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* OTP Input */}
              <div className="w-full mb-2">
                <div
                  className="group border border-white/10 rounded-2xl w-full flex items-center bg-white/5 transition-all duration-300 focus-within:ring-1"
                  style={{
                    borderColor:
                      formik.touched.otp && !formik.errors.otp
                        ? theme.color
                        : "rgba(255,255,255,0.1)",
                  }}
                >
                  <label
                    htmlFor="otp"
                    className="pl-4 pr-2 opacity-50 group-focus-within:opacity-100 transition-opacity"
                  >
                    <FontAwesomeIcon icon={faCode} />
                  </label>
                  <input
                    type="text"
                    id="otp"
                    {...formik.getFieldProps("otp")}
                    placeholder="Enter 6-digit OTP"
                    className="w-full bg-transparent px-4 py-5 outline-none text-white placeholder:text-gray-500 rounded-2xl tracking-[0.2em]"
                  />
                </div>
                {formik.touched.otp && formik.errors.otp && (
                  <p className="text-red-500 text-xs mt-2 ml-2 font-medium">
                    {formik.errors.otp}
                  </p>
                )}
              </div>

              {/* Resend OTP Button */}
              <div className="w-full flex justify-end px-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={timer > 0}
                  className="text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50 flex items-center gap-2"
                  style={{ color: theme.color }}
                >
                  <FontAwesomeIcon
                    icon={faSync}
                    className={timer > 0 ? "animate-spin" : ""}
                  />
                  {timer > 0 ? `Resend in ${timer}s` : "Resend Code?"}
                </button>
              </div>
            </div>

            <div className="btn w-full mt-2">
              <button
                type="submit"
                disabled={
                  formik.isSubmitting || !formik.isValid || !formik.dirty
                }
                className="w-full rounded-2xl px-4 py-3 sm:py-4 font-orbitron font-bold tracking-wide text-white disabled:opacity-30 transition-transform active:scale-95 shadow-lg"
                style={{
                  background: theme.gradient,
                  boxShadow: `0 4px 15px ${theme.shadowColor}44`,
                }}
              >
                {formik.isSubmitting ? "Verifying..." : "Confirm OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

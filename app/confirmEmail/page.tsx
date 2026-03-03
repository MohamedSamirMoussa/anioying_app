"use client";
import { FormikHelpers, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmEmailThunk,
  resendOtpThunk,
} from "../libs/redux/features/authSlice"; // افترضت وجود ثانك للإرسال
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import emailIcon from "../../public/email.png";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode, faSync } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { IConfirmInterface } from "../confirmPassword/page";
import { RootState } from "../libs/redux/store";
import { themes } from "../hooks/themes";

const initialValues: IConfirmInterface = {
  email: "",
  otp: "",
};

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [timer, setTimer] = useState(0);

  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer ,
  );
  const theme = themes[activeServer];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

const onSubmit = async (
  values: IConfirmInterface,
  { resetForm }: FormikHelpers<IConfirmInterface>,
) => {
  const result = await dispatch(
    confirmEmailThunk(values) as any
  );

  if (result.meta.requestStatus === "rejected") {
    // default message
    let errorMessage ;

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
  router.push("/auth");
};


const handleResendOtp = async () => {
  if (!formik.values.email) {
    toast.error("Please enter your email first");
    return;
  }

  const result = await dispatch(
    resendOtpThunk({ email: formik.values.email }) as any
  );

  if (resendOtpThunk.fulfilled.match(result)) {
    toast.success(
      (result.payload as any)?.message || "New OTP sent to your email"
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
  });

  return (
    <div className="auth text-white py-8">
      <div className="container w-[90%] max-w-lg m-auto min-h-screen flex flex-col justify-center items-center">
        <div className="inputs-group w-full flex flex-col gap-6">
          <div className="description text-center">
            <h1
              className="text-3xl md:text-5xl font-bold font-orbitron py-2"
              style={{
                backgroundImage: theme.gradient,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Verify Identity
            </h1>
            <p className="text-gray-400 mt-2">
              Enter the code sent to your inbox
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
            {/* Email Input */}
            <div
              className={`group border rounded-2xl flex items-center bg-white/5 transition-all ${formik.values.email ? "border-opacity-100" : "border-white/10"}`}
              style={{ borderColor: formik.values.email ? theme.color : "" }}
            >
              <label className="pl-4 opacity-50">
                <Image
                  src={emailIcon}
                  alt="email"
                  width={20}
                  className="brightness-200"
                />
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent p-5 outline-none"
                {...formik.getFieldProps("email")}
              />
            </div>

            {/* OTP Input */}
            <div
              className={`group border rounded-2xl flex items-center bg-white/5 transition-all ${formik.values.otp ? "border-opacity-100" : "border-white/10"}`}
              style={{ borderColor: formik.values.otp ? theme.color : "" }}
            >
              <label className="pl-4 opacity-50">
                <FontAwesomeIcon icon={faCode} />
              </label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                className="w-full bg-transparent p-5 outline-none tracking-[0.5em] font-bold"
                {...formik.getFieldProps("otp")}
              />
            </div>

            {/* Resend OTP Button */}
            <div className="flex justify-end px-2">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
              className="w-full mt-4 rounded-2xl p-4 font-orbitron font-bold tracking-widest shadow-lg transition-transform active:scale-95 disabled:opacity-30"
              style={{ background: theme.gradient }}
            >
              {formik.isSubmitting ? "Processing..." : "Verify Now"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;

"use client";
import { FormikHelpers, useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { themes } from "../hooks/themes";
import Image from "next/image";
import emailIcon from "../../public/email.png";
import { forgetPasswordThunk } from "../libs/redux/features/authSlice";
import * as Yup from "yup";
import { AppDispatch, RootState } from "../libs/redux/store";

const initialValues: { email: string } = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const Page = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const activeServer = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeServer] || themes["atm 10"];
  const onSubmit = async (
    values: { email: string },
    { resetForm, setSubmitting }: FormikHelpers<{ email: string }>,
  ) => {
    setSubmitting(true);

    const result = await dispatch(forgetPasswordThunk(values));

    /* ❌ ERROR */
    if (forgetPasswordThunk.rejected.match(result)) {
      const errorMessage =
        (result.payload as any)?.cause?.cause?.[0]?.issues?.[0]?.message ||
        (result.payload as any)?.errMessage ||
        "Failed to send reset code";

      toast.error(errorMessage);
      setSubmitting(false);
      return;
    }

    /* ✅ SUCCESS */
    if (forgetPasswordThunk.fulfilled.match(result)) {
      toast.success(
        (result.payload as any)?.message || "Reset code sent to your email",
      );
      resetForm();
      setSubmitting(false);
      router.push("/confirmPassword");
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

export default Page;

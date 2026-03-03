"use client";
import { faHeart, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
const PaypalPayment = React.lazy(
  () => import("../PaypalPayment/PaypalPayment"),
);
import { useFormik } from "formik";
import { themes } from "@/app/hooks/themes";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { RootState } from "@/app/libs/redux/store";
import "./Donate.css";
import { usePathname } from "next/navigation";


export interface IDonateSlice {
  _id?: string;
  payerUsername?: {
    given_name: string;
    surname: string;
  };
  username: string;
  createdAt?: string | Date | number;
  currency?: "USD";
  amount?: string;
  payerMCusername?: string;
  status?: string;
}

export interface IDonate {
  amount: {
    currency_code: "USD";
    value: string;
  };
  username: string;
}

const initialValues: IDonate = {
  amount: {
    currency_code: "USD",
    value: "",
  },
  username: "",
};

const validationSchema = Yup.object({
  amount: Yup.object({
    value: Yup.number()
      .typeError("Value must be a number")
      .required("Value is required")
      .positive("Value must be greater than 0"),
  }),
  username: Yup.string().optional(),
});

const quickAmount = ["5", "10", "25", "50"];

const Donate = () => {
  const pathname = usePathname();
  const activeTab = useSelector(
    (state: RootState) => state.theme.activeServer || "atm 10",
  );
  const theme = themes[activeTab] || themes["atm 10"];
  const [hidden, setHidden] = useState<boolean>(true);

  const handleDonateBtn = () => setHidden(!hidden);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: IDonate) => {},
  });

  const isValidAmount = Number(formik.values.amount.value) > 0;

  if (pathname === "/dashboard") return;

  return (
    <>
      <div className="fixed bottom-10 left-10 z-30">
        <button
          className="bg-rose-600 heart py-1 pe-2 relative overflow-hidden w-12 hover:w-full flex justify-start  items-center rounded-full shadow-lg hover:scale-110 animate-floating transition-all duration-300"
          onClick={handleDonateBtn}
        >
          <span className="">
            <FontAwesomeIcon
              icon={faHeart}
              className="text-2xl text-white heart px-2"
            />
          </span>
        </button>
      </div>

      <div
        onClick={(e) => e.target === e.currentTarget && setHidden(true)}
        className={`card h-screen w-screen flex justify-center items-center text-white overflow-y-auto fixed top-0 left-0 bg-[#000000aa] backdrop-blur-sm z-50 transition-all duration-500 ${
          hidden ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 relative rounded-3xl border border-[#ffffff20] bg-[#0f0f15] shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-center items-center my-5">
            <span className="bg-red-600 w-12 h-12 flex shadow-lg animate-[pulse_2s_ease-in-out_infinite] scale-110 shadow-red-600 justify-center items-center rounded-full">
              <FontAwesomeIcon icon={faHeart} className="text-3xl" />
            </span>
          </div>

          <h2
            className="text-3xl font-extrabold mb-6 text-center font-orbitron"
            style={{
              backgroundImage: theme?.gradient,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Support Our Server
          </h2>

          <p className="text-white/50 text-center">
            Your donation helps keep the servers running and allows us to
            improve the experience for everyone!
          </p>

          <div className=" flex flex-col gap-3">
            <div className="quick-amount my-2">
              <div className="head my-2 text-white/60 font-bold">
                <h3>Amount :</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {quickAmount.map((amt: string) => (
                  <button
                    key={amt}
                    onClick={() => formik.setFieldValue("amount.value", amt)}
                    className="py-3 px-3 rounded-xl w-full bg-[#1a1a25] transition-all border-2 border-white/5 hover:bg-rose-600/10 hover:border-2 hover:border-rose-600/60
                     duration-300 hover:-translate-y-1"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Minecraft's Username (optional)"
                className={`bg-[#1a1a25] border border-[#ffffff10] py-3 px-4 rounded-xl text-gray-400 w-full ${formik.errors?.username && formik.touched?.username ? "border-red-500" : ""}`}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="relative flex-1 mb-2">
              <input
                type="text"
                id="amount.value"
                name="amount.value"
                placeholder="0.00"
                /**/
                className={`bg-[#1a1a25] border border-[#ffffff10] py-3 px-4 rounded-xl w-full focus:outline-none focus:border-rose-600 transition-colors ${formik.errors?.amount?.value && formik.touched?.amount?.value ? "border-red-500" : ""}`}
                onChange={(e) => {
                  const regex = /^[0-9\b]+$/;
                  if (e.target.value === "" || regex.test(e.target.value)) {
                    formik.handleChange(e);
                  }
                }}
                onBlur={formik.handleBlur}
                value={formik.values.amount.value}
              />
              <span className="absolute right-4 top-3 text-gray-500">$</span>
              {formik.errors.amount?.value && formik.touched.amount?.value && (
                <>
                  <span className="text-[10px] text-rose-800">
                    Value is required
                  </span>
                </>
              )}
            </div>

            <input
              type="text"
              className="bg-[#1a1a25] hidden border border-[#ffffff10] py-3 px-4 rounded-xl w-24 text-center text-gray-400"
              disabled
              value={formik.values.amount.currency_code}
            />
          </div>

          <div key={formik.values.amount.value} className="min-h-[150px]">
            {isValidAmount ? (
              <div className="animate-fade-in">
                <PaypalPayment theme={theme} data={formik.values} />
              </div>
            ) : (
              <div className="text-center text-gray-500 py-10 border-2 border-dashed border-[#ffffff10] rounded-xl">
                Please enter a valid amount to donate by paypal
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setHidden(true)}
            className="w-full mt-4 text-gray-500 hover:text-white transition-colors text-sm"
          >
            Cancel
          </button>
          <div>
            <button
              onClick={() => setHidden(true)}
              className="absolute top-0 right-0 -translate-x-5 translate-y-5"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Donate;

"use client";
import {
  captureWithPaypalThunk,
  donateWithPaypalThunk,
} from "@/app/libs/redux/features/donateSlice";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch } from "react-redux";
import { IDonate } from "../Donate/Donate";
import toast from "react-hot-toast";
import { AppDispatch } from "@/app/libs/redux/store";
import { ThemeProps } from "@/app/hooks/themes";

interface IOptions {
  clientId: string;
  currency: "USD";
  intent: "capture";
}

const initialOptions: IOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string,
  currency: "USD",
  intent: "capture",
};

const PaypalPayment = ({
  theme,
  data,
}: {
  theme: Partial<ThemeProps>;
  data: IDonate;
}) => {
  const dispatch: AppDispatch = useDispatch();

  const handleCreateOrder = async () => {
    try {
      const res = await dispatch(donateWithPaypalThunk(data));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(res.payload.message);
        return res.payload
      } else {
        toast.error(res.payload.message || res.payload.errMessage);
      }
    } catch (error: any) {
      toast.error(error || "Something went wrong");
      throw error;
    }
  };

  const handleApprove = async (data: { orderID: string }) => {
    const res = await dispatch(captureWithPaypalThunk(data.orderID));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success((res.payload as any)?.paymentData?.status);
    } else {
      toast.error(
        `${(res.payload as any)?.paymentData?.errMessage || "Something went wrong ... Please try again"}`,
      );
    }
  };
  return (
    <PayPalScriptProvider options={initialOptions}>
      <div
        className="max-w-[400px] mx-auto p-6  rounded-2xl shadow-lg"
        style={{ background: theme.gradient }}
      >
        <div className="mb-4 text-center">
          <h3 className="text-2xl font-extrabold font-orbitron">
            Confirm your donation
          </h3>
        </div>

        <PayPalButtons
          style={{
            shape: "pill",
            color: "blue",
            layout: "vertical",
            label: "donate",
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
        />

        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-[10px] uppercase tracking-widest">
            Secure Encryption
          </span>
          <div className="h-px w-8 bg-gray-200"></div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default PaypalPayment;

import toast from "react-hot-toast";
import { successHandler } from "./successHandler";
import { ErrorHandler } from "./handleErr";
import { FormikValues } from "formik";
import { AppDispatch } from "../libs/redux/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const Onsubmit = async (
  values: FormikValues,
  helpers: () => void, 
  fnThunk: any,
  dispatch: AppDispatch,
  router?: AppRouterInstance,
  path?: string
) => {

  const res = await dispatch(fnThunk(values));

  if (res.meta.requestStatus === "rejected") {
    toast.error(ErrorHandler(res));
  }
  
  if (res.meta.requestStatus === "fulfilled") {
    helpers(); 
    toast.success(successHandler(res));
    
    if (router && path) {
      router.push(path);
    }
  }

  return res;
};
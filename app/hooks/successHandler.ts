export const successHandler = (res: any): string => {
  if (res?.meta?.requestStatus === "fulfilled") {
    return res.payload?.message ?? "Operation was successful.";
  }
  return "Success!";
};
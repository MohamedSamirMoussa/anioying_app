export const ErrorHandler = (res: any): string => {
    if (res?.meta?.requestStatus === "rejected") {
        return res.payload?.errMessage || res.error?.message || "Something went wrong on our end.";
    }
    
    return "An unexpected error occurred.";
};
import { io } from "socket.io-client";

export const createSocket = (namespace: string = "") => {
  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = process.env.NEXT_PUBLIC_BACK_END_URI || "http://localhost:3000";

  return io(`${baseUrl}${namespace}`, {
    transports: isProduction ? ["polling"] : ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    timeout: 20000,
    forceNew: isProduction,
  });
};

export const dashboardSocket = createSocket("/dashboard");
"use client";

import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect, useState } from "react";
import { setupApiInterceptors } from "../api/api";
import SessionMonitor from "@/app/Components/SessionProvider/SessionProvider";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setupApiInterceptors(store.dispatch);

    const UPDATE_ID = "v4_final_update";
    const hasUpdated = localStorage.getItem(UPDATE_ID);

    if (!hasUpdated) {
      persistor.purge().then(() => {
        localStorage.clear();

        localStorage.setItem(UPDATE_ID, "true");

        window.location.reload();
      });
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SessionMonitor />
        {children}
      </PersistGate>
    </Provider>
  );
}

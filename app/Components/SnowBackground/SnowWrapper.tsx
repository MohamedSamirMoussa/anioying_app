"use client";
import { usePathname } from "next/navigation";
import React from "react";
const SnowBackground = React.lazy(() => import("./SnowBackground"));
const SnowWrapper = () => {
  const pathname = usePathname();
  return (
    <>
      <SnowBackground key={pathname} />
    </>
  );
};

export default SnowWrapper;

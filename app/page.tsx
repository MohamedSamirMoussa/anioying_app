"use client";
import React from "react";

// Components
const Home = React.lazy(() => import("./Components/Home/Home"));
const About = React.lazy(() => import("./Components/About/About"));
const OptionalMods = React.lazy(() => import("./Components/OptionalMods/OptionalMods"));
const Community = React.lazy(() => import("./Components/Community/Community"));
const DiscordChannel = React.lazy(() => import("./Components/DiscordChannel/DiscordChannel"));

const Main = () => {

  return (
    /* Consider adding a loading spinner or skeleton in fallback */
    <React.Suspense fallback={null}>
      <Home />
      <About />
      <OptionalMods />
      <Community />
      <DiscordChannel />
    </React.Suspense>
  );
};

export default Main;
"use client";
import "./Navbar.css";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  IAuthState,
  logout,
  logoutThunk,
} from "@/app/libs/redux/features/authSlice";
import type { AppDispatch, RootState } from "@/app/libs/redux/store";
import { themes } from "@/app/hooks/themes";
const sections = ["home", "about", "op", "community", "gallery", "leaderboard"];

const Navbar = () => {
  const [scrollSection, setScrollSection] = useState<string>("home");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const activeTab = useSelector((state: RootState) => state.theme.activeServer);
  const theme = themes[activeTab] || themes["3"];
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user }: IAuthState = useSelector((s: RootState) => s.auth);
  
  const isLogged = user?.isLogged;
  const getActiveSection = useCallback(() => {
    if (pathname === "/") return scrollSection;
    return pathname.replace("/", "");
  }, [pathname, scrollSection]);

  const activeSection = getActiveSection();

  const handleLogout = async () => {
    const res = await dispatch(logoutThunk(undefined));
    try {
      if (res.type === "auth/logout/rejected") {
        toast.error(res.payload.errMessage);
        dispatch(logout());
        return;
      }
      toast.success("Logged out successfully");
    } catch {
      toast.error(res.payload.errMessage);
    }
  };

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset بسيط للدقة

      for (const sec of sections) {
        const element = document.getElementById(sec);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setScrollSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const linkStyle = (sec: string) =>
    ({
      color: activeSection === sec ? theme.color : "#fff",
      "--hover-color": theme.color,
    }) as React.CSSProperties;

  return (
    <>
      {pathname !== "/dashboard" ? (
        <nav
          className="nav fixed top-0 start-0 end-0 z-[999] backdrop-blur-sm py-3 bg-[#000000]"
          style={{ "--active-gradient": theme.gradient } as React.CSSProperties}
        >
          <section className="container lg:w-[70%] md:w-[80%] flex items-center justify-between mx-auto lg:justify-center">
            {/* Mobile Logo (Left-aligned on mobile) */}
            <div className="lg:hidden p-4 ">
              <Link
                href="/"
                className="logo text-3xl font-bold font-orbitron"
                style={{
                  backgroundImage: theme.gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                Anoing
              </Link>
            </div>

            {/* Desktop Menu */}
            <ul className="lg:flex justify-center items-center gap-9 2xl:gap-22 links hidden">
              <li className={activeSection === "home" ? "active" : ""}>
                <Link href="/#home" style={linkStyle("home")}>
                  Home
                </Link>
              </li>
              <li className={activeSection === "about" ? "active" : ""}>
                <Link href="/#about" style={linkStyle("about")}>
                  About
                </Link>
              </li>
              <li
                className={`${activeSection === "op" ? "active" : ""} flex text-xs font-bold`}
              >
                <Link href="/#op" style={linkStyle("op")}>
                  Optional Mods
                </Link>
              </li>

              {/* Central Logo */}
              <li className="">
                <Link
                  href="/"
                  className="logo text-4xl font-bold tracking-widest font-orbitron"
                  style={{
                    backgroundImage: theme.gradient,
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Anoing
                </Link>
              </li>

              <li className={activeSection === "community" ? "active" : ""}>
                <Link href="/#community" style={linkStyle("community")}>
                  Community
                </Link>
              </li>
              <li className={activeSection === "gallery" ? "active" : ""}>
                <Link href="/gallery" style={linkStyle("gallery")}>
                  Gallery
                </Link>
              </li>
              <li className={activeSection === "leaderboard" ? "active" : ""}>
                <Link href="/leaderboard" style={linkStyle("leaderboard")}>
                  Leaderboard
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-2xl text-white p-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
            </button>

            {/* Mobile Sidebar/Overlay */}
            <div
              className={`fixed h-screen inset-0 bg-[#0a0a0f] transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-500 lg:hidden flex flex-col items-center justify-center gap-8 z-50`}
            >
              <button
                className="absolute top-6 right-8 text-3xl text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {sections.map((sec) => (
                <Link
                  key={sec}
                  href={
                    sec === "gallery" || sec === "leaderboard"
                      ? `/${sec}`
                      : `/#${sec}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-orbitron uppercase tracking-widest"
                  style={{
                    color: activeSection === sec ? theme.color : "#fff",
                  }}
                >
                  {sec === "op" ? "Optional Mods" : sec}
                </Link>
              ))}

              {isLogged && (
                <button
                  onClick={handleLogout}
                  className="mt-4 text-red-500 font-bold text-xl uppercase"
                >
                  Logout
                </button>
              )}
            </div>
          </section>
        </nav>
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;

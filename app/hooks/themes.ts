import { StaticImageData } from "next/image";
import blue from "@/public/blue.png";
import newHorizon from "@/public/new-horizon.png";
import one from "@/public/one.png";
export interface ThemeProps {
  id?: string;
  name?: string;
  players: string;
  version: string;
  color: string;
  shadowColor: string;
  hoverColor?: string;
  primaryColor?: string;
  gradient: string;
  image: StaticImageData;
  backgroundClip?: string;
  WebkitTextFillColor?: string;
}

export const themes: Record<string, ThemeProps> = {
  "1": {
    id: "86943e54",
    name: "atm10",
    players: "5/20",
    version: "ATM10",
    color: "#3b82f6",
    shadowColor: "rgba(59, 130, 246, 0.5)",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    gradient: `linear-gradient(to top right , rgba(75, 221, 240, 1), rgba(74, 0, 224, 1))`,
    image: blue,
  },
  "2": {
    id: "8bd2e79a",
    name: "AllTheMons",
    players: "3/15",
    version: "All The Mons",
    color: "#f43f5e",
    shadowColor: "rgba(244, 63, 94, 0.5)",
    hoverColor: "rgba(245, 34, 45, 1);",
    primaryColor: "rgba(243, 83, 200, 1)",
    gradient: `linear-gradient(to top right , rgba(230, 34, 45, 1), rgba(243, 83, 200, 1))`,
    image: newHorizon,
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  "3": {
    id: "b7157e41",
    name: "stoneblock4",
    players: "2/10",
    version: "SB4",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "#f0c14b",
    shadowColor: "rgba(240, 193, 75, 0.5)",
    hoverColor: "#f0c14b",
    primaryColor: "#a953f3",
    gradient:
      "linear-gradient(to top right, var(--hover-color), var(--color-primary))",
    image: one,
  },
  "4": {
    id: "8709e381",
    name: "palworld",
    players: "5/20",
    version: "4",
    color: "#3b82f6",
    shadowColor: "rgba(59, 130, 246, 0.5)",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    gradient: `linear-gradient(to top right , rgba(75, 221, 240, 1), rgba(74, 0, 224, 1))`,
    image: blue,
  },
  "5": {
    name: "5",
    players: "5/20",
    version: "5",
    color: "#f43f5e",
    shadowColor: "rgba(244, 63, 94, 0.5)",
    hoverColor: "rgba(245, 34, 45, 1);",
    primaryColor: "rgba(243, 83, 200, 1)",
    gradient: `linear-gradient(to top right , rgba(230, 34, 45, 1), rgba(243, 83, 200, 1))`,
    image: newHorizon,
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  "6": {
    name: "6",
    players: "5/20",
    version: "6",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
    color: "#f0c14b",
    shadowColor: "rgba(240, 193, 75, 0.5)",
    hoverColor: "#f0c14b",
    primaryColor: "#a953f3",
    gradient:
      "linear-gradient(to top right, var(--hover-color), var(--color-primary))",
    image: one,
  },
};

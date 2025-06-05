import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    layout: {
      radius: {
        small: "6px", 
        medium: "10px", 
        large: "14px", 
      },
    },
    themes: {
      light: {
        colors: {
          primary: {
            "50": "#eef6ff",
            "100": "#d9eaff",
            "200": "#bcdaff",
            "300": "#8ec2ff",
            "400": "#599eff",
            "500": "#3178ff",
            "600": "#1a5af7",
            "700": "#1347e6",
            "800": "#173bba",
            "900": "#193993",
            "DEFAULT": "#3178ff",
            "foreground": "#ffffff"
          },
        },
      },
      dark: {
        colors: {
          background: {
            "DEFAULT": "#0a0a1a"
          },
          content1: {
            "DEFAULT": "#12122a",
            "foreground": "#f1f1fc"
          },
          content2: {
            "DEFAULT": "#1a1a36",
            "foreground": "#e1e1f6"
          },
          content3: {
            "DEFAULT": "#222244",
            "foreground": "#d1d1f0"
          },
          content4: {
            "DEFAULT": "#2a2a52",
            "foreground": "#c1c1ea"
          },
          primary: {
            "50": "#131336",
            "100": "#1a1a4d",
            "200": "#222264",
            "300": "#2a2a7b",
            "400": "#3232a1",
            "500": "#4949c8",
            "600": "#6a6ad4",
            "700": "#8b8be0",
            "800": "#acacec",
            "900": "#d0d0f8",
            "DEFAULT": "#4949c8",
            "foreground": "#ffffff"
          },
        }
      }
    }
  })],
};

import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { scopedPreflightStyles } from "tailwindcss-scoped-preflight";

const config: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderWidth: {
        1: "1px",
      },
      fontFamily: {
        code: ["var(--font-code)"],
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".ligatures-none": {
          fontVariantLigatures: "none",
        },
      });
    }),
    scopedPreflightStyles({
      cssSelector: ".rsc", // or .tailwind-preflight or even [data-twp=true] - any valid CSS selector of your choice
      mode: "matched only", // it's the default
    }),
  ],
};

export default config;

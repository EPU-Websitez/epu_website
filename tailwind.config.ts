import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1B417B",
        secondary: "#003366",
        background: "#ffffff",
        backgroundSecondary: "#F8F8F8",
        blue: "#298BD0",
        red: "#ff2e2e",
        backgroundTerinary: "#3a3b3c",
        grey: "#c7f5e0",
        green: "#20e87d",
        yellow: "#fff200",
        lightBorder: "#E8E8E8",
        lightText: "#4F4F4F",
        golden: "#DCC48C",
      },
      fontSize: {
        // Custom font sizes with size and line-height
        title: ["2.5rem", { lineHeight: "3.5rem", fontWeight: "700" }], // 40px
        titleNormal: ["1.75rem", { lineHeight: "2.5rem", fontWeight: "600" }], // 40px
        smallTitle: ["1.5rem", { lineHeight: "2rem", fontWeight: "600" }], // 24px
        paragraph: ["1rem", { lineHeight: "1.75rem" }], // 16px
        smallParagraph: ["0.875rem", { lineHeight: "1.5rem" }], // 14px
        caption: ["0.75rem", { lineHeight: "1.25rem" }], // 12px
      },
    },
  },
  plugins: [],
};
export default config;

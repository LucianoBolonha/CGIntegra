import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./docs/design-system/**/*.html"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        surface: "#f7f8fb",
        brand: "#2357a3",
        accent: "#1b8a6b"
      }
    }
  },
  plugins: []
};

export default config;

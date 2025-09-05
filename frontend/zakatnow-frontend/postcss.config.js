// postcss.config.js (ESM)
import tailwind from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    tailwind(),    // ini plugin resmi baru Tailwind 4
    autoprefixer(), 
  ],
};

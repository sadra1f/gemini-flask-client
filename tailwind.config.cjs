/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./assets/**/*.js", "./templates/**/*.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), //
    require("daisyui"),
  ],
  daisyui: {
    themes: ["dark"],
  },
};

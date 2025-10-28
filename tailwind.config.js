/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./apps/**/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./apps/**/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./apps/**/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./packages/**/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

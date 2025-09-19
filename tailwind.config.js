/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkblue: "#0B1E3F",  // example deep navy
        blue: "#1E40AF",      // bold blue
        beige: "#F5F5DC",     // classic beige
        red: "#DC2626",       // Tailwind red-600
        indigo: "#6366F1",
        purple: "#A855F7",
        pink: "#F472B6",
        orange: "#FB923C",
        yellow: "#FACC15",
        teal: "#14B8A6",
        emerald: "#10B981",
      },
    },
  },
  plugins: [],
};

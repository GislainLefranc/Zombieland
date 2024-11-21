/* Ajout des chemins d'accès à tous les fichiers modèles. */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    
    extend: {
      colors: {
        red: {
          primary: "#7B0002",
          secondary: "#3E0A16",
        },
        grey: "#222222",
        green: {
          low: "#343826",
          high: "#3C4D41",
        }
      },
      fontFamily: {
        title: ["Alfa Slab One, sans serif"],
        body: ["Gentium Book Basic, sans serif"],
      },
    },
    
  },
  plugins: [
    require('@headlessui/tailwindcss'),
    require('@tailwindcss/forms'),
  ],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      'fc-Candy' : ['Fc-Candy' , 'Regular'],
      'sunny-spells' : ['sunny-spells' , 'Regular'],
      'itim' : ['itim' , 'Regular']
    },
    backgroundImage: {
      'LevelMode-Selector': "url('/src/assets/img/LevelMode-Selector-BG.jpg')",
    }
  },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes : ["pastel", "dracula","aqua"],
    // darkTheme: "dracula",
    // base: false,
  },
}


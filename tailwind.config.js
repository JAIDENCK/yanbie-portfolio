/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        greige: '#D6CCBF',
        offwhite: '#E3DDD1',
        'yellow-light': '#FFF3CB',
        yellow: '#FFF095',
        orange: '#FDC77D',
        salmon: '#FF9C7F',
        pink: '#FD7E85',
        rose: '#D85F7E',
        berry: '#B93360',
        text: '#3a2a2a',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.3, transform: 'scale(0.7)' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

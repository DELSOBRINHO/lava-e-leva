/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3DBFF2',
          secondary: '#FFFFFF',
          accent: '#3DF2B6',
          graylight: '#F4F8FB',
          gray: '#7B8A99',
          dark: '#1A365D',
        },
      },
      borderRadius: {
        'md': '8px',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        none: '0',
        DEFAULT: '0',
      },
      colors: {
        primary: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#000000',  // Black (main primary)
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        secondary: {
          50: '#FFFFFF',
          100: '#F8F8F8',
          200: '#F5F5F5',
          300: '#EDEDED',
          400: '#E8E8E8',
          500: '#D9D9D9',
          600: '#CCCCCC',
          700: '#999999',
          800: '#666666',
          900: '#333333',
        },
        accent: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        text: {
          primary: '#000000',    // Pure black
          secondary: '#666666',  // Grey for secondary text
          muted: '#999999',
          light: '#CCCCCC',
        },
        background: {
          main: '#FFFFFF',       // Pure white
          secondary: '#F8F8F8',  // Light grey
          section: '#FAFAFA',    // Very light grey
          card: '#FFFFFF',       // White cards
          cream: '#FFFFFF',      // White
          white: '#FFFFFF',
        },
        border: {
          light: '#E8E8E8',
          main: '#000000',
        },
      },
      fontFamily: {
        heading: ['var(--font-poppins)', 'Helvetica', 'Arial', 'sans-serif'],
        sans: ['var(--font-poppins)', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['var(--font-poppins)', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

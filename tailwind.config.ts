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
          50: '#FBF8F5',
          100: '#F7F0E8',
          200: '#EFE1D1',
          300: '#E8D7C3',  // Main beige
          400: '#D4BFA7',
          500: '#C0A88B',  // Medium beige
          600: '#A08868',
          700: '#7A6850',
          800: '#544838',
          900: '#2E281C',
        },
        secondary: {
          50: '#FEFEFE',
          100: '#FDFCFB',
          200: '#FAF8F5',
          300: '#F5F2EE',
          400: '#EBE7E1',
          500: '#D9D3CB',
          600: '#B8AFA3',
          700: '#8C837A',
          800: '#615951',
          900: '#362F28',
        },
        accent: {
          50: '#FAF8F3',
          100: '#F5F1E8',
          200: '#EBE3D1',
          300: '#DDD0B0',
          400: '#C9B888',
          500: '#d4af37',  // Gold accent
          600: '#b8961e',
          700: '#8a7116',
          800: '#5c4b0f',
          900: '#2e2508',
        },
        text: {
          primary: '#2E281C',    // Dark brown
          secondary: '#615951',  // Medium brown
          muted: '#8C837A',
          light: '#B8AFA3',
        },
        background: {
          main: '#FDFCFB',       // Off white
          secondary: '#F7F0E8',  // Light beige
          section: '#E8D7C3',    // Beige
          card: '#FFFFFF',       // Pure white
          cream: '#FAF8F5',      // Cream
          white: '#FFFFFF',
        },
        border: {
          light: '#EBE7E1',
          main: '#D9D3CB',
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

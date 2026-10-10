import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dasara: {
          maroon: '#4c0d17',       // Deep Burgundy (Matches AI Hero Image)
          deepCrimson: '#3d1118',  // Darker shade for contrast
          gold: '#b08a47',         // Soft Gold
          goldLight: '#d2b471',    // Shimmer highlight
          peacock: '#0D5C75',
          emerald: '#0B4D3C',
          haldi: '#E5A93C',
          champagne: '#f9f5ec',    // Warm Cream
          obsidian: '#121013',
          cardBg: '#1A1518',
          borderGold: 'rgba(176, 138, 71, 0.25)',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Noto Serif Telugu"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Telugu"', 'Inter', 'sans-serif'],
        telugu: ['"Noto Serif Telugu"', '"Noto Sans Telugu"', 'serif'],
      },
      animation: {
        'shine': 'shine 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 25s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear',
      },
      keyframes: {
        'border-beam': {
          '100%': {
            'offset-distance': '100%',
          },
        },
        shine: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(212, 175, 55, 0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(212, 175, 55, 0.45)' },
        }
      }
    }
  },
  plugins: [tailwindcssAnimate],
};

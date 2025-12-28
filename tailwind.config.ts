import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#AE1C3E',
          dark: '#8B1631',
          light: '#C42D4F',
        },
        secondary: {
          DEFAULT: '#F0E5E7',
        },
        accent: {
          DEFAULT: '#D4AF37',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(86.7deg, #AE1C3E 0.85%, rgba(174, 28, 62, 0.45) 98.94%)',
        'gradient-primary-solid': 'linear-gradient(135deg, #AE1C3E 0%, #C42D4F 50%, #D93D5F 100%)',
        'gradient-vibrant': 'linear-gradient(135deg, #AE1C3E 0%, #C42D4F 40%, #D4AF37 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E5C55A 100%)',
        'gradient-hero': 'linear-gradient(160deg, #AE1C3E 0%, #C42D4F 40%, #8B1631 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
      },
      fontFamily: {
        sans: ['var(--font-be-vietnam-pro)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        button: '0 4px 14px rgba(174, 28, 62, 0.3)',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
      },
    },
  },
  plugins: [],
}

export default config

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--bg) / <alpha-value>)',
        foreground: 'hsl(var(--on-surface) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        brand: {
          DEFAULT: 'hsl(var(--brand) / <alpha-value>)',
          50: 'hsl(var(--brand) / 0.05)',
          100: 'hsl(var(--brand) / 0.1)',
          200: 'hsl(var(--brand) / 0.2)',
          300: 'hsl(var(--brand) / 0.3)',
          400: 'hsl(var(--brand) / 0.4)',
          500: 'hsl(var(--brand) / 0.5)',
          600: 'hsl(var(--brand) / 0.6)',
          700: 'hsl(var(--brand) / 0.7)',
          800: 'hsl(var(--brand) / 0.8)',
          900: 'hsl(var(--brand) / 0.9)',
        },
        'brand-light': 'hsl(var(--brand-light) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        error: 'hsl(var(--error) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neumorphic': '5px 5px 10px rgba(0, 0, 0, 0.05), -5px -5px 10px rgba(255, 255, 255, 0.7)',
      },
      transitionTimingFunction: {
        'ease-custom': 'var(--transition-ease)',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
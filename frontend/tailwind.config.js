/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#0f0f0f',
        accent: '#111827',
        success: '#16a34a',
        error: '#dc2626',
        warning: '#f59e0b',
        muted: '#4b5563',
        border: '#e5e7eb',
        background: '#fafafa',
        surface: '#ffffff',
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15,15,15,0.08)',
      },
      transitionTimingFunction: {
        gentle: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      screens: {
        '2xl': '1440px',
      },
    }
  },
  plugins: []
}


/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3F6B3F',
        primaryDark: '#2E4F2E',
        primaryLight: '#E8F0E4',
        accent: '#B9793E',
        accentLight: '#F5E9DC',
        background: '#FAF9F6',
        surface: '#FFFFFF',
        border: '#E4E1D9',
        textPrimary: '#232420',
        textSecondary: '#6B6A63',
        textMuted: '#9A988F',
        success: '#3F6B3F',
        successLight: '#E8F0E4',
        warning: '#B9793E',
        warningLight: '#F5E9DC',
        error: '#B3422F',
        errorLight: '#F6E5E1',
        info: '#3A6B8A',
        infoLight: '#E4EDF2',
        disabled: '#D8D6CC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
        'card-lg': '0 20px 40px -12px rgba(0,0,0,0.1)',
        toast: '0 14px 30px -6px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.06)',
      },
      keyframes: {
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'toast-out': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-12px) scale(0.96)' },
        },
        'skeleton-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'toast-in': 'toast-in 0.3s ease-out',
        'toast-out': 'toast-out 0.2s ease-in forwards',
        'skeleton-pulse': 'skeleton-pulse 1.8s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.2s ease-in forwards',
        'fade-in': 'fade-in 0.2s ease-out',
        'marquee': 'marquee 25s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
};

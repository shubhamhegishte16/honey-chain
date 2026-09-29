/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Honey Chain Official Palette
        deepBrown: '#281D1C',
        burgundy: '#861C1C',
        burgundyDark: '#6A1515',
        burgundyLight: '#FBEBEB',
        burntOrange: '#C06E30',
        burntOrangeLight: '#FDF1E7',
        honeyGold: '#F4B345',
        honeyGoldLight: '#FEF6E4',
        honeyGoldDark: '#D99827',
        mutedSage: '#C8CBB8',
        mutedSageLight: '#F3F4EE',
        mutedSageDark: '#8F937A',
        warmIvory: '#FAF7EE',
        warmIvoryDark: '#E8E3CF',

        // Semantic Role Bindings matching project
        primary: '#861C1C', // Burgundy as primary action
        primaryDark: '#6A1515',
        primaryLight: '#FBEBEB',
        accent: '#C06E30', // Burnt Orange
        accentLight: '#FDF1E7',
        gold: '#F4B345',
        goldLight: '#FEF6E4',
        background: '#FAF7EE',
        surface: '#FFFFFF',
        surfaceIvory: '#F7F3E6',
        border: '#E8E3CF',
        borderDark: '#D6CEB5',
        textPrimary: '#281D1C',
        textSecondary: '#5E524D',
        textMuted: '#9B918B',
        success: '#2E7D32',
        successLight: '#E8F5E9',
        warning: '#C06E30',
        warningLight: '#FDF1E7',
        error: '#861C1C',
        errorLight: '#FBEBEB',
        info: '#1E6B7B',
        infoLight: '#E0F2F6',
        disabled: '#E5E0D2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['Fraunces', '"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 2px 8px rgba(40, 29, 28, 0.04), 0 1px 2px rgba(40, 29, 28, 0.02)',
        'soft-md': '0 6px 20px -2px rgba(40, 29, 28, 0.07), 0 2px 6px -1px rgba(40, 29, 28, 0.04)',
        'soft-lg': '0 16px 36px -4px rgba(40, 29, 28, 0.1), 0 6px 14px -2px rgba(40, 29, 28, 0.05)',
        card: '0 2px 10px rgba(40, 29, 28, 0.04), 0 1px 3px rgba(40, 29, 28, 0.03)',
        'card-hover': '0 12px 28px -4px rgba(40, 29, 28, 0.1), 0 4px 8px -2px rgba(40, 29, 28, 0.04)',
        'card-lg': '0 20px 45px -10px rgba(40, 29, 28, 0.12)',
        toast: '0 16px 36px -6px rgba(40, 29, 28, 0.14), 0 4px 10px -2px rgba(40, 29, 28, 0.06)',
        neomorph: '6px 6px 16px rgba(40, 29, 28, 0.06), -6px -6px 16px rgba(255, 255, 255, 0.95)',
        'neomorph-inset': 'inset 2px 2px 5px rgba(40, 29, 28, 0.06), inset -2px -2px 5px rgba(255, 255, 255, 0.85)',
        glass: '0 8px 32px 0 rgba(40, 29, 28, 0.08)',
        gold: '0 8px 24px -3px rgba(244, 179, 69, 0.35)',
        burgundy: '0 8px 24px -3px rgba(134, 28, 28, 0.35)',
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
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
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
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      animation: {
        'toast-in': 'toast-in 0.3s ease-out',
        'toast-out': 'toast-out 0.2s ease-in forwards',
        'skeleton-pulse': 'skeleton-pulse 1.8s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.2s ease-in forwards',
        'fade-in': 'fade-in 0.2s ease-out',
        'marquee': 'marquee 28s linear infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

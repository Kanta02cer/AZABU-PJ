
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"Plus Jakarta Sans"', '"Noto Sans JP"', 'sans-serif'],
        },
        colors: {
          brand: {
            orange: '#FF6B00',
            yellow: '#FFB800',
            black: '#111111',
            white: '#FFFFFF',
          }
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.3' },
            '50%': { transform: 'translateY(-30px) scale(1.5)', opacity: '0.6' },
          },
          shimmer: {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' },
          },
          'bounce-slow': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-8px)' },
          },
          'slide-right': {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(6px)' },
          },
          'cta-glow': {
            '0%, 100%': { boxShadow: '0 8px 24px rgba(245,166,35,0.35)' },
            '50%': { boxShadow: '0 12px 36px rgba(245,166,35,0.55)' },
          },
          'subtle-pulse': {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          },
          'expand-line': {
            '0%': { transform: 'scaleX(0)' },
            '100%': { transform: 'scaleX(1)' },
          },
          'blob-morph-1': {
            '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', transform: 'rotate(0deg) scale(1)' },
            '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%', transform: 'rotate(90deg) scale(1.05)' },
            '50%': { borderRadius: '50% 60% 30% 60% / 30% 50% 70% 60%', transform: 'rotate(180deg) scale(0.95)' },
            '75%': { borderRadius: '60% 30% 60% 40% / 70% 40% 50% 60%', transform: 'rotate(270deg) scale(1.02)' },
          },
          'blob-morph-2': {
            '0%, 100%': { borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%', transform: 'rotate(0deg) scale(1)' },
            '33%': { borderRadius: '70% 30% 50% 50% / 30% 70% 40% 60%', transform: 'rotate(120deg) scale(1.08)' },
            '66%': { borderRadius: '50% 50% 30% 70% / 60% 40% 70% 30%', transform: 'rotate(240deg) scale(0.92)' },
          },
          'blob-morph-3': {
            '0%, 100%': { borderRadius: '50% 50% 40% 60% / 60% 40% 60% 40%', transform: 'rotate(0deg) scale(1)' },
            '50%': { borderRadius: '40% 60% 50% 50% / 40% 60% 40% 60%', transform: 'rotate(180deg) scale(1.1)' },
          },
          'gradient-shift': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          'float-slow': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '25%': { transform: 'translateY(-20px) translateX(10px)' },
            '50%': { transform: 'translateY(-10px) translateX(-5px)' },
            '75%': { transform: 'translateY(-25px) translateX(15px)' },
          },
          'float-reverse': {
            '0%, 100%': { transform: 'translateY(0) translateX(0)' },
            '25%': { transform: 'translateY(15px) translateX(-10px)' },
            '50%': { transform: 'translateY(5px) translateX(8px)' },
            '75%': { transform: 'translateY(20px) translateX(-12px)' },
          },
          'ripple': {
            '0%': { transform: 'scale(0.8)', opacity: '0.6' },
            '100%': { transform: 'scale(2.5)', opacity: '0' },
          },
          'glow-pulse': {
            '0%, 100%': { opacity: '0.4', filter: 'blur(40px)' },
            '50%': { opacity: '0.7', filter: 'blur(60px)' },
          },
          'text-reveal': {
            '0%': { transform: 'translateY(100%)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          'tag-slide': {
            '0%': { transform: 'translateX(-20px) scale(0.9)', opacity: '0' },
            '100%': { transform: 'translateX(0) scale(1)', opacity: '1' },
          },
          'orbit': {
            '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
            '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
          },
          'line-draw': {
            '0%': { strokeDashoffset: '1000' },
            '100%': { strokeDashoffset: '0' },
          },
          'marquee': {
            '0%': { transform: 'translateX(0%)' },
            '100%': { transform: 'translateX(-100%)' },
          },
        },
        animation: {
          float: 'float 5s ease-in-out infinite',
          shimmer: 'shimmer 4s ease-in-out infinite',
          'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
          'slide-right': 'slide-right 1.5s ease-in-out infinite',
          'cta-glow': 'cta-glow 2.5s ease-in-out infinite',
          'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
          'expand-line': 'expand-line 0.8s ease-out forwards',
          'blob-morph-1': 'blob-morph-1 12s ease-in-out infinite',
          'blob-morph-2': 'blob-morph-2 15s ease-in-out infinite',
          'blob-morph-3': 'blob-morph-3 10s ease-in-out infinite',
          'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
          'float-slow': 'float-slow 8s ease-in-out infinite',
          'float-reverse': 'float-reverse 9s ease-in-out infinite',
          'ripple': 'ripple 3s ease-out infinite',
          'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
          'text-reveal': 'text-reveal 0.8s ease-out forwards',
          'tag-slide': 'tag-slide 0.6s ease-out forwards',
          'orbit': 'orbit 20s linear infinite',
          'line-draw': 'line-draw 2s ease-out forwards',
          'marquee': 'marquee 40s linear infinite',
        },
      },
    },
    plugins: [],
  }

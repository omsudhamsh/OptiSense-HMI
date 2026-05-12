/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        isa: {
          p1: '#FF2D2D',
          p2: '#FF8C00',
          p3: '#FFD700',
          p4: '#3B82F6'
        },
        accent: '#00D4AA',
        surface: {
          base:     '#080C18',
          card:     '#0D1424',
          elevated: '#121B2E',
          border:   '#1E2D45',
          hover:    '#172035'
        },
        text: {
          primary:   '#F0F4FF',
          secondary: '#8B9CC8',
          tertiary:  '#4A5A7A'
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        body:    ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-accent':   '0 0 24px rgba(0, 212, 170, 0.35)',
        'glow-p1':       '0 0 20px rgba(255, 45, 45, 0.3)',
        'glow-p2':       '0 0 16px rgba(255, 140, 0, 0.25)',
        'card':          '0 4px 24px rgba(0, 0, 0, 0.35)',
        'card-hover':    '0 8px 40px rgba(0, 0, 0, 0.5)',
        'modal':         '0 24px 80px rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Cpath d='M0 0h1v40H0zM40 0h1v40h-1zM0 0v1h40V0zM0 40v1h40v-1z' fill='%231E2D45' opacity='0.3'/%3E%3C/svg%3E\")"
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    }
  },
  plugins: []
}

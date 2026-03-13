export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50: '#ffe6e6',
          100: '#ffcccc',
          500: '#ff1a1a',
          600: '#ff0000',
          700: '#cc0000',
          800: '#990000',
          900: '#660000'
        },
        dark: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#a0a0a0',
          500: '#7a7a7a',
          600: '#555555',
          700: '#333333',
          800: '#1a1a1a',
          900: '#0a0a0a'
        },// Add this in theme.extend section, after colors
lightMode: {
  background: '#ffffff',
  text: '#1a1a1a',
  surface: '#f5f5f5',
  border: '#e5e5e5'
}
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif']
      },
      backdropBlur: {
        glass: '10px'
      },
      backgroundOpacity: {
        glass: '0.7'
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        glow: '0 0 20px rgba(255, 26, 26, 0.3)',
        'glow-sm': '0 0 10px rgba(255, 26, 26, 0.2)'
      },
      animation: {
        'gradient-shift': 'gradient 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(255, 26, 26, 0.2)',
            opacity: '1'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(255, 26, 26, 0.4)',
            opacity: '0.95'
          }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      },
      spacing: {
        'glass': '0.5px',
        'border-glass': '1px'
      }
      
    }
  },
  darkMode: 'class',
  plugins: []
}
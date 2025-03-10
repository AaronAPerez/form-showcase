/** @type {import('tailwindcss').Config} */

const { violet, blackA, mauve, green } = require('@radix-ui/colors');

module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Modern violet gradient primary color
        primary: {
          DEFAULT: violet.violet9,
          foreground: 'white',
          50: violet.violet1,
          100: violet.violet2,
          200: violet.violet3,
          300: violet.violet4,
          400: violet.violet5,
          500: violet.violet6,
          600: violet.violet7,
          700: violet.violet8,
          800: violet.violet9,
          900: violet.violet10,
        },
        // Neutral tones
        neutral: {
          DEFAULT: mauve.mauve8,
          50: mauve.mauve1,
          100: mauve.mauve2,
          200: mauve.mauve3,
          300: mauve.mauve4,
          400: mauve.mauve5,
          500: mauve.mauve6,
          600: mauve.mauve7,
          700: mauve.mauve8,
          800: mauve.mauve9,
          900: mauve.mauve10,
        },
        // Success colors
        success: {
          DEFAULT: green.green9,
          50: green.green1,
          100: green.green2,
          200: green.green3,
          300: green.green4,
          400: green.green5,
          500: green.green6,
          600: green.green7,
          700: green.green8,
          800: green.green9,
          900: green.green10,
        },
        // Add glassmorphism utilities
        backdropFilter: {
          'none': 'none',
          'blur': 'blur(20px)',
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 }
        },
        pulse: {
          '0%, 100%': {
            opacity: 1
          },
          '50%': {
            opacity: 0.5
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in": "slideInFromLeft 0.5s ease-out forwards",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
      // Add outline styles for accessibility
      outlineOffset: {
        '3': '3px',
      },
      outline: {
        'blue': '2px solid rgba(59, 130, 246, 0.5)',
        'violet': '2px solid rgba(139, 92, 246, 0.5)',
      },
      // Adding focus-visible styles
      ringWidth: {
        DEFAULT: '3px',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
      // Adding high contrast mode support
      screens: {
        'high-contrast': {'raw': '(forced-colors: active)'},
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add plugin for accessibility features
    function({ addUtilities }) {
      const newUtilities = {
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0',
        },
        '.focus-visible\\:not-sr-only:focus-visible': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: '0',
          margin: '0',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
        '.reduce-motion': {
          '@media (prefers-reduced-motion: reduce)': {
            'animation-duration': '0.01ms !important',
            'animation-iteration-count': '1 !important',
            'transition-duration': '0.01ms !important',
            'scroll-behavior': 'auto !important',
          },
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
  ],
}
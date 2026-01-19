/**
 * Kaitif Skatepark UI - Tailwind CSS Preset
 *
 * Storm Cloud Aesthetic
 * Dark, moody grays with electric yellow energy.
 *
 * Usage:
 * // tailwind.config.js
 * module.exports = {
 *   presets: [require('./path/to/kaitif-preset.js')],
 *   // ... your config
 * }
 */

const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      // ============================================
      // COLORS - Storm Cloud Palette
      // ============================================
      colors: {
        // Storm Cloud Backgrounds (Layered Grays)
        storm: {
          DEFAULT: '#0A0A0B',   // Deepest storm - primary background
          cloud: '#111113',     // Cloud layer - cards, elevated surfaces
          slate: '#1A1A1D',     // Slate - inputs, secondary surfaces
          ash: '#252529',       // Ash - hover states, tertiary surfaces
          steel: '#35353A',     // Steel - borders, dividers
        },

        // Electric Accent
        electric: {
          DEFAULT: '#FFE500',   // Electric yellow - THE accent
          bright: '#FFF040',    // Brighter yellow - hover states
          dim: '#BFA900',       // Dimmed yellow - subtle states
        },

        // Text Colors
        text: {
          primary: '#FFFFFF',
          secondary: '#9A9AA0',
          tertiary: '#5A5A62',
          muted: '#3A3A42',
          inverse: '#0A0A0B',
        },

        // Semantic Colors
        semantic: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },

        // Gamification Tiers
        tier: {
          bronze: '#CD7F32',
          silver: '#8A8A8A',
          gold: '#FFE500',      // Matches electric
          platinum: '#E5E4E2',
        },

        // Border Colors
        border: {
          DEFAULT: '#252529',
          hover: '#35353A',
          focus: '#5A5A62',
          electric: '#FFE500',
        },
      },

      // ============================================
      // TYPOGRAPHY
      // ============================================
      fontFamily: {
        display: ['Plus Jakarta Sans', 'Satoshi', 'system-ui', 'sans-serif'],
        body: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },

      fontSize: {
        // Display sizes
        'display-xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],

        // Heading sizes
        'heading-xl': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading': ['1.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],

        // Title & Body
        'title': ['1.125rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Small text
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
        'overline': ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '600' }],
      },

      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.02em',
        'snug': '-0.01em',
        'normal': '0',
        'wide': '0.02em',
        'wider': '0.05em',
        'widest': '0.1em',
      },

      // ============================================
      // SPACING
      // ============================================
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
      },

      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'none': '0',
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px',
        'full': '9999px',
      },

      // ============================================
      // SHADOWS
      // ============================================
      boxShadow: {
        // Subtle - hover states
        'sm': '0 2px 8px -2px rgba(0, 0, 0, 0.4)',

        // Card - default elevation
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.6)',

        // Lifted - hover state for cards
        'lifted': '0 8px 32px -4px rgba(0, 0, 0, 0.7)',

        // Modal - overlays
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.8)',

        // Inner - inputs
        'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',

        // Electric glow effects
        'glow-electric': '0 0 24px rgba(255, 229, 0, 0.4)',
        'glow-electric-sm': '0 0 8px rgba(255, 229, 0, 0.6)',
        'glow-electric-lg': '0 0 40px rgba(255, 229, 0, 0.5)',
      },

      // ============================================
      // Z-INDEX
      // ============================================
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        'max': '9999',
      },

      // ============================================
      // ANIMATION
      // ============================================
      transitionDuration: {
        'fast': '150ms',
        'DEFAULT': '300ms',
        'slow': '500ms',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in': 'cubic-bezier(0.4, 0, 1, 1)',
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-up': 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'electric-pulse': 'electricPulse 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        electricPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(255, 229, 0, 0.6)' },
          '50%': { boxShadow: '0 0 16px rgba(255, 229, 0, 0.8)' },
        },
      },

      // ============================================
      // BREAKPOINTS
      // ============================================
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

      // ============================================
      // CONTAINER
      // ============================================
      container: {
        center: true,
        padding: {
          DEFAULT: '1.5rem',
          sm: '2rem',
          lg: '3rem',
          xl: '4rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },

      // ============================================
      // BACKDROP BLUR
      // ============================================
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },

  plugins: [
    // Custom Kaitif utility classes
    plugin(function({ addUtilities, addComponents, theme }) {

      // ============================================
      // UTILITY CLASSES
      // ============================================
      addUtilities({
        // Text gradient utility
        '.text-gradient': {
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },

        // Hide scrollbar
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

        // Custom scrollbar
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': '#35353A #111113',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#111113',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#35353A',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#5A5A62',
          },
        },
      });

      // ============================================
      // COMPONENT CLASSES
      // ============================================
      addComponents({
        // Premium Card
        '.card-storm': {
          backgroundColor: theme('colors.storm.cloud'),
          borderRadius: theme('borderRadius.2xl'),
          border: `1px solid ${theme('colors.storm.ash')}`,
          boxShadow: theme('boxShadow.card'),
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            borderColor: theme('colors.storm.steel'),
            boxShadow: theme('boxShadow.lifted'),
          },
        },

        // Primary Button - Electric
        '.btn-electric': {
          padding: '1rem 2rem',
          backgroundColor: theme('colors.electric.DEFAULT'),
          color: theme('colors.storm.DEFAULT'),
          fontSize: theme('fontSize.body-sm')[0],
          fontWeight: '600',
          letterSpacing: '0.02em',
          borderRadius: theme('borderRadius.full'),
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            backgroundColor: theme('colors.electric.bright'),
            transform: 'scale(1.02)',
            boxShadow: theme('boxShadow.glow-electric'),
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        // Secondary Button
        '.btn-secondary': {
          padding: '1rem 2rem',
          backgroundColor: 'transparent',
          color: theme('colors.text.primary'),
          fontSize: theme('fontSize.body-sm')[0],
          fontWeight: '600',
          letterSpacing: '0.02em',
          borderRadius: theme('borderRadius.full'),
          border: `1px solid ${theme('colors.storm.steel')}`,
          transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: theme('colors.text.tertiary'),
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        // Ghost Button
        '.btn-ghost': {
          padding: '0.75rem 1.5rem',
          backgroundColor: 'transparent',
          color: theme('colors.text.secondary'),
          fontSize: theme('fontSize.body-sm')[0],
          fontWeight: '500',
          borderRadius: theme('borderRadius.lg'),
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: theme('colors.text.primary'),
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        },

        // Input Field with electric focus
        '.input-field': {
          width: '100%',
          padding: '0.75rem 1rem',
          backgroundColor: theme('colors.storm.slate'),
          color: theme('colors.text.primary'),
          fontSize: theme('fontSize.body')[0],
          borderRadius: theme('borderRadius.xl'),
          border: `1px solid ${theme('colors.storm.ash')}`,
          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&::placeholder': {
            color: theme('colors.text.muted'),
          },
          '&:focus': {
            outline: 'none',
            borderColor: theme('colors.electric.DEFAULT'),
            boxShadow: `0 0 0 1px ${theme('colors.electric.DEFAULT')}`,
          },
          '&:disabled': {
            opacity: '0.5',
            cursor: 'not-allowed',
          },
        },

        // Badge
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.375rem 0.75rem',
          fontSize: theme('fontSize.caption')[0],
          fontWeight: '500',
          borderRadius: theme('borderRadius.full'),
          backgroundColor: theme('colors.storm.ash'),
          color: theme('colors.text.secondary'),
        },

        // Badge variants
        '.badge-success': {
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          color: theme('colors.semantic.success'),
        },
        '.badge-warning': {
          backgroundColor: 'rgba(245, 158, 11, 0.15)',
          color: theme('colors.semantic.warning'),
        },
        '.badge-error': {
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: theme('colors.semantic.error'),
        },
        '.badge-electric': {
          backgroundColor: 'rgba(255, 229, 0, 0.15)',
          color: theme('colors.electric.DEFAULT'),
        },
        '.badge-live': {
          backgroundColor: theme('colors.electric.DEFAULT'),
          color: theme('colors.storm.DEFAULT'),
        },

        // Live indicator with electric glow
        '.live-indicator': {
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          '& .dot': {
            width: '0.5rem',
            height: '0.5rem',
            borderRadius: '9999px',
            backgroundColor: theme('colors.electric.DEFAULT'),
            boxShadow: theme('boxShadow.glow-electric-sm'),
            animation: 'electricPulse 2s ease-in-out infinite',
          },
          '& .text': {
            fontSize: theme('fontSize.caption')[0],
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: theme('colors.electric.DEFAULT'),
          },
        },

        // Section header
        '.section-header': {
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '3rem',
        },

        // Electric overline text
        '.overline-electric': {
          fontSize: theme('fontSize.overline')[0],
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: theme('colors.electric.DEFAULT'),
        },

        // Overline text
        '.overline': {
          fontSize: theme('fontSize.overline')[0],
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: theme('colors.text.tertiary'),
        },

        // Progress bar with electric fill
        '.progress-electric': {
          height: '6px',
          backgroundColor: theme('colors.storm.slate'),
          borderRadius: theme('borderRadius.full'),
          overflow: 'hidden',
          '& .fill': {
            height: '100%',
            backgroundColor: theme('colors.electric.DEFAULT'),
            borderRadius: theme('borderRadius.full'),
            transition: 'width 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          },
        },
      });
    }),
  ],
};

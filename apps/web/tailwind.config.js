/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: {
          DEFAULT: "#0A0A0F",
          secondary: "#12121A",
        },
        foreground: "#FAFAFA",
        
        // Primary - Electric Yellow
        primary: {
          DEFAULT: "#FFE500",
          foreground: "#0A0A0F",
          glow: "rgba(255, 229, 0, 0.3)",
        },
        
        // Accent - Cyan
        accent: {
          DEFAULT: "#00E6E6",
          foreground: "#0A0A0F",
        },
        
        // Glass colors
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          light: "rgba(255, 255, 255, 0.08)",
          medium: "rgba(255, 255, 255, 0.12)",
          border: "rgba(255, 255, 255, 0.1)",
          "border-light": "rgba(255, 255, 255, 0.15)",
        },
        
        // Muted
        muted: {
          DEFAULT: "rgba(255, 255, 255, 0.6)",
          foreground: "rgba(255, 255, 255, 0.4)",
        },
        
        // Destructive
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FAFAFA",
        },
        
        // Semantic
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      
      boxShadow: {
        // Glass shadows
        "glass": "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 12px 40px rgba(0, 0, 0, 0.4)",
        "glass-xl": "0 20px 60px rgba(0, 0, 0, 0.5)",
        
        // Inner highlight for glass
        "inner-glass": "inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "inner-glass-strong": "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
        
        // Glow effects
        "glow-sm": "0 0 10px rgba(255, 229, 0, 0.2)",
        "glow": "0 0 20px rgba(255, 229, 0, 0.3)",
        "glow-lg": "0 0 30px rgba(255, 229, 0, 0.4)",
        "glow-xl": "0 0 40px rgba(255, 229, 0, 0.5)",
        
        // Focus ring
        "focus-glow": "0 0 0 2px rgba(255, 229, 0, 0.2), 0 0 16px rgba(255, 229, 0, 0.15)",
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 229, 0, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(255, 229, 0, 0.5)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      
      transitionDuration: {
        "400": "400ms",
      },
      
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

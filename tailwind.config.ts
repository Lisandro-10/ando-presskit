import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'ando-navy': '#0d0d1a',
        'ando-cyan': '#00d9ff',
        'ando-text': '#ffffff',
        'ando-muted': 'rgba(255, 255, 255, 0.6)',
      },
    },
    fontFamily: {
      'orbitron': ['var(--font-orbitron)'],
      'spaceGrotesk': ['var(--font-space-grotesk)'],
    },
  },
  plugins: [],
};
export default config;
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f9f4',
          100: '#e3f6e3',
          200: '#c2e9c2',
          300: '#8fd88f',
          400: '#4eb84e',
          500: '#16610E', // Hijau Tua utama
          600: '#13510c',
          700: '#10410a',
          800: '#0d3108',
          900: '#092106',
        },
        accent: {
          orange: '#F97A00', // Oranye utama
          yellow: '#FED16A', // Kuning tua
          lightyellow: '#FFF4A4', // Kuning muda
        },
        // Warna pendukung harmonis
        greenlight: '#8fd88f', // Hijau muda
        orangelight: '#FFB366', // Oranye muda
        graysoft: '#F5F5F5', // Abu-abu netral
        dark: '#222', // Untuk teks gelap
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}

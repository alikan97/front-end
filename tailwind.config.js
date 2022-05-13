module.exports = {
  content: ["./src/**/*.{tsx,ts}"],
  theme: {
    extend: {
      fontFamily: {
        "main": ["Inter var", "sans-serif"]
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

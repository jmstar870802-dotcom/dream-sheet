module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
  theme: {
    extend: {
      screens: {
        'fold': '280px', // 폴드 닫힌 상태 대응
      },
    },
  },
};

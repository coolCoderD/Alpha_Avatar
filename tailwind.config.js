module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], // Add your file paths
  theme: {
    extend: {
      colors: {
        scrollbarThumbStart: '#6541F9',
        scrollbarThumbEnd: '#F3748E',
        scrollbarTrack: '#f1f1f1',
      },
    },
  },
  plugins: [],
  corePlugins: {
    textCenter: false,
  },
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"], // Add your file paths
  theme: {
    extend: {
      backgroundImage: {
        'login-bg': 'linear-gradient(180deg, rgba(118, 134, 252, 0.18) 0%, rgba(233, 120, 151, 0.18) 100%)',
        'login-bg-before': 'linear-gradient(180deg, #7186FF 0%, #F97689 100%)',
      },
      zIndex: {
        '-12': '-12',
      },
    },
  },
  plugins: [],
  corePlugins: {
    textCenter: false,
  },
};

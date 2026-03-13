// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        // Animasi ini bergerak selama 0.5s dengan kurva yang sangat halus
        "dialog-smooth":
          "dialog-smooth 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "dialog-smooth": {
          "0%": {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%, -50%) scale(1)",
          },
        },
      },
    },
  },
};

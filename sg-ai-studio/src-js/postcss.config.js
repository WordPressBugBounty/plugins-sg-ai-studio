export default {
  plugins: {
    // Shadow DOM doesn't isolate rem units - they always reference document.documentElement font-size
    // and styleguide uses rem units for all its components on a 10px root font-size
    // wordpress uses 16px as root font-size rendering our fonts bigger
    // This plugin proccess our styles and ensures our fonts use the correct root base font-size
    // without overriding wordpress root font-size breaking other pages that use rem units
    "postcss-rem-to-pixel": {
      rootValue: 10,
      propList: ["*"],
    },
  },
};

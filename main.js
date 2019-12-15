/**
 * @overview MinimalistNotation preset "main"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 * @dependencies
 * mn-presets/styles
 * mn-presets/medias
 */


/* eslint quote-props: ["error", "as-needed"] */
module.exports = (mn) => {
  const {css, assign} = mn;
  css({
    html: {
      '-webkit-tap-highlight-color': '#000',
    },
  });
  assign({
    '*, *:before, *:after': 'bxzBorderBox',
    html: 'ovxHidden tsa',
    body: 'm0 ovxHidden',
    a: 'crPointer@mouse',
    img: 'wmax dBlock mhAuto b0',
    iframe: 'dBlock b0',
    // eslint-disable-next-line
    'aside, article, main, section, header, footer, nav, video, canvas, input, textarea':
      'dBlock',
  });
  // assign('[m~="container"]', '(mhAuto|ph10|w970@md|w1170@lg|w1570@ll)');
};
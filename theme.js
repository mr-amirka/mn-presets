module.exports = (mn) => {
  const {css, assign} = mn;
  css({
    html: {
      '-ms-text-size-adjust': '100%',
      '-webkit-text-size-adjust': '100%',
      '-webkit-tap-highlight-color': '#000'
    }
  });
  assign({
    '*, *:before, *:after': 'bxzBorderBox',
    html: 'ovxHidden',
    body: 'm0 ovxHidden',
    a: 'crPointer@d crDefault@m',
    img: 'wmax dBlock mhAuto b0',
    'input, textarea, main, section, header, footer, nav, iframe, video': 'dBlock'
  });
  //assign('[m~="container"]', '(mhAuto|ph10|w970@md|w1170@lg|w1570@ll)');
};

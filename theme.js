
module.exports = (mn) => {

  mn.css({
    '*, *:before, *:after': {
      boxSizing: 'border-box'
    },
    html: {
      '-ms-text-size-adjust': '100%',
      '-webkit-text-size-adjust': '100%',
      '-webkit-tap-highlight-color': '#000'
    }
  });

  mn.assign({
    html: 'ovxHidden',
    body: 'm0 ovxHidden',
    a: 'crPointer@d crDefault@m',
    img: 'wmax dBlock mhAuto b0',
    'input, textarea, main, section, header, footer, nav, iframe, video': 'dBlock'
  });

  //mn.assign('[m~="container"]', '(mhAuto|ph10|w970@md|w1170@lg|w1570@ll)');

  /*
  mn({
    ffTheme: {
      style: {
        fontFamily: "'Exo Two', 'Open Sans', 'Roboto', Arial, sans-serif"
      }
    },
    xs: {
      exts: [ 'vInline', 'cRed' ]
    }
  });

  */


};

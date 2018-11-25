
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
    body: 'm0',

    a: 'crPointer@d crDefault@m',

    'main, section, header, footer, nav, iframe, video': 'dBlock'
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

/**
 * @overview MinimalistNotation preset "default styles"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

/* eslint quote-props: ["error", "as-needed"] */

const reTrimSnackLeft = /^_+/g;
const reTrimKebabLeft = /^-+/g;
const reZero =/^0+|\.?0+$/g;

function replace(v, from, to) {
  return v.replace(from, to);
}
function snackLeftTrim(v) {
  return replace(v, reTrimSnackLeft, '');
}
function styleWrap(style, priority) {
  return {style, priority: priority || 0};
}
function toFixed(v) {
  return replace(v.toFixed(2), reZero, '') || '0';
}
function sidesIteratee(dst, sideName) {
  dst[sideName ? ('-' + sideName) : sideName] = 1;
  return dst;
}
function normalizeValue(p) {
  const {value} = p;
  return value == '0' ? value : (value + (p.unit || 'px'));
}
function normalizeDefault(p, priority, def) {
  return {
    exts: [p.name + (def || '0') + p.ni],
    priority: priority || 0,
  };
}

module.exports = (mn) => {
  const {utils, setKeyframes} = mn;
  const {
    forIn,
    forEach,
    joinArrays,
    upperFirst,
    lowerFirst,
    camelToKebabCase,
    size,
    intval,
    reduce,
    color: getColor,
    colorGetBackground,
  } = utils;

  const defaultSides = reduce({
    '': [''],
    t: ['top'],
    b: ['bottom'],
    l: ['left'],
    r: ['right'],

    v: ['top', 'bottom'],
    vl: ['top', 'bottom', 'left'],
    vr: ['top', 'bottom', 'right'],

    h: ['left', 'right'],
    ht: ['left', 'right', 'top'],
    hb: ['left', 'right', 'bottom'],

    lt: ['top', 'left'],
    rt: ['top', 'right'],
    lb: ['bottom', 'left'],
    rb: ['bottom', 'right'],
  }, (dst, sides, sideKey) => {
    dst[sideKey] = reduce(sides, sidesIteratee, {});
    return dst;
  }, {});

  forIn(defaultSides, (sides, suffix) => {
    const priority = suffix ? (4 - size(sides)) : 0;

    function sidesSetter(handle) {
      const propsMap = {};
      let propSide;
      for (propSide in sides) propsMap[handle(propSide)] = 1; //eslint-disable-line
      return (v) => {
        const style = {};
        let pName;
        for (pName in propsMap) style[pName] = v; //eslint-disable-line
        return style;
      };
    }

    forIn({
      p: ['padding'],
      m: ['margin'],
      b: ['border', '-width'],
    }, (args, pfx) => {
      const propName = args[0];
      const propSuffix = args[1] || '';
      const sidesSet = sidesSetter((side) => propName + side + propSuffix);
      mn(pfx + suffix, (p) => {
        const camel = p.camel;
        return p.value ? styleWrap(
            sidesSet((camel ? lowerFirst(camel) : normalizeValue(p))),
            priority,
        ) : normalizeDefault(p, priority);
      });
    });

    (() => {
      const sidesSet = suffix
        ? sidesSetter((side) => replace(side, reTrimKebabLeft, ''))
        : (v) => ({
          top: v,
          bottom: v,
          left: v,
          right: v,
        });

      mn('s' + suffix, (p) => {
        return p.camel ? 0 : (p.value ? styleWrap(
            sidesSet(normalizeValue(p)),
            priority,
        ) : normalizeDefault(p, priority));
      });
    })();

    (() => {
      const sidesSet = sidesSetter((side) => 'border' + side + '-style');
      mn('bs' + suffix, (p) => {
        return styleWrap(
            sidesSet(camelToKebabCase(lowerFirst(p.suffix || 'solid'))),
            priority,
        );
      });
    })();

    (() => {
      const sidesSet = sidesSetter((side) => 'border' + side + '-color');
      mn('bc' + suffix, (p) => {
        const {value} = p;
        return value
          ? styleWrap(sidesSet(getColor(value || '0')), priority)
          : normalizeDefault(p, priority);
      }, '^(([A-Z][a-z][A-Za-z]+):camel|([A-F0-9]+):color):value(.*)?$');
    })();
  });

  forIn({
    sq: ['width', 'height'],
    w: ['width'],
    h: ['height'],
  }, (props, essencePrefix) => {
    const length = props.length;
    const priority = 2 - length;
    forEach(['', 'min', 'max'], (sfx) => {
      const propMap = {};
      let propName, i = 0; // eslint-disable-line
      for (; i < length; i++) {
        propName = props[i];
        propMap[sfx ? (sfx + '-' + propName) : propName] = 1;
      }
      mn(essencePrefix + sfx, (p) => {
        if (!p.value) return normalizeDefault(p, priority, '100%');
        const {sign, camel} = p;
        const num = p.negative ? 0 : p.num;
        const style = {};
        let propName;
        let sz = camel
          ? camel.toLowerCase()
          : (num ? (num == '0' ? num: (num + (p.unit || 'px'))) : '100%');
        if (sign) sz = 'calc(' + sz + ' ' + sign + ' ' + p.add + 'px)';
        for (propName in propMap) style[propName] = sz; // eslint-disable-line
        return styleWrap(style, priority);
      }, '(([-+]):sign([0-9]+):add)$');
    });
  });

  mn('tbl', styleWrap({display: 'table'}));
  mn('tbl.cell', {
    selectors: ['>*'],
    style: {
      display: 'table-cell',
      verticalAlign: 'middle',
    },
  });

  mn('cfx.pale', {
    selectors: [':before', ':after'],
    style: {content: '" "', clear: 'both', display: 'table'},
  });
  mn('layout', styleWrap({
    display: ['-webkit-box', '-webkit-flex', 'flex'],
  }));
  mn('layoutRow', {
    exts: ['layout'],
    style: {
      '-webkit-box-direction': 'normal',
      '-webkit-box-orient': 'horizontal',
      '-webkit-flex-direction': 'row',
      'flex-direction': 'row',

      '-webkit-box-pack': 'start',
      '-webkit-justify-content': 'flex-start',
      'justify-content': 'flex-start',

      '-webkit-box-align': 'center',
      '-webkit-align-items': 'center',
      'align-items': 'center',
      '-webkit-align-content': 'center',
      'align-content': 'center',
    },
  });

  mn('layoutColumn', {
    exts: ['layout'],
    style: {
      '-webkit-box-direction': 'normal',
      '-webkit-box-orient': 'vertical',
      '-webkit-flex-direction': 'column',
      'flex-direction': 'column',
    },
  });

  // flex horizontal align
  forIn({
    start: {'-webkit-box-pack': 'start',
      '-webkit-justify-content': 'flex-start', 'justify-content': 'flex-start'},
    center: {'-webkit-box-pack': 'center',
      '-webkit-justify-content': 'center', 'justify-content': 'center'},
    end: {'-webkit-box-pack': 'end',
      '-webkit-justify-content': 'flex-end', 'justify-content': 'flex-end'},
    around: {'-webkit-justify-content': 'space-around',
      'justify-content': 'space-around'},
    between: {'-webkit-box-pack': 'justify',
      '-webkit-justify-content': 'space-between',
      'justify-content': 'space-between'},
  }, (style, essenceName) => mn(
      'fha' + upperFirst(essenceName),
      styleWrap(style, 1),
  ));

  // flex vertical align
  forIn({
    start: {
      '-webkit-box-align': 'start',
      '-webkit-align-items': 'flex-start',
      'align-items': 'flex-start',
      '-webkit-align-content': 'flex-start',
      'align-content': 'flex-start',
    },
    center: {
      '-webkit-box-align': 'center',
      '-webkit-align-items': 'center',
      'align-items': 'center',
      '-webkit-align-content': 'center',
      'align-content': 'center',
    },
    end: {
      '-webkit-box-align': 'end',
      '-webkit-align-items': 'flex-end',
      'align-items': 'flex-end',
      '-webkit-align-content': 'flex-end',
      'align-content': 'flex-end',
    },
    stretch: {
      '-webkit-box-align': 'stretch',
      '-webkit-align-items': 'stretch',
      'align-items': 'stretch',
      '-webkit-align-content': 'stretch',
      'align-content': 'stretch',
    },
  }, (style, essenceName) => mn(
      'fva' + upperFirst(essenceName), styleWrap(style),
  ));

  forIn({
    dn: 'transitionDuration',
    delay: 'transitionDelay',
  }, (propName, essenceName) => {
    mn(essenceName, (p, num) => {
      return p.camel || p.negative ? 0 : ((num = p.num)
        ? styleWrap({[propName]: num + 'ms'})
        : normalizeDefault(p, 1, 250)
      );
    });
  });

  forIn({
    c: ['color'],
    stroke: ['stroke'],
    fill: ['fill'],
    olc: ['outlineColor', 1],
    bgc: ['backgroundColor', 1],
  }, (options, pfx) => {
    const propName = options[0];
    const priority = options[1] || 0;
    mn(pfx, (p) => {
      const style = {};
      style[propName] = getColor(p.value || '0');
      return styleWrap(style, priority);
    }, '^(([A-Z][a-z][A-Za-z]+):camel|([A-F0-9]+):color):value(.*)?$');
  });

  // background: (...)
  mn('bg', (p, v) => {
    return p.negative ? 0 : ((v = p.suffix) ? styleWrap({
      background: colorGetBackground(v),
    }) : normalizeDefault(p));
  });

  // background: url(...)
  mn('bgu', (p, url) => {
    return styleWrap({
      background: (url = snackLeftTrim(p.suffix))
        ? ('url("' + url + '")')
        : 'none',
    });
  });

  forIn({
    textAlign: {
      tl: 'left',
      tc: 'center',
      tr: 'right',
      tj: 'justify',
    },
    float: {
      lt: 'left',
      jt: 'none',
      rt: 'right',
    },
  }, (valsMap, propName) => {
    forIn(valsMap, (value, pfx) => {
      mn(pfx, (p) => {
        return p.suffix ? 0 : styleWrap({
          [propName]: value,
        });
      });
    });
  });

  mn('fw', (p) => {
    const camel = p.camel;
    return p.negative ? 0 : styleWrap({
      fontWeight: camel
        ? camelToKebabCase(lowerFirst(camel))
        : (100 * intval(p.num, 1, 1, 9)),
    }, 1);
  });

  forIn({
    rlv: ['relative', 1],
    abs: ['absolute', 2],
    fixed: ['fixed', 3],
    'static': ['static', 4], // eslint-disable-line
  }, (options, essenceName) => {
    mn(essenceName, (p) => styleWrap(
        {position: options[0]},
        options[1] || 0),
    );
  });

  mn('x', (p) => {
    const scale = p.s;
    const angle = p.angle;
    const z = p.z;
    return styleWrap({
      transform:
        'translate(' + ((p.x || '0') + (p.xu || 'px')) + ','
        + ((p.y || '0') + (p.yu || 'px')) + ')'
        + (z ? (' translateZ(' + (z || '0') + (p.zu || 'px') + ')') : '')
        + (scale ? (' scale(' + (0.01 * scale) + ')') : '')
        + (angle ? (' rotate' + p.dir.toUpperCase()
        + '(' + angle + (p.unit || 'deg') + ')') : ''),
    }); // eslint-disable-next-line
  }, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([zZ](-?[0-9]+):z(%):zu?)?([sS]([0-9]+):s)?([rR](x|y|z):dir(-?[0-9]+):angle([a-z]+):unit?)?$');

  (() => {
    let inited;
    mn('spnr', (p) => {
      let v = p.value;
      if (isNaN(v = v ? parseInt(v) : 3000) || v < 1) return 0;

      inited || (inited = 1, setKeyframes('spinner-animate', {
        from: {transform: 'rotateZ(0deg)'},
        to: {transform: 'rotateZ(360deg)'},
      }), mn.keyframesCompile());

      return styleWrap({
        animation: 'spinner-animate ' + v + 'ms infinite linear',
      });
    });
  })();

  ['x', 'y', 'z'].forEach((suffix) => {
    const prefix = 'rotate' + suffix.toUpperCase() + '(';
    mn('r' + suffix, (p, v) => {
      return (v = p.value) ? styleWrap({
        transform: prefix + v + (p.unit || 'deg') + ')',
      }) : normalizeDefault(p, 0, 180);
    });
  });


  mn('break', styleWrap({
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  }));

  (() => {
    const matchs = [
      '((r|R)(\\-?[0-9]+):r)',
      '((x|X)(\\-?[0-9]+):x)',
      '((y|Y)(\\-?[0-9]+):y)',
      '((m|M)([0-9]+):m)',
      '(c([0-9A-F]+):c)',
      '(in):in',
    ];
    forIn({
      bxsh: ['boxShadow', function(x, y, value, r, color) {
        return [x, y, value, r, color];
      }],
      tsh: ['textShadow', function(x, y, value, r, color) {
        return [x, y, value, color];
      }],
    }, ([propName, handler], pfx) => {
      mn(pfx, (p) => {
        const repeatCount = intval(p.m, 1, 0);
        const value = p.value;
        const style = {};
        if (!value || repeatCount < 1) {
          style[propName] = 'none';
          return styleWrap(style);
        }

        const colors = getColor(p.c || '0');
        const prefixIn = p.in ? 'inset ' : '';
        const colorsLength = colors.length;
        const output = new Array(colorsLength);
        let sample, v, color, i, ci = 0; // eslint-disable-line

        for (;ci < colorsLength; ci++) {
          color = colors[ci];
          sample = prefixIn
            + handler(p.x || 0, p.y || 0, value, p.r || 0, color).join('px ');
          v = new Array(repeatCount);
          for (i = repeatCount; i--;) v[i] = sample;
          output[ci] = v.join(',');
        }
        style[propName] = output;
        return styleWrap(style);
      }, matchs);
    });
  })();

  // border-radius by sides
  forIn({
    lt: 'top-left',
    lb: 'bottom-left',
    rt: 'top-right',
    rb: 'bottom-right',
  }, (side, suffix) => {
    const propName = 'border-' + side + '-radius';
    mn('r' + suffix, (p) => {
      if (p.camel || p.negative) return 0;
      const style = {};
      style[propName] = (p.num || 10000) + (p.unit || 'px');
      return styleWrap(style, 2);
    });
  });

  forIn({
    f: ['fontSize', 14, 1],
    r: ['borderRadius', 10000],
    sw: ['strokeWidth', 0],
    olw: ['outlineWidth', 0, 1],
  }, (options, pfx) => {
    const [propName, defaultValue] = options;
    const priority = options[2] || 0;
    mn(pfx, (p) => {
      if (p.camel || p.negative) return 0;
      const style = {};
      style[propName] = (p.num || defaultValue) + (p.unit || 'px');
      return styleWrap(style, priority);
    });
  });

  mn('z', (p, num) => {
    return p.camel ? 0 : ((num = p.num) ? styleWrap({
      zIndex: num,
    }) : normalizeDefault(p, 0, 1));
  });

  mn('o', (p, num) => {
    return p.camel || p.negative ? 0 : ((num = p.num) ? styleWrap({
      opacity: toFixed((p.num || 0) * 0.01),
    }) : normalizeDefault(p));
  });

  mn('lh', (p, num, unit) => {
    return p.camel ? 0 : (
      unit = p.unit,
      (num = p.num) ? styleWrap({
        lineHeight: num == '0' ? num : (
          unit === '%' ? toFixed(num * 0.01) : (num + (unit || 'px'))
        ),
      }) : normalizeDefault(p, 0, 1)
    );
  });

  mn('tsa', (p, num, camel) => {
    return p.negative ? 0 : (p.value ? styleWrap({
      textSizeAdjust: (camel = p.camel)
        ? lowerFirst(camel)
        : ((num = p.num) == '0' ? num : (num + (p.unit || '%'))),
    }) : normalizeDefault(p, 0, 100));
  });
  mn('olo', (p, num, camel) => {
    return (p.value ? styleWrap({
      outlineOffset: (camel = p.camel)
        ? lowerFirst(camel)
        : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
    }) : normalizeDefault(p));
  });

  (() => {
    function replacer(all, escaped) {
      return escaped ? '_' : ' ';
    }
    const regexp = /(\\_)|(_)/g;

    forIn({
      apc: ['appearance', 0],

      tn: ['transition', 0],
      tp: ['transitionProperty', 1],
      ttf: ['transitionTimingFunction', 1],

      bgp: ['backgroundPosition', 1],
      bgpx: ['backgroundPositionX', 1],
      bgpy: ['backgroundPositionY', 1],

      bgs: ['backgroundSize', 1],
      bga: ['backgroundAttachment', 1],
      bgcp: ['backgroundClip', 1],

      bgr: ['backgroundRepeat', 1],

      ol: ['outline', 0],
      ols: ['outlineStyle', 1],
      ov: ['overflow', 0],
      ovx: ['overflowX', 1],
      ovy: ['overflowY', 1],

      g: ['grid', 0],
      gt: ['gridTemplate', 1],
      gtc: ['gridTemplateColumns', 2],
      gtr: ['gridTemplateRows', 2],
      gac: ['gridAutoColumns', 1],
      gar: ['gridAutoRows', 1],
      gaf: ['gridAutoFlow', 1],

      gg: ['gridGap', 1],
      ggc: ['gridColumnGap', 2],
      ggr: ['gridRowGap', 2],

      gr: ['gridRow', 1],
      gc: ['gridColumn', 1],

      fx: ['flex', 0],
      fxd: ['flexDirection', 1],
      fxb: ['flexBasis', 1],
      fxf: ['flexFlow', 1],
      fxw: ['flexWrap', 1],
      fxg: ['flexGrow', 1],
      fxs: ['flexShrink', 1],

      or: ['order', 0],
      jc: ['justifyContent', 0],
      ai: ['alignItems', 0],
      tt: ['textTransform', 0],
      td: ['textDecoration', 0],
      to: ['textOverflow', 0],
      cr: ['cursor', 0],

      ws: ['whiteSpace', 0],
      va: ['verticalAlign', 0],
      d: ['display', 0],
      e: ['pointerEvents', 0],
      us: ['user-select', 0],
      v: ['visibility', 0],
      ts: ['transformStyle', 0],
      mbm: ['mixBlendMode', 0],
      bsp: ['borderSpacing', 0],
      bxz: ['boxSizing', 0],
      font: ['font', 0],
      fs: ['font-style', 1],
    }, ([propName, priority], essenceName) => {
      mn(essenceName, (p, suffix, style) => {
        return (suffix = lowerFirst(p.suffix || ''))
          ? (style = {}, style[propName] = replace(
              suffix[0] == '_'
                ? snackLeftTrim(suffix)
                : camelToKebabCase(suffix),
              regexp,
              replacer,
          ), styleWrap(style, priority || 0))
          : 0;
      });
    });

    function __wr(v) {
      return v[0] == '-' ? '"' + v.substr(1) + '"' : v;
    }
    mn('ff', (p) => {
      const suffix = p.suffix;
      return suffix && styleWrap({
        fontFamily: replace(
          suffix[0] == '_' ? snackLeftTrim(suffix) : lowerFirst(suffix),
          regexp, replacer,
        )
            .split(/(?:\s*,\s*)+/)
            .map(__wr).join(','),
      }, 1);
    });
    mn('ctt', (p) => {
      const s = p.suffix;
      return styleWrap({
        content: (s ? ('"'
          + replace((snackLeftTrim(s) || ' '), regexp, replacer)
          + '"') : 'none'),
      });
    });
    mn('rs', (p) => {
      const s = p.suffix;
      return s ? styleWrap({
        borderRadius: replace(snackLeftTrim(s), regexp, replacer),
      }) : 0;
    });
  })();

  forIn({
    '': 'width',
    l: 'marginLeft',
    r: 'marginRight',
  }, (propName, suffix) => {
    mn('col' + suffix, (p) => {
      return p.camel || p.negative ? 0 : {
        exts: ['hmin1-i'],
        style: {
          [propName]: ''
            + toFixed(100 * (p.num || 12) / (p.total || 12)) + '%',
        },
      };
    }, '^([0-9]+(/([0-9]+):total)?)?(.*)$');
  });

  ((essences) => {
    const regexpName = /^([A-Za-z]+)([0-9]*)(.*)$/;
    const regexpSep = /_+/;
    mn('ft', (p) => styleWrap({
      filter: lowerFirst(p.suffix).split(regexpSep).map((v) => {
        if (!v) return '';
        const matchs = regexpName.exec(v);
        const funcName = matchs[1];
        if (!funcName) return '';
        const options = essences[funcName];
        return camelToKebabCase(options && options[0] || funcName)
          + '(' + (matchs[2] || options && options[1] || '')
          + (matchs[3] || options && options[2] || '') + ') ';
      }).join(''),
    }));
  })({
    blur: ['blur', 4, 'px'],
    gray: ['grayscale', 100, '%'],
    bright: ['brightness', 100, '%'],
    contrast: ['contrast', 100, '%'],
    hue: ['hue-rotate', 180, 'deg'],
    invert: ['invert', 100, '%'],
    saturate: ['saturate', 100, '%'],
    sepia: ['sepia', 100, '%'],
  });

  mn('ratio', (p) => {
    return p.negative || p.camel ? 0 : {
      style: {
        position: 'relative',
        paddingTop: 'calc(' + (100 * intval(p.oh || p.h, 100, 1)
          / intval(p.w || 100, 1, 1)) + '% '
          + (p.sign || '+') + ' ' + (p.add || '0') + 'px)',
      },
      childs: {
        overlay: {
          selectors: ['>*'],
          exts: ['abs' + p.ni, 's' + p.ni],
        },
      },
    };
  }, '((((\\d+):w)x((\\d+):h))|(\\d+):oh)?(([-+]):sign(\\d+):add)?');
};

/**
 * @overview MinimalistNotation preset "default styles"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

const reTrimSnackLeft = /^_+/g;
const reTrimKebabLeft = /^-+/g;

function replace(v, from, to) {
  return v.replace(from, to);
}
function snackLeftTrim(v) {
  return replace(v, reTrimSnackLeft, '');
}
function toFixed(v) {
  return v.toFixed(2);
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

  function sidesIteratee(dst, sideName) {
    dst[sideName ? ('-' + sideName) : sideName] = 1;
    return dst;
  }
  const defaultSides = reduce({
    '': [''],
    't': ['top'],
    'b': ['bottom'],
    'l': ['left'],
    'r': ['right'],

    'v': ['top', 'bottom'],
    'vl': ['top', 'bottom', 'left'],
    'vr': ['top', 'bottom', 'right'],

    'h': ['left', 'right'],
    'ht': ['left', 'right', 'top'],
    'hb': ['left', 'right', 'bottom'],

    'lt': ['top', 'left'],
    'rt': ['top', 'right'],
    'lb': ['bottom', 'left'],
    'rb': ['bottom', 'right'],
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
        return p.camel ? 0 : {
          style: sidesSet((p.value || '0') + (p.unit || 'px') + p.i),
          priority,
        };
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
        return p.camel ? 0 : {
          style: sidesSet((p.value || '0') + (p.unit || 'px') + p.i),
          priority,
        };
      });
    })();

    (() => {
      const sidesSet = sidesSetter((side) => 'border' + side + '-style');
      mn('bs' + suffix, (p) => {
        const suffix = p.suffix;
        return suffix && {
          style: sidesSet(camelToKebabCase(lowerFirst(suffix)) + p.i),
          priority,
        };
      });
    })();

    (() => {
      const sidesSet = sidesSetter((side) => 'border' + side + '-color');
      mn('bc' + suffix, (p) => {
        const alts = getColor(p.camel || p.color || '0');
        const important = p.i;
        return {
          style: sidesSet(important ? joinArrays([], alts, [important]) : alts),
          priority,
        };
      }, '([A-F0-9]+):color');
    })();
  });

  const matchWidthCalc = '(([-+]):sign([0-9]+):add)$';
  forIn({
    sq: ['width', 'height'],
    w: ['width'],
    h: ['height'],
  }, (props, essencePrefix) => {
    const length = props.length;
    const priority = 4 - length;
    forEach(['', 'min', 'max'], (sfx) => {
      const propMap = {};
      let propName, i = 0; // eslint-disable-line
      for (; i < length; i++) {
        propName = props[i];
        propMap[sfx ? (sfx + '-' + propName) : propName] = 1;
      }
      mn(essencePrefix + sfx, (p) => {
        if (p.negative) return;
        const sign = p.sign;
        const num = p.num;
        const camel = p.camel;
        const unit = p.unit || 'px';
        const style = {};
        let propName;
        let sz = camel ? camel.toLowerCase() : (num ? (num + unit) : '100%');
        if (sign) sz = 'calc(' + sz + ' ' + sign + ' ' + p.add + 'px)';
        sz += p.i;
        for (propName in propMap) style[propName] = sz; // eslint-disable-line
        return {
          style,
          priority,
        };
      }, matchWidthCalc);
    });
  });

  mn('tbl', {
    style: {display: 'table'},
  });
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
  mn('layout', {
    style: {
      display: ['-webkit-box', '-webkit-flex', 'flex'],
    },
  });
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
      'fha' + upperFirst(essenceName), {style, priority: 1},
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
      'fva' + upperFirst(essenceName), {style, priority: 1},
  ));

  forIn({
    dn: 'transitionDuration',
    delay: 'transitionDelay',
  }, (propName, essenceName) => {
    mn(essenceName, (p) => {
      const num = p.num;
      return p.camel || p.negative ? 0 : (num ? {
        style: {[propName]: num + 'ms' + p.i},
      } : {
        exts: [essenceName + '250' + p.ni],
      });
    });
  });

  const colorMatch
    = '^(([A-Z][a-z][A-Za-z]+):camel|([A-F0-9]+):color):value(.*)?$';
  forIn({
    c: 'color',
    stroke: 'stroke',
    fill: 'fill',
  }, (propName, pfx) => {
    mn(pfx, (p) => {
      const alts = getColor(p.value || '0');
      const important = p.i;
      const style = {};
      style[propName] = important ? joinArrays([], alts, [important]) : alts;
      return {style};
    }, colorMatch);
  });

  // background: (...)
  mn('bg', (p) => {
    const v = p.suffix;
    if (p.negative || !v) return;
    const alts = colorGetBackground(v);
    const important = p.i;
    return {
      style: {
        background: important ? joinArrays([], alts, [important]) : alts,
      },
    };
  });

  // background: url(...)
  mn('bgu', (p) => {
    const url = snackLeftTrim(p.suffix);
    return url ? {
      style: {
        background: 'url("' + url + '")' + p.i,
      },
    } : 0;
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
        if (p.suffix) return;
        return {
          style: {
            [propName]: value + p.i,
          },
        };
      });
    });
  });

  mn('fw', (p) => {
    if (p.negative) return;
    const camel = p.camel;
    return {
      style: {
        fontWeight: (camel
          ? camelToKebabCase(lowerFirst(camel))
          : (100 * intval(p.num, 1, 1, 9))) + p.i,
      },
    };
  });

  forIn({
    rlv: 'relative', // eslint-disable-line
    fixed: 'fixed', // eslint-disable-line
    abs: 'absolute', // eslint-disable-line
    'static': 'static',
  }, (position, essenceName) => {
    mn(essenceName, (p) => ({style: {position: position + p.i}, priority: 1}));
  });

  mn('x', (p) => {
    const scale = p.s;
    const angle = p.angle;
    const z = p.z;
    return {
      style: {
        transform:
          (angle ? ('rotate' + p.dir.toUpperCase()
          + '(' + angle + (p.unit || 'deg') + ') ') : '')
          + 'translate(' + ((p.x || '0') + (p.xu || 'px')) + ','
          + ((p.y || '0') + (p.yu || 'px')) + ')'
          + (z ? (' translateZ(' + (z || '0') + (p.zu || 'px') + ')') : '')
          + (scale ? (' scale(' + (0.01 * scale) + ')') : '')
          + p.i,
      },
    }; // eslint-disable-next-line
  }, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([zZ](-?[0-9]+):z(%):zu?)?([sS]([0-9]+):s)?([rR](x|y|z):dir(-?[0-9]+):angle([a-z]+):unit?)?$');

  (() => {
    let uninited = true;
    mn('spnr', (p) => {
      let v = p.value;
      if (isNaN(v = v ? parseInt(v) : 3000) || v < 1) return 0;

      if (uninited) {
        uninited = false;
        setKeyframes('spinner-animate', {
          from: {transform: 'rotateZ(0deg)'},
          to: {transform: 'rotateZ(360deg)'},
        });
        mn.keyframesCompile();
      }

      return {
        style: {animation: 'spinner-animate ' + v + 'ms infinite linear' + p.i},
      };
    });
  })();

  ['x', 'y', 'z'].forEach((suffix) => {
    const prefix = 'rotate' + suffix.toUpperCase() + '(';
    mn('r' + suffix, (p) => ({
      style: {
        transform: prefix + (p.value || '180') + (p.unit || 'deg') + ')' + p.i,
      },
    }));
  });


  mn('break', {
    style: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    },
  });

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
      bsh: {
        propName: 'boxShadow',
        handler: (x, y, value, r, color) => [x, y, value, r, color],
      },
      tsh: {
        propName: 'textShadow',
        handler: (x, y, value, r, color) => [x, y, value, color],
      },
    }, (options, pfx) => {
      const propName = options.propName;
      const handler = options.handler;

      mn(pfx, (p) => {
        const repeatCount = intval(p.m, 1, 0);
        const value = p.value;

        if (!value || repeatCount < 1) return;

        const important = p.i;
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
          output[ci] = v.join(',') + important;
        }

        const style = {};
        style[propName] = output;
        return {style};
      }, matchs);
    });
  })();


  forIn({
    f: ['font-size', 14],
    r: ['borderRadius', 10000],
    sw: ['strokeWidth', 0],
  }, (options, pfx) => {
    const [propName, defaultValue] = options;
    mn(pfx, (p) => {
      if (p.camel || p.negative) return 0;
      const style = {};
      style[propName] = (p.num || defaultValue) + (p.unit || 'px') + p.i;
      return {style};
    });
  });

  mn('z', (p) => {
    return p.camel ? 0 : {
      style: {
        zIndex: (p.num || '1') + p.i,
      },
    };
  });

  mn('o', (p) => {
    return p.camel || p.negative ? 0 : {
      style: {
        opacity: '' + toFixed((p.num || 0) * 0.01) + p.i,
      },
    };
  });

  mn('lh', (p) => {
    const num = p.num;
    const unit = p.unit;
    return p.camel ? 0 : {
      style: {
        lineHeight: num ? (unit === '%'
          ? toFixed(num * 0.01) : (num + (unit || 'px'))) : '1' + p.i,
      },
    };
  });

  (() => {
    function replacer(all, escaped) {
      return escaped ? '_' : ' ';
    }
    const regexp = /(\\_)|(_)/g;

    forIn({
      tn: ['transition', 0],
      tp: ['transition-property', 1],

      bgp: ['backgroundPosition', 0],
      bgpx: ['backgroundPositionX', 1],
      bgpy: ['backgroundPositionY', 1],

      bgs: ['backgroundSize', 0],
      bga: ['backgroundAttachment', 0],

      bgr: ['backgroundRepeat', 0],
      bgrx: ['backgroundRepeatX', 1],
      bgry: ['backgroundRepeatY', 1],

      ov: ['overflow', 0],
      ovx: ['overflow-x', 1],
      ovy: ['overflow-y', 1],

      g: ['grid-template', 0],
      gc: ['grid-template-columns', 1],
      gr: ['grid-template-rows', 1],
      gar: ['grid-auto-rows', 0],

      gg: ['grid-gap', 0],

      gRow: ['grid-row', 0],
      gCol: ['grid-column', 0],

      fx: ['flex', 0],
      fxd: ['flex-direction', 0],
      fxb: ['flex-basis', 0],
      fxw: ['flex-wrap', 0],

      or: ['order', 0],
      fs: ['font-style', 0],
      jc: ['justify-content', 0],
      ai: ['align-items', 0],
      tt: ['text-transform', 0],
      ttf: ['transition-timing-function', 0],
      td: ['text-decoration', 0],
      to: ['text-overflow', 0],
      cr: ['cursor', 0],
      ol: ['outline', 0],
      ws: ['white-space', 0],
      va: ['vertical-align', 0],
      d: ['display', 0],
      e: ['pointer-events', 0],
      us: ['user-select', 0],
      v: ['visibility', 0],
      ts: ['transform-style', 0],
      mbm: ['mix-blend-mode', 0],
      bsp: ['borderSpacing', 0],
      bxz: ['boxSizing', 0],
    }, ([propName, priority], essenceName) => {
      mn(essenceName, (p) => {
        const style = {};
        style[propName]
          = replace(
              snackLeftTrim(camelToKebabCase(lowerFirst((p.suffix || '')))),
              regexp,
              replacer,
          ) + p.i;
        return {style, priority: priority || 0};
      });
    });

    function __wr(v) {
      return '"' + v + '"';
    }
    mn('ff', (p) => {
      return {
        style: {
          fontFamily: replace(snackLeftTrim(p.suffix || ''), regexp, replacer)
              .split(/(?:\s*,\s*)+/)
              .map(__wr).join(',') + p.i,
        },
      };
    });
    mn('ctt', (p) => {
      const s = p.suffix;
      return {
        style: {
          content: (s ? ('"'
            + replace((snackLeftTrim(s) || ' '), regexp, replacer)
            + '"') : 'none') + p.i,
        },
      };
    });
    mn('rs', (p) => {
      const s = p.suffix;
      return s ? {
        style: {
          borderRadius: replace(snackLeftTrim(s), regexp, replacer) + p.i,
        },
      } : 0;
    });
  })();

  forIn({
    '': 'width',
    l: 'marginLeft', // eslint-disable-line
    r: 'marginRight', // eslint-disable-line
  }, (propName, suffix) => {
    mn('col' + suffix, (p) => {
      return p.camel || p.negative ? 0 : {
        exts: ['hmin1-i'],
        style: {
          [propName]: ''
            + toFixed(100 * (p.num || 12) / (p.total || 12)) + '%' + p.i,
        },
      };
    }, '^([0-9]+(/([0-9]+):total)?)?(.*)$');
  });

  ((essences) => {
    const regexpName = /^([A-Za-z]+)([0-9]*)(.*)$/;
    const regexpSep = /_+/;
    mn('ft', (p) => ({
      style: {
        filter: lowerFirst(p.suffix).split(regexpSep).map((v) => {
          if (!v) return '';
          const matchs = regexpName.exec(v);
          const funcName = matchs[1];
          if (!funcName) return '';
          const options = essences[funcName];
          return camelToKebabCase(options && options[0] || funcName)
            + '(' + (matchs[2] || options && options[1] || '')
            + (matchs[3] || options && options[2] || '') + ') ';
        }).join('') + p.i,
      },
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
        position: 'relative' + p.i,
        paddingTop: 'calc(' + (100 * intval(p.oh || p.h, 100, 1)
          / intval(p.w || 100, 1, 1)) + '% '
          + (p.sign || '+') + ' ' + (p.add || '0') + 'px)' + p.i,
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

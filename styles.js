/**
 * @overview MinimalistNotation preset "default styles"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

/* eslint quote-props: ["error", "as-needed"] */

const reTrimSnackLeft = /^_+/g;
const reTrimKebabLeft = /^-+/g;
const reZero =/^0+|\.?0+$/g;
const regexpSpaceNormalize = /(\\_)|(_)/g;
const colorPattern
  = '^(([A-Z][a-z][A-Za-z]+):camel|([A-Fa-f0-9]+(\\.[0-9]+)?):color):value';

function replacerSpaceNormalize(all, escaped) {
  return escaped ? '_' : ' ';
}
function spaceNormalize(v) {
  return replace(v, regexpSpaceNormalize, replacerSpaceNormalize);
}
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
function normalizeDefault(p, def) {
  return {
    exts: [p.name + (def || 0) + p.ni],
  };
}
function stylePosition(position, priority) {
  return styleWrap({position: position}, priority);
}
function upperCase(v) {
  return v.toUpperCase();
}

module.exports = (mn) => {
  const {utils, setKeyframes} = mn;
  const {
    map,
    filter,
    forIn,
    forEach,
    upperFirst,
    lowerFirst,
    camelToKebabCase,
    size,
    intval,
    floatval,
    reduce,
    color: getColor,
    colorGetBackground,
  } = utils;

  function toKebabCase(v) {
    return camelToKebabCase(lowerFirst(v));
  }

  function synonymProvider(propName, synonyms, priority) {
    return (p, s, style, synonym) => {
      return (synonym = synonyms[s = p.suffix])
        ? normalizeDefault(p, synonym)
        : (
          s ? (style = {}, style[propName] = spaceNormalize(
              s[0] == '_'
                ? snackLeftTrim(s)
                : toKebabCase(s),
          ), styleWrap(style, priority))
          : 0
        );
    };
  }

  const defaultSides = map({
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
  }, (sides) => reduce(sides, sidesIteratee, {}));

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
    function handleProvider(sidesSet) {
      return (p, camel) => {
        return (camel = p.camel) === 'A'
          ? normalizeDefault(p, 'Auto')
          : (
            p.value ? styleWrap(
                sidesSet(camel ? toKebabCase(camel) : normalizeValue(p)),
                priority,
            ) : normalizeDefault(p)
          );
      };
    }

    forIn({
      p: ['padding'],
      m: ['margin'],
      b: ['border', '-width'],
    }, (args, pfx) => {
      const propName = args[0];
      const propSuffix = args[1] || '';
      mn(pfx + suffix, handleProvider(
          sidesSetter((side) => propName + side + propSuffix),
      ));
    });

    mn('s' + suffix, handleProvider(
      suffix
        ? sidesSetter((side) => replace(side, reTrimKebabLeft, ''))
        : (v) => ({
          top: v,
          bottom: v,
          left: v,
          right: v,
        }),
    ));

    ((sidesSet) => {
      mn('bs' + suffix, (p, v) => {
        return (v = p.suffix)
          ? styleWrap(sidesSet(toKebabCase(v)), priority)
          : normalizeDefault(p, 'Solid');
      });
    })(sidesSetter((side) => 'border' + side + '-style'));

    ((sidesSet) => {
      mn('bc' + suffix, (p, v) => {
        return (v = p.value)
          ? styleWrap(sidesSet(getColor(v)), priority)
          : normalizeDefault(p);
      }, colorPattern);
    })(sidesSetter((side) => 'border' + side + '-color'));
  });


  const sizeSynonyms = {
    A: 'Auto',
    N: 'None',
  };
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
        if (!p.value) return normalizeDefault(p, '100%');
        const camel = p.camel;
        const synonym = camel && sizeSynonyms[camel];
        if (synonym) return normalizeDefault(p, synonym);
        const sign = p.sign;
        const num = p.negative ? 0 : p.num;
        const style = {};
        let propName, v; // eslint-disable-line
        const sz = camel ? toKebabCase(camel) : (
          v = (num ? (num == '0' ? num: (num + (p.unit || 'px'))) : '100%'),
          sign ? 'calc(' + v + ' ' + sign + ' ' + p.add + 'px)' : v
        );
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
      boxDirection: 'normal',
      boxOrient: 'horizontal',
      flexDirection: 'row',
      boxPack: 'start',
      justifyContent: 'flex-start',
      boxAlign: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
  });

  mn('layoutColumn', {
    exts: ['layout'],
    style: {
      boxDirection: 'normal',
      boxOrient: 'vertical',
      flexDirection: 'column',
    },
  });

  // flex horizontal align
  forIn({
    start: {boxPack: 'start', justifyContent: 'flex-start'},
    center: {boxPack: 'center', justifyContent: 'center'},
    end: {boxPack: 'end', justifyContent: 'flex-end'},
    around: {justifyContent: 'space-around'},
    between: {boxPack: 'justify', justifyContent: 'space-between'},
  }, (style, essenceName, name) => {
    mn(
        name = 'fha' + (essenceName = upperFirst(essenceName)),
        styleWrap(style, 1),
    );
    mn('fha' + essenceName[0], name);
  });

  // flex vertical align
  forIn({
    start: {
      boxAlign: 'start',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
    },
    center: {
      boxAlign: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    end: {
      boxAlign: 'end',
      alignItems: 'flex-end',
      alignContent: 'flex-end',
    },
    stretch: {
      boxAlign: 'stretch',
      alignItems: 'stretch',
      alignContent: 'stretch',
    },
  }, (style, essenceName) => {
    mn('fva' + upperFirst(essenceName), styleWrap(style, 1));
  });

  forIn({
    S: 'Start',
    C: 'Center',
    E: 'End',
    A: 'Around',
    ST: 'Stretch',
  }, (essenceName, abbr) => {
    mn('fva' + abbr, 'fva' + essenceName);
  });

  forIn({
    dn: 'transitionDuration',
    delay: 'transitionDelay',
  }, (propName, essenceName) => {
    mn(essenceName, (p, num) => {
      return p.camel || p.negative ? 0 : ((num = p.num)
        ? styleWrap({[propName]: num + 'ms'}, 1)
        : normalizeDefault(p, 250)
      );
    });
  });

  forIn({
    c: ['color'],
    stroke: ['stroke'],
    fill: ['fill'],
    olc: ['outlineColor', 1],
    bgc: ['backgroundColor', 1],
    temc: ['textEmphasisColor', 1],
    tdc: ['textDecorationColor', 1],
  }, (options, pfx) => {
    const propName = options[0];
    const priority = options[1] || 0;
    mn(pfx, (p) => {
      const style = {};
      style[propName] = getColor(p.value || '0');
      return styleWrap(style, priority);
    }, colorPattern);
  });

  // background: (...)
  mn('bg', (p, v) => {
    return !p.negative && ((v = p.suffix) ? styleWrap({
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

  const fontWeightSynonyms = {
    N: 'Normal',
    B: 'Bold',
    BR: 'Bolder',
    LR: 'Lighter',
  };
  mn('fw', (p, camel, synonym) => {
    camel = p.camel;
    synonym = camel && fontWeightSynonyms[camel];
    return synonym ? normalizeDefault(p, synonym) : !p.negative && styleWrap({
      fontWeight: camel
        ? toKebabCase(camel)
        : (100 * intval(p.num, 1, 1, 9)),
    }, 1);
  });

  // position
  mn({
    posR: stylePosition('relative', 0),
    posA: stylePosition('absolute', 1),
    posF: stylePosition('fixed', 2),
    posS: stylePosition('static', 3),
    pos: 'posR',
    rlv: 'posR',
    abs: 'posA',
    fixed: 'posF',
    'static': 'posS', // eslint-disable-line
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
        + (angle ? (' rotate' + upperCase(p.dir)
        + '(' + angle + (p.unit || 'deg') + ')') : ''),
    }); // eslint-disable-next-line
  }, '^(-?[0-9]+):x?(%):xu?([yY](-?[0-9]+):y(%):yu?)?([zZ](-?[0-9]+):z(%):zu?)?([sS]([0-9]+):s)?([rR](x|y|z):dir(-?[0-9]+):angle([a-z]+):unit?)?$');

  ((inited) => {
    mn('spnr', (p, v) => {
      return isNaN(v = (v = p.value) ? parseInt(v) : 3000) || v < 1 ? 0 : (
        inited || (inited = 1, setKeyframes('spinner-animate', {
          from: {transform: 'rotateZ(0deg)'},
          to: {transform: 'rotateZ(360deg)'},
        }), mn.keyframesCompile()),
        styleWrap({
          animation: 'spinner-animate ' + v + 'ms infinite linear',
        })
      );
    });
  })();

  forEach(['x', 'y', 'z'], (suffix) => {
    const prefix = 'rotate' + upperCase(suffix) + '(';
    mn('r' + suffix, (p, v) => {
      return (v = p.value) ? styleWrap({
        transform: prefix + v + (p.unit || 'deg') + ')',
      }) : normalizeDefault(p, 180);
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
    mn('r' + suffix, (p, style) => {
      return p.camel || p.negative ? 0 : (
        style = {},
        style[propName] = (p.num || 10000) + (p.unit || 'px'),
        styleWrap(style, 2)
      );
    });
  });

  forIn({
    f: ['fontSize', 14, 1],
    r: ['borderRadius', 10000],
    sw: ['strokeWidth'],
    olw: ['outlineWidth', 0, 1],
  }, (options, pfx) => {
    const [propName, defaultValue] = options;
    const priority = options[2] || 0;
    mn(pfx, (p, style, camel) => {
      return !p.negative && (
        style = {},
        style[propName] = (camel = p.camel)
          ? toKebabCase(camel)
          : (p.num || defaultValue) + (p.unit || 'px'),
        styleWrap(style, priority)
      );
    });
  });

  mn('z', (p, num) => {
    return p.camel ? 0 : ((num = p.num) ? styleWrap({
      zIndex: num,
    }) : normalizeDefault(p, 1));
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
      }) : normalizeDefault(p, '100%')
    );
  });

  mn('tsa', (p, num, camel) => {
    return p.negative ? 0 : (p.value ? styleWrap({
      textSizeAdjust: (camel = p.camel)
        ? toKebabCase(camel)
        : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
    }) : normalizeDefault(p, '100%'));
  });

  mn('fsa', (p, num, camel) => {
    return p.negative ? 0 : (p.value ? styleWrap({
      fontSizeAdjust: (camel = p.camel)
        ? (camel == 'N' ? 'none' : toKebabCase(camel))
        : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
    }) : 0);
  });

  mn('olo', (p, num, camel) => {
    return (p.value ? styleWrap({
      outlineOffset: (camel = p.camel)
        ? toKebabCase(camel)
        : ((num = p.num) == '0' ? num : (num + (p.unit || 'px'))),
    }) : normalizeDefault(p));
  });

  mn('d', synonymProvider('display', {
    '': 'Block',
    B: 'Block',
    N: 'None',
    F: 'Flex',
    IF: 'InlineFlex',
    I: 'Inline',
    IB: 'InlineBlock',
    LI: 'ListItem',
    RI: 'RunIn',
    CP: 'Compact',
    TB: 'Table',
    ITB: 'InlineTable',
    TBCP: 'TableCaption',
    TBCL: 'TableColumn',
    TBCLG: 'TableColumnGroup',
    TBHG: 'TableHeaderGroup',
    TBFG: 'TableFooterGroup',
    TBR: 'TableRow',
    TBRG: 'TableRowGroup',
    TBC: 'TableCell',
    RB: 'Ruby',
    RBB: 'RubyBase',
    RBBG: 'RubyBaseGroup',
    RBT: 'RubyText',
    RBTG: 'RubyTextGroup',
  }));

  mn('cl', synonymProvider('clear', {
    '': 'Both',
    B: 'Both',
    N: 'None',
    L: 'Left',
    R: 'Right',
  }));

  mn('v', synonymProvider('visibility', {
    '': 'Hidden',
    V: 'Visible',
    H: 'Hidden',
    C: 'Collapse',
  }));

  forIn({'': 0, x: 1, y: 1}, (priority, suffix) => {
    mn('ov' + suffix, synonymProvider('overflow' + upperCase(suffix), {
      '': 'Hidden',
      V: 'Visible',
      H: 'Hidden',
      S: 'Scroll',
      A: 'Auto',
    }, priority));
  });

  mn('ovs', synonymProvider('overflowStyle', {
    '': 'Scrollbar',
    S: 'Scrollbar',
    A: 'Auto',
    P: 'Panner',
    M: 'Move',
    MQ: 'Marquee',
  }));

  mn('cp', synonymProvider('clip', {
    A: 'Auto',
    R: 'Rect\\(top_right_bottom_left\\)',
  }));

  mn('rsz', synonymProvider('resize', {
    '': 'None',
    N: 'None',
    B: 'Both',
    H: 'Horizontal',
    V: 'Vertical',
  }));

  mn('cr', synonymProvider('cursor', {
    '': 'Pointer',
    A: 'Auto',
    D: 'Default',
    C: 'Crosshair',
    HA: 'Hand',
    HE: 'Help',
    M: 'Move',
    P: 'Pointer',
    T: 'Text',
  }));

  mn('jc', synonymProvider('justifyContent', {
    '': 'Center',
    C: 'Center',
    FE: 'FlexEnd',
    FS: 'FlexStart',
    SA: 'SpaceAround',
    SB: 'SpaceBetween',
  }));

  mn('ai', synonymProvider('alignItems', {
    '': 'Center',
    C: 'Center',
    B: 'Baseline',
    FE: 'FlexEnd',
    FS: 'FlexStart',
    S: 'Stretch',
  }));

  mn('bxz', synonymProvider('boxSizing', {
    '': 'BorderBox',
    BB: 'BorderBox',
    CB: 'ContentBox',
  }));

  mn('fs', synonymProvider('fontStyle', {
    '': 'Italic',
    N: 'Normal',
    I: 'Italic',
    O: 'Oblique',
  }, 1));

  mn('fv', synonymProvider('fontVariant', {
    N: 'Normal',
    SC: 'SmallCaps',
  }, 1));

  mn('fef', synonymProvider('fontEffect', {
    N: 'None',
    EG: 'Engrave',
    EB: 'Emboss',
    O: 'Outline',
  }, 1));

  mn('fsm', synonymProvider('fontSmooth', {
    A: 'Auto',
    N: 'Never',
    AW: 'Always',
  }, 1));

  mn('fst', synonymProvider('fontStretch', {
    N: 'Normal',
    UC: 'UltraCondensed',
    EC: 'ExtraCondensed',
    C: 'Condensed',
    SC: 'SemiCondensed',
    SE: 'SemiExpanded',
    E: 'Expanded',
    EE: 'ExtraExpanded',
    UE: 'UltraExpanded',
  }, 1));

  mn('tal', synonymProvider('textAlignLast', {
    A: 'Auto',
    L: 'Left',
    C: 'Center',
    R: 'Right',
    J: 'Justify',
    E: 'End',
    S: 'Start',
  }, 1));

  const tdSynonyms = {
    '': 'None',
    N: 'None',
    U: 'Underline',
    O: 'Overline',
    L: 'LineThrough',
  };
  mn('td', synonymProvider('textDecoration', tdSynonyms));
  mn('tdl', synonymProvider('textDecorationLine', tdSynonyms, 1));

  mn('tj', synonymProvider('textJustify', {
    A: 'Auto',
    IW: 'InterWord',
    II: 'InterIdeograph',
    IC: 'InterCluster',
    D: 'Distribute',
    K: 'Kashida',
    T: 'Tibetan',
  }));

  mn('tov', synonymProvider('textOverflow', {
    '': 'Ellipsis',
    C: 'Clip',
    E: 'Ellipsis',
  }));

  mn('tt', synonymProvider('textTransform', {
    '': 'Uppercase',
    N: 'None',
    C: 'Capitalize',
    U: 'Uppercase',
    L: 'Lowercase',
    FL: 'FullWidth',
    FSK: 'FullSizeKana',
  }));

  mn('tw', synonymProvider('textWrap', {
    N: 'Normal',
    NO: 'None',
    U: 'Unrestricted',
    S: 'Suppress',
  }));


  forIn({
    apc: ['appearance'],

    ti: ['textIndent'],

    tn: ['transition'],
    tp: ['transitionProperty', 1],
    ttf: ['transitionTimingFunction', 1],

    bgp: ['backgroundPosition', 1],
    bgpx: ['backgroundPositionX', 1],
    bgpy: ['backgroundPositionY', 1],

    bgs: ['backgroundSize', 1],
    bga: ['backgroundAttachment', 1],
    bgcp: ['backgroundClip', 1],

    bgr: ['backgroundRepeat', 1],

    ol: ['outline'],
    ols: ['outlineStyle', 1],

    g: ['grid'],
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

    fx: ['flex'],
    fxd: ['flexDirection', 1],
    fxb: ['flexBasis', 1],
    fxf: ['flexFlow', 1],
    fxw: ['flexWrap', 1],
    fxg: ['flexGrow', 1],
    fxs: ['flexShrink', 1],

    or: ['order'],
    as: ['alignSelf'],
    ac: ['alignContent'],
    tds: ['textDecorationSkip', 1],
    tdsi: ['textDecorationSkipInk', 2],
    tdt: ['textDecorationThickness', 1],

    ws: ['whiteSpace'],
    va: ['verticalAlign'],
    e: ['pointerEvents'],
    us: ['userSelect'],
    ts: ['transformStyle'],
    mbm: ['mixBlendMode'],
    bsp: ['borderSpacing'],
    bdrs: ['borderRadius'],
    zm: ['zoom'],
    tem: ['textEmphasis'],
    temp: ['textEmphasisPosition', 1],
    tems: ['textEmphasisStyle', 1],
  }, ([propName, priority], essenceName) => {
    mn(essenceName, (p, s, style) => {
      return (s = p.suffix)
        ? (style = {}, style[propName] = spaceNormalize(
            s[0] == '_'
              ? snackLeftTrim(s)
              : toKebabCase(s),
        ), styleWrap(style, priority || 0))
        : 0;
    });
  });

  mn('font', (p, s) => {
    return (s = p.s) && styleWrap({
      font: spaceNormalize(s[0] == '_' ? snackLeftTrim(s) : toKebabCase(s)),
    });
  });

  function __wr(v) {
    return v[0] == '-' ? '"' + v.substr(1) + '"' : v;
  }
  mn('ff', (p, s) => {
    return (s = p.suffix) && styleWrap({
      fontFamily: map(
          spaceNormalize(s[0] == '_' ? snackLeftTrim(s) : toKebabCase(s))
              .split(/(?:\s*,\s*)+/)
          , __wr).join(','),
    }, 1);
  });
  mn('cnt', (p, s) => {
    return styleWrap({
      content: (s = p.suffix)
        ? spaceNormalize(
          s[0] == '_' ? (snackLeftTrim(s) || '" "') : toKebabCase(s),
        )
        : 'none',
    });
  });


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
    mn('ft', (p, v) => {
      return (v = filter(map(
          p.suffix.split(regexpSep),
          (v, matchs, name, options) => {
            return v && (matchs = regexpName.exec(v)) ? (
              options = essences[name = lowerFirst(matchs[1])],
              camelToKebabCase(options && options[0] || name)
                + '(' + (matchs[2] || options && options[1] || '')
                + (matchs[3] || options && options[2] || '') + ')'
            ) : 0;
          },
      )).join(' ')) ? styleWrap({
        filter: v,
      }) : 0;
    });
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

  mn('ratio', (p, add, v) => {
    return p.negative || p.camel ? 0 : (
      v = '' + (100 * floatval(p.oh || p.h || 100, 1, 1)
        / floatval(p.w || 100, 1, 1)) + '% ',
      {
        style: {
          position: 'relative',
          paddingTop: (add = p.add) ? (
            'calc(' + v + p.sign + ' ' + add + 'px)'
          ) : v,
        },
        childs: {
          overlay: {
            selectors: ['>*'],
            exts: ['abs' + p.ni, 's' + p.ni],
          },
        },
      }
    );
  }, '((((\\d+):w)x((\\d+):h))|(\\d+):oh)?(([-+]):sign(\\d+):add)?');
};

# Minimalist Notation Default Presets


**The MN library includes this default presets if other is not seated.**


* [Auto prefixes](#auto-prefixes)   
* [Media queries](#media-queries)   
* [Other default settings](#other-default-settings)  
* [States](#states)  
* [Side names](#side-names)  
* [Essences of styles](#essences-of-styles)  
    * [Dynamic essences](#dynamic-essences)  
    * [Static essences](#static-essences)   



#### Auto prefixes

[mn-presets/prefixes.js](https://github.com/mr-amirka/mn-presets/blob/master/prefixes.js)  
[mn-presets/runtime-prefixes.js](https://github.com/mr-amirka/mn-presets/blob/master/runtime-prefixes.js)  



#### Media queries

[mn-presets/medias.js](https://github.com/mr-amirka/mn-presets/blob/master/medias.js)


```js
module.exports = (mn) => {
  const {media} = mn;
  mn.utils.forEach([
    // mobile
    ['m', '(max-width: 992px)'],
    ['m2', '(max-width: 768px)'],
    ['m3', '(max-width: 640px)'],
    ['m4', '(max-width: 480px)'],
    ['m5', '(max-width: 360px)'],
    ['m6', '(max-width: 320px)'],

    ['m2-', '(min-width: 768px) and (max-width: 992px)'],
    ['m3-', '(min-width: 640px) and (max-width: 992px)'],
    ['m4-', '(min-width: 480px) and (max-width: 992px)'],
    ['m5-', '(min-width: 360px) and (max-width: 992px)'],
    ['m6-', '(min-width: 320px) and (max-width: 992px)'],

    // desktop
    ['d', '(min-width: 992px)'],
    ['d2', '(min-width: 1200px)'],
    ['d3', '(min-width: 1600px)'],
    ['d4', '(min-width: 1920px)'],

    ['-d4', '(min-width: 992px) and (max-width: 1920px)'],
    ['-d3', '(min-width: 992px) and (max-width: 1600px)'],
    ['-d2', '(min-width: 992px) and (max-width: 1200px)'],

    // if has mouse, touch pad, advanced stylus digitizers
    ['mouse', '(pointer: fine) and (hover: hover)'],

  ], (v, i) => (media[v[0]] = {query: v[1], priority: i}));
};
```


**Example:**  


Input:  
```html
<div m="ph15 ph10@m">...</div>
```
Output:  
```css
[m~='ph15']{
  padding-left: 15px;
  padding-right: 15px;
}
@media (max-width: 991px) {
  [m~='ph10@m']{
    padding-left: 10px;
    padding-right: 10px;
  }
}
```


#### States

[mn-presets/states.js](https://github.com/mr-amirka/mn-presets/blob/master/states.js)


| State name | Selectors                                        |
| ---------- | ------------------------------------------------ |
| h          | :hover                                           |
| a          | :active                                          |
| f          | :focus                                           |
| i          | ::-webkit-input-placeholder, ::-moz-placeholder, :-ms-input-placeholder, ::placeholder  |
| even       | :nth-child(2n)                                   |
| odd        | :nth-child(2n+1)                                 |
| n          | :nth-child                                       |
| first      | :first-child                                     |
| last       | :last-child                                      |


**Example:**  


Input:  
```html
<a m="o70:h">link</a>
```
Output:  
```css
[m~='o70:h']:hover {
  opacity: 0.7;
}
```


#### Other default settings


[mn-presets/main.js](https://github.com/mr-amirka/mn-presets/blob/master/main.js)


```js
module.exports = (mn) => {;
  mn.css({
    html: {
      '-webkit-tap-highlight-color': '#000',
    },
  });
  mn.assign({
    '*, *:before, *:after': 'bxzBorderBox',
    html: 'ovxHidden tsa',
    body: 'm0 ovxHidden',
    a: 'crPointer@mouse',
    img: 'wmax dBlock mhAuto b0',
    iframe: 'dBlock b0',
    'aside, article, main, section, header, footer, nav, video, canvas, input, textarea':
      'dBlock',
  });
};
```


#### Side names


**How sides named in the names of the essences, if such clarification may take place for the attribute in question**


Base format: ``` {baseName}{sideName}{value} ```

| Side suffix | Sides               | Description           |
| ----------- | ------------------- | --------------------- |
| t           | top                 |                       |
| b           | bottom              |                       |
| l           | left                |                       |
| r           | right               |                       |
| v           | top, bottom         | vertical              |
| vl          | top, bottom, left   | vertical and left     |
| vr          | top, bottom, right  | vertical and right    |
| h           | left, right         | horizontal            |
| ht          | top, left, right    | horizontal and top    |
| hb          | bottom, left, right | horizontal and bottom |
| lt          | left, top           |                       |
| rt          | right, bottom       |                       |
| lb          | left, bottom        |                       |
| rb          | right, bottom       |                       |


```js

const defaultSides = reduce({
  '': [ '' ],
  t: [ 'top' ],
  b: [ 'bottom' ],
  l: [ 'left' ],
  r: [ 'right' ],

  v: [ 'top', 'bottom' ],
  vl: [ 'top', 'bottom', 'left' ],
  vr: [ 'top', 'bottom', 'right' ],

  h: [ 'left', 'right' ],
  ht: [ 'left', 'right', 'top' ],
  hb: [ 'left', 'right', 'bottom' ],

  lt: [ 'top', 'left' ],
  rt: [ 'top', 'right' ],
  lb: [ 'bottom', 'left' ],
  rb: [ 'bottom', 'right' ]
}, (dst, sides, sideKey) => {
  dst[sideKey] = reduce(sides, sidesIteratee, {});
  return dst;
}, {});

```



**Examples:**  

```html
<div m="p5"></div>
```
```css
[m~="p5"]{
  padding: 5px;
}
```
-------------------------


```html
<div m="pl10"></div>
```
```css
[m~="pl10"]{
  padding-left: 10px;
}
```
-------------------------



```html
<div m="pv15"></div>
```
```css
[m~="pv15"]{
  padding-top: 15px;
  padding-bottom: 15px;
}
```
-------------------------



```html
<div m="prb15"></div>
```
```css
[m~="prb15"]{
  padding-right: 15px;
  padding-bottom: 15px;
}
```





#### Essences of styles


[mn-presets/styles.js](https://github.com/mr-amirka/mn-presets/blob/master/styles.js)



##### Dynamic essences


| Essence name | CSS                                     | Description | Value format                                     | Default            |
| ----------- | ---------------------------------------- | ----------- | ------------------------------------------------ | ------------------ |
| p           | &{padding:{value}{unit}}                 |             | {side:([a-z]+)}{value:([0-9]+)}{unit:([a-z]+)}   | 0px ('', 0, 'px')  |
| m           | &{margin:{value}{unit}}                  |             | {side:([a-z]+)}{value:(-?[0-9]+)}{unit:([a-z]+)} | 0px ('', 0, 'px')  |
| s           | &{top?:{value}{unit}; bottom?:{value}{unit}; left?:{value}{unit}; right?:{value}{unit};} | side    | {side:([a-z]+)}{value:(-?[0-9])}{unit:([a-z]+)} | 0px ('', 0, 'px')  |
| b           | &{border-width:{value}{unit}}            |             | {side:([a-z]+)}{value:([0-9]+)}{unit:([a-z]+)}   | 0px ('', 0, 'px')  |
| bs          | &{border-style:{value}}                  |             | {value:camleCase}                                |                    |
| bc          | &{border-color:{value}}                  |             | {value:camleCase/([A-F0-9]+)}                    | #000 (0)           |
| sq          | &{width:{value}; height:{value}}         | square      | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| w           | &{width:{value}}                         |             | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| h           | &{height:{value}}                        |             | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| sqmin       | &{min-width:{value}{unit}; min-height:{value}{unit}} | square      | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| wmin        | &{min-width:{value}{unit}}               |             | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| hmin        | &{min-height:{value}{unit}}              |             | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| sqmax       | &{max-width:{value}{unit}; max-height:{value}{unit}} | square      | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| wmax        | &{max-width:{value}{unit}}               |             | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| hmax        | &{max-height:{value}{unit}}              |             | {value:([0-9]+)}{unit:([a-z]+)}                  | 100% (100, '%')    |
| dn          | &{transition-duration:{value}ms}         |             | {value:([0-9]+)}                                 | 250ms (250)        |
| delay       | &{transition-delay:{value}ms}            |             | {value:([0-9]+)}                                 | 250ms (250)        |
| c           | &{color:{value}}                         |             | {value:camleCase/([A-F0-9]+)}                    | #000 (0)           |
| stroke      | &{stroke:{value}}                        |             | {value:camleCase/([A-F0-9]+)}                    | #000 (0)           |
| bg          | &{background:{value}}                    |             | [ ...-?{value:camleCase/([A-F0-9]+)}{unit:(p/w)}{position:([0-9]+)} ]-?{(r_{method:(.*)})/g{angle:(-?[0-9]+)})}  | #000 (0)           |
| x           | &{transform: translate({x}{x-unit}, {y}{y-unit}) scale({s*0.01})} |             | {x:([0-9]+)}{x-unit:([a-z]+)}y{y:([0-9]+)}{y-unit:([a-z]+)}s{s:([0-9]+)} | 0, 0, _ (0, 'px', 0, 'px', _) |
| spnr        | &{animation: spinner-animate {speed}ms infinite linear} | spinner     | {speed:([0-9]+)}                                | 3000ms (3000)      |
| rx          | &{transform: rotateX({value}deg)}        |             | {value:(-?[0-9]+)}                               | 180deg (180)       |
| ry          | &{transform: rotateY({value}deg)}        |             | {value:(-?[0-9]+)}                               | 180deg (180)       |
| rz          | &{transform: rotateZ({value}deg)}        |             | {value:(-?[0-9]+)}                               | 180deg (180)       |
| bsh         | &{box-shadow: [ {inset} {x}px {y}px {value}px {r}px {color} ] * repeat} | shadow      | {value:([0-9]+)}r{r:([0-9]+)}x{x:(-?[0-9]+)}y{y:(-?[0-9]+)}m{repeat:([0-9]+)}c{color:([A-F0-9]+)}in{inset:boolean} | 0, 0, 0, 0, 1, #000, '' |
| tsh         | &{text-shadow: [ {inset} {x}px {y}px {value}px {color} ] * repeat} | text-shadow | {value:([0-9]+)}x{x:(-?[0-9]+)}y{y:(-?[0-9]+)}m{repeat:([0-9]+)}c{color:([A-F0-9]+)}in{inset:boolean} | 0, 0, 0, 1, #000, '' |
| f           | &{font-size:{value}{unit}}               | font        | {value:([0-9]+)}{unit:([a-z]+)}                  | 14px                |
| fw          | &{font-weight:{value is camleCase ? value : value *100}} |             | {value:camleCase/([A-F0-9]+)}      | 100 (1)             |
| ff          | &{font-family:{value}}                   |             | {value:snackCase}                                    |                     |
| fs          | &{font-style:{value}}                    |             | {value:camelCase}                                    |                     |
| r           | &{border-radius:{value}{unit}}           | radius      | {value:([0-9]+)}{unit:([a-z]+)}                      | 10000px (10000, 'px') |
| z           | &{z-index:{value}}                       |             | {value:(-?[0-9]+)}}                                  | 1                   |
| o           | &{opacity:{value * 0.01}}                |             | {value:([0-9]+)}}                                    | 0                   |
| lh          | &{line-height:{value * 0.01}{unit == '%' ? '' : 'px'}} |             | {value:([0-9]+)}{unit:([a-z]+)}                      | 1  (100, '%')       |
| tn          | &{transition:{value}}                              |             | {value:camelCase}                                    |                     |
| g           | &{grid-template:{value}}                 |             | {value:camelCase}                                    |                     |
| gr          | &{grid-template-rows:{value}}            |             | {value:camelCase}                                    |                     |
| gc          | &{grid-template-columns:{value}}         |             | {value:camelCase}                                    |                     |
| gar         | &{grid-auto-rows:{value}}                |             | {value:camelCase}                                    |                     |
| gg          | &{grid-gap:{value}}                      |             | {value:camelCase}                                    |                     |
| gRow        | &{grid-row:{value}}                      |             | {value:camelCase}                                    |                     |
| gCol        | &{grid-column:{value}}                   |             | {value:camelCase}                                    |                     |
| fx          | &{flex:{value}}                          |             | {value:camelCase}                                    |                     |
| tp          | &{transition-property:{value}}           |             | {value:camelCase}                                    |                     |
| bgp         | &{background-position:{value}}           |             | {value:camelCase}                                    |                     |
| bgpx        | &{transition-propertyX:{value}}          |             | {value:camelCase}                                    |                     |
| bgpy        | &{transition-propertyY:{value}}          |             | {value:camelCase}                                    |                     |
| bgs         | &{background-size:{value}}               |             | {value:camelCase}                                    |                     |
| bga         | &{background-attachment:{value}}         |             | {value:camelCase}                                    |                     |
| bgr          | &{background-repeat:{value}}           |             | {value:camelCase}                                    |                     |
| bgrx          | &{background-repeat-x:{value}}           |             | {value:camelCase}                                    |                     |
| bgry          | &{background-repeat-y:{value}}           |             | {value:camelCase}                                    |                     |
| ctt         | &{content:{value}}                       |             | {value:camelCase}                                    |                     |
| rs          | &{border-radius:{value}}                 | radius      | {value:camelCase}                                    |                     |
| ov          | &{overflow:{value}}                      |             | {value:camelCase}                                    |                     |
| ovx         | &{overflow-x:{value}}                    |             | {value:camelCase}                                    |                     |
| ovy         | &{overflow-y:{value}}                    |             | {value:camelCase}                                    |                     |
| fd          | &{flex-direction:{value}}                |             | {value:camelCase}                                    |                     |
| jc          | &{justify-content:{value}}               |             | {value:camelCase}                                    |                     |
| ai          | &{align-items:{value}}                   |             | {value:camelCase}                                    |                     |
| tt          | &{text-transform:{value}}                |             | {value:camelCase}                                    |                     |
| td          | &{text-decoration:{value}}               |             | {value:camelCase}                                    |                     |
| to          | &{text-overflow:{value}}                 |             | {value:camelCase}                                    |                     |
| cr          | &{cursor :{value}}                       |             | {value:camelCase}                                    |                     |
| ol          | &{outline:{value}}                       |             | {value:camelCase}                                    |                     |
| ws          | &{white-space:{value}}                   |             | {value:camelCase}                                    |                     |
| va          | &{vertical-align:{value}}                |             | {value:camelCase}                                    |                     |
| d           | &{display:{value}}                       |             | {value:camelCase}                                    |                     |
| e           | &{pointer-events:{value}}                |             | {value:camelCase}                                    |                     |
| us          | &{user-select:{value}}                   |             | {value:camelCase}                                    |                     |
| v           | &{visibility:{value}}                    |             | {value:camelCase}                                    |                     |
| bsp         | &{border-spacing:{value}}                |             | {value:camelCase}                                    |                     |
| mbm         | &{mix-blend-mode:{value}}                |             | {value:camelCase}                                    |                     |
| col         | &{width:{100 * colSize / fullSize}%}     | column      | {colSize:([0-9]+)}/{fullSize:([0-9]+)}               | 100% (12, 12)       |
| coll         | &{margin-left:{100 * colSize / fullSize}%}     | column      | {colSize:([0-9]+)}/{fullSize:([0-9]+)}               | 100% (12, 12)       |
| colr         | &{margin-right:{100 * colSize / fullSize}%}     | column      | {colSize:([0-9]+)}/{fullSize:([0-9]+)}               | 100% (12, 12)       |
| ratio       | &{position: relative; padding-top: calc({height}/{width}% + {addition}px)} &>*{position: absolute; top: 0; bottom: 0; left: 0; right: 0} |             | {width:([0-9]+)}x{height:([0-9]+)}[-+]{addition([0-9]+)} | 100% (1, 1, 0)      |



**ft**

```js
((essences) => {
  const regexpName = /^([A-Za-z]+)([0-9]*)(.*)$/;
  const regexpSep = /_+/;
  mn('ft', p => ({
    style: {
      filter: lowerFirst(p.suffix).split(regexpSep).map(v => {
        if (!v) return '';
        const matchs = regexpName.exec(v);
        const funcName = matchs[1];
        if (!funcName) return '';
        const options = essences[funcName];
        return camelToKebabCase(options && options[0] || funcName)
          + '('  + (matchs[2] || options && options[1] || '')
          + (matchs[3] || options && options[2] || '') + ') ';
      }).join('') + p.i
    }
  }));
})({
  blur: [ 'blur', 4, 'px' ],
  gray: [ 'grayscale', 100, '%' ],
  bright: [ 'brightness', 100, '%' ],
  contrast: [ 'contrast', 100, '%' ],
  hue: [ 'hue-rotate', 180, 'deg' ],
  invert: [ 'invert', 100, '%' ],
  saturate: [ 'saturate', 100, '%' ],
  sepia: [ 'sepia', 100, '%' ]
});
```

**Examples**  


```html
<div m="ftBlur3">...</div>
```

```css
[m~='ftBlur3']{
  filter: blur(3px);
}
```

-------------------------

```html
<div m="ftGray50">...</div>
```

```css
[m~='ftGray50']{
  filter: grayscale(50%);
}
```

-------------------------



##### Static essences  


| Essence name  | css                                                                | Description           |
| ------------- | ------------------------------------------------------------------ | --------------------- |
| tbl           | &{display: table} &>*{display: table-cell; vertical-align: middle} |                       |
| cfx           | &:before,&:after{content: " "; clear: both; display: table}        |                       |
| layout        | &{display: [ -webkit-box, -webkit-flex, flex ]}                    |                       |
| layoutRow     | &{exts layout; box-direction: normal; box-orient: horizontal; flex-direction: row; box-pack: start; justify-content: flex-start; box-align: center; align-items: center; align-content: center} |                       |
| layoutColumn  | &{exts layout; box-direction: normal; box-orient: vertical; flex-direction: column} |                       |
| fhaStart      | &{box-pack: start; justify-content: flex-start}                    | flex horizontal align |
| fhaCenter     | &{box-pack: center; justify-content: center}                       | flex horizontal align |
| fhaEnd        | &{box-pack: end; justify-content: flex-end}                        | flex horizontal align |
| fhaAround     | &{box-pack: space-around; justify-content: space-around}           | flex horizontal align |
| fhaBetween    | &{box-pack: justify; justify-content: space-between}               | flex horizontal align |
| fvaStart      | &{box-align: start; align-items: flex-start; align-content: flex-start} | flex vertical align   |
| fvaCenter     | &{box-align: center; align-items: center; align-content: center}   | flex vertical align   |
| fvaEnd        | &{box-align: end; align-items: flex-end; align-content: flex-end}  | flex vertical align   |
| fvaStretch    | &{box-align: stretch; align-items: stretch; align-content: stretch} | flex vertical align   |
| tl            | &{text-align: left}                                                | text-left             |
| tc            | &{text-align: center}                                              | text-center           |
| tr            | &{text-align: right}                                               | text-right            |
| tj            | &{text-align: justify}                                             | text-justify          |
| lt            | &{float: left}                                                     | left                  |
| rt            | &{float: right}                                                    | right                 |
| jt            | &{float: none}                                                     | justify               |
| rlv           | &{position: relative}                                              | relative              |
| fixed         | &{position: fixed}                                                 | fixed                 |
| abs           | &{position: absolute}                                              | absolute              |
| static        | &{position: static}                                                | static                |
| break         | &{white-space: normal; word-break: break-word}                     |                       |




**Examples**  


```html
<div m="abs s">...</div>
```

```css
[m~='abs']{
  position: absolute;
}
[m~='s']{
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
```

-------------------------


```html
<div m="s10">...</div>
```

```css
[m~='s10']{
  top: 10px;
  bottom: 10px;
  left: 10px;
  right: 10px;
}
```

-------------------------


```html
<div m="sv20">...</div>
```

```css
[m~='sv20']{
  top: 20px;
  bottom: 20px;
}
```

-------------------------


```html
<div m="st-20">...</div>
```

```css
[m~='st-20']{
  top: -20px;
}
```

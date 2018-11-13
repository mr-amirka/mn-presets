[Русский](https://github.com/mr-amirka/amirka/blob/master/src/presets-ru.md)


# Minimalist Notation Default Presets


**The MN library includes predefined settings included in the default cli-version.**


* [Prefixes](#prefixes)   
* [Media queries](#media-queries)   
* [Other default settings](#other-default-settings)  
* [States](#states)  
* [Side names](#side-names)  
* [Essences of styles](#essences-of-styles)  
    * [Dynamic essences](#dynamic-essences)  
    * [Static essences](#static-essences)   



Try this tests:
* https://jsfiddle.net/j6d8aozy/51/  
* https://jsfiddle.net/j6d8aozy/46/  

Home page: http://minimalist-notation.org  


I would be grateful for your feedback and comments. Write me in a [telegram](https://t.me/mr_amirka).  
With love, your mr.Amirka :)


Are you interested in the development of this project? Do your [bit](https://yasobe.ru/na/notation).  



#### Prefixes

[mn-presets/prefixes.js](https://github.com/mr-amirka/mn-presets/blob/master/prefixes.js)  
[mn-presets/runtime-prefixes.js](https://github.com/mr-amirka/mn-presets/blob/master/runtime-prefixes.js)  


```js
module.exports = (mn) => {
  const { flags } = mn.utils;
  flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
  flags([
    'transform',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'boxSizing'
  ], mn.propertiesStringify.prefixedAttrs);
};

```



#### Media queries

[mn-presets/medias.js](https://github.com/mr-amirka/mn-presets/blob/master/medias.js)


```js
module.exports = (mn) => {
  const media = mn.media;
  [
    //mobile
    [ 'm', '(max-width: 991px)' ],
    [ 'm2', '(max-width: 767px)' ],
    [ 'm3', '(max-width: 639px)' ],
    [ 'm4', '(max-width: 479px)' ],
    [ 'm5', '(max-width: 359px)' ],
    [ 'm6', '(max-width: 319px)' ],

    [ 'm2-', '(min-width: 768px) and (max-width: 991px)' ],
    [ 'm3-', '(min-width: 640px) and (max-width: 991px)' ],
    [ 'm4-', '(min-width: 480px) and (max-width: 991px)' ],
    [ 'm5-', '(min-width: 360px) and (max-width: 991px)' ],
    [ 'm6-', '(min-width: 320px) and (max-width: 991px)' ],

    //desktop
    [ 'd', '(min-width: 992px)' ],
    [ 'd2', '(min-width: 1200px)' ],
    [ 'd3', '(min-width: 1600px)' ],
    [ 'd4', '(min-width: 1920px)' ],

    [ '-d4', '(min-width: 992px) and (max-width: 1919px)' ],
    [ '-d3', '(min-width: 992px) and (max-width: 1599px)' ],
    [ '-d2', '(min-width: 992px) and (max-width: 1199px)' ],

    [ 'pt', 'print' ]
  ].forEach((v, i) => media[v[0]] = {query: v[1], priority: i});
};
```


**Example:**  


Input:  
```html
<div m="ph15 ph10@sm">...</div>
```
Output:  
```css
[m~='ph15@sm']{
  padding-left: 15px;
  padding-right: 15px;
}
@media (max-width: 991px) {
  [m~='ph10']{
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
| even       | :nth-child(2n)                                   |
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


[mn-presets/mn.theme.js](https://github.com/mr-amirka/mn-presets/blob/master/theme.js)


```js
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
    'main, section, header, footer, nav, iframe, video': 'dBlock'
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
| rx          | &{rotateX:{value}{unit}}                 |             | {value:([0-9]+)}{unit:([a-z]+)}                      | 180deg (180, 'deg') |
| ry          | &{rotateY:{value}{unit}}                 |             | {value:([0-9]+)}{unit:([a-z]+)}                      | 180deg (180, 'deg') |
| rz          | &{rotateZ:{value}{unit}}                 |             | {value:([0-9]+)}{unit:([a-z]+)}                      | 180deg (180, 'deg') |
| lh          | &{line-height:{value * 0.01}{unit == '%' ? '' : 'px'}} |             | {value:([0-9]+)}{unit:([a-z]+)}                      | 1  (100, '%')       |
| tn          | &{transition:{value}}                              |             | {value:snackCase}                                    |                     |
| g           | &{grid-template:{value}}                 |             | {value:snackCase}                                    |                     |
| gr          | &{grid-template-rows:{value}}            |             | {value:snackCase}                                    |                     |
| gc          | &{grid-template-columns:{value}}         |             | {value:snackCase}                                    |                     |
| gar         | &{grid-auto-rows:{value}}                |             | {value:snackCase}                                    |                     |
| gg          | &{grid-gap:{value}}                      |             | {value:snackCase}                                    |                     |
| gRow        | &{grid-row:{value}}                      |             | {value:snackCase}                                    |                     |
| gCol        | &{grid-column:{value}}                   |             | {value:snackCase}                                    |                     |
| fx          | &{flex:{value}}                          |             | {value:snackCase}                                    |                     |
| tp          | &{transition-property:{value}}           |             | {value:snackCase}                                    |                     |
| bgp         | &{background-position:{value}}           |             | {value:snackCase}                                    |                     |
| bgpx        | &{transition-propertyX:{value}}          |             | {value:snackCase}                                    |                     |
| bgpy        | &{transition-propertyY:{value}}          |             | {value:snackCase}                                    |                     |
| bgs         | &{background-size:{value}}               |             | {value:snackCase}                                    |                     |
| bga         | &{background-attachment:{value}}         |             | {value:snackCase}                                    |                     |
| bgr          | &{background-repeat:{value}}           |             | {value:snackCase}                                    |                     |
| bgrx          | &{background-repeat-x:{value}}           |             | {value:snackCase}                                    |                     |
| bgry          | &{background-repeat-y:{value}}           |             | {value:snackCase}                                    |                     |
| ctt         | &{content:{value}}                       |             | {value:snackCase}                                    |                     |
| rs          | &{border-radius:{value}}                 | radius      | {value:snackCase}                                    |                     |
| ov          | &{overflow:{value}}                      |             | {value:snackCase}                                    |                     |
| ovx         | &{overflow-x:{value}}                    |             | {value:snackCase}                                    |                     |
| ovy         | &{overflow-y:{value}}                    |             | {value:snackCase}                                    |                     |
| fd          | &{flex-direction:{value}}                |             | {value:snackCase}                                    |                     |
| jc          | &{justify-content:{value}}               |             | {value:snackCase}                                    |                     |
| ai          | &{align-items:{value}}                   |             | {value:snackCase}                                    |                     |
| tt          | &{text-transform:{value}}                |             | {value:snackCase}                                    |                     |
| td          | &{text-decoration:{value}}               |             | {value:snackCase}                                    |                     |
| to          | &{text-overflow:{value}}                 |             | {value:snackCase}                                    |                     |
| cr          | &{cursor :{value}}                       |             | {value:snackCase}                                    |                     |
| ol          | &{outline:{value}}                       |             | {value:snackCase}                                    |                     |
| ws          | &{white-space:{value}}                   |             | {value:snackCase}                                    |                     |
| va          | &{vertical-align:{value}}                |             | {value:snackCase}                                    |                     |
| d           | &{display:{value}}                       |             | {value:snackCase}                                    |                     |
| e           | &{pointer-events:{value}}                |             | {value:snackCase}                                    |                     |
| us          | &{user-select:{value}}                   |             | {value:snackCase}                                    |                     |
| v           | &{visibility:{value}}                    |             | {value:snackCase}                                    |                     |
| bsp         | &{border-spacing:{value}}                |             | {value:snackCase}                                    |                     |
| col         | &{width:{100 * colSize / fullSize}%}     | column      | {colSize:([0-9]+)}/{fullSize:([0-9]+)}               | 100% (12, 12)       |
| coll         | &{margin-left:{100 * colSize / fullSize}%}     | column      | {colSize:([0-9]+)}/{fullSize:([0-9]+)}               | 100% (12, 12)       |
| colr         | &{margin-right:{100 * colSize / fullSize}%}     | column      | {colSize:([0-9]+)}/{fullSize:([0-9]+)}               | 100% (12, 12)       |
| ratio       | &{position: relative; padding-top: calc({height}/{width}% + {addition}px)} &>*{position: absolute; top: 0; bottom: 0; left: 0; right: 0} |             | {width:([0-9]+)}x{height:([0-9]+)}[-+]{addition([0-9]+)} | 100% (1, 1, 0)      |


** ft **

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
  left: 20px;
  right: 20px;
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

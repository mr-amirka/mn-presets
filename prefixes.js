/**
 * @overview MinimalistNotation preset "prefixes"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const {utils, propertiesStringify} = mn;
  const {flags} = utils;
  flags([
    '-webkit-', '-moz-', '-o-', '-ms-', '-khtml-',
  ], propertiesStringify.prefixes);
  flags([
    'appearance',
    'backgroundClip',
    'transform',
    'transformStyle',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'flex',
    'flexDirection',
    'flexBasis',
    'flexWrap',
    'flexFlow',
    'flexGrow',
    'flexShrink',
    'justifyContent',
    'alignItems',
    'alignContent',
    'alignSelf',
    'boxPack',
    'boxDirection',
    'boxOrient',
    'order',
    'opacity',
    'boxSizing',
    'textSizeAdjust',
  ], propertiesStringify.prefixedAttrs);
};

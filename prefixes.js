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
    'transform',
    'transformStyle',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'opacity',
    'boxSizing',
    'textSizeAdjust',
  ], propertiesStringify.prefixedAttrs);
};

/**
 * @overview MinimalistNotation preset "runtime prefixes"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const {utils, propertiesStringify} = mn;
  const {flags, forEach} = utils;
  const style = document.createElement('div').style;
  const prefixes = propertiesStringify.prefixes;
  forEach(['webkit', 'moz', 'o', 'ms', 'khtml'], (prefix) => {
    style[prefix + 'Transform'] && (prefixes['-' + prefix + '-'] = 1);
  });
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

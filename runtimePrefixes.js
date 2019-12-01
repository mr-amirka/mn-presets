/**
 * @overview MinimalistNotation preset "default runtime prefixes"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const {utils, propertiesStringify} = mn;
  const {flags, forEach} = utils;
  const style = document.createElement('div').style;
  const prefixes = propertiesStringify.prefixes;
  forEach(['webkit', 'moz', 'o',  'ms', 'khtml'], (prefix) => {
  	if (style[prefix + 'Transform'] !== undefined) prefixes['-' + prefix + '-'] = true;
  });
  flags([
    'transform',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'boxSizing'
  ], propertiesStringify.prefixedAttrs);
};

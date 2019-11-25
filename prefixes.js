/**
 * @overview MinimalistNotation preset "default settings"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const {utils, propertiesStringify} = mn;
  const {flags} = utils;

  flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-'], propertiesStringify.prefixes);
  flags([
    'transform',
    'transformStyle',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'opacity',
    'boxSizing',
  ], propertiesStringify.prefixedAttrs);
};

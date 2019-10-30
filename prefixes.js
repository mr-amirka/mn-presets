/**
 * @overview MinimalistNotation preset "default settings"
 * @author Amir Absolutely <mr.amirka@ya.ru>
 */

module.exports = (mn) => {
  const { flags } = mn.utils;
  flags(['-webkit-', '-moz-', '-o-',  '-ms-', '-khtml-' ], mn.propertiesStringify.prefixes);
  flags([
    'transform',
    'transformStyle',
    'transitionDuration',
    'pointerEvents',
    'userSelect',
    'filter',
    'opacity',
    'boxSizing'
  ], mn.propertiesStringify.prefixedAttrs);
};

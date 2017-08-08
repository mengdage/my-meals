export function capitalize(str='') {
  return typeof str === 'string' ? str.slice(0,1).toUpperCase() + str.slice(1) : '';
}

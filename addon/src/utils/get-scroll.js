import getWindow from './window';

export default function getScroll(elem, direction) {
  if (elem === null || elem === undefined) {
    return;
  }

  if (elem.jquery) {
    // Convert to DOM element if jQuery was used
    elem = elem[0];
  }

  if (elem === null || elem === undefined) {
    return;
  }

  // `window`/`document` do not have scrollLeft attributes
  // Instead, we look at `pageXOffset`, which is an alias for `scrollX`,
  // But has better browser support (namely IE)
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/pageXOffset
  let windowObj = getWindow(elem);
  if (windowObj) {
    if (direction === 'left') {
      return windowObj.pageXOffset;
    }
    return windowObj.pageYOffset;
  }

  if (direction === 'left') {
    return elem.scrollLeft;
  }

  return elem.scrollTop;
}

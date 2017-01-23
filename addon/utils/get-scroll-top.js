// https://github.com/jquery/jquery/blob/1b9575b9d14399e9426b9eacdd92b3717846c3f2/src/core.js#L218-L220
function isWindow(obj) {
  return obj === obj.window;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
function isDocument(obj) {
  return obj.nodeType === 9;
}

function getWindow(obj) {
  if (isWindow(obj)) {
    return obj;
  }

  if (isDocument(obj)) {
    return obj.defaultView;
  }

  return null; // Return nothing if not `window` or `document`, as we won't use window for elements
}

export default function getScrollTop(elem) {
  if (elem === null || elem === undefined) {
    return;
  }

  if (elem.jquery) { // Convert to DOM element if jQuery was used
    elem = elem[0];
  }

  if (elem === null || elem === undefined) {
    return;
  }

  // `window`/`document` do not have scrollTop attributes
  // Instead, we look at `pageYOffset`, which is an alias for `scrollY`,
  // But has better browser support (namely IE)
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/pageYOffset
  let windowObj = getWindow(elem);
  if (windowObj) {
    return windowObj.pageYOffset;
  }

  return elem.scrollTop;
}

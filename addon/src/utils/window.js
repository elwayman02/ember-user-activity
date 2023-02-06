// https://github.com/jquery/jquery/blob/1b9575b9d14399e9426b9eacdd92b3717846c3f2/src/core.js#L218-L220
function isWindow(obj) {
  return obj === obj.window;
}

// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
function isDocument(obj) {
  return obj.nodeType === 9;
}

export default function getWindow(obj) {
  if (isWindow(obj)) {
    return obj;
  }

  if (isDocument(obj)) {
    return obj.defaultView;
  }

  return null; // Return nothing if not `window` or `document`, as we won't use window for elements
}

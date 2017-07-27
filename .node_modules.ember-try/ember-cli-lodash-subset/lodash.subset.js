import assign   from 'lodash-es/assign';
import forOwn   from 'lodash-es/forOwn';
import merge    from 'lodash-es/merge';
import union    from 'lodash-es/union';
import uniq     from 'lodash-es/uniq';
import uniqBy   from 'lodash-es/uniqBy';
import map      from 'lodash-es/map';
import reject   from 'lodash-es/reject';
import filter   from 'lodash-es/filter';
import defaults from 'lodash-es/defaults';
import keys     from 'lodash-es/keys';
import find     from 'lodash-es/find';
import defaultsDeep from 'lodash-es/defaultsDeep';
import omitBy from 'lodash-es/omitBy';
import isNull from 'lodash-es/isNull';
import compact from 'lodash-es/compact';
import intersection from 'lodash-es/intersection';
import zipObject from 'lodash-es/zipObject';
import includes from 'lodash-es/includes';
import cloneDeep from 'lodash-es/cloneDeep';
import some from 'lodash-es/some';
import values from 'lodash-es/values';
import debounce from 'lodash-es/debounce';
import remove from 'lodash-es/remove';
import clone from 'lodash-es/clone';
import forEach from 'lodash-es/forEach';

module.exports = {
  assign: assign,
  forOwn: forOwn,
  merge: merge,
  union: union,
  uniq: uniq,
  uniqBy: uniqBy,
  map: map,
  reject: reject,
  filter: filter,
  defaults: defaults,
  keys: keys,
  find: find,
  defaultsDeep: defaultsDeep,
  omitBy: omitBy,
  isNull: isNull,
  compact: compact,
  zipObject: zipObject,
  any: some,
  some: some,
  includes: includes,
  cloneDeep: cloneDeep,
  values: values,
  debounce: debounce,
  intersection: intersection,
  remove: remove,
  clone: clone,
  forEach: forEach,
};


import Immutable from 'immutable';


const DEFAULT_PROPS = {
  maxSize: Infinity
};


const DEFAULT_STATE = Immutable.Map({
  map: Immutable.OrderedMap()
});


const SHRINK_RATIO = 0.25;
const SHRINK_THRESHOLD = 1;


function removeOldKeys(state) {
  const map = state.get('map');
  const currentSize = map.size;
  const numberOfKeysToRemove = Math.ceil(currentSize * SHRINK_RATIO);
  const entriesToRemove = map.slice(0, numberOfKeysToRemove);

  return entriesToRemove.keySeq().reduce((newState, key) => {
    return newState.update('map', (map) => map.remove(key));
  }, state.asMutable()).asImmutable();
}


/**
 * Immutable cache.
 *
 * Usage:
 *
 *    let cache = new Cache({maxSize: 1000});
 *
 *    // adding value
 *    cache = cache.set('key', 'value');
 *
 *    // check if key is cached
 *    cache.has('key'); // true
 *
 *    // get value for key
 *    cache.get('key'); // 'value'
 */
export default class Cache {

  /**
   * @param {{maxSize: Number}} props
   * @param {Immutable.Map} state
   */
  constructor(props, state) {
    this._state = state || DEFAULT_STATE;
    this._props = props || DEFAULT_PROPS;
  }


  /**
   * Get value for key.
   * If key is not cached, returns undefined.
   *
   * @param {*} key
   * @returns {*}
   */
  get(key) {
    return this._state.getIn(['map', key]);
  }


  /**
   * Set value for key.
   *
   * @param {*} key
   * @param {*} value
   * @returns {Cache} updated cache
   */
  set(key, value) {
    const state = this._state;
    let newState = state;

    if (state.get('map').size >= this._props.maxSize * SHRINK_THRESHOLD) {
      newState = removeOldKeys(state);
    }

    newState = newState.update('map', (map) => map.set(key, value));

    if (Immutable.is(state, newState)) {
      return this;
    }

    return new Cache(this._props, newState);
  }


  /**
   * Check if key is cached.
   *
   * @param {*} key
   * @returns {Boolean}
   */
  has(key) {
    return this._state.get('map').has(key);
  }


  /**
   * Returns number of cached values.
   */
  get size() {
    return this._state.get('map').size;
  }


  toString() {
    return `Cache ${this._state.get('map').toString()}`;
  }
}

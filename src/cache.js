import Immutable from 'immutable';


const DEFAULT_PROPS = {
  maxSize: Infinity
};


const DEFAULT_STATE = Immutable.Map({
  map: Immutable.OrderedMap()
});


const SHRINK_RATIO = 0.25;
const SHRINK_THRESCHOLD = 0.5;


function removeOldKeys(state) {
  const map = state.get('map');
  const currentSize = map.size;
  const numberOfKeysToRemove = Math.ceil(currentSize * SHRINK_RATIO);
  const entriesToRemove = map.slice(0, numberOfKeysToRemove);

  return entriesToRemove.keySeq().reduce((newState, key) => {
    return newState.update('map', (map) => map.remove(key));
  }, state.asMutable()).asImmutable();
}


export default class Cache {
  constructor(props, state) {
    this._state = state || DEFAULT_STATE;
    this._props = props || DEFAULT_PROPS;
  }


  get(key) {
    return this._state.getIn(['map', key]);
  }


  set(key, value) {
    const state = this._state;
    let newState = state;

    if (state.size > this._props.maxSize * SHRINK_THRESCHOLD) {
      newState = removeOldKeys(state);
    }

    newState = newState.update('map', (map) => map.set(key, value));

    if (Immutable.is(state, newState)) {
      return this;
    }

    return new Cache(this._props, newState);
  }


  has(key) {
    return this._state.get('map').has(key);
  }


  get size() {
    return this._state.get('map').size;
  }


  toString() {
    return `Cache ${this._state.get('map').toString()}`;
  }
}

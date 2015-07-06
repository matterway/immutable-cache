'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var DEFAULT_PROPS = {
  maxSize: Infinity
};

var DEFAULT_STATE = _immutable2['default'].Map({
  map: _immutable2['default'].OrderedMap()
});

var SHRINK_RATIO = 0.25;
var SHRINK_THRESCHOLD = 0.5;

function removeOldKeys(state) {
  var map = state.get('map');
  var currentSize = map.size;
  var numberOfKeysToRemove = Math.ceil(currentSize * SHRINK_RATIO);
  var entriesToRemove = map.slice(0, numberOfKeysToRemove);

  return entriesToRemove.keySeq().reduce(function (newState, key) {
    return newState.update('map', function (map) {
      return map.remove(key);
    });
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

var Cache = (function () {

  /**
   * @param {{maxSize: Number}} props
   * @param {Immutable.Map} state
   */

  function Cache(props, state) {
    _classCallCheck(this, Cache);

    this._state = state || DEFAULT_STATE;
    this._props = props || DEFAULT_PROPS;
  }

  _createClass(Cache, [{
    key: 'get',

    /**
     * Get value for key.
     * If key is not cached, returns undefined.
     *
     * @param {*} key
     * @returns {*}
     */
    value: function get(key) {
      return this._state.getIn(['map', key]);
    }
  }, {
    key: 'set',

    /**
     * Set value for key.
     *
     * @param {*} key
     * @param {*} value
     * @returns {Cache} updated cache
     */
    value: function set(key, value) {
      var state = this._state;
      var newState = state;

      if (state.size > this._props.maxSize * SHRINK_THRESCHOLD) {
        newState = removeOldKeys(state);
      }

      newState = newState.update('map', function (map) {
        return map.set(key, value);
      });

      if (_immutable2['default'].is(state, newState)) {
        return this;
      }

      return new Cache(this._props, newState);
    }
  }, {
    key: 'has',

    /**
     * Check if key is cached.
     *
     * @param {*} key
     * @returns {Boolean}
     */
    value: function has(key) {
      return this._state.get('map').has(key);
    }
  }, {
    key: 'toString',
    value: function toString() {
      return 'Cache ' + this._state.get('map').toString();
    }
  }, {
    key: 'size',

    /**
     * Returns number of cached values.
     */
    get: function get() {
      return this._state.get('map').size;
    }
  }]);

  return Cache;
})();

exports['default'] = Cache;
module.exports = exports['default'];
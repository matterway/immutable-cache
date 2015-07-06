## Immutable Cache

Configurable cache, based on
[immutable.js](https://facebook.github.io/immutable-js/).

### Example

```js
import {Cache} from 'immutable-cache';

let cache = new Cache({maxSize: 100});

// cache key 'key' with value 'value'
cache = cache.set('key', 'value');

// check if key is cached
cache.has('key'); // true
cache.has('other-key'); // false

cache.get('key'); // 'value'
cache.get('other-key'); // undefined
```


### Options

Name      | Description
----------|-----------
`maxSize` | maximum number of keys stored in cache


### License

Immutable-Cache is freely distributable under the terms of the [MIT
license][MIT].

[MIT]: https://github.com/ProductiveMobile/immutable-cache/blob/develop/LICENSE

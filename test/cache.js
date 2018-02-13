import {expect} from 'chai';
import sinon from 'sinon';
import Cache from '../src/cache';

describe('Cache', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });


  afterEach(() => {
    sandbox.restore();
  });


  it('is a map-like object', () => {
    const cache = new Cache();

    expect(cache).to.have.property('get').to.be.a('function');
    expect(cache).to.have.property('set').to.be.a('function');
    expect(cache).to.have.property('size').to.be.a('number');
  });


  it('can set the value', () => {
    let cache = new Cache();
    const key = 'key';
    const value = 'value';

    cache = cache.set(key, value);

    expect(cache.get(key)).to.equal(value);
  });


  it('increases size when new values added', () => {
    let cache = new Cache();
    const key1 = 'key1';
    const key2 = 'key2';
    const key3 = 'key3';
    const value = 'value';

    cache = cache.set(key1, value);
    cache = cache.set(key2, value);
    cache = cache.set(key3, value);

    expect(cache.size).to.equal(3);
  });


  it('returns true if has a key cached', () => {
    let cache = new Cache();
    const key = 'key';
    const value = 'value';

    cache = cache.set(key, value);

    expect(cache.has(key)).to.equal(true);
  });



  it('can have limited size', () => {
    let cache = new Cache({
      maxSize: 2
    });

    cache = cache.set('discard', 'value 1');
    cache = cache.set('keep', 'value 2');
    cache = cache.set('also', 'value 3');

    expect(cache.has('discard')).to.equal(false);
    expect(cache.has('keep')).to.equal(true);
    expect(cache.has('also')).to.equal(true);
  });

});

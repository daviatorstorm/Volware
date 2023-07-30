import NodeCache from 'node-cache';

class CacheService {
    cache = new NodeCache({
        stdTTL: 3600, checkperiod: 120
    });

    exist(key) {
        return this.cache.has(key);
    }

    set(key, value) {
        this.cache.set(key, value);
    }

    get(key) {
        return this.cache.get(key);
    }
}

export default new CacheService();
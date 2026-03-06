/**
 * Config Cache
 * 
 * Cache de configuração com TTL
 */

export class ConfigCache {
  constructor(options = {}) {
    this.cache = new Map()
    this.ttl = options.ttl || 300000 // 5 minutos
  }

  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }

  set(key, value, ttl = this.ttl) {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttl
    })
  }

  has(key) {
    return this.get(key) !== null
  }

  delete(key) {
    return this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  size() {
    return this.cache.size
  }
}

// Cache global
export const globalConfigCache = new ConfigCache()

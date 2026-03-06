/**
 * Service Registry
 * 
 * Registro de serviços do sistema
 */

export class ServiceRegistry {
  constructor() {
    this.services = new Map()
  }

  register(name, service, options = {}) {
    this.services.set(name, {
      service,
      options,
      registeredAt: Date.now()
    })
  }

  get(name) {
    return this.services.get(name)
  }

  has(name) {
    return this.services.has(name)
  }

  unregister(name) {
    return this.services.delete(name)
  }

  list() {
    return Array.from(this.services.entries()).map(([name, info]) => ({
      name,
      options: info.options,
      registeredAt: info.registeredAt
    }))
  }

  count() {
    return this.services.size
  }
}

// Singleton
let registryInstance = null

export function getRegistry() {
  if (!registryInstance) {
    registryInstance = new ServiceRegistry()
  }
  return registryInstance
}

export function loadRegistry() {
  return getRegistry()
}

import type { EffectsCtx } from '../context'

import { PingPongBuffer } from '../utils/ping-pong'

export interface Filter<O = any> {
  options?: O

  render(): Filter
  destroy(): void
  updateOptions(options: O): Filter
}

export interface FilterConstructor {
  new (ctx: EffectsCtx): Filter
  preset?: any
}

export class FilterManager {
  private filters: Map<FilterConstructor, Filter> = new Map()
  private readonly filterCache = new Map<FilterConstructor, Filter>()
  private readonly pingPongBuffer = new PingPongBuffer(this.ctx.gl)

  constructor(private readonly ctx: EffectsCtx) {}

  get size() {
    return this.filters.size
  }

  add(filterClass: FilterConstructor) {
    let filter = this.filterCache.get(filterClass)
    if (!filter) {
      filter = new filterClass(this.ctx)
      this.filterCache.set(filterClass, filter)
    }
    this.filters.set(filterClass, filter)

    return this
  }

  remove(filterClass: FilterConstructor, destroy = false) {
    if (this.filters.has(filterClass)) {
      this.filters.delete(filterClass)
      if (destroy) {
        this.filterCache.get(filterClass)?.destroy()
        this.filterCache.delete(filterClass)
      }
    }

    return this
  }

  get(filterClass: FilterConstructor) {
    return this.filters.get(filterClass)
  }

  getAll() {
    return this.filters
  }

  updateOptions<T extends FilterConstructor>(
    filterClass: T,
    options: InstanceType<T>['options']
  ) {
    const filter = this.filters.get(filterClass)
    if (filter) {
      filter.updateOptions(options)
    }
    return this
  }

  applyAll(texture: WebGLTexture) {
    const {
      ctx: { gl },
      pingPongBuffer,
      filters
    } = this

    if (filters.size === 0) {
      return texture
    }

    for (const filter of filters.values()) {
      gl.bindFramebuffer(
        WebGLRenderingContext.FRAMEBUFFER,
        pingPongBuffer.current.framebuffer
      )

      gl.activeTexture(WebGLRenderingContext.TEXTURE0)
      gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture)

      filter.render()

      texture = pingPongBuffer.current.texture
      pingPongBuffer.swap()
    }

    gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null)

    return texture
  }

  destroy(): void {
    this.filters.clear()

    this.filterCache.forEach((filter) => filter.destroy())
    this.filterCache.clear()

    this.pingPongBuffer.destroy()
  }
}

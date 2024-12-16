import type { EffectsCtx } from '../context'

import { mergeOptions } from '../utils/merge'

export class Renderer {
  // unit: number = 0

  constructor(
    protected readonly ctx: EffectsCtx,
    protected readonly program: WebGLProgram
  ) {}

  // sampler(name: string) {
  //   this.ctx.useProgram(this.program)
  //   this.ctx.gl.uniform1i(this.getUniformLocation(name), this.unit)
  // }

  // uniform() {}

  protected useProgram() {
    this.ctx.useProgram(this.program)
  }

  protected mergeOptions(source: any, overrides: any) {
    return mergeOptions(source, overrides, true)
  }

  protected getUniformLocation(name: string) {
    return this.ctx.gl.getUniformLocation(this.program, name)
  }

  destroy() {
    this.ctx.gl.deleteProgram(this.program)
  }
}

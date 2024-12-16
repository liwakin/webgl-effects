import greenScreenFrag from '../shader/green-screen.frag'

import type { Filter } from './manager'
import type { EffectsCtx } from '../context'

import { Renderer } from '../renderer/renderer'

export interface GreenScreenFilterOptions {
  /**
   * Cutoff value (0.0 to 1.0)
   *
   * @default 0.3
   */
  cutoff: number

  /**
   * Screen color index
   *
   * @description 0: red, 1: green, 2: blue
   *
   * @default 1
   */
  colorIndex: number
}

export class GreenScreenFilter extends Renderer implements Filter {
  static preset: GreenScreenFilterOptions = {
    cutoff: 0.3,
    colorIndex: 1
  }

  readonly options: GreenScreenFilterOptions = {
    ...GreenScreenFilter.preset
  }

  readonly sampler: WebGLUniformLocation = this.getUniformLocation('u_sampler')!

  private readonly uniforms: Record<
    keyof GreenScreenFilterOptions,
    WebGLUniformLocation
  > = {
    cutoff: this.getUniformLocation('u_cutoff')!,
    colorIndex: this.getUniformLocation('u_colorIndex')!
  }

  constructor(readonly ctx: EffectsCtx) {
    const program = ctx.createProgram(
      ctx.vertShader,
      ctx.createShader(WebGLRenderingContext.FRAGMENT_SHADER, greenScreenFrag)
    )

    super(ctx, program)
  }

  updateOptions(options: Partial<GreenScreenFilterOptions>) {
    this.mergeOptions(this.options, options)
    return this
  }

  render() {
    const { uniforms, options, ctx, sampler } = this

    this.useProgram()

    ctx.gl.uniform1i(sampler, 0)
    ctx.gl.uniform1i(uniforms.colorIndex, options.colorIndex)
    ctx.gl.uniform1f(uniforms.cutoff, options.cutoff)

    ctx.draw()

    return this
  }

  destroy() {
    this.ctx.gl.deleteProgram(this.program)
  }
}

import retroGraphicsFrag from '../shader/retro-graphics.frag'

import type { Filter } from './manager'
import type { EffectsCtx } from '../context'

import { Renderer } from '../renderer/renderer'

export interface RetroGraphicsFilterOptions {
  /**
   * Pixelation level (5 to 15)
   *
   * @default 10
   */
  pixelation: number

  /**
   * Color palette
   *
   * @description 0: original, 1: 8-bit, 2: retro-handheld-green
   *
   * @default 0
   */
  colorPalette: number
}

export class RetroGraphicsFilter extends Renderer implements Filter {
  static preset: RetroGraphicsFilterOptions = {
    pixelation: 10,
    colorPalette: 0
  }

  readonly options: RetroGraphicsFilterOptions = {
    ...RetroGraphicsFilter.preset
  }

  readonly sampler: WebGLUniformLocation = this.getUniformLocation('u_texture')!

  private readonly uniforms: Record<
    keyof RetroGraphicsFilterOptions,
    WebGLUniformLocation
  > = {
    pixelation: this.getUniformLocation('u_pixelation')!,
    colorPalette: this.getUniformLocation('u_colorPalette')!
  }

  constructor(readonly ctx: EffectsCtx) {
    const program = ctx.createProgram(
      ctx.vertShader,
      ctx.createShader(WebGLRenderingContext.FRAGMENT_SHADER, retroGraphicsFrag)
    )

    super(ctx, program)
  }

  updateOptions(options: Partial<RetroGraphicsFilterOptions>) {
    this.mergeOptions(this.options, options)
    return this
  }

  render() {
    const { uniforms, options, ctx, sampler } = this

    this.useProgram()

    ctx.gl.uniform1i(sampler, 0)
    ctx.gl.uniform1i(uniforms.colorPalette, options.colorPalette)
    ctx.gl.uniform1f(uniforms.pixelation, options.pixelation)

    ctx.draw()
    return this
  }

  destroy() {
    this.ctx.gl.deleteProgram(this.program)
  }
}

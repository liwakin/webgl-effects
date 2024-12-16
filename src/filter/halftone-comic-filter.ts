import greenScreenFrag from '../shader/green-screen.frag'

import type { Filter } from './manager'
import type { EffectsCtx } from '../context'

import { CompositeRenderer } from '../renderer/composite-renderer'

// NOTE: Not implemented!

export interface HalftoneComicFilterOptions {
  /**
   * 0.0 to 1.0
   *
   * @default 0.5
   */
  halftoneIntensity: number
}

export class HalftoneComicFilter extends CompositeRenderer implements Filter {
  static preset: HalftoneComicFilterOptions = {
    halftoneIntensity: 0.5
  }

  readonly options: HalftoneComicFilterOptions = {
    ...HalftoneComicFilter.preset
  }

  readonly sampler: WebGLUniformLocation = this.getUniformLocation('u_sampler')!

  private readonly uniforms: Record<
    keyof HalftoneComicFilterOptions,
    WebGLUniformLocation
  > = {
    halftoneIntensity: this.getUniformLocation('u_halftoneIntensity')!
  }

  constructor(readonly ctx: EffectsCtx) {
    throw new Error('Not implemented')

    const program = ctx.createProgram(
      ctx.vertShader,
      ctx.createShader(WebGLRenderingContext.FRAGMENT_SHADER, greenScreenFrag)
    )

    super(ctx, program)
  }

  updateOptions(options: Partial<HalftoneComicFilterOptions>) {
    this.mergeOptions(this.options, options)
    return this
  }

  render() {
    const { uniforms, options, ctx, sampler } = this

    this.useProgram()

    ctx.gl.uniform1i(sampler, 0)
    ctx.gl.uniform1f(uniforms.halftoneIntensity, options.halftoneIntensity)

    ctx.draw()

    return this
  }

  destroy() {
    this.ctx.gl.deleteProgram(this.program)
  }
}

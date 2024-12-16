import colorBalanceFrag from '../shader/color-balance.frag'

import type { Filter } from './manager'
import type { EffectsCtx } from '../context'

import { Renderer } from '../renderer/renderer'

export interface ColorBalanceFilterOptions {
  /**
   * -1.0 to 1.0
   *
   * @default 0
   */
  exposure: number

  /**
   * -1.0 to 1.0
   *
   * @default 0
   */
  saturation: number

  /**
   * -1.0 to 1.0
   *
   * @default 0
   */
  temperature: number

  /**
   * -1.0 to 1.0
   *
   * @default 0
   */
  contrast: number
}

export class ColorBalanceFilter extends Renderer implements Filter {
  static preset: ColorBalanceFilterOptions = {
    exposure: 0,
    saturation: 0,
    temperature: 0,
    contrast: 0
  }

  readonly options: ColorBalanceFilterOptions = {
    ...ColorBalanceFilter.preset
  }

  readonly sampler: WebGLUniformLocation = this.getUniformLocation('u_sampler')!

  private readonly uniforms: Record<
    keyof ColorBalanceFilterOptions,
    WebGLUniformLocation
  > = {
    exposure: this.getUniformLocation('u_exposure')!,
    saturation: this.getUniformLocation('u_saturation')!,
    temperature: this.getUniformLocation('u_temperature')!,
    contrast: this.getUniformLocation('u_contrast')!
  }

  constructor(readonly ctx: EffectsCtx) {
    const program = ctx.createProgram(
      ctx.vertShader,
      ctx.createShader(WebGLRenderingContext.FRAGMENT_SHADER, colorBalanceFrag)
    )

    super(ctx, program)
  }

  updateOptions(options: Partial<ColorBalanceFilterOptions>) {
    this.mergeOptions(this.options, options)
    return this
  }

  render() {
    const { uniforms, options, ctx, sampler } = this

    this.useProgram()

    ctx.gl.uniform1i(sampler, 0)
    ctx.gl.uniform1f(uniforms.exposure, options.exposure)
    ctx.gl.uniform1f(uniforms.saturation, options.saturation)
    ctx.gl.uniform1f(uniforms.temperature, options.temperature)
    ctx.gl.uniform1f(uniforms.contrast, options.contrast)

    ctx.draw()

    return this
  }

  destroy() {
    this.ctx.gl.deleteProgram(this.program)
  }
}

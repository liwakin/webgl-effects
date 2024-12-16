import simpleVert from '../shader/simple.vert'
import simpleFrag from '../shader/simple.frag'

// import { PerformanceMonitor } from '../performance/performance'
import { FilterManager } from '../filter/manager'
import {
  createAndSetupTexture,
  createShader,
  createProgram,
  updateTexture,
  createBuffer,
  setupVertexAttribPointer
} from '../utils/gl-helper'

export class EffectsCtx {
  readonly vertShader: WebGLShader = this.createShader(
    WebGLRenderingContext.VERTEX_SHADER,
    simpleVert
  )
  private readonly program: WebGLProgram = this.createProgram(
    this.vertShader,
    this.createShader(WebGLRenderingContext.FRAGMENT_SHADER, simpleFrag)
  )
  private readonly texture: WebGLTexture = createAndSetupTexture(
    this.gl,
    new Uint8Array([0, 0, 0, 255]) // black
  )
  private readonly buffers: {
    position: WebGLBuffer
    textureCoord: WebGLBuffer
  } = {
    position: this.createPositionBuffer(this.gl),
    textureCoord: this.createTextureCoordBuffer(this.gl)
  }
  private readonly attributes: {
    position: number
    texCoord: number
  } = {
    position: this.gl.getAttribLocation(this.program, 'a_position'),
    texCoord: this.gl.getAttribLocation(this.program, 'a_texCoord')
  }
  // readonly fpsPerf = new PerformanceMonitor()
  readonly filter = new FilterManager(this)

  constructor(readonly gl: WebGLRenderingContext) {
    gl.enable(WebGLRenderingContext.BLEND)
    gl.blendEquation(WebGLRenderingContext.FUNC_ADD)
    gl.blendFunc(
      WebGLRenderingContext.ONE,
      WebGLRenderingContext.ONE_MINUS_SRC_ALPHA
    )
    gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, true)
  }

  private createPositionBuffer(gl: WebGLRenderingContext) {
    return createBuffer(
      gl,
      new Float32Array([
        // left top
        -1.0, 1.0,
        // right top
        1.0, 1.0,
        // left bottom
        -1.0, -1.0,
        // right bottom
        1.0, -1.0
      ])
    )
  }

  private createTextureCoordBuffer(gl: WebGLRenderingContext) {
    return createBuffer(
      gl,
      new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0])
    )
  }

  createProgram(vertShader: WebGLShader, fragShader: WebGLShader) {
    return createProgram(this.gl, vertShader, fragShader)
  }

  createShader(type: GLenum, source: string) {
    return createShader(this.gl, type, source)
  }

  useProgram(program: WebGLProgram) {
    this.gl.useProgram(program)
  }

  draw() {
    this.gl.drawArrays(WebGLRenderingContext.TRIANGLE_STRIP, 0, 4)
  }

  render(source: TexImageSource) {
    // this.fpsPerf.startFrame()

    const { gl, buffers, attributes, program, filter } = this
    const { width: canvasWidth, height: canvasHeight } = gl.canvas

    let { texture } = this

    updateTexture(gl, texture, source)

    gl.viewport(0, 0, canvasWidth, canvasHeight)

    gl.useProgram(program)

    setupVertexAttribPointer(gl, buffers.position, attributes.position)
    setupVertexAttribPointer(gl, buffers.textureCoord, attributes.texCoord)

    texture = filter.applyAll(texture)

    gl.useProgram(program)

    gl.activeTexture(WebGLRenderingContext.TEXTURE0)
    gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture)

    this.draw()

    // this.fpsPerf.endFrame()
    // console.log(this.fpsPerf.getMetrics())
  }

  destroy() {
    this.filter.destroy()
  }
}

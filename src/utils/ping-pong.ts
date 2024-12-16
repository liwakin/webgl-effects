import { createAndSetupTexture } from './gl-helper'

interface FrameBufferObject {
  framebuffer: WebGLFramebuffer
  texture: WebGLTexture
}

export class PingPongBuffer {
  private fboPing: FrameBufferObject
  private fboPong: FrameBufferObject
  private currentFbo: FrameBufferObject
  private nextFbo: FrameBufferObject

  constructor(private readonly gl: WebGLRenderingContext) {
    this.fboPing = this.createFramebuffer()
    this.fboPong = this.createFramebuffer()
    this.currentFbo = this.fboPing
    this.nextFbo = this.fboPong
  }

  swap() {
    const temp = this.currentFbo
    this.currentFbo = this.nextFbo
    this.nextFbo = temp
  }

  get current() {
    return this.currentFbo
  }

  get next() {
    return this.nextFbo
  }

  private createFramebuffer(): FrameBufferObject {
    const { gl } = this

    const framebuffer = gl.createFramebuffer()
    const texture = createAndSetupTexture(gl)

    gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, framebuffer)

    gl.texImage2D(
      WebGLRenderingContext.TEXTURE_2D,
      0,
      WebGLRenderingContext.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      WebGLRenderingContext.RGBA,
      WebGLRenderingContext.UNSIGNED_BYTE,
      null
    )

    gl.framebufferTexture2D(
      WebGLRenderingContext.FRAMEBUFFER,
      WebGLRenderingContext.COLOR_ATTACHMENT0,
      WebGLRenderingContext.TEXTURE_2D,
      texture,
      0
    )

    gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null)
    gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, null)

    return { framebuffer, texture }
  }

  destroy() {
    const { gl, fboPing, fboPong } = this

    gl.deleteFramebuffer(fboPing.framebuffer)
    gl.deleteTexture(fboPing.texture)
    gl.deleteFramebuffer(fboPong.framebuffer)
    gl.deleteTexture(fboPong.texture)
  }
}

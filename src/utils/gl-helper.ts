export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const shaderProgram = gl.createProgram()
  if (!shaderProgram) {
    throw new Error('Failed to create shader program')
  }

  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)

  gl.linkProgram(shaderProgram)
  if (
    !gl.getProgramParameter(shaderProgram, WebGLRenderingContext.LINK_STATUS)
  ) {
    throw new Error(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    )
  }

  return shaderProgram
}

export function createShader(
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string
) {
  const shader = gl.createShader(type)
  if (!shader) {
    throw new Error('Failed to create shader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, WebGLRenderingContext.COMPILE_STATUS)) {
    throw new Error(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    )
  }
  return shader
}

export function createAndSetupTexture(
  gl: WebGLRenderingContext,
  pixels?: ArrayBufferView | null,
  width = 1,
  height = 1
) {
  const texture = gl.createTexture()
  if (!texture) {
    throw new Error('Failed to create texture')
  }

  gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture)

  // Set up texture so we can render any size image and so we are
  // working with pixels.
  gl.texParameteri(
    WebGLRenderingContext.TEXTURE_2D,
    WebGLRenderingContext.TEXTURE_WRAP_S,
    WebGLRenderingContext.CLAMP_TO_EDGE
  )
  gl.texParameteri(
    WebGLRenderingContext.TEXTURE_2D,
    WebGLRenderingContext.TEXTURE_WRAP_T,
    WebGLRenderingContext.CLAMP_TO_EDGE
  )
  gl.texParameteri(
    WebGLRenderingContext.TEXTURE_2D,
    WebGLRenderingContext.TEXTURE_MIN_FILTER,
    WebGLRenderingContext.NEAREST
  )
  gl.texParameteri(
    WebGLRenderingContext.TEXTURE_2D,
    WebGLRenderingContext.TEXTURE_MAG_FILTER,
    WebGLRenderingContext.NEAREST
  )

  if (pixels !== undefined) {
    gl.texImage2D(
      WebGLRenderingContext.TEXTURE_2D,
      0, // level
      WebGLRenderingContext.RGBA,
      width,
      height,
      0, // border
      WebGLRenderingContext.RGBA,
      WebGLRenderingContext.UNSIGNED_BYTE,
      pixels
    )
  }

  return texture
}

export function updateTexture(
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  source: TexImageSource
) {
  gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    WebGLRenderingContext.RGBA,
    WebGLRenderingContext.RGBA,
    WebGLRenderingContext.UNSIGNED_BYTE,
    source
  )
}

export function setupVertexAttribPointer(
  gl: WebGLRenderingContext,
  buffer: WebGLBuffer,
  attributeLocation: GLenum
) {
  gl.enableVertexAttribArray(attributeLocation)
  gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(
    attributeLocation,
    2, // pull out 2 values per iteration
    WebGLRenderingContext.FLOAT, // the data in the buffer is 32bit floats
    false, // don't normalize
    0, // how many bytes to get from one set of values to the next
    0 // how many bytes inside the buffer to start from
  )
}

export function createBuffer(
  gl: WebGLRenderingContext,
  bufferData: Float32Array
) {
  const buffer = gl.createBuffer()
  if (!buffer) {
    throw new Error('Failed to create vertex buffer')
  }
  gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, buffer)
  gl.bufferData(
    WebGLRenderingContext.ARRAY_BUFFER,
    bufferData,
    WebGLRenderingContext.STATIC_DRAW
  )
  return buffer
}

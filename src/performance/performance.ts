export class PerformanceMonitor {
  private frameTimeHistory: number[] = []
  private lastFrameStart: number = 0
  private readonly historySize = 30
  private readonly MAX_FPS = 120
  private readonly MIN_FPS = 1

  startFrame() {
    this.lastFrameStart = performance.now()
  }

  endFrame() {
    const frameTime = performance.now() - this.lastFrameStart
    this.frameTimeHistory.push(frameTime)

    if (this.frameTimeHistory.length > this.historySize) {
      this.frameTimeHistory.shift()
    }
  }

  getMetrics() {
    if (this.frameTimeHistory.length === 0) {
      return { fps: 0, frameTime: 0, avgFrameTime: 0 }
    }

    const avgFrameTime =
      this.frameTimeHistory.reduce((a, b) => a + b, 0) /
      this.frameTimeHistory.length
    const lastFrameTime =
      this.frameTimeHistory[this.frameTimeHistory.length - 1]

    const fps = Math.min(
      this.MAX_FPS,
      Math.max(this.MIN_FPS, Math.round(1000 / avgFrameTime))
    )

    return {
      fps, // frames per second
      frameTime: Number(lastFrameTime.toFixed(2)), // ms
      avgFrameTime: Number(avgFrameTime.toFixed(2)) // ms
    }
  }

  reset(): void {
    this.frameTimeHistory = []
    this.lastFrameStart = 0
  }
}

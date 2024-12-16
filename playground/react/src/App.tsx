import './App.css'

import { useRef, useState, useEffect } from 'react'
import { EffectsCtx } from 'webgl-effects'

import { Filfers } from './Filters'
import { useVideo } from './video'

const App = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [effectsCtx, setEffectsCtx] = useState<EffectsCtx | null>(null)

  const video = useVideo()

  useEffect(() => {
    if (!video || !effectsCtx) return

    video.requestVideoFrameCallback(function loop() {
      if (!video) return

      effectsCtx.render(video)
      video.requestVideoFrameCallback(loop)
    })
  }, [effectsCtx])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('webgl')
    if (!ctx) {
      throw new Error('Failed to get WebGL context')
    }

    const effectsCtx = new EffectsCtx(ctx)
    setEffectsCtx(effectsCtx)

    return () => {
      effectsCtx.destroy()
    }
  }, [canvasRef.current])

  useEffect(() => {
    return () => {
      if (effectsCtx) {
        effectsCtx.destroy()
      }
    }
  }, [])

  return (
    <div className="app">
      <canvas ref={canvasRef} width="720" height="480"></canvas>

      <Filfers effectsCtx={effectsCtx} />
    </div>
  )
}

export default App

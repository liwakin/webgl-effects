<script setup lang="ts">
import { shallowRef, onMounted, onUnmounted } from 'vue'
import { EffectsCtx } from 'webgl-effects'

import Filters from './Filters.vue'
import { createVideo } from '../../common/video'

const canvasRef = shallowRef<HTMLCanvasElement | null>(null)

const video = shallowRef<HTMLVideoElement>(createVideo())
const effectsCtx = shallowRef<EffectsCtx>()

video.value.requestVideoFrameCallback(function loop() {
  if (!effectsCtx.value) return

  effectsCtx.value.render(video.value)

  video.value.requestVideoFrameCallback(loop)
})

const init = () => {
  const canvas = canvasRef.value
  const videoEl = video.value

  if (!canvas || !videoEl) return

  const ctx = canvas.getContext('webgl')
  if (!ctx) {
    throw new Error('WebGL not supported')
  }

  effectsCtx.value = new EffectsCtx(ctx)
}

const cleanup = () => {
  if (video.value) {
    video.value.pause()
    video.value.src = ''
    video.value = null!
  }
}

onMounted(() => init())
onUnmounted(() => cleanup())
</script>

<template>
  <div class="app">
    <canvas ref="canvasRef" width="720" height="480"></canvas>

    <Filters :effectsCtx />
  </div>
</template>

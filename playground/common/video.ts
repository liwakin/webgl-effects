import testMp4 from './test.mp4'

export function createVideo() {
  const video = document.createElement('video')
  video.src = testMp4
  video.autoplay = true
  video.loop = true
  video.muted = true

  video.play()

  return video
}

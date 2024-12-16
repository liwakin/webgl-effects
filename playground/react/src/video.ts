import { useEffect, useRef } from 'react'

import { createVideo } from '../../common/video'

export function useVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    videoRef.current = createVideo()

    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
        videoRef.current = null!
      }
    }
  }, [])

  return videoRef.current
}

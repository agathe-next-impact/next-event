"use client"

import { useEffect, useState } from "react"
import AnimatedCursor from "react-animated-cursor"

export default function AnimatedCursorWrapper() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Détecte si l'appareil est tactile
    const hasTouchScreen = 
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches

    setIsTouchDevice(hasTouchScreen)
  }, [])

  // Ne pas afficher le curseur sur les appareils tactiles
  if (isTouchDevice) {
    return null
  }

  return (
    <AnimatedCursor
      innerSize={8}
      outerSize={15}
      color="255, 219, 0"
      outerAlpha={0.2}
      innerScale={0.7}
      outerScale={5}
      trailingSpeed={5}
      showSystemCursor={false}
      clickables={[
        "a",
        "button",
        ".cursor-pointer",
        ".cursor-default",
        ".cursor-move",
        ".cursor-grab",
      ]}
    />
  )
}

"use client"

import dynamic from "next/dynamic"
import { useIsMobile } from "@/hooks/use-mobile"

const AnimatedCursor = dynamic(() => import("react-animated-cursor"), { 
  ssr: false,
  loading: () => null,
})

export default function AnimatedCursorWrapper() {
  const isMobile = useIsMobile()

  // Désactiver le curseur animé sur mobile
  if (isMobile) {
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

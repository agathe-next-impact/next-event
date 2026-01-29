"use client"

import { BeatLoader } from "react-spinners"

export default function Loading() {
  return (
    <div className="min-h-screen overflow-y-scroll flex flex-col items-center justify-center">
      <BeatLoader color="hsl(51.53, 100%, 50%)" size={15} />
    </div>
  )
}

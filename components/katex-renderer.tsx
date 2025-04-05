"use client"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface KaTeXProps {
  latex: string
  displayMode?: boolean
}

export default function KaTeX({ latex, displayMode = true }: KaTeXProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode: displayMode,
          throwOnError: false,
          errorColor: "#f44336",
          macros: {
            "\\f": "f(#1)",
          },
          trust: true,
          strict: false,
        })
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        if (containerRef.current) {
          containerRef.current.innerHTML = `<span style="color: #f44336;">Error rendering formula: ${error}</span>`
        }
      }
    }
  }, [latex, displayMode])

  return <div ref={containerRef} className="overflow-x-auto max-w-full" />
}


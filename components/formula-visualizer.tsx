"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZoomIn, ZoomOut, Play, Pause } from "lucide-react"

interface FormulaVisualizerProps {
  latex: string
}

export default function FormulaVisualizer({ latex }: FormulaVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [visualizationType, setVisualizationType] = useState("3d-surface")
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const animationRef = useRef<number | null>(null)

  // Parse the LaTeX to determine what to visualize
  useEffect(() => {
    setError(null)

    try {
      // This is a simplified parser for demonstration
      // In a real implementation, you would use a proper LaTeX parser
      if (latex.includes("\\sum") || latex.includes("\\int")) {
        setVisualizationType("3d-surface")
      } else if (latex.includes("\\vec") || latex.includes("\\nabla")) {
        setVisualizationType("vector-field")
      } else if (latex.includes("\\sin") || latex.includes("\\cos")) {
        setVisualizationType("wave")
      } else {
        setVisualizationType("3d-surface")
      }
    } catch (err) {
      setError("Could not parse formula for visualization")
    }
  }, [latex])

  // Render the visualization
  useEffect(() => {
    if (!canvasRef.current || error) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Center point
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Animation function
    let angle = rotation
    const animate = () => {
      if (!ctx || !canvas) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update angle if animating
      if (isAnimating) {
        angle += 0.01 * animationSpeed
        if (angle > Math.PI * 2) angle -= Math.PI * 2
      } else {
        angle = rotation
      }

      // Draw base
      ctx.strokeStyle = "#8A2BE2"
      ctx.lineWidth = 2

      // Draw based on visualization type
      if (visualizationType === "3d-surface") {
        draw3DSurface(ctx, centerX, centerY, angle, zoom)
      } else if (visualizationType === "vector-field") {
        drawVectorField(ctx, centerX, centerY, angle, zoom)
      } else if (visualizationType === "wave") {
        drawWave(ctx, centerX, centerY, angle, zoom)
      }

      // Continue animation
      if (isAnimating) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [visualizationType, zoom, rotation, isAnimating, animationSpeed, error])

  // Drawing functions
  const draw3DSurface = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    angle: number,
    zoom: number,
  ) => {
    const size = Math.min(centerX, centerY) * 0.8 * zoom
    const resolution = 20
    const points: [number, number, number][][] = []

    // Generate 3D points for a surface (z = sin(x) * cos(y))
    for (let i = 0; i < resolution; i++) {
      points[i] = []
      for (let j = 0; j < resolution; j++) {
        const x = (i / resolution - 0.5) * 2
        const y = (j / resolution - 0.5) * 2
        const z = Math.sin(x * 3 + angle) * Math.cos(y * 3 + angle) * 0.5
        points[i][j] = [x, y, z]
      }
    }

    // Draw the surface
    for (let i = 0; i < resolution - 1; i++) {
      for (let j = 0; j < resolution - 1; j++) {
        const p1 = project3DPoint(points[i][j], angle, size)
        const p2 = project3DPoint(points[i + 1][j], angle, size)
        const p3 = project3DPoint(points[i + 1][j + 1], angle, size)
        const p4 = project3DPoint(points[i][j + 1], angle, size)

        // Calculate color based on height (z value)
        const z = (points[i][j][2] + 1) / 2 // Normalize to 0-1
        const hue = z * 270 // Purple spectrum
        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`

        // Draw lines
        ctx.beginPath()
        ctx.moveTo(centerX + p1[0], centerY + p1[1])
        ctx.lineTo(centerX + p2[0], centerY + p2[1])
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(centerX + p1[0], centerY + p1[1])
        ctx.lineTo(centerX + p4[0], centerY + p4[1])
        ctx.stroke()
      }
    }
  }

  const drawVectorField = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    angle: number,
    zoom: number,
  ) => {
    const size = Math.min(centerX, centerY) * 0.8 * zoom
    const resolution = 15

    // Draw vector field
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const x = (i / resolution - 0.5) * 2
        const y = (j / resolution - 0.5) * 2

        // Vector field formula (rotating field)
        const vx = -y * Math.cos(angle)
        const vy = x * Math.sin(angle)
        const length = Math.sqrt(vx * vx + vy * vy)

        // Calculate color based on vector length
        const hue = (length * 270) % 360 // Purple spectrum
        ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`

        // Draw vector
        const px = centerX + x * size
        const py = centerY + y * size
        const scale = (size / resolution) * 0.8

        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px + vx * scale, py + vy * scale)
        ctx.stroke()

        // Draw arrowhead
        const arrowSize = 3
        const arrowAngle = Math.atan2(vy, vx)
        ctx.beginPath()
        ctx.moveTo(px + vx * scale, py + vy * scale)
        ctx.lineTo(
          px + vx * scale - arrowSize * Math.cos(arrowAngle - Math.PI / 6),
          py + vy * scale - arrowSize * Math.sin(arrowAngle - Math.PI / 6),
        )
        ctx.lineTo(
          px + vx * scale - arrowSize * Math.cos(arrowAngle + Math.PI / 6),
          py + vy * scale - arrowSize * Math.sin(arrowAngle + Math.PI / 6),
        )
        ctx.closePath()
        ctx.fill()
      }
    }
  }

  const drawWave = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, angle: number, zoom: number) => {
    const width = ctx.canvas.width
    const height = ctx.canvas.height
    const amplitude = height * 0.2 * zoom

    // Draw sine wave
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const normalizedX = (x / width) * 10 * Math.PI
      const y = centerY + Math.sin(normalizedX + angle) * amplitude

      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()

    // Draw cosine wave
    ctx.strokeStyle = "rgba(138, 43, 226, 0.5)"
    ctx.beginPath()
    for (let x = 0; x < width; x++) {
      const normalizedX = (x / width) * 10 * Math.PI
      const y = centerY + Math.cos(normalizedX + angle) * amplitude

      if (x === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }
    ctx.stroke()
  }

  // Project 3D point to 2D
  const project3DPoint = (point: [number, number, number], angle: number, size: number): [number, number] => {
    const [x, y, z] = point

    // Rotate around Y axis
    const cosA = Math.cos(angle)
    const sinA = Math.sin(angle)
    const rotX = x * cosA - z * sinA
    const rotZ = z * cosA + x * sinA

    // Rotate around X axis
    const cosB = Math.cos(angle * 0.5)
    const sinB = Math.sin(angle * 0.5)
    const rotY = y * cosB - rotZ * sinB
    const finalZ = rotZ * cosB + y * sinB

    // Project to 2D with perspective
    const perspective = 4
    const factor = perspective / (perspective + finalZ)

    return [rotX * size * factor, rotY * size * factor]
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-purple-500/20 flex flex-wrap items-center justify-between gap-2">
        <Select value={visualizationType} onValueChange={setVisualizationType}>
          <SelectTrigger className="w-[180px] glass border-purple-500/30">
            <SelectValue placeholder="Visualization Type" />
          </SelectTrigger>
          <SelectContent className="glass border-purple-500/20">
            <SelectItem value="3d-surface">3D Surface</SelectItem>
            <SelectItem value="vector-field">Vector Field</SelectItem>
            <SelectItem value="wave">Wave Function</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-purple-500/30 hover:bg-purple-500/20"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <Slider
            value={[zoom]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => setZoom(value[0])}
            className="w-24"
          />

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-purple-500/30 hover:bg-purple-500/20"
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-purple-500/30 hover:bg-purple-500/20"
            onClick={() => setIsAnimating(!isAnimating)}
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Slider
            value={[animationSpeed]}
            min={0.5}
            max={3}
            step={0.5}
            onValueChange={(value) => setAnimationSpeed(value[0])}
            className="w-24"
          />
        </div>
      </div>

      <div className="flex-1 relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center text-destructive">{error}</div>
        ) : (
          <canvas ref={canvasRef} className="w-full h-full" style={{ background: "rgba(0, 0, 0, 0.05)" }} />
        )}
      </div>
    </div>
  )
}


"use client"

import { Button } from "@/components/ui/button"
import { Clock, Copy, ArrowUpRight } from "lucide-react"
import { useState } from "react"
import KaTeX from "./katex-renderer"

interface HistoryItem {
  id: number
  latex: string
  timestamp: string
}

interface FormulaHistoryProps {
  history: HistoryItem[]
  onSelect: (latex: string) => void
}

export default function FormulaHistory({ history, onSelect }: FormulaHistoryProps) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className="p-3">
      {history.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No history yet</div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-md hover:bg-purple-500/10 cursor-pointer group relative"
              onClick={() => onSelect(item.latex)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.timestamp}
                </div>

                <div
                  className={`flex items-center gap-1 ${hoveredItem === item.id ? "opacity-100" : "opacity-0"} transition-opacity`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(item.latex)
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="text-xs font-mono text-muted-foreground mb-1 truncate">{item.latex}</div>

              <div className="bg-white dark:bg-gray-800 rounded p-2 flex items-center justify-center">
                <KaTeX latex={item.latex} displayMode={false} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


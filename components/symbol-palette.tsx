"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SymbolPaletteProps {
  onSymbolClick: (symbol: string) => void
}

export default function SymbolPalette({ onSymbolClick }: SymbolPaletteProps) {
  const [activeCategory, setActiveCategory] = useState("basic")
  const [searchQuery, setSearchQuery] = useState("")

  const symbolCategories = {
    basic: [
      { symbol: "+", latex: "+", description: "Addition" },
      { symbol: "-", latex: "-", description: "Subtraction" },
      { symbol: "×", latex: "\\times", description: "Multiplication" },
      { symbol: "÷", latex: "\\div", description: "Division" },
      { symbol: "=", latex: "=", description: "Equals" },
      { symbol: "≠", latex: "\\neq", description: "Not Equal" },
      { symbol: "<", latex: "<", description: "Less Than" },
      { symbol: ">", latex: ">", description: "Greater Than" },
      { symbol: "≤", latex: "\\leq", description: "Less Than or Equal" },
      { symbol: "≥", latex: "\\geq", description: "Greater Than or Equal" },
      { symbol: "±", latex: "\\pm", description: "Plus-Minus" },
      { symbol: "∓", latex: "\\mp", description: "Minus-Plus" },
      { symbol: "≈", latex: "\\approx", description: "Approximately Equal" },
      { symbol: "≡", latex: "\\equiv", description: "Equivalent" },
      { symbol: "≅", latex: "\\cong", description: "Congruent" },
      { symbol: "∝", latex: "\\propto", description: "Proportional To" },
    ],
    greek: [
      { symbol: "α", latex: "\\alpha", description: "Alpha" },
      { symbol: "β", latex: "\\beta", description: "Beta" },
      { symbol: "γ", latex: "\\gamma", description: "Gamma" },
      { symbol: "Γ", latex: "\\Gamma", description: "Capital Gamma" },
      { symbol: "δ", latex: "\\delta", description: "Delta" },
      { symbol: "Δ", latex: "\\Delta", description: "Capital Delta" },
      { symbol: "ε", latex: "\\varepsilon", description: "Epsilon" },
      { symbol: "θ", latex: "\\theta", description: "Theta" },
      { symbol: "λ", latex: "\\lambda", description: "Lambda" },
      { symbol: "μ", latex: "\\mu", description: "Mu" },
      { symbol: "π", latex: "\\pi", description: "Pi" },
      { symbol: "Π", latex: "\\Pi", description: "Capital Pi" },
      { symbol: "σ", latex: "\\sigma", description: "Sigma" },
      { symbol: "Σ", latex: "\\Sigma", description: "Capital Sigma" },
      { symbol: "τ", latex: "\\tau", description: "Tau" },
      { symbol: "φ", latex: "\\phi", description: "Phi" },
      { symbol: "Φ", latex: "\\Phi", description: "Capital Phi" },
      { symbol: "ω", latex: "\\omega", description: "Omega" },
      { symbol: "Ω", latex: "\\Omega", description: "Capital Omega" },
    ],
    operators: [
      { symbol: "∑", latex: "\\sum_{i=1}^{n}", description: "Summation" },
      { symbol: "∏", latex: "\\prod_{i=1}^{n}", description: "Product" },
      { symbol: "∫", latex: "\\int_{a}^{b}", description: "Integral" },
      { symbol: "∮", latex: "\\oint", description: "Contour Integral" },
      { symbol: "∂", latex: "\\partial", description: "Partial Derivative" },
      { symbol: "∇", latex: "\\nabla", description: "Nabla/Del Operator" },
      { symbol: "∞", latex: "\\infty", description: "Infinity" },
      { symbol: "lim", latex: "\\lim_{x \\to \\infty}", description: "Limit" },
      { symbol: "∫∫", latex: "\\iint", description: "Double Integral" },
      { symbol: "∫∫∫", latex: "\\iiint", description: "Triple Integral" },
      { symbol: "∮∮", latex: "\\oiint", description: "Double Contour Integral" },
      { symbol: "∯", latex: "\\oiiint", description: "Triple Contour Integral" },
    ],
    structures: [
      { symbol: "frac", latex: "\\frac{a}{b}", description: "Fraction" },
      { symbol: "sqrt", latex: "\\sqrt{x}", description: "Square Root" },
      { symbol: "^", latex: "^{}", description: "Superscript" },
      { symbol: "_", latex: "_{}", description: "Subscript" },
      { symbol: "vec", latex: "\\vec{v}", description: "Vector" },
      { symbol: "hat", latex: "\\hat{x}", description: "Hat" },
      { symbol: "bar", latex: "\\bar{x}", description: "Bar" },
      { symbol: "matrix", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", description: "Matrix" },
      {
        symbol: "cases",
        latex: "\\begin{cases} f(x) & \\text{if } x > 0 \\\\ g(x) & \\text{if } x < 0 \\end{cases}",
        description: "Cases",
      },
      { symbol: "align", latex: "\\begin{align} a &= b \\\\ c &= d \\end{align}", description: "Align" },
    ],
    sets: [
      { symbol: "∈", latex: "\\in", description: "Element Of" },
      { symbol: "∉", latex: "\\notin", description: "Not Element Of" },
      { symbol: "⊂", latex: "\\subset", description: "Subset" },
      { symbol: "⊆", latex: "\\subseteq", description: "Subset or Equal" },
      { symbol: "⊃", latex: "\\supset", description: "Superset" },
      { symbol: "⊇", latex: "\\supseteq", description: "Superset or Equal" },
      { symbol: "∪", latex: "\\cup", description: "Union" },
      { symbol: "∩", latex: "\\cap", description: "Intersection" },
      { symbol: "∅", latex: "\\emptyset", description: "Empty Set" },
      { symbol: "ℝ", latex: "\\mathbb{R}", description: "Real Numbers" },
      { symbol: "ℕ", latex: "\\mathbb{N}", description: "Natural Numbers" },
      { symbol: "ℤ", latex: "\\mathbb{Z}", description: "Integers" },
      { symbol: "ℚ", latex: "\\mathbb{Q}", description: "Rational Numbers" },
      { symbol: "ℂ", latex: "\\mathbb{C}", description: "Complex Numbers" },
      { symbol: "∀", latex: "\\forall", description: "For All" },
      { symbol: "∃", latex: "\\exists", description: "There Exists" },
      { symbol: "∄", latex: "\\nexists", description: "There Does Not Exist" },
    ],
    arrows: [
      { symbol: "→", latex: "\\rightarrow", description: "Right Arrow" },
      { symbol: "←", latex: "\\leftarrow", description: "Left Arrow" },
      { symbol: "↑", latex: "\\uparrow", description: "Up Arrow" },
      { symbol: "↓", latex: "\\downarrow", description: "Down Arrow" },
      { symbol: "↔", latex: "\\leftrightarrow", description: "Left-Right Arrow" },
      { symbol: "⇒", latex: "\\Rightarrow", description: "Right Double Arrow" },
      { symbol: "⇐", latex: "\\Leftarrow", description: "Left Double Arrow" },
      { symbol: "⇔", latex: "\\Leftrightarrow", description: "Left-Right Double Arrow" },
      { symbol: "↦", latex: "\\mapsto", description: "Maps To" },
      { symbol: "⟼", latex: "\\longmapsto", description: "Long Maps To" },
    ],
    physics: [
      { symbol: "ħ", latex: "\\hbar", description: "Reduced Planck Constant" },
      { symbol: "∇", latex: "\\nabla", description: "Nabla/Del Operator" },
      { symbol: "∂", latex: "\\partial", description: "Partial Derivative" },
      { symbol: "∞", latex: "\\infty", description: "Infinity" },
      { symbol: "°", latex: "^{\\circ}", description: "Degree" },
      { symbol: "⟨ψ|", latex: "\\langle \\psi |", description: "Bra" },
      { symbol: "|ψ⟩", latex: "| \\psi \\rangle", description: "Ket" },
      { symbol: "⟨ψ|ψ⟩", latex: "\\langle \\psi | \\psi \\rangle", description: "Braket" },
      { symbol: "×", latex: "\\times", description: "Cross Product" },
      { symbol: "·", latex: "\\cdot", description: "Dot Product" },
      { symbol: "⊗", latex: "\\otimes", description: "Tensor Product" },
    ],
  }

  // Filter symbols based on search query
  const filteredSymbols = searchQuery
    ? Object.values(symbolCategories)
        .flat()
        .filter(
          (item) =>
            item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.latex.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()),
        )
    : symbolCategories[activeCategory as keyof typeof symbolCategories]

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search symbols..."
          className="pl-8 bg-background/10 border-purple-500/30 focus-visible:ring-purple-500/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!searchQuery && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-7 mb-2 glass border-purple-500/30">
            <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600">
              Basic
            </TabsTrigger>
            <TabsTrigger value="greek" className="data-[state=active]:bg-purple-600">
              Greek
            </TabsTrigger>
            <TabsTrigger value="operators" className="data-[state=active]:bg-purple-600">
              Operators
            </TabsTrigger>
            <TabsTrigger value="structures" className="data-[state=active]:bg-purple-600">
              Structures
            </TabsTrigger>
            <TabsTrigger value="sets" className="data-[state=active]:bg-purple-600">
              Sets
            </TabsTrigger>
            <TabsTrigger value="arrows" className="data-[state=active]:bg-purple-600">
              Arrows
            </TabsTrigger>
            <TabsTrigger value="physics" className="data-[state=active]:bg-purple-600">
              Physics
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <ScrollArea className="h-[120px]">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 p-1">
          {filteredSymbols.map((item, index) => (
            <TooltipProvider key={index} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 font-mono tactile-button border-purple-500/30 hover:bg-purple-500/20"
                    onClick={() => onSymbolClick(item.latex)}
                  >
                    {item.symbol}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{item.description}</p>
                  <p className="font-mono text-xs text-muted-foreground">{item.latex}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}


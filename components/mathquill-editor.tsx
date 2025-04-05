"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface MathQuillEditorProps {
  latex: string
  onChange: (latex: string) => void
  fontSize?: number
}

export default function MathQuillEditor({ latex, onChange, fontSize = 18 }: MathQuillEditorProps) {
  const mathFieldRef = useRef<HTMLDivElement>(null)
  const [mathFieldInstance, setMathFieldInstance] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState("basic")

  // Categories of buttons for the visual editor
  const buttonCategories = {
    basic: [
      { label: "+", latex: "+", tooltip: "Addition" },
      { label: "-", latex: "-", tooltip: "Subtraction" },
      { label: "×", latex: "\\times", tooltip: "Multiplication" },
      { label: "÷", latex: "\\div", tooltip: "Division" },
      { label: "=", latex: "=", tooltip: "Equals" },
      { label: "≠", latex: "\\neq", tooltip: "Not Equal" },
      { label: "<", latex: "<", tooltip: "Less Than" },
      { label: ">", latex: ">", tooltip: "Greater Than" },
      { label: "≤", latex: "\\leq", tooltip: "Less Than or Equal" },
      { label: "≥", latex: "\\geq", tooltip: "Greater Than or Equal" },
      { label: "±", latex: "\\pm", tooltip: "Plus-Minus" },
      { label: "∓", latex: "\\mp", tooltip: "Minus-Plus" },
      { label: "≈", latex: "\\approx", tooltip: "Approximately Equal" },
      { label: "≡", latex: "\\equiv", tooltip: "Equivalent" },
      { label: "≅", latex: "\\cong", tooltip: "Congruent" },
      { label: "∝", latex: "\\propto", tooltip: "Proportional To" },
    ],
    fractions: [
      { label: "a/b", latex: "\\frac{a}{b}", tooltip: "Fraction" },
      { label: "∂/∂x", latex: "\\frac{\\partial}{\\partial x}", tooltip: "Partial Derivative" },
      { label: "dx/dy", latex: "\\frac{dx}{dy}", tooltip: "Derivative" },
      { label: "∆x/∆y", latex: "\\frac{\\Delta x}{\\Delta y}", tooltip: "Difference Quotient" },
      { label: "a÷b", latex: "a \\div b", tooltip: "Division" },
      { label: "a:b", latex: "a : b", tooltip: "Ratio" },
      { label: "binom", latex: "\\binom{n}{k}", tooltip: "Binomial Coefficient" },
      { label: "sfrac", latex: "{}^{a}/_{b}", tooltip: "Small Fraction" },
    ],
    exponents: [
      { label: "x²", latex: "x^2", tooltip: "Square" },
      { label: "x³", latex: "x^3", tooltip: "Cube" },
      { label: "x^n", latex: "x^{n}", tooltip: "Power" },
      { label: "e^x", latex: "e^{x}", tooltip: "Exponential" },
      { label: "10^x", latex: "10^{x}", tooltip: "Power of 10" },
      { label: "x_i", latex: "x_{i}", tooltip: "Subscript" },
      { label: "x_i^j", latex: "x_{i}^{j}", tooltip: "Subscript and Superscript" },
      { label: "x′", latex: "x'", tooltip: "Prime" },
      { label: "x″", latex: "x''", tooltip: "Double Prime" },
      { label: "x‴", latex: "x'''", tooltip: "Triple Prime" },
      { label: "x⁽ⁿ⁾", latex: "x^{(n)}", tooltip: "nth Derivative" },
      { label: "x̄", latex: "\\bar{x}", tooltip: "Bar" },
      { label: "x̂", latex: "\\hat{x}", tooltip: "Hat" },
      { label: "x̃", latex: "\\tilde{x}", tooltip: "Tilde" },
      { label: "x⃗", latex: "\\vec{x}", tooltip: "Vector" },
      { label: "x⃗", latex: "\\overrightarrow{AB}", tooltip: "Vector from A to B" },
    ],
    roots: [
      { label: "√", latex: "\\sqrt{x}", tooltip: "Square Root" },
      { label: "∛", latex: "\\sqrt[3]{x}", tooltip: "Cube Root" },
      { label: "∜", latex: "\\sqrt[4]{x}", tooltip: "Fourth Root" },
      { label: "ⁿ√", latex: "\\sqrt[n]{x}", tooltip: "nth Root" },
    ],
    calculus: [
      { label: "∫", latex: "\\int", tooltip: "Integral" },
      { label: "∫_a^b", latex: "\\int_{a}^{b}", tooltip: "Definite Integral" },
      { label: "∮", latex: "\\oint", tooltip: "Contour Integral" },
      { label: "∂/∂x", latex: "\\frac{\\partial}{\\partial x}", tooltip: "Partial Derivative" },
      { label: "∇", latex: "\\nabla", tooltip: "Nabla/Del Operator" },
      { label: "lim", latex: "\\lim_{x \\to \\infty}", tooltip: "Limit" },
      { label: "∑", latex: "\\sum_{i=1}^{n}", tooltip: "Summation" },
      { label: "∏", latex: "\\prod_{i=1}^{n}", tooltip: "Product" },
      { label: "d/dx", latex: "\\frac{d}{dx}", tooltip: "Derivative" },
      { label: "∆", latex: "\\Delta", tooltip: "Delta/Change" },
      { label: "∂", latex: "\\partial", tooltip: "Partial" },
      { label: "∇²", latex: "\\nabla^2", tooltip: "Laplacian" },
      { label: "∇⋅", latex: "\\nabla \\cdot", tooltip: "Divergence" },
      { label: "∇×", latex: "\\nabla \\times", tooltip: "Curl" },
      { label: "∫∫", latex: "\\iint", tooltip: "Double Integral" },
      { label: "∫∫∫", latex: "\\iiint", tooltip: "Triple Integral" },
    ],
    matrices: [
      { label: "2×2", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", tooltip: "2×2 Matrix" },
      {
        label: "3×3",
        latex: "\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}",
        tooltip: "3×3 Matrix",
      },
      { label: "det", latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}", tooltip: "Determinant" },
      { label: "bmat", latex: "\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}", tooltip: "Bracket Matrix" },
      { label: "Bmat", latex: "\\begin{Bmatrix} a & b \\\\ c & d \\end{Bmatrix}", tooltip: "Curly Bracket Matrix" },
      { label: "vmat", latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}", tooltip: "Vertical Line Matrix" },
      {
        label: "Vmat",
        latex: "\\begin{Vmatrix} a & b \\\\ c & d \\end{Vmatrix}",
        tooltip: "Double Vertical Line Matrix",
      },
      {
        label: "cases",
        latex: "\\begin{cases} f(x) & \\text{if } x > 0 \\\\ g(x) & \\text{if } x < 0 \\end{cases}",
        tooltip: "Cases",
      },
    ],
    greek: [
      { label: "α", latex: "\\alpha", tooltip: "Alpha" },
      { label: "β", latex: "\\beta", tooltip: "Beta" },
      { label: "γ", latex: "\\gamma", tooltip: "Gamma" },
      { label: "Γ", latex: "\\Gamma", tooltip: "Capital Gamma" },
      { label: "δ", latex: "\\delta", tooltip: "Delta" },
      { label: "Δ", latex: "\\Delta", tooltip: "Capital Delta" },
      { label: "ε", latex: "\\varepsilon", tooltip: "Epsilon" },
      { label: "ζ", latex: "\\zeta", tooltip: "Zeta" },
      { label: "η", latex: "\\eta", tooltip: "Eta" },
      { label: "θ", latex: "\\theta", tooltip: "Theta" },
      { label: "Θ", latex: "\\Theta", tooltip: "Capital Theta" },
      { label: "ι", latex: "\\iota", tooltip: "Iota" },
      { label: "κ", latex: "\\kappa", tooltip: "Kappa" },
      { label: "λ", latex: "\\lambda", tooltip: "Lambda" },
      { label: "Λ", latex: "\\Lambda", tooltip: "Capital Lambda" },
      { label: "μ", latex: "\\mu", tooltip: "Mu" },
      { label: "ν", latex: "\\nu", tooltip: "Nu" },
      { label: "ξ", latex: "\\xi", tooltip: "Xi" },
      { label: "Ξ", latex: "\\Xi", tooltip: "Capital Xi" },
      { label: "π", latex: "\\pi", tooltip: "Pi" },
      { label: "Π", latex: "\\Pi", tooltip: "Capital Pi" },
      { label: "ρ", latex: "\\rho", tooltip: "Rho" },
      { label: "σ", latex: "\\sigma", tooltip: "Sigma" },
      { label: "Σ", latex: "\\Sigma", tooltip: "Capital Sigma" },
      { label: "τ", latex: "\\tau", tooltip: "Tau" },
      { label: "φ", latex: "\\phi", tooltip: "Phi" },
      { label: "Φ", latex: "\\Phi", tooltip: "Capital Phi" },
      { label: "χ", latex: "\\chi", tooltip: "Chi" },
      { label: "ψ", latex: "\\psi", tooltip: "Psi" },
      { label: "Ψ", latex: "\\Psi", tooltip: "Capital Psi" },
      { label: "ω", latex: "\\omega", tooltip: "Omega" },
      { label: "Ω", latex: "\\Omega", tooltip: "Capital Omega" },
    ],
    sets: [
      { label: "∈", latex: "\\in", tooltip: "Element Of" },
      { label: "∉", latex: "\\notin", tooltip: "Not Element Of" },
      { label: "⊂", latex: "\\subset", tooltip: "Subset" },
      { label: "⊆", latex: "\\subseteq", tooltip: "Subset or Equal" },
      { label: "⊃", latex: "\\supset", tooltip: "Superset" },
      { label: "⊇", latex: "\\supseteq", tooltip: "Superset or Equal" },
      { label: "∪", latex: "\\cup", tooltip: "Union" },
      { label: "∩", latex: "\\cap", tooltip: "Intersection" },
      { label: "∅", latex: "\\emptyset", tooltip: "Empty Set" },
      { label: "ℝ", latex: "\\mathbb{R}", tooltip: "Real Numbers" },
      { label: "ℕ", latex: "\\mathbb{N}", tooltip: "Natural Numbers" },
      { label: "ℤ", latex: "\\mathbb{Z}", tooltip: "Integers" },
      { label: "ℚ", latex: "\\mathbb{Q}", tooltip: "Rational Numbers" },
      { label: "ℂ", latex: "\\mathbb{C}", tooltip: "Complex Numbers" },
      { label: "∀", latex: "\\forall", tooltip: "For All" },
      { label: "∃", latex: "\\exists", tooltip: "There Exists" },
      { label: "∄", latex: "\\nexists", tooltip: "There Does Not Exist" },
      { label: "⟹", latex: "\\Rightarrow", tooltip: "Implies" },
      { label: "⟺", latex: "\\Leftrightarrow", tooltip: "If and Only If" },
    ],
    physics: [
      { label: "ħ", latex: "\\hbar", tooltip: "Reduced Planck Constant" },
      { label: "∇", latex: "\\nabla", tooltip: "Nabla/Del Operator" },
      { label: "∂", latex: "\\partial", tooltip: "Partial Derivative" },
      { label: "∞", latex: "\\infty", tooltip: "Infinity" },
      { label: "°", latex: "^{\\circ}", tooltip: "Degree" },
      { label: "⟨ψ|", latex: "\\langle \\psi |", tooltip: "Bra" },
      { label: "|ψ⟩", latex: "| \\psi \\rangle", tooltip: "Ket" },
      { label: "⟨ψ|ψ⟩", latex: "\\langle \\psi | \\psi \\rangle", tooltip: "Braket" },
      { label: "×", latex: "\\times", tooltip: "Cross Product" },
      { label: "·", latex: "\\cdot", tooltip: "Dot Product" },
      { label: "⊗", latex: "\\otimes", tooltip: "Tensor Product" },
      { label: "±", latex: "\\pm", tooltip: "Plus-Minus" },
      { label: "∓", latex: "\\mp", tooltip: "Minus-Plus" },
    ],
    arrows: [
      { label: "→", latex: "\\rightarrow", tooltip: "Right Arrow" },
      { label: "←", latex: "\\leftarrow", tooltip: "Left Arrow" },
      { label: "↑", latex: "\\uparrow", tooltip: "Up Arrow" },
      { label: "↓", latex: "\\downarrow", tooltip: "Down Arrow" },
      { label: "↔", latex: "\\leftrightarrow", tooltip: "Left-Right Arrow" },
      { label: "⇒", latex: "\\Rightarrow", tooltip: "Right Double Arrow" },
      { label: "⇐", latex: "\\Leftarrow", tooltip: "Left Double Arrow" },
      { label: "⇔", latex: "\\Leftrightarrow", tooltip: "Left-Right Double Arrow" },
      { label: "↦", latex: "\\mapsto", tooltip: "Maps To" },
      { label: "⟼", latex: "\\longmapsto", tooltip: "Long Maps To" },
    ],
  }

  useEffect(() => {
    // Load MathQuill dynamically since it requires the window object
    const loadMathQuill = async () => {
      if (typeof window !== "undefined" && !loaded) {
        try {
          // Load MathQuill CSS
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css"
          document.head.appendChild(link)

          // Load jQuery (required by MathQuill)
          const jqueryScript = document.createElement("script")
          jqueryScript.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"
          jqueryScript.async = true
          document.body.appendChild(jqueryScript)

          jqueryScript.onload = () => {
            // Load MathQuill after jQuery
            const mathquillScript = document.createElement("script")
            mathquillScript.src = "https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js"
            mathquillScript.async = true
            document.body.appendChild(mathquillScript)

            mathquillScript.onload = () => {
              setLoaded(true)
              initMathQuill()
            }
          }
        } catch (error) {
          console.error("Error loading MathQuill:", error)
        }
      } else if (loaded) {
        initMathQuill()
      }
    }

    const initMathQuill = () => {
      if (typeof window !== "undefined" && loaded && mathFieldRef.current) {
        try {
          // @ts-ignore - MathQuill is loaded dynamically
          const MQ = window.MathQuill.getInterface(2)

          const mathField = MQ.MathField(mathFieldRef.current, {
            spaceBehavesLikeTab: true,
            handlers: {
              edit: () => {
                const newLatex = mathField.latex()
                onChange(newLatex)
              },
            },
          })

          setMathFieldInstance(mathField)

          // Set initial value
          if (latex) {
            mathField.latex(latex)
          }
        } catch (error) {
          console.error("Error initializing MathQuill:", error)
        }
      }
    }

    loadMathQuill()
  }, [loaded, latex, onChange])

  const insertSymbol = (latexSymbol: string) => {
    if (mathFieldInstance) {
      mathFieldInstance.write(latexSymbol)
      mathFieldInstance.focus()
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white dark:bg-gray-800 glass border-purple-500/20 neon-border">
        <div
          ref={mathFieldRef}
          className="min-h-[120px] flex items-center justify-center"
          style={{ fontSize: `${fontSize}px` }}
        >
          {!loaded && (
            <div className="text-muted-foreground flex items-center">
              <div className="animate-spin mr-2">
                <svg
                  className="h-5 w-5 text-purple-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              Loading MathQuill editor...
            </div>
          )}
        </div>
      </Card>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-2 glass border-purple-500/30">
          <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600">
            Basic
          </TabsTrigger>
          <TabsTrigger value="fractions" className="data-[state=active]:bg-purple-600">
            Fractions
          </TabsTrigger>
          <TabsTrigger value="exponents" className="data-[state=active]:bg-purple-600">
            Exponents
          </TabsTrigger>
          <TabsTrigger value="roots" className="data-[state=active]:bg-purple-600">
            Roots
          </TabsTrigger>
          <TabsTrigger value="calculus" className="data-[state=active]:bg-purple-600">
            Calculus
          </TabsTrigger>
          <TabsTrigger value="matrices" className="data-[state=active]:bg-purple-600">
            Matrices
          </TabsTrigger>
          <TabsTrigger value="greek" className="data-[state=active]:bg-purple-600">
            Greek
          </TabsTrigger>
          <TabsTrigger value="sets" className="data-[state=active]:bg-purple-600">
            Sets
          </TabsTrigger>
          <TabsTrigger value="physics" className="data-[state=active]:bg-purple-600">
            Physics
          </TabsTrigger>
          <TabsTrigger value="arrows" className="data-[state=active]:bg-purple-600">
            Arrows
          </TabsTrigger>
        </TabsList>

        {Object.entries(buttonCategories).map(([category, buttons]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <ScrollArea className="h-[180px]">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1 p-1">
                {buttons.map((button, index) => (
                  <TooltipProvider key={index} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 tactile-button border-purple-500/30 hover:bg-purple-500/20"
                          onClick={() => insertSymbol(button.latex)}
                        >
                          {button.label}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-mono text-xs">{button.tooltip}</p>
                        <p className="text-muted-foreground text-xs">{button.latex}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}


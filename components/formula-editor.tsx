"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Copy,
  Download,
  Maximize2,
  Check,
  Settings,
  Save,
  Share,
  Sparkles,
  Palette,
  BookOpen,
  Code,
  FileText,
  Image,
  Cpu,
  Braces,
  Layers,
  Eye,
  Moon,
  Sun,
  Bookmark,
  Trash2,
  RefreshCw,
  Search,
  Keyboard,
  Loader2,
  Pencil,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useTheme } from "next-themes"
import SymbolPalette from "./symbol-palette"
import MathQuillEditor from "./mathquill-editor"
import FormulaVisualizer from "./formula-visualizer"
import FormulaHistory from "./formula-history"
import KeyboardShortcuts from "./keyboard-shortcuts"
import dynamic from "next/dynamic"

// Dynamically import KaTeX to avoid SSR issues
const KaTeX = dynamic(() => import("./katex-renderer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      <span className="ml-2 text-purple-300">Rendering formula...</span>
    </div>
  ),
})

// Sample formulas for the library
const sampleFormulas = [
  {
    id: 1,
    name: "Quadratic Formula",
    latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
    category: "Algebra",
    favorite: true,
  },
  { id: 2, name: "Pythagorean Theorem", latex: "a^2 + b^2 = c^2", category: "Geometry", favorite: true },
  { id: 3, name: "Euler's Identity", latex: "e^{i\\pi} + 1 = 0", category: "Complex Analysis", favorite: true },
  {
    id: 4,
    name: "Gaussian Distribution",
    latex: "f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}}e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}",
    category: "Statistics",
    favorite: false,
  },
  {
    id: 5,
    name: "Maxwell's Equations",
    latex: "\\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\varepsilon_0}",
    category: "Physics",
    favorite: false,
  },
  {
    id: 6,
    name: "Einstein's Field Equations",
    latex: "G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}",
    category: "Physics",
    favorite: false,
  },
  {
    id: 7,
    name: "Schrödinger Equation",
    latex: "i\\hbar\\frac{\\partial}{\\partial t}\\Psi(\\mathbf{r},t) = \\hat{H}\\Psi(\\mathbf{r},t)",
    category: "Quantum Physics",
    favorite: false,
  },
  {
    id: 8,
    name: "Fourier Transform",
    latex: "F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}dt",
    category: "Analysis",
    favorite: false,
  },
  {
    id: 9,
    name: "Navier-Stokes Equation",
    latex:
      "\\rho\\left(\\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla \\mathbf{v}\\right) = -\\nabla p + \\nabla \\cdot \\mathbf{T} + \\mathbf{f}",
    category: "Fluid Dynamics",
    favorite: false,
  },
  {
    id: 10,
    name: "Riemann Zeta Function",
    latex: "\\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}",
    category: "Number Theory",
    favorite: false,
  },
]

// Sample formula history
const sampleHistory = [
  { id: 1, latex: "\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)", timestamp: "2 minutes ago" },
  { id: 2, latex: "\\sum_{i=0}^{n} i = \\frac{n(n+1)}{2}", timestamp: "10 minutes ago" },
  { id: 3, latex: "\\lim_{x \\to \\infty} \\left(1 + \\frac{1}{x}\\right)^x = e", timestamp: "25 minutes ago" },
  { id: 4, latex: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}", timestamp: "1 hour ago" },
  { id: 5, latex: "\\vec{F} = m\\vec{a}", timestamp: "2 hours ago" },
]

export default function FormulaEditor() {
  const [latex, setLatex] = useState("\\sum_{i=1}^{n} x_i^2")
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)
  const [inputMethod, setInputMethod] = useState<"latex" | "mathquill">("mathquill")
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split" | "visualize">("split")
  const [fontSize, setFontSize] = useState(18)
  const [autoRender, setAutoRender] = useState(true)
  const [showGrid, setShowGrid] = useState(true)
  const [formulas, setFormulas] = useState(sampleFormulas)
  const [history, setHistory] = useState(sampleHistory)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [exportFormat, setExportFormat] = useState("latex")
  const [showCollaborators, setShowCollaborators] = useState(false)
  const [formulaName, setFormulaName] = useState("Untitled Formula")
  const [isEditing, setIsEditing] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const { theme, setTheme } = useTheme()
  const editorRef = useRef<HTMLDivElement>(null)

  // Simulate AI suggestions
  useEffect(() => {
    if (showAiSuggestions) {
      setIsLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        setAiSuggestions([
          "\\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6}",
          "\\int x^2 \\sin(x) \\, dx = 2x \\sin(x) - (x^2-2) \\cos(x) + C",
          "\\frac{d}{dx}[\\sin(x^2)] = 2x\\cos(x^2)",
          "\\lim_{x \\to 0} \\frac{\\sin(x)}{x} = 1",
        ])
        setIsLoading(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showAiSuggestions])

  // Add to history when latex changes
  useEffect(() => {
    const addToHistory = () => {
      const newHistoryItem = {
        id: Date.now(),
        latex,
        timestamp: "Just now",
      }
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)])
    }

    // Debounce to avoid too many history entries
    const timer = setTimeout(addToHistory, 2000)
    return () => clearTimeout(timer)
  }, [latex])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(latex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadFormula = () => {
    // In a real implementation, this would convert the rendered formula to the selected format
    alert(`In a production app, this would download the formula as ${exportFormat.toUpperCase()}`)
  }

  const saveFormula = () => {
    const newFormula = {
      id: Date.now(),
      name: formulaName,
      latex,
      category: "Custom",
      favorite: false,
    }
    setFormulas((prev) => [newFormula, ...prev])
    alert(`Formula "${formulaName}" saved to library!`)
  }

  const toggleFavorite = (id: number) => {
    setFormulas((prev) =>
      prev.map((formula) => (formula.id === id ? { ...formula, favorite: !formula.favorite } : formula)),
    )
  }

  const deleteFormula = (id: number) => {
    setFormulas((prev) => prev.filter((formula) => formula.id !== id))
  }

  const filteredFormulas = formulas.filter((formula) => {
    const matchesSearch =
      formula.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formula.latex.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      activeCategory === "all" ||
      formula.category === activeCategory ||
      (activeCategory === "favorites" && formula.favorite)
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "favorites", ...Array.from(new Set(formulas.map((f) => f.category)))]

  const handleLatexChange = (newLatex: string) => {
    setLatex(newLatex)
  }

  const applyAiSuggestion = (suggestion: string) => {
    setLatex(suggestion)
    setShowAiSuggestions(false)
  }

  const shareFormula = () => {
    navigator.clipboard.writeText(`Check out this formula: ${latex}`)
    alert("Formula link copied to clipboard!")
  }

  return (
    <div
      className={`transition-all duration-300 ${fullscreen ? "fixed inset-0 z-50 p-6 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900" : ""}`}
    >
      <Card className="glass border-0 shadow-2xl overflow-hidden card-3d">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative mr-4">
                <Input
                  value={formulaName}
                  onChange={(e) => setFormulaName(e.target.value)}
                  className={`bg-transparent border-0 text-white text-lg font-medium focus:ring-0 ${isEditing ? "border-b border-purple-400" : ""}`}
                  readOnly={!isEditing}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white hover:bg-transparent"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </Button>
              </div>
              <Badge variant="outline" className="text-purple-200 border-purple-400">
                {inputMethod === "latex" ? "LaTeX" : "Visual"}
              </Badge>
            </div>

            <div className="flex items-center gap-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={() => setShowLibrary(!showLibrary)}
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Formula library</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={() => setShowKeyboardShortcuts(true)}
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keyboard shortcuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Keyboard Shortcuts</DialogTitle>
                    <DialogDescription>Use these shortcuts to speed up your workflow</DialogDescription>
                  </DialogHeader>
                  <KeyboardShortcuts />
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-purple-200 hover:text-white hover:bg-purple-800"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent align="end" className="w-56 glass border-purple-500/20">
                  <DropdownMenuLabel className="text-purple-300">Editor Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-purple-500/20" />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Auto-render</span>
                      </div>
                      <Switch checked={autoRender} onCheckedChange={setAutoRender} />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Braces className="mr-2 h-4 w-4" />
                        <span>Show grid</span>
                      </div>
                      <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Palette className="mr-2 h-4 w-4" />
                        <span>Font Size</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="glass border-purple-500/20">
                        <div className="px-4 py-2">
                          <Slider
                            value={[fontSize]}
                            min={12}
                            max={32}
                            step={1}
                            onValueChange={(value) => setFontSize(value[0])}
                            className="w-32"
                          />
                          <div className="text-center mt-1 text-sm">{fontSize}px</div>
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="bg-purple-500/20" />
                  <DropdownMenuLabel className="text-purple-300">Export Options</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={exportFormat} onValueChange={setExportFormat}>
                    <DropdownMenuRadioItem value="latex">
                      <Code className="mr-2 h-4 w-4" />
                      <span>LaTeX</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="png">
                      <Image className="mr-2 h-4 w-4" />
                      <span>PNG Image</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="svg">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>SVG Vector</span>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="mathml">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>MathML</span>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy LaTeX</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={downloadFormula}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download formula</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={shareFormula}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share formula</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={saveFormula}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save to library</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-purple-200 hover:text-white hover:bg-purple-800"
                      onClick={() => setFullscreen(!fullscreen)}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle fullscreen</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex flex-col md:flex-row h-[calc(100vh-12rem)]">
            {/* Library Panel */}
            {showLibrary && (
              <div className="w-full md:w-64 border-r border-purple-500/20 glass">
                <div className="p-3">
                  <div className="relative mb-3">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search formulas..."
                      className="pl-8 bg-background/10 border-purple-500/30 focus-visible:ring-purple-500/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        className={`cursor-pointer capitalize ${
                          activeCategory === category ? "bg-purple-600 hover:bg-purple-700" : "hover:bg-purple-500/20"
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category === "favorites" ? "★ Favorites" : category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="p-3">
                    {filteredFormulas.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">No formulas found</div>
                    ) : (
                      <div className="space-y-2">
                        {filteredFormulas.map((formula) => (
                          <div
                            key={formula.id}
                            className="p-2 rounded-md hover:bg-purple-500/10 cursor-pointer group"
                            onClick={() => setLatex(formula.latex)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm">{formula.name}</div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(formula.id)
                                  }}
                                >
                                  {formula.favorite ? (
                                    <Bookmark className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  ) : (
                                    <Bookmark className="h-3 w-3" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteFormula(formula.id)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">{formula.latex}</div>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {formula.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Main Editor Area */}
            <div className="flex-1 flex flex-col">
              {/* View Mode Tabs */}
              <div className="border-b border-purple-500/20 p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Button
                    variant={viewMode === "edit" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "edit" ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => setViewMode("edit")}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant={viewMode === "preview" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "preview" ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => setViewMode("preview")}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant={viewMode === "split" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "split" ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => setViewMode("split")}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Split
                  </Button>
                  <Button
                    variant={viewMode === "visualize" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "visualize" ? "bg-purple-600 hover:bg-purple-700" : ""}
                    onClick={() => setViewMode("visualize")}
                  >
                    <Cpu className="mr-2 h-4 w-4" />
                    Visualize
                  </Button>
                </div>

                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-purple-500/30 hover:bg-purple-500/20"
                    onClick={() => setShowAiSuggestions(!showAiSuggestions)}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    AI Assist
                  </Button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Edit Panel */}
                {(viewMode === "edit" || viewMode === "split") && (
                  <div className={`${viewMode === "split" ? "w-1/2" : "w-full"} flex flex-col`}>
                    <div className="p-3 border-b border-purple-500/20">
                      <Tabs
                        defaultValue={inputMethod}
                        onValueChange={(value) => setInputMethod(value as "latex" | "mathquill")}
                      >
                        <TabsList className="glass border-purple-500/30">
                          <TabsTrigger value="latex" className="data-[state=active]:bg-purple-600">
                            LaTeX Code
                          </TabsTrigger>
                          <TabsTrigger value="mathquill" className="data-[state=active]:bg-purple-600">
                            Visual Editor
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="flex-1 overflow-auto">
                      {inputMethod === "latex" ? (
                        <div className="p-3 h-full">
                          <SymbolPalette
                            onSymbolClick={(symbol) => {
                              setLatex((prev) => prev + symbol)
                            }}
                          />

                          <Textarea
                            value={latex}
                            onChange={(e) => setLatex(e.target.value)}
                            placeholder="Enter LaTeX formula here..."
                            className="font-mono mt-4 h-[calc(100%-10rem)] bg-background/10 border-purple-500/30 focus-visible:ring-purple-500/50"
                            style={{ fontSize: `${fontSize}px` }}
                          />
                        </div>
                      ) : (
                        <div className="p-3 h-full" ref={editorRef}>
                          <MathQuillEditor latex={latex} onChange={handleLatexChange} fontSize={fontSize} />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview Panel */}
                {(viewMode === "preview" || viewMode === "split") && (
                  <div
                    className={`${viewMode === "split" ? "w-1/2 border-l border-purple-500/20" : "w-full"} flex flex-col`}
                  >
                    <div className="p-3 border-b border-purple-500/20 flex justify-between items-center">
                      <h3 className="font-medium">Preview</h3>
                      {!autoRender && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-500/30 hover:bg-purple-500/20"
                          onClick={() => {
                            /* Trigger manual render */
                          }}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Render
                        </Button>
                      )}
                    </div>

                    <div
                      className={`flex-1 overflow-auto p-6 flex items-center justify-center ${showGrid ? "bg-grid-pattern" : ""}`}
                    >
                      <div
                        className="glass p-8 rounded-lg border border-purple-500/20 shadow-lg"
                        style={{ fontSize: `${fontSize}px` }}
                      >
                        <KaTeX latex={latex} displayMode={true} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Visualization Panel */}
                {viewMode === "visualize" && (
                  <div className="w-full flex flex-col">
                    <div className="p-3 border-b border-purple-500/20">
                      <h3 className="font-medium">3D Visualization</h3>
                    </div>

                    <div className="flex-1 overflow-auto">
                      <FormulaVisualizer latex={latex} />
                    </div>
                  </div>
                )}
              </div>

              {/* AI Suggestions Panel */}
              {showAiSuggestions && (
                <div className="border-t border-purple-500/20 p-3 glass">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                      <h3 className="font-medium">AI Formula Suggestions</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowAiSuggestions(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500 mr-2" />
                      <span>Generating suggestions...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 rounded-md hover:bg-purple-500/10 cursor-pointer border border-purple-500/20"
                          onClick={() => applyAiSuggestion(suggestion)}
                        >
                          <div className="text-xs font-mono mb-1 truncate">{suggestion}</div>
                          <div className="text-center">
                            <KaTeX latex={suggestion} displayMode={false} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* History Panel */}
            <div className="w-64 border-l border-purple-500/20 glass hidden lg:block">
              <div className="p-3 border-b border-purple-500/20">
                <h3 className="font-medium">History</h3>
              </div>

              <ScrollArea className="h-[calc(100vh-16rem)]">
                <FormulaHistory history={history} onSelect={setLatex} />
              </ScrollArea>
            </div>
          </div>

          {/* Status Bar */}
          <div className="border-t border-purple-500/20 p-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div>Characters: {latex.length}</div>
              <div>Input: {inputMethod === "latex" ? "LaTeX Code" : "Visual Editor"}</div>
              <div>View: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</div>
            </div>
            <div className="flex items-center gap-2">
              <span>Font: {fontSize}px</span>
              <span>Export: {exportFormat.toUpperCase()}</span>
              <Badge variant="outline" className="ml-2">
                <span className="animate-pulse mr-1">●</span>
                Ready
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import FormulaEditor from "@/components/formula-editor"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 grid-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white neon-text tracking-tight">Quantum Formula</h1>
          <p className="text-purple-200 mb-8 text-center max-w-2xl">
            Next-generation mathematical formula editor with advanced visualization and AI-powered features
          </p>
          <FormulaEditor />
        </div>
      </div>
    </main>
  )
}


import FormulaEditor from "@/components/formula-editor";
import { ThemeSwitcher } from "@/components/theme-switcher"; // Import ThemeSwitcher

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 grid-bg">
      {/* Added relative positioning */}
      <div className="w-full h-full relative p-4"> {/* Added padding for switcher */}
        {/* Added ThemeSwitcher with absolute positioning */}
        <div className="absolute top-4 right-4 z-10">
           <ThemeSwitcher />
        </div>
        <div className="flex flex-col items-center justify-center pt-12"> {/* Added top padding */}
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


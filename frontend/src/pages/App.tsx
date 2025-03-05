import React, { useState, useCallback, useEffect } from "react";
import ParticleBackground from "../components/ParticleBackground";
import BackgroundControls from "../components/BackgroundControls";
import CalculatorContainer from "../components/CalculatorContainer";
import { debounce } from "../utils/debounce";
import { CalculatorProvider } from "../utils/calculatorContext";

export default function App() {
  // State for particle background configuration
  // Actual state values
  const [baseColor, setBaseColor] = useState("#270057"); // Deep purple
  const [accentColor, setAccentColor] = useState("#9d00ff"); // Bright purple
  const [starColor, setStarColor] = useState("#ffffff"); // White stars
  const [particleDensity, setParticleDensity] = useState(2000);
  const [animationSpeed, setAnimationSpeed] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  
  // Debounced state values (to reduce rendering frequency)
  const [debouncedBaseColor, setDebouncedBaseColor] = useState(baseColor);
  const [debouncedAccentColor, setDebouncedAccentColor] = useState(accentColor);
  const [debouncedStarColor, setDebouncedStarColor] = useState(starColor);
  
  // Debounced state setters
  const debouncedSetBaseColor = useCallback(debounce((color: string) => {
    setDebouncedBaseColor(color);
  }, 1000), []);
  
  const debouncedSetAccentColor = useCallback(debounce((color: string) => {
    setDebouncedAccentColor(color);
  }, 1000), []);
  
  const debouncedSetStarColor = useCallback(debounce((color: string) => {
    setDebouncedStarColor(color);
  }, 1000), []);
  
  // Update debounced values when immediate values change
  useEffect(() => {
    debouncedSetBaseColor(baseColor);
  }, [baseColor, debouncedSetBaseColor]);
  
  useEffect(() => {
    debouncedSetAccentColor(accentColor);
  }, [accentColor, debouncedSetAccentColor]);
  
  useEffect(() => {
    debouncedSetStarColor(starColor);
  }, [starColor, debouncedSetStarColor]);

  return (
    <>
      {/* Particle Background */}
      <ParticleBackground 
        baseColor={debouncedBaseColor}
        accentColor={debouncedAccentColor}
        starColor={debouncedStarColor}
        density={particleDensity}
        speed={animationSpeed}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <main className="container mx-auto px-4 flex flex-col items-center">
          {/* Settings Button */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-lg hover:bg-black/70 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
          
          {/* Controls Panel */}
          {showControls && (
            <div className="fixed bottom-16 right-4 z-50">
              <BackgroundControls 
                baseColor={baseColor}
                accentColor={accentColor}
                starColor={starColor}
                particleDensity={particleDensity}
                animationSpeed={animationSpeed}
                onBaseColorChange={setBaseColor}
                onAccentColorChange={setAccentColor}
                onStarColorChange={setStarColor}
                onDensityChange={setParticleDensity}
                onSpeedChange={setAnimationSpeed}
              />
            </div>
          )}
          
          {/* Calculator */}
          <div className="flex items-center justify-center w-full h-full p-4 relative">
            <CalculatorProvider>
              <CalculatorContainer accentColor={debouncedAccentColor} />
            </CalculatorProvider>
          </div>
        </main>
      </div>
    </>
  );
}

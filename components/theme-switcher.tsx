'use client'

import * as React from 'react'
import { Moon, Sun, Palette } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu'

export function ThemeSwitcher() {
  const { setTheme, theme, resolvedTheme } = useTheme()

  // Function to set the base theme (light/dark)
  const setMode = (mode: string) => {
    const currentBaseTheme = theme?.split('-')[0] // e.g., 'blue' from 'theme-blue'
    if (currentBaseTheme && ['theme', 'light', 'dark', 'system'].indexOf(currentBaseTheme) === -1) {
      setTheme(`${currentBaseTheme}-${mode}`)
    } else {
      setTheme(mode)
    }
  }

  // Function to set the color theme
  const setColorTheme = (colorTheme: string) => {
     const currentMode = resolvedTheme === 'dark' ? 'dark' : 'light'
     if (colorTheme === 'default') {
        setTheme(currentMode) // Revert to base light/dark
     } else {
        setTheme(`${colorTheme}-${currentMode}`)
     }
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setMode('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode('system')}>
          System
        </DropdownMenuItem>
        <DropdownMenuSeparator />
         <DropdownMenuSub>
           <DropdownMenuSubTrigger>
             <Palette className="mr-2 h-4 w-4" />
             <span>Color Theme</span>
           </DropdownMenuSubTrigger>
           <DropdownMenuPortal>
             <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setColorTheme('default')}>
                 Default (Purple)
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setColorTheme('theme-blue')}>
                 Blue
               </DropdownMenuItem>
               <DropdownMenuItem onClick={() => setColorTheme('theme-green')}>
                 Green
               </DropdownMenuItem>
             </DropdownMenuSubContent>
           </DropdownMenuPortal>
         </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
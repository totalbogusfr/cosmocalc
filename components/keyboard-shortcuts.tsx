export default function KeyboardShortcuts() {
  const shortcuts = [
    { key: "Ctrl + Z", description: "Undo" },
    { key: "Ctrl + Y", description: "Redo" },
    { key: "Ctrl + C", description: "Copy LaTeX" },
    { key: "Ctrl + V", description: "Paste" },
    { key: "Ctrl + S", description: "Save to library" },
    { key: "Ctrl + P", description: "Print/Export" },
    { key: "Ctrl + F", description: "Find in formula" },
    { key: "Ctrl + /", description: "Show keyboard shortcuts" },
    { key: "F11", description: "Toggle fullscreen" },
    { key: "Esc", description: "Exit fullscreen / Close dialogs" },
    { key: "Tab", description: "Move to next element in MathQuill" },
    { key: "Shift + Tab", description: "Move to previous element in MathQuill" },
    { key: "Alt + L", description: "Switch to LaTeX input" },
    { key: "Alt + V", description: "Switch to Visual input" },
    { key: "Alt + P", description: "Switch to Preview mode" },
    { key: "Alt + S", description: "Switch to Split mode" },
    { key: "Alt + 3", description: "Switch to 3D Visualization" },
  ]

  return (
    <div className="grid gap-2">
      {shortcuts.map((shortcut, index) => (
        <div key={index} className="flex justify-between py-1">
          <span className="text-muted-foreground">{shortcut.description}</span>
          <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">{shortcut.key}</kbd>
        </div>
      ))}
    </div>
  )
}


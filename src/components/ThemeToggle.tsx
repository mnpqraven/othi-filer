"use client";

import { useTheme } from "next-themes";
import { type HTMLAttributes, forwardRef } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";

type Prop = Omit<HTMLAttributes<HTMLButtonElement>, "onClick">;

export const ThemeToggle = forwardRef<HTMLButtonElement, Prop>(
  function ThemeToggle({ ...props }, ref) {
    const { theme, setTheme } = useTheme();

    function toggleTheme() {
      setTheme(theme === "light" ? "dark" : "light");
    }
    return (
      <Button
        size="sm"
        variant="ghost"
        {...props}
        onClick={toggleTheme}
        ref={ref}
      >
        <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  },
);

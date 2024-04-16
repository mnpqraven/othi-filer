export type Modifiers = "Ctrl" | "Meta" | "Alt" | "Shift";

export interface KeybindConfig {
  keycode: string;
  modifiers?: { list: Modifiers[]; op: "AND" | "OR" };
  description?: string;
}

export function modLabel(mod: Modifiers): string {
  switch (mod) {
    case "Ctrl":
      return "Ctrl";
    case "Meta":
      return "⌘";
    case "Alt":
      return "Alt";
    case "Shift":
      return "Shift";
  }
}

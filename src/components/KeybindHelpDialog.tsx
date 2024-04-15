"use client";

import { useAtom } from "jotai";
import { cva } from "class-variance-authority";
import { keybindHelpOpenAtom } from "@/app/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { type KeybindConfig, modLabel } from "./providers/eventHandlers/types";

export function KeybindHelpDialog() {
  const [open, setOpen] = useAtom(keybindHelpOpenAtom);
  const generalKeybinds: KeybindConfig[] = [
    {
      keycode: "?",
      description: "Open this menu",
      modifiers: { list: ["Ctrl", "Meta"], op: "OR" },
    },
    {
      keycode: "k",
      description: "Open Command Center",
      modifiers: { list: ["Ctrl", "Meta"], op: "OR" },
    },
  ];

  const fileKeybinds: KeybindConfig[] = [
    {
      keycode: "n",
      description: "go to (n)ext file/folder",
      modifiers: { list: ["Ctrl", "Meta"], op: "OR" },
    },
    {
      keycode: "p",
      description: "go to (p)revious file/folder",
      modifiers: { list: ["Ctrl", "Meta"], op: "OR" },
    },
    {
      keycode: "m",
      description: "(m)ark selected file/folders",
      modifiers: { list: ["Ctrl", "Meta"], op: "OR" },
    },
    {
      keycode: "o",
      description: "expand selected file/folder",
      modifiers: { list: ["Ctrl", "Meta"], op: "OR" },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Keybinds</DialogTitle>
          <DialogDescription className="space-y-4 pt-4">
            <p className="text-lg font-semibold leading-none text-primary">
              General
            </p>
            <div className="grid grid-cols-2 gap-4">
              {generalKeybinds.map((kb, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Keybind key={index} {...kb} />
              ))}
            </div>

            <p className="text-lg font-semibold leading-none text-primary">
              Copy n&apos; Paste
            </p>
            <div className="grid grid-cols-2 gap-4">
              {fileKeybinds.map((kb, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Keybind key={index} {...kb} />
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Keybind({ description, keycode, modifiers }: KeybindConfig) {
  const opJoinSymbol = modifiers?.op === "AND" ? "+" : "/";
  const codeVariant = cva(
    "bg-muted text-muted-foreground pointer-events-none right-2 inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono font-medium opacity-100 text-sm",
  );
  return (
    <div className="flex justify-between">
      <span>{description}</span>

      <div>
        <kbd className={codeVariant()}>
          {modifiers?.list.map((mod, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={index}>
              {modLabel(mod)}{" "}
              {index + 1 < modifiers.list.length ? opJoinSymbol : null}{" "}
            </span>
          ))}
        </kbd>{" "}
        + <kbd className={codeVariant()}>{keycode}</kbd>
      </div>
    </div>
  );
}

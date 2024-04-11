"use client";

import { useSetAtom } from "jotai";
import { useEffect, type ReactNode } from "react";
import { commandOpenAtom } from "@/app/store";
import { toast } from "sonner";

/**
 * This wrapper component modifies event handlers inherited from tauri and webviews
 */
export function ProcessEventHandlers({ children }: { children: ReactNode }) {
  const setCommandOpen = useSetAtom(commandOpenAtom);

  // disables context menu in prod
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
      });
    }
  }, []);

  useEffect(() => {
    const kCommand = key(
      { key: "k", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        e.preventDefault();
        setCommandOpen((open) => !open);
      },
    );

    const ctrlHelper = (e: KeyboardEvent) => {
      if (e.key === "Control" && !e.repeat) {
        // toast("should see on press");
      }
    };
    const ctrlHelperUndo = (e: KeyboardEvent) => {
      // TODO: this should not cause any layout shift, only clean up state
      if (e.key === "Control") {
        // toast("should see on unpress");
      }
    };

    document.addEventListener("keydown", kCommand);
    document.addEventListener("keydown", ctrlHelper);
    document.addEventListener("keyup", ctrlHelperUndo);
    return () => {
      document.removeEventListener("keydown", kCommand);
      document.removeEventListener("keydown", ctrlHelper);
      document.removeEventListener("keyup", ctrlHelperUndo);
    };
  }, [setCommandOpen]);

  return children;
}

type Modifiers = "Ctrl" | "Meta" | "Alt" | "Shift";
interface KeyConf {
  key: string;
  modifiers?: { list: Modifiers[]; op: "AND" | "OR" };
}
function key(
  keyConf: KeyConf,
  action: (e: KeyboardEvent) => void,
): (e: KeyboardEvent) => void {
  const { key, modifiers } = keyConf;

  return (e) => {
    if (e.key === key && getModCond(e, modifiers)) {
      action(e);
    }
  };
}

function getModCond(e: KeyboardEvent, conf: KeyConf["modifiers"]) {
  if (!conf) return true;
  const bools = conf.list.map((mod) => getModCallback(mod)(e));
  if (conf.op === "OR") {
    // any of them being true passes
    return bools.some((e) => e);
  }
  // every of them being true passes
  return bools.every((e) => e);
}

function getModCallback(mod: Modifiers) {
  switch (mod) {
    case "Ctrl":
      return (e: KeyboardEvent) => e.ctrlKey;
    case "Meta":
      return (e: KeyboardEvent) => e.metaKey;
    case "Alt":
      return (e: KeyboardEvent) => e.altKey;
    case "Shift":
      return (e: KeyboardEvent) => e.shiftKey;
  }
}

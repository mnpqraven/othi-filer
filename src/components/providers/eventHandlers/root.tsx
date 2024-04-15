"use client";

import { useSetAtom } from "jotai";
import { useEffect, type ReactNode } from "react";
import {
  TopMenuAltPressedAtom,
  TopMenuAltValueAtom,
  commandOpenAtom,
  keybindHelpOpenAtom,
} from "@/app/store";
import { useToggleExpand } from "@/hooks/dirAction/useUIAction";
import { type KeybindConfig, type Modifiers } from "./types";

/**
 * This wrapper component modifies event handlers inherited from tauri and webviews
 */
export function RootEventHandlers({ children }: { children: ReactNode }) {
  const setCommandOpen = useSetAtom(commandOpenAtom);
  const setAltOpen = useSetAtom(TopMenuAltPressedAtom);
  const setAltValue = useSetAtom(TopMenuAltValueAtom);
  const setKeybindHelp = useSetAtom(keybindHelpOpenAtom);
  const { mutate: expand } = useToggleExpand();

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
      { keycode: "k", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        e.preventDefault();
        setCommandOpen((open) => !open);
      },
    );
    const questionCommand = key(
      { keycode: "?", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        e.preventDefault();
        setKeybindHelp((open) => !open);
      },
    );

    const fFileMenu = key(
      { keycode: "f", modifiers: { list: ["Alt"], op: "OR" } },
      (e) => {
        e.preventDefault();
        setAltValue("File-0");
      },
    );

    const altHelper = (e: KeyboardEvent) => {
      if (e.key === "Alt" && !e.repeat) {
        setAltOpen(true);
      }
    };
    const altHelperUndo = (e: KeyboardEvent) => {
      if (e.key === "Alt") {
        setAltOpen(false);
      }
    };

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

    document.addEventListener("keydown", questionCommand);
    document.addEventListener("keydown", kCommand);
    document.addEventListener("keydown", fFileMenu);
    document.addEventListener("keydown", ctrlHelper);
    document.addEventListener("keydown", altHelper);
    document.addEventListener("keyup", altHelperUndo);
    document.addEventListener("keyup", ctrlHelperUndo);
    return () => {
      document.removeEventListener("keydown", questionCommand);
      document.removeEventListener("keydown", kCommand);
      document.removeEventListener("keydown", fFileMenu);
      document.removeEventListener("keydown", ctrlHelper);
      document.removeEventListener("keydown", altHelper);
      document.removeEventListener("keyup", altHelperUndo);
      document.removeEventListener("keyup", ctrlHelperUndo);
    };
  }, [expand, setAltOpen, setAltValue, setCommandOpen, setKeybindHelp]);

  return children;
}

export function key(
  keyConf: KeybindConfig,
  action: (e: KeyboardEvent) => void,
): (e: KeyboardEvent) => void {
  const { keycode, modifiers } = keyConf;

  return (e) => {
    if (e.key === keycode && getModCond(e, modifiers)) {
      action(e);
    }
  };
}

function getModCond(e: KeyboardEvent, conf: KeybindConfig["modifiers"]) {
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

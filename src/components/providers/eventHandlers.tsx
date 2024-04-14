"use client";

import { useSetAtom } from "jotai";
import { useEffect, type ReactNode } from "react";
import {
  TopMenuAltPressedAtom,
  TopMenuAltValueAtom,
  commandOpenAtom,
} from "@/app/store";
import { dirItemConf } from "@/lib/utils";
import { useToggleExpand } from "@/hooks/dirAction/useUIAction";

/**
 * This wrapper component modifies event handlers inherited from tauri and webviews
 */
export function ProcessEventHandlers({ children }: { children: ReactNode }) {
  const setCommandOpen = useSetAtom(commandOpenAtom);
  const setAltOpen = useSetAtom(TopMenuAltPressedAtom);
  const setAltValue = useSetAtom(TopMenuAltValueAtom);
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
      { key: "k", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        e.preventDefault();
        setCommandOpen((open) => !open);
      },
    );

    const fFileMenu = key(
      { key: "f", modifiers: { list: ["Alt"], op: "OR" } },
      (e) => {
        e.preventDefault();
        setAltValue("File-0");
      },
    );

    // TODO: stript id prefix, get path, use for mutation
    const oExpandDir = key(
      { key: "o", modifiers: { list: ["Ctrl"], op: "OR" } },
      (e) => {
        const currentEle = document.activeElement;
        const dirItem = dirItemConf(currentEle?.id);
        if (dirItem) {
          const { path, side } = dirItem;
          expand({ folder_path: path, side, expanded: null });
        }
      },
    );

    const nNext = key(
      { key: "n", modifiers: { list: ["Ctrl"], op: "OR" } },
      (_e) => {
        const currentEle = document.activeElement;
        const dirItem = dirItemConf(currentEle?.id);
        if (dirItem) {
          const { path, side } = dirItem;
          const elements = document.querySelectorAll(
            `[id^=diritem-selector-${side}]`,
          );
          let foundIndex = -1;
          elements.forEach((element, index) => {
            const dirItem = dirItemConf(element.id);
            if (dirItem) {
              const { path: pathInner } = dirItem;
              if (pathInner === path) foundIndex = index;
              if (foundIndex + 1 === index) {
                document.getElementById(element.id)?.focus();
              }
            }
          });
        } else {
          // TODO: focus first element
        }
      },
    );

    const pPrev = key(
      { key: "p", modifiers: { list: ["Ctrl"], op: "OR" } },
      (e) => {
        e.preventDefault();
        const currentEle = document.activeElement;
        const dirItem = dirItemConf(currentEle?.id);
        if (dirItem) {
          const { path, side } = dirItem;
          const elements = document.querySelectorAll(
            `[id^=diritem-selector-${side}]`,
          );
          const elementsRev = Array.from(elements).reverse();
          let foundIndex = -1;
          elementsRev.forEach((element, index) => {
            const dirItem = dirItemConf(element.id);
            if (dirItem) {
              const { path: pathInner } = dirItem;
              if (pathInner === path) foundIndex = index;
              if (foundIndex + 1 === index) {
                document.getElementById(element.id)?.focus();
              }
            }
          });
        }
      },
    );

    const mMarkDir = key(
      { key: "m", modifiers: { list: ["Ctrl"], op: "OR" } },
      (e) => {
        const currentEle = document.activeElement;
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

    document.addEventListener("keydown", kCommand);
    document.addEventListener("keydown", fFileMenu);
    document.addEventListener("keydown", oExpandDir);
    document.addEventListener("keydown", nNext);
    document.addEventListener("keydown", pPrev);
    document.addEventListener("keydown", ctrlHelper);
    document.addEventListener("keydown", altHelper);
    document.addEventListener("keyup", altHelperUndo);
    document.addEventListener("keyup", ctrlHelperUndo);
    return () => {
      document.removeEventListener("keydown", kCommand);
      document.removeEventListener("keydown", fFileMenu);
      document.removeEventListener("keydown", oExpandDir);
      document.removeEventListener("keydown", nNext);
      document.removeEventListener("keydown", pPrev);
      document.removeEventListener("keydown", ctrlHelper);
      document.removeEventListener("keydown", altHelper);
      document.removeEventListener("keyup", altHelperUndo);
      document.removeEventListener("keyup", ctrlHelperUndo);
    };
  }, [setAltOpen, setAltValue, setCommandOpen]);

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

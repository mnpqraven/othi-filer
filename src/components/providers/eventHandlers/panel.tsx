"use client";

import { type Provider } from "jotai";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { dirItemConf } from "@/lib/utils";
import { panelSideAtom, selectedIdMouseAtom } from "@/app/copy-n-paste/_store";
import { key } from "./root";

type Store = NonNullable<ComponentPropsWithoutRef<typeof Provider>["store"]>;

interface Prop {
  children: ReactNode;
  store: Store;
}
export function PanelEventHandlers({ children, store }: Prop) {
  const sideValue = store.get(panelSideAtom);
  const foundIndex = useRef<number>(-1);

  useEffect(() => {
    const nNext = key(
      { key: "n", modifiers: { list: ["Ctrl"], op: "OR" } },
      (e) => {
        e.preventDefault();
        // TODO: this can be further optimized by reading `selectedIdMouseAtom`
        // as fallback
        const currentEle = document.activeElement;
        const dirItem = dirItemConf(currentEle?.id);
        if (dirItem && dirItem.side === sideValue) {
          const { path, side } = dirItem;
          const _elements = document.querySelectorAll(
            `[id^=diritem-selector-${side}]`,
          );
          const elements = Array.from(_elements);
          elements.forEach((element, index) => {
            const dirItem = dirItemConf(element.id);
            if (dirItem) {
              const { path: pathInner } = dirItem;
              if (pathInner === path) {
                foundIndex.current = index;
              }
            }
          });
          const nextEle = elements.at(
            (foundIndex.current + 1) % elements.length,
          );
          if (nextEle) {
            store.set(selectedIdMouseAtom, [nextEle.id]);
            document.getElementById(nextEle.id)?.focus();
          }
        } else {
          // TODO: focus first element BUT NOT IN THIS BLOCK
        }
      },
    );

    const pPrev = key(
      { key: "p", modifiers: { list: ["Ctrl"], op: "OR" } },
      (e) => {
        e.preventDefault();
        const currentEle = document.activeElement;
        const dirItem = dirItemConf(currentEle?.id);
        if (dirItem && dirItem.side === sideValue) {
          const { path, side } = dirItem;
          const _elements = document.querySelectorAll(
            `[id^=diritem-selector-${side}]`,
          );
          const elements = Array.from(_elements).reverse();
          elements.forEach((element, index) => {
            const dirItem = dirItemConf(element.id);
            if (dirItem) {
              const { path: pathInner } = dirItem;
              if (pathInner === path) {
                foundIndex.current = index;
              }
            }
          });
          const nextEle = elements.at(
            (foundIndex.current + 1) % elements.length,
          );
          if (nextEle) {
            store.set(selectedIdMouseAtom, [nextEle.id]);
            document.getElementById(nextEle.id)?.focus();
          }
        } else {
          // TODO: focus first element BUT NOT IN THIS BLOCK
        }
      },
    );

    document.addEventListener("keydown", nNext);
    document.addEventListener("keydown", pPrev);
    return () => {
      document.removeEventListener("keydown", nNext);
      document.removeEventListener("keydown", pPrev);
    };
  }, [sideValue, store]);

  return children;
}

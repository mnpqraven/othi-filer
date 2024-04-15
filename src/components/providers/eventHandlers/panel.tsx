"use client";

import { useAtomValue, type Provider } from "jotai";
import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { dirItemConf } from "@/lib/utils";
import { panelSideAtom, selectedIdMouseAtom } from "@/app/copy-n-paste/_store";
import {
  useToggleExpand,
  useToggleSelect,
} from "@/hooks/dirAction/useUIAction";
import { key } from "./root";

type Store = NonNullable<ComponentPropsWithoutRef<typeof Provider>["store"]>;

interface Prop {
  children: ReactNode;
  store: Store;
}
// TODO: split
export function PanelEventHandlers({ children, store }: Prop) {
  const sideValue = store.get(panelSideAtom);
  const foundIndex = useRef<number>(-1);
  const ids = useAtomValue(selectedIdMouseAtom, { store });
  const { mutate: select } = useToggleSelect();
  const { mutate: expand } = useToggleExpand();

  const iterateElements = useCallback(
    (e: KeyboardEvent, reverse: boolean) => {
      e.preventDefault();
      const currentEle = document.activeElement;
      const dirItem = dirItemConf(currentEle?.id) ?? dirItemConf(ids.at(-1));

      if (dirItem && dirItem.side === sideValue) {
        const { path, side } = dirItem;
        const _elements = document.querySelectorAll(
          `[id^=diritem-selector-${side}]`,
        );
        const elements = reverse
          ? Array.from(_elements).reverse()
          : Array.from(_elements);

        elements.forEach((element, index) => {
          const dirItem = dirItemConf(element.id);
          if (dirItem) {
            const { path: pathInner } = dirItem;
            if (pathInner === path) {
              foundIndex.current = index;
            }
          }
        });
        const nextEle = elements.at((foundIndex.current + 1) % elements.length);
        if (nextEle) {
          store.set(selectedIdMouseAtom, [nextEle.id]);
          document.getElementById(nextEle.id)?.focus();
        }
      }
    },
    [ids, sideValue, store],
  );

  useEffect(() => {
    const nNext = key(
      { keycode: "n", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        iterateElements(e, false);
      },
    );

    const pPrev = key(
      { keycode: "p", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        iterateElements(e, true);
      },
    );

    const mMarkDir = key(
      { keycode: "m", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        e.preventDefault();
        const paths = ids
          .map((id) => dirItemConf(id)?.path ?? "")
          .filter((path) => path.length);

        if (paths.length) select({ paths, side: sideValue, selected: null });
      },
    );

    const oExpandDir = key(
      { keycode: "o", modifiers: { list: ["Ctrl", "Meta"], op: "OR" } },
      (e) => {
        e.preventDefault();
        const paths = ids
          .map((id) => dirItemConf(id)?.path ?? "")
          .filter((path) => path.length);

        if (paths.length) expand({ paths, side: sideValue, expanded: null });
      },
    );

    document.addEventListener("keydown", nNext);
    document.addEventListener("keydown", pPrev);
    document.addEventListener("keydown", mMarkDir);
    document.addEventListener("keydown", oExpandDir);
    return () => {
      document.removeEventListener("keydown", nNext);
      document.removeEventListener("keydown", pPrev);
      document.removeEventListener("keydown", mMarkDir);
      document.removeEventListener("keydown", oExpandDir);
    };
  }, [expand, ids, iterateElements, select, sideValue, store]);

  return children;
}

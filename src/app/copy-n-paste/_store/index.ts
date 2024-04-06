import { atomWithReducer } from "jotai/utils";
import { atom, createStore } from "jotai";
import { type ReducerAction } from "@/lib/generics";
import { type Side } from "@/bindings/taurpc";
import { type CopyPanelAtom, type CopyPanelReducerSchema } from "./types";
import { copyPanelReducer } from "./reducers";

const defaultCopyConf: CopyPanelAtom = {
  left: {
    path: undefined,
    selected: [],
    show_hidden: false,
  },
  right: {
    path: undefined,
    selected: [],
    show_hidden: false,
  },
};

export const copyPanelDispatchAtom = atomWithReducer<
  CopyPanelAtom,
  ReducerAction<CopyPanelReducerSchema>
>(defaultCopyConf, copyPanelReducer);
copyPanelDispatchAtom.debugLabel = "copyPanelAtom";

export const panelSideAtom = atom<Side>("left");
export const leftPanelStore = createStore();
export const rightPanelStore = createStore();
rightPanelStore.set(panelSideAtom, "right");

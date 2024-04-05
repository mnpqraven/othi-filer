import { atomWithReducer } from "jotai/utils";
import { type ReducerAction } from "@/lib/generics";
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

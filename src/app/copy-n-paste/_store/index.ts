import { atomWithReducer } from "jotai/utils";
import { focusAtom } from "jotai-optics";
import { type ReducerAction } from "@/lib/generics";
import { type CopyPanelAtom, type CopyPanelReducerSchema } from "./types";
import { copyPanelReducer } from "./reducers";

export const copyPanelDispatchAtom = atomWithReducer<
  CopyPanelAtom,
  ReducerAction<CopyPanelReducerSchema>
>(
  {
    left: {
      path: undefined,
      selected: [],
    },
    right: {
      path: undefined,
      selected: [],
    },
  },
  copyPanelReducer,
);
copyPanelDispatchAtom.debugLabel = "copyPanelAtom";

import { type ReducerAction } from "@/lib/generics";
import { type CopyPanelReducerSchema, type CopyPanelAtom } from "./types";

export function copyPanelReducer(
  prev: CopyPanelAtom,
  action: ReducerAction<CopyPanelReducerSchema>,
): CopyPanelAtom {
  const { type, payload } = action;
  switch (type) {
    case "updateAll":
      return payload;
    case "setPath": {
      switch (payload.side) {
        case "left":
          return {
            left: { ...prev.left, path: payload.to },
            right: prev.right,
          };
        case "right":
          return {
            left: prev.left,
            right: { ...prev.right, path: payload.to },
          };
        default:
          return prev;
      }
    }
    case "setHidden": {
      switch (payload.side) {
        case "left":
          return {
            left: { ...prev.left, show_hidden: payload.to },
            right: prev.right,
          };
        case "right":
          return {
            left: prev.left,
            right: { ...prev.right, show_hidden: payload.to },
          };
        default:
          return prev;
      }
    }
    case "swapSide":
      return { left: prev.right, right: prev.left };
    case "setSelectedDirs": {
      switch (payload.side) {
        case "left":
          return { ...prev, left: { ...prev.left, selected: payload.dirs } };
        case "right":
          return { ...prev, right: { ...prev.right, selected: payload.dirs } };
        default:
          return prev;
      }
    }
    default:
      throw new Error("unimplemented");
  }
}

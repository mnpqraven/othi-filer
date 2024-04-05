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
            left: { path: payload.to, selected: prev.left.selected },
            right: prev.right,
          };
        case "right":
          return {
            left: prev.left,
            right: { path: payload.to, selected: prev.right.selected },
          };
        default:
          return prev;
      }
    }
    case "swapSide":
      return { left: prev.right, right: prev.left };
    default:
      throw new Error("unimplemented");
  }
}

export type CopyPanelAtom = Record<"left" | "right", PanelConfig>;

export interface PanelConfig {
  path: string | undefined;
  selected: string[];
}

interface Side {
  side: "left" | "right";
}

/**
 * this is the underlying schema for the dispatch actions
 * key: name of the action
 * value: type of the payload
 */
export interface CopyPanelReducerSchema {
  updateAll: CopyPanelAtom;
  update: Side & { to: PanelConfig };
  setPath: Side & { to: string };
  setDirs: Side & { to: string[] };
  addDirs: Side & { files: string[] };
  removeDirs: Side & { files: string[] };
  swapSide: null;
}

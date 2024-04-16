import { atom } from "jotai";

export const commandOpenAtom = atom(false);
export const sidebarOpenAtom = atom(false);
export const keybindHelpOpenAtom = atom(false);

export const TopMenuAltPressedAtom = atom(false);
export const TopMenuAltValueAtom = atom<string>("");

"use client";

import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { type ComponentPropsWithoutRef, forwardRef } from "react";
import { commandOpenAtom, keybindHelpOpenAtom } from "@/app/store";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

export function AppCommandPanel() {
  const [open, setOpen] = useAtom(commandOpenAtom);
  const setKeybindHelp = useSetAtom(keybindHelpOpenAtom);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          <CommandRoute to="/copy-n-paste">Copy n&apos; Paste</CommandRoute>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              setKeybindHelp(true);
              setOpen(false);
            }}
          >
            Show keybinds help
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

interface RouteProp
  extends Omit<ComponentPropsWithoutRef<typeof CommandItem>, "onSelect"> {
  to: string;
}
const CommandRoute = forwardRef<HTMLDivElement, RouteProp>(
  function CommandRoute({ to, children, ...props }, ref) {
    const setOpen = useSetAtom(commandOpenAtom);
    const router = useRouter();

    function navigate(to: string) {
      router.push(to);
      setOpen(false);
    }
    return (
      <CommandItem
        {...props}
        ref={ref}
        onSelect={() => {
          navigate(to);
        }}
      >
        {children}
      </CommandItem>
    );
  },
);

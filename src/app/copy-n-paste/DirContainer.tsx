import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ArrowUpToLine } from "lucide-react";
import { Transition } from "@headlessui/react";
import { useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScroll } from "@/hooks/event/useScroll";
import {
  useBack,
  useListDir,
  usePanelConfig,
} from "@/hooks/dirAction/useDirAction";
import { DirPanelItem } from "./DirPanelItem";
import { panelSideAtom } from "./_store";

interface Prop extends ComponentPropsWithoutRef<typeof ScrollArea> {
  cursorPath: string;
  scrollToTop?: boolean;
}
export const DirContainer = forwardRef<HTMLDivElement, Prop>(
  function DirContainer({ cursorPath, className, scrollToTop, ...props }, ref) {
    const { refWithScroll, toTop, overThreshold } = useScroll({
      threshold: 300,
    });
    const side = useAtomValue(panelSideAtom);
    const { data: panelState } = usePanelConfig({ side });
    const { data } = useListDir({
      path: cursorPath,
      show_hidden: panelState?.show_hidden,
    });

    const { mutate } = useBack();

    if (!data) return "listdir loading...";
    return (
      <ScrollArea
        id="ree"
        className={cn(
          "relative flex flex-col rounded-md border py-2 pl-3 pr-2.5",
          className,
        )}
        viewportRef={refWithScroll}
        {...props}
        ref={ref}
      >
        <Button
          variant="ghost"
          className="ml-6 w-full justify-start"
          onClick={() => {
            mutate(side);
          }}
        >
          ..
        </Button>

        {data.map((dir) => (
          <DirPanelItem dirItem={dir} key={dir.path} />
        ))}

        {scrollToTop ? (
          <Transition
            show={overThreshold}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Button
              className="absolute bottom-4 right-4 rounded-full p-2.5"
              variant="outline"
              onClick={() => {
                toTop();
              }}
            >
              <ArrowUpToLine className="h-5 w-5" />
            </Button>
          </Transition>
        ) : null}
      </ScrollArea>
    );
  },
);

import { forwardRef, useRef, type ComponentPropsWithoutRef } from "react";
import { ArrowUpToLine } from "lucide-react";
import { Transition } from "@headlessui/react";
import { useAtomValue, useStore } from "jotai";
import Selecto from "react-selecto";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScroll } from "@/hooks/event/useScroll";
import {
  useBack,
  useListDir,
  usePanelConfig,
} from "@/hooks/dirAction/useUIAction";
import { DirPanelItem } from "./DirPanelItem";
import { panelSideAtom, selectedIdMouseAtom } from "./_store";

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
      side,
    });

    const { mutate } = useBack();
    const { set } = useStore();
    const selectoRef = useRef<Selecto>(null);

    if (!data) return "listdir loading...";
    return (
      <ScrollArea
        className={cn("relative rounded-md border py-2 pl-3 pr-2.5", className)}
        viewportRef={refWithScroll}
        onScroll={() => {
          if (selectoRef.current) {
            selectoRef.current.checkScroll();
          }
        }}
        {...props}
        ref={ref}
      >
        <Selecto
          ref={selectoRef}
          selectableTargets={["[id^=diritem-selector]"]}
          selectFromInside
          hitRate={10}
          selectByClick
          ratio={0}
          toggleContinueSelect="ctrl"
          scrollOptions={{
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            container: refWithScroll.current!,
            throttleTime: 30,
            threshold: 0,
          }}
          onSelect={(e) => {
            set(
              selectedIdMouseAtom,
              e.selected.map((el) => el.id),
            );
          }}
          onDragStart={(e) => {
            if (e.inputEvent.target.nodeName === "BUTTON") return false;
            return true;
          }}
          onScroll={(e) => {
            const yDelta = e.direction.at(1);
            if (yDelta !== undefined)
              // only scrolls vertically
              refWithScroll.current?.scrollBy(0, yDelta * 10);
          }}
        />

        <div className="flex flex-col gap-2">
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
        </div>

        {/* NOTE: better to mask this ? */}
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

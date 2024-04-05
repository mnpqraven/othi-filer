import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { ArrowUpToLine } from "lucide-react";
import { Transition } from "@headlessui/react";
import { type DirItem } from "@/bindings/taurpc";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useScroll } from "@/hooks/event/useScroll";
import { DirPanelItem } from "./DirPanelItem";

interface Prop extends ComponentPropsWithoutRef<typeof ScrollArea> {
  dirs: DirItem[];
  onCheckboxSelect?: (name: string, value: boolean) => void;
  onNameSelect?: (name: string) => void;
  onBack?: () => void;
  scrollToTop?: boolean;
  side: "left" | "right";
}
export const DirPanel = forwardRef<HTMLDivElement, Prop>(function DirPanel(
  {
    side,
    dirs,
    onCheckboxSelect,
    className,
    onNameSelect,
    onBack,
    scrollToTop,
    ...props
  },
  ref,
) {
  const { refWithScroll, toTop, overThreshold } = useScroll({ threshold: 300 });

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
      {onBack ? (
        <Button
          variant="ghost"
          className="ml-6 w-full justify-start"
          onClick={() => {
            onBack();
          }}
        >
          ..
        </Button>
      ) : null}
      {dirs.map((dir) => (
        <DirPanelItem side={side} item={dir} key={dir.full_path} />
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
});

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Folder, File } from "lucide-react";
import { type DirItem } from "@/bindings/taurpc";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileName } from "@/components/FileName";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Prop extends ComponentPropsWithoutRef<typeof ScrollArea> {
  dirs: DirItem[];
  onCheckboxSelect?: (name: string, value: boolean) => void;
  onNameSelect?: (name: string) => void;
  onBack?: () => void;
}
export const DirPanel = forwardRef<HTMLDivElement, Prop>(function DirPanel(
  { dirs, onCheckboxSelect, className, onNameSelect, onBack, ...props },
  ref,
) {
  return (
    <ScrollArea
      className={cn(
        "flex flex-col rounded-md border py-2 pl-3 pr-2.5",
        className,
      )}
      ref={ref}
      {...props}
    >
      {onBack ? (
        <Button
          variant="ghost"
          className="ml-6 justify-start w-full"
          onClick={() => {
            onBack();
          }}
        >
          ..
        </Button>
      ) : null}
      {dirs.map(({ name, is_folder }, index) => (
        <div
          className="cursor-pointer flex gap-2 items-center"
          key={`${name}-${String(index)}`}
        >
          <Checkbox
            onCheckedChange={(e) => {
              if (onCheckboxSelect) {
                if (e !== "indeterminate") onCheckboxSelect(name, e);
                else onCheckboxSelect(name, false);
              }
            }}
          />
          <Button
            variant="ghost"
            className="hover:underline px-2 py-0 justify-start gap-2 flex-1 min-w-0"
            onClick={() => {
              if (onNameSelect && is_folder) onNameSelect(name);
            }}
          >
            {is_folder ? (
              <Folder className="w-4 h-4 shrink-0" />
            ) : (
              <File className="w-4 h-4 shrink-0" />
            )}
            <FileName name={name} className="w-full" />
          </Button>
        </div>
      ))}
    </ScrollArea>
  );
});

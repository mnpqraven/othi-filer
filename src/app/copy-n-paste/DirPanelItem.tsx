import { useAtom } from "jotai";
import { Folder, File, ArrowDownRight, ArrowDown } from "lucide-react";
import { type HTMLAttributes, forwardRef, useState } from "react";
import { type DirItem } from "@/bindings/taurpc";
import { FileName } from "@/components/FileName";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForward, useList } from "@/hooks/dirAction/useDirAction";
import { cn } from "@/lib/utils";
import { copyPanelDispatchAtom } from "./_store";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  side: "left" | "right";
  item: DirItem;
}

export const DirPanelItem = forwardRef<HTMLDivElement, Prop>(
  function DirPanelItem({ item, side, className, ...props }, ref) {
    const { name, is_folder } = item;
    const [panelConfig, updateConfig] = useAtom(copyPanelDispatchAtom);
    const [expanded, setExpanded] = useState(false);

    const { data: subDirs } = useList(
      {
        show_hidden: panelConfig[side].show_hidden,
        path: item.full_path,
      },
      { enabled: expanded },
    );
    console.log(subDirs);

    const { mutate: forward } = useForward({
      onSuccess({ path }) {
        updateConfig({ type: "setPath", payload: { side, to: path } });
      },
    });

    return (
      <>
        <div
          className={cn("flex cursor-pointer items-center gap-2", className)}
          {...props}
          ref={ref}
        >
          <Checkbox
          // onCheckedChange={(e) => {
          //   if (onCheckboxSelect) {
          //     if (e !== "indeterminate") onCheckboxSelect(name, e);
          //     else onCheckboxSelect(name, false);
          //   }
          // }}
          />

          {is_folder ? (
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {expanded ? <ArrowDown /> : <ArrowDownRight />}
            </Button>
          ) : null}

          <Button
            variant="ghost"
            className="min-w-0 flex-1 justify-start gap-2 px-2 py-0 hover:underline"
            onClick={() => {
              if (is_folder) forward({ path: name, to_folder: name });
            }}
          >
            {is_folder ? (
              <Folder className="h-4 w-4 shrink-0" />
            ) : (
              <File className="h-4 w-4 shrink-0" />
            )}
            <FileName name={name} className="w-full" />
          </Button>
        </div>

        {expanded ? (
          <div className="flex flex-col gap-2">
            {/* FIX: render crash
                probably better to manage state from rust's side
                */}
            {/* {subDirs?.children.map((dir) => ( */}
            {/*   <DirPanelItem side={side} item={dir} key={dir.full_path} /> */}
            {/* ))} */}
          </div>
        ) : null}
      </>
    );
  },
);

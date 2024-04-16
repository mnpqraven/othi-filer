import { Folder, File, ArrowDownRight, ArrowDown, Loader } from "lucide-react";
import { type HTMLAttributes } from "react";
import { useAtomValue } from "jotai";
import { cva } from "class-variance-authority";
import { type DirItem } from "@/bindings/taurpc";
import { FileName } from "@/components/FileName";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useForward,
  useListDir,
  usePanelConfig,
  useToggleSelect,
  useToggleExpand,
} from "@/hooks/dirAction/useUIAction";
import { cn } from "@/lib/utils";
import { panelSideAtom, selectedIdMouseAtom } from "./_store";

interface Prop extends HTMLAttributes<HTMLDivElement> {
  dirItem: DirItem;
}

/**
 * NOTE: this component should be `forwardRef`, recursion will cause crashing by using the same ref
 */
export function DirPanelItem({ dirItem, className, ...props }: Prop) {
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = usePanelConfig({ side });

  const dirIsExpanded = Boolean(
    panelState?.expanded_paths.find((e) => e === dirItem.path),
  );
  const { data: listDirData, isLoading } = useListDir(
    { path: dirItem.path, show_hidden: panelState?.show_hidden, side },
    { enabled: panelState?.show_hidden !== undefined && dirIsExpanded },
  );

  if (isLoading)
    return (
      <>
        <Loader className="animate-spin" />
        Loading ...
      </>
    );
  return (
    <>
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <SelectButton {...dirItem} />

        <ExpandButton {...dirItem} />

        <FileMetaBlock {...dirItem} />
      </div>

      {dirIsExpanded && listDirData?.length ? (
        <div className="flex flex-col gap-2 pl-6">
          {listDirData.map((dir) => (
            <DirPanelItem dirItem={dir} key={dir.path} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function SelectButton({ path }: DirItem) {
  const { mutate: select } = useToggleSelect();
  const side = useAtomValue(panelSideAtom);
  const { data: panelData } = usePanelConfig({ side });

  const checked = panelData?.selected_items.includes(path) ?? false;

  return (
    <Checkbox
      tabIndex={-1}
      checked={checked}
      onCheckedChange={(e) => {
        const selected = e === "indeterminate" ? false : e;
        select({ side, paths: [path], selected });
      }}
    />
  );
}

function ExpandButton({ is_folder, path }: DirItem) {
  const { mutate: expand } = useToggleExpand();
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = usePanelConfig({ side });

  const expanded = Boolean(panelState?.expanded_paths.find((e) => e === path));

  if (!is_folder) return null;
  return (
    <Button
      tabIndex={-1}
      variant="ghost"
      className="h-auto p-0"
      onClick={() => {
        expand({
          paths: [path],
          side,
          expanded: !expanded,
        });
      }}
    >
      {expanded ? <ArrowDown /> : <ArrowDownRight />}
    </Button>
  );
}

function FileMetaBlock(item: DirItem) {
  const { is_folder, path, short_path } = item;
  const { mutate } = useForward();
  const side = useAtomValue(panelSideAtom);
  const selectedIds = useAtomValue(selectedIdMouseAtom);
  const isSelected = selectedIds.includes(
    `diritem-selector-${side}-${item.path}`,
  );

  const variants = cva(
    "min-w-48 h-auto justify-start gap-2 border border-transparent px-2 py-0.5 hover:underline",
    {
      variants: {
        variant: {
          default: "",
          selected: "border-accent bg-accent/30 text-accent-foreground",
        },
      },
    },
  );

  return (
    <Button
      id={`diritem-selector-${side}-${item.path}`}
      variant="ghost"
      className={variants({ variant: isSelected ? "selected" : "default" })}
      onDoubleClick={() => {
        if (is_folder) mutate({ side, to: path });
      }}
    >
      {is_folder ? (
        <Folder className="h-4 w-4 shrink-0" />
      ) : (
        <File className="h-4 w-4 shrink-0" />
      )}
      <FileName path={short_path} className="w-full" />
    </Button>
  );
}

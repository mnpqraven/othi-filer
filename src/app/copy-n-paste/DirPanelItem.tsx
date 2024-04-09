import { Folder, File, ArrowDownRight, ArrowDown } from "lucide-react";
import { type HTMLAttributes } from "react";
import { useAtomValue } from "jotai";
import { type DirItem } from "@/bindings/taurpc";
import { FileName } from "@/components/FileName";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useForward,
  useListDir,
  usePanelConfig,
  useSelect,
  useToggleExpand,
} from "@/hooks/dirAction/useUIAction";
import { cn } from "@/lib/utils";
import { panelSideAtom } from "./_store";

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
  const { data: listDirData } = useListDir(
    { path: dirItem.path, show_hidden: panelState?.show_hidden },
    { enabled: panelState?.show_hidden !== undefined && dirIsExpanded },
  );

  return (
    <>
      <div
        className={cn("flex cursor-pointer items-center gap-2", className)}
        {...props}
      >
        <SelectButton {...dirItem} />

        <ExpandButton {...dirItem} />

        <FileMetaBlock {...dirItem} />
      </div>

      {dirIsExpanded ? (
        <div className="flex flex-col gap-2 pl-6">
          {listDirData?.map((dir) => (
            <DirPanelItem dirItem={dir} key={dir.path} />
          ))}
        </div>
      ) : null}
    </>
  );
}

function SelectButton({ path }: DirItem) {
  const { mutate } = useSelect();
  const side = useAtomValue(panelSideAtom);

  return (
    <Checkbox
      onCheckedChange={(e) => {
        const selected = e === "indeterminate" ? false : e;
        mutate({ side, path, selected });
      }}
    />
  );
}

function ExpandButton({ is_folder, path }: DirItem) {
  const { mutate: toggleExpand } = useToggleExpand();
  const side = useAtomValue(panelSideAtom);
  const { data: panelState } = usePanelConfig({ side });

  const expanded = Boolean(panelState?.expanded_paths.find((e) => e === path));

  if (!is_folder) return null;
  return (
    <Button
      variant="ghost"
      className="p-0"
      onClick={() => {
        toggleExpand({
          folder_path: path,
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
  return (
    <Button
      variant="ghost"
      className="min-w-0 flex-1 justify-start gap-2 px-2 py-0 hover:underline"
      onClick={() => {
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

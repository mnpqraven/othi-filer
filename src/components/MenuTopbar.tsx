/* eslint-disable react/no-array-index-key */
import { Fragment } from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./ui/menubar";

interface ContextBarItem {
  label: string;
  subgroupItems: ContextSubGroupItem[][];
}

type ContextSubGroupItem =
  | {
      label: string;
      // TODO: modifiers should be enumerated
      disabled?: boolean;
      shortcut?: { key: string; modifiers: string[] };
      action?: () => void;
    }
  | {
      label: string;
      // TODO: modifiers should be enumerated
      disabled?: boolean;
      subgroupItems: ContextSubGroupItem[][];
    };

export function MenuTopbar() {
  const menuConfig: ContextBarItem[] = [
    {
      label: "File",
      subgroupItems: [
        [
          { label: "New Tab", shortcut: { key: "T", modifiers: ["CTRL"] } },
          { label: "New Window" },
        ],
        [
          {
            label: "Share",
            subgroupItems: [
              [{ label: "to me" }, { label: "to you" }],
              [{ label: "to UID" }],
              [{ label: "other", subgroupItems: [[{ label: "custom" }]] }],
            ],
          },
          { label: "Print" },
        ],
        [{ label: "About" }],
      ],
    },
    {
      label: "Edit",
      subgroupItems: [
        [{ label: "New Tab", shortcut: { key: "T", modifiers: ["CTRL"] } }],
        [{ label: "New Window" }],
        [{ label: "Print" }],
      ],
    },
  ];

  return (
    <Menubar>
      {menuConfig.map((menu, index) => (
        <MenubarMenu key={`${menu.label}-${index.toString()}`}>
          <MenubarTrigger>{menu.label}</MenubarTrigger>
          <MenubarContent>
            {menu.subgroupItems.map((dropdownConf, index) => (
              <Fragment key={index}>
                <DropdownTree data={dropdownConf} />
                {index + 1 < menu.subgroupItems.length ? (
                  <MenubarSeparator />
                ) : null}
              </Fragment>
            ))}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}

function DropdownTree({ data }: { data: ContextSubGroupItem[] }) {
  return (
    <>
      {data.map((subgroupOrItem, index) => (
        <Fragment key={index}>
          <SubgroupOrItem data={subgroupOrItem} key={index} />
        </Fragment>
      ))}
    </>
  );
}

function SubgroupOrItem({ data }: { data: ContextSubGroupItem }) {
  // INFO: case for subgroup items
  // this causes recursion in the menu tree
  if ("subgroupItems" in data) {
    return (
      <MenubarSub>
        <MenubarSubTrigger>{data.label}</MenubarSubTrigger>
        <MenubarSubContent>
          {data.subgroupItems.map((dropdownConf, index) => (
            <Fragment key={index}>
              <DropdownTree data={dropdownConf} />
              {index + 1 < data.subgroupItems.length ? (
                <MenubarSeparator />
              ) : null}
            </Fragment>
          ))}
        </MenubarSubContent>
      </MenubarSub>
    );
  }

  // case for normal menu item, recursion stops here
  return <MenubarItem>{data.label}</MenubarItem>;
}

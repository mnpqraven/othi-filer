/* eslint-disable no-console */
import { readDir } from "@tauri-apps/api/fs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useHomeDir } from "./useHomeDir";
import { useSystem } from "./useSystem";

interface ListOpt {
  hello: "world";
}
export function usePathTraverse(_opt?: ListOpt) {
  const { data } = useHomeDir();
  const { data: systemData } = useSystem();
  const delim = systemData === "win32" ? "\\" : "/";

  const [path, setPath] = useState(data?.home);

  useEffect(() => {
    if (data?.home) setPath(data.home);
  }, [data]);

  const listQuery = useQuery({
    queryKey: ["listdir", path],
    queryFn: async () => {
      const res: {
        path: string;
        short_path: string;
        children: { path: string; name: string }[];
      } = await invoke("list_dir");
      return res;
      // if (path) {
      //   const entries = await readDir(path);
      //   return entries;
      // }
      // return [];
    },
    enabled: Boolean(data?.home),
  });
  function forward(opt: { folderName: string } | { pathName: string }) {
    if (path) {
      if ("folderName" in opt) {
        setPath(`${path}${delim}${opt.folderName}`);
      } else {
        setPath(opt.pathName);
      }
    }
  }
  function back() {
    if (!path) return;
    // early return for root
    console.log(" path", path);
    if (systemData === "win32" && path.length <= 2) return;
    else if (path === delim) return;

    console.log("back fn", path);

    const slashIndex = path.lastIndexOf(delim);

    const nextPath = path.slice(0, slashIndex);
    console.log("nextpath", nextPath);
    // only for unix
    if (nextPath.length) setPath(nextPath);
  }

  return { path, forward, back, listQuery };
}

/* eslint-disable no-console */
import { readDir } from "@tauri-apps/api/fs";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useHomeDir } from "./useHomeDir";

interface ListOpt {
  hello: "world";
}
export function usePathTraverse(_opt?: ListOpt) {
  const { data } = useHomeDir();

  const [path, setPath] = useState(data?.home);

  useEffect(() => {
    if (data?.home) setPath(data.home);
  }, [data]);

  const listQuery = useQuery({
    queryKey: ["listdir", path],
    queryFn: async () => {
      if (path) {
        const entries = await readDir(path);
        return entries;
      }
      return [];
    },
    enabled: Boolean(data?.home),
  });
  function forward(opt: { folderName: string } | { pathName: string }) {
    if (path) {
      if ("folderName" in opt) {
        setPath(`${path}/${opt.folderName}`);
      } else {
        setPath(opt.pathName);
      }
    }
  }
  function back() {
    if (!path) return;
    if (path === "/") return;

    console.log("back fn", path);

    const slashIndex = path.lastIndexOf("/");

    const nextPath = path.slice(0, slashIndex);
    console.log("nextpath", nextPath);
    // only for unix
    if (nextPath.length) setPath(nextPath);
  }

  return { path, forward, back, listQuery };
}

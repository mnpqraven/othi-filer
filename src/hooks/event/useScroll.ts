import { useEffect, useRef, useState } from "react";

export function useScroll(opt?: { threshold: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [overThreshold, setOverThreshold] = useState(false);

  useEffect(() => {
    ref.current?.addEventListener("scroll", (_ev) => {
      if (opt?.threshold) {
        if (ref.current?.scrollTop && ref.current.scrollTop > opt.threshold) {
          setOverThreshold(true);
        } else setOverThreshold(false);
      }
    });
  }, [opt]);

  function toTop(opt?: ScrollToOptions) {
    ref.current?.scrollTo({
      top: opt?.top ?? 0,
      behavior: opt?.behavior ?? "smooth",
      left: opt?.left ?? 0,
    });
  }

  function toBottom(opt?: ScrollToOptions) {
    ref.current?.scrollTo({
      top: opt?.top ?? 0,
      behavior: opt?.behavior ?? "smooth",
      left: opt?.left ?? 0,
    });
  }

  return { refWithScroll: ref, toTop, toBottom, overThreshold };
}

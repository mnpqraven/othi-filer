import dynamic from "next/dynamic";

const Panel = dynamic(() => import("./Panel").then((e) => e.Panel), {
  ssr: false,
});
export default function Page() {
  return (
    <div className="flex flex-1 justify-center gap-4">
      <Panel panelType="left" />
      <div className="grow-0">middle actions</div>
      <Panel panelType="right" />
    </div>
  );
}

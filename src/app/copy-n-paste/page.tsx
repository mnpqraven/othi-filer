import { Panel } from "./Panel";

export default function Page() {
  return (
    <div className="flex flex-1 justify-center gap-4">
      <Panel panelType="left" />
      <div className="grow-0">middle actions</div>
      <Panel panelType="right" />
    </div>
  );
}

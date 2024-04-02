export default function Page() {
  return (
    <div className="flex justify-center gap-4">
      <Panel panelType="left" />
      <div className="grow-0">middle actions</div>
      <Panel panelType="right" />
    </div>
  );
}

function Panel({ panelType }: { panelType: "left" | "right" }) {
  return (
    <div className="flex flex-col gap-2 grow">
      <div>actionbar</div>
      <div className="border rounded-md">{panelType}</div>
    </div>
  );
}

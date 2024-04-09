import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LinkItem {
  href: string;
  title: string;
  description?: string;
}
export default function LandingPage() {
  const links: LinkItem[] = [
    { href: "/copy-n-paste", title: "Copy & Paste", description: "ree" },
    { href: "/test", title: "Test", description: "test playground" },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 p-8">
      {links.map((link) => (
        <LinkItem key={link.href} {...link} />
      ))}
    </div>
  );
}

function LinkItem({ href, title, description }: LinkItem) {
  return (
    <Button asChild variant="outline">
      <Link href={href} className="flex flex-col py-8">
        <span className="font-bold">{title}</span>
        <span>{description}</span>
      </Link>
    </Button>
  );
}

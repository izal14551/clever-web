import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ProfileSubpageHeader({
  title,
  backHref = "/menu",
}: {
  title: string;
  backHref?: string;
}) {
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-[#9c8466] to-[#b59a79] px-4 py-4 text-white">
      <div className="flex items-center gap-3">
        <Link href={backHref} className="inline-flex items-center justify-center">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
}

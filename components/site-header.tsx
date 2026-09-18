import Link from "next/link";
import { site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07110d]/85 backdrop-blur-xl">
      <div className="container flex min-h-18 items-center justify-between gap-6">
        <Link href="/" className="font-semibold tracking-tight" aria-label={`${site.name} home`}>
          JO<span className="text-[#7ce59c]">.</span>
        </Link>
        <nav className="hidden gap-7 text-sm text-[#91a79a] md:flex" aria-label="Primary navigation">
          <Link className="transition hover:text-white" href="/projects">Projects</Link>
          <Link className="transition hover:text-white" href="/notes">Notes</Link>
          <Link className="transition hover:text-white" href="/about">About</Link>
          <Link className="transition hover:text-white" href="/resume">Resume</Link>
        </nav>
        <a href={`mailto:${site.email}`} className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-[#b5f6c6] transition hover:border-[#7ce59c]/40 hover:bg-white/5 sm:block">
          Let&apos;s connect
        </a>
      </div>
    </header>
  );
}

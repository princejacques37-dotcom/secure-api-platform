import { Github, Linkedin, Mail } from "lucide-react";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container flex flex-col gap-5 text-sm text-[#718579] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[#b8c9bc]">{site.name}</p>
          <p className="mt-1">Software · Systems · Security · DevSecOps</p>
        </div>
        <div className="flex items-center gap-4">
          <a aria-label="GitHub" href={site.github} target="_blank" rel="noreferrer" className="transition hover:text-white"><Github size={17} /></a>
          <a aria-label="LinkedIn" href={site.linkedin} target="_blank" rel="noreferrer" className="transition hover:text-white"><Linkedin size={17} /></a>
          <a aria-label="Email" href={`mailto:${site.email}`} className="transition hover:text-white"><Mail size={17} /></a>
        </div>
      </div>
    </footer>
  );
}

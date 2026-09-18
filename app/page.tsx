import Link from "next/link";
import { ArrowUpRight, BarChart3, CloudCog, Github, Mail, ShieldCheck, Terminal } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { projects, site } from "@/data/site";

const focus = [
  [Terminal, "Software Engineering", "Build maintainable applications, APIs and developer tooling."],
  [ShieldCheck, "Security Engineering", "Design for secure authentication, hardening, detection and resilience."],
  [CloudCog, "DevSecOps & Cloud", "Automate delivery and secure infrastructure from commit to production."],
  [BarChart3, "Statistics & Analytics", "Use statistical thinking to understand systems, signals and anomalies."],
] as const;

const path = [
  ["01", "Software Engineer", "Applications · APIs · tooling"],
  ["02", "Systems Engineer", "Linux · networking · infrastructure"],
  ["03", "Security Engineer", "Hardening · detection · architecture"],
  ["04", "DevSecOps / Cloud Security", "Automation · CI/CD · cloud controls"],
] as const;

export default function Home() {
  return <PageShell>
    <section className="container grid min-h-[720px] items-center py-24 md:grid-cols-[1.2fr_.8fr] md:gap-12">
      <div>
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7ce59c]/20 bg-[#7ce59c]/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#b5f6c6]"><span className="h-1.5 w-1.5 rounded-full bg-[#7ce59c]" /> Building secure systems</p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl">Software. Systems. Security. <span className="text-[#7ce59c]">Built to last.</span></h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-[#91a79a]">I&apos;m {site.name}. I build software, understand the systems underneath it, and work toward secure, automated cloud infrastructure.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/projects" className="inline-flex items-center gap-2 rounded-full bg-[#7ce59c] px-5 py-3 text-sm font-semibold text-[#07110d] transition hover:-translate-y-0.5 hover:bg-[#b5f6c6]">Explore my work <ArrowUpRight size={17} /></Link>
          <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/5"><Github size={17} /> GitHub</a>
        </div>
        <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[0.16em] text-[#60756a]"><span>Python</span><span>Linux</span><span>TypeScript</span><span>Docker</span><span>Cloud</span><span>Security</span></div>
      </div>
      <div className="glass relative overflow-hidden rounded-3xl p-6 md:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7ce59c]/60 to-transparent" />
        <div className="flex items-center justify-between border-b border-white/5 pb-5"><span className="text-xs uppercase tracking-[0.18em] text-[#60756a]">Engineering path</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-[#91a79a]">01 → 04</span></div>
        <div className="space-y-5 py-6">{path.map(([n,t,d],i)=><div key={n} className="flex gap-4"><div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs ${i===0?"border-[#7ce59c]/40 text-[#7ce59c]":"border-white/10 text-[#60756a]"}`}>{n}</div><div><h3 className="font-medium text-white">{t}</h3><p className="mt-1 text-sm text-[#758b7d]">{d}</p></div></div>)}</div>
      </div>
    </section>

    <section className="border-y border-white/5 bg-black/10 py-24"><div className="container"><div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs uppercase tracking-[0.2em] text-[#7cae89]">Selected work</p><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Projects that show the thinking.</h2></div><Link href="/projects" className="inline-flex items-center gap-2 text-sm text-[#b5f6c6]">All projects <ArrowUpRight size={16}/></Link></div><div className="grid gap-5 lg:grid-cols-3">{projects.map((p)=><article key={p.slug} className="glass group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7ce59c]/20"><div className="mb-10 flex items-center justify-between text-xs text-[#7cae89]"><span>{p.type}</span><ArrowUpRight size={16} className="opacity-0 transition group-hover:opacity-100"/></div><h3 className="text-xl font-semibold">{p.title}</h3><p className="mt-3 min-h-24 text-sm leading-6 text-[#8da294]">{p.summary}</p><div className="mt-6 flex flex-wrap gap-2">{p.stack.map(tag=><span key={tag} className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[11px] text-[#91a79a]">{tag}</span>)}</div><Link href={`/projects/${p.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm text-[#b5f6c6]">View project <ArrowUpRight size={15}/></Link></article>)}</div></div></section>

    <section className="container py-24"><div className="max-w-2xl"><p className="text-xs uppercase tracking-[0.2em] text-[#7cae89]">What I work on</p><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">A connected engineering stack.</h2><p className="mt-4 leading-7 text-[#91a79a]">The goal isn&apos;t to collect tools. It&apos;s to understand how software, infrastructure, security and data fit together.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2">{focus.map(([Icon,title,text])=><div key={title} className="glass rounded-3xl p-6"><Icon size={22} className="text-[#7ce59c]"/><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-[#8da294]">{text}</p></div>)}</div></section>

    <section className="border-y border-white/5 py-24"><div className="container grid gap-10 md:grid-cols-[.7fr_1.3fr]"><div><p className="text-xs uppercase tracking-[0.2em] text-[#7cae89]">Engineering notes</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Learn in public.</h2><p className="mt-4 leading-7 text-[#91a79a]">Technical notes on systems, security, cloud infrastructure and practical experiments.</p></div><div className="divide-y divide-white/5 border-y border-white/5"><Link href="/notes" className="group flex items-center justify-between gap-6 py-5"><span className="text-sm text-[#d3e3d7] transition group-hover:text-white">Explore the notes and technical experiments</span><ArrowUpRight size={16} className="shrink-0 text-[#60756a] group-hover:text-[#7ce59c]"/></Link></div></div></section>

    <section className="container py-24"><div className="glass rounded-[2rem] p-8 md:p-12"><div className="grid gap-10 md:grid-cols-[.7fr_1.3fr] md:items-start"><div><p className="text-xs uppercase tracking-[0.2em] text-[#7cae89]">About</p><h2 className="mt-3 text-3xl font-semibold">Build deeply. Document clearly.</h2></div><div><p className="leading-7 text-[#91a79a]">My background in Statistics and Computer Science shapes how I approach engineering: software craftsmanship, systems thinking, data-driven analysis and security awareness.</p><Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm text-[#b5f6c6]">More about me <ArrowUpRight size={16}/></Link></div></div></div></section>

    <section className="container pb-24"><div className="relative overflow-hidden rounded-[2rem] border border-[#7ce59c]/15 bg-[#0d1a13] p-8 md:p-12"><div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7ce59c]/10 blur-3xl"/><p className="relative text-xs uppercase tracking-[0.2em] text-[#7cae89]">Contact</p><h2 className="relative mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">Let&apos;s build something thoughtful.</h2><p className="relative mt-4 max-w-xl leading-7 text-[#91a79a]">Open to technical conversations, collaborations, engineering opportunities and interesting problems.</p><div className="relative mt-8 flex flex-wrap gap-3"><a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-full bg-[#7ce59c] px-5 py-3 text-sm font-semibold text-[#07110d]"><Mail size={17}/> Email me</a><a href={site.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-medium">LinkedIn</a></div></div></section>
  </PageShell>;
}

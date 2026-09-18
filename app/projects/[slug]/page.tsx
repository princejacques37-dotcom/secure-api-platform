import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { projects, site } from "@/data/site";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return <PageShell><section className="container py-24">
    <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-[#91a79a] hover:text-white"><ArrowLeft size={16}/> All projects</Link>
    <div className="mt-10 max-w-4xl">
      <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#7cae89]"><span>{project.type}</span><span className="text-[#60756a]">{project.status}</span></div>
      <h1 className="mt-4 text-5xl font-semibold tracking-[-0.03em] md:text-6xl">{project.title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-[#91a79a]">{project.summary}</p>
      <div className="mt-8 flex flex-wrap gap-3"><a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white"><Github size={17}/> GitHub</a>{project.demo && <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#7ce59c] px-5 py-3 text-sm font-semibold text-[#07110d]">Live demo <ArrowUpRight size={16}/></a>}</div>
    </div>
    <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <article className="glass rounded-3xl p-8"><p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">Case study</p><h2 className="mt-4 text-2xl font-semibold">What this project is meant to prove</h2><p className="mt-4 leading-7 text-[#91a79a]">{project.outcome}</p><div className="mt-10 border-t border-white/5 pt-8"><h3 className="text-sm font-semibold text-white">Build notes</h3><p className="mt-3 leading-7 text-[#91a79a]">This page is ready to become the permanent case study for the project. Add architecture diagrams, implementation decisions, security controls, benchmarks, screenshots, and lessons learned as the build becomes real.</p></div></article>
      <aside className="glass rounded-3xl p-8"><p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">Stack</p><div className="mt-5 flex flex-wrap gap-2">{project.stack.map((item)=><span key={item} className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs text-[#d3e3d7]">{item}</span>)}</div><div className="mt-10 border-t border-white/5 pt-8"><p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">Contact</p><a href={`mailto:${site.email}`} className="mt-3 inline-flex text-sm text-[#b5f6c6]">Discuss this project <ArrowUpRight size={15} className="ml-2"/></a></div></aside>
    </div>
  </section></PageShell>;
}

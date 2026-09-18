import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { site } from "@/data/site";

export default function About(){
  return <PageShell><section className="container py-24">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#91a79a] hover:text-white"><ArrowLeft size={16}/> Home</Link>
    <div className="mt-10 grid gap-14 md:grid-cols-[.8fr_1.2fr]">
      <div><p className="text-xs uppercase tracking-[0.2em] text-[#7cae89]">About</p><h1 className="mt-3 text-5xl font-semibold tracking-[-0.03em] md:text-6xl">A long-term engineering path.</h1></div>
      <div className="space-y-6 text-lg leading-8 text-[#91a79a]">
        <p>I&apos;m Jack Ochieng, an engineer focused on building reliable, secure and scalable technology.</p>
        <p>I&apos;m pursuing Statistics and Computer Science at the Technical University of Mombasa, combining software engineering foundations with statistical reasoning and data-driven problem solving.</p>
        <p>My technical direction is deliberate: grow from software engineering into systems engineering, then security engineering, and ultimately DevSecOps and cloud security.</p>
        <p>This website is a living record of that path—projects become case studies, experiments become notes, and skills are backed by practical evidence.</p>
      </div>
    </div>
    <div className="mt-20 grid gap-4 md:grid-cols-3">
      <div className="glass rounded-3xl p-7"><p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">01</p><h2 className="mt-5 text-xl font-semibold">Build</h2><p className="mt-3 text-sm leading-6 text-[#91a79a]">Applications, APIs, automation and developer tooling.</p></div>
      <div className="glass rounded-3xl p-7"><p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">02</p><h2 className="mt-5 text-xl font-semibold">Understand</h2><p className="mt-3 text-sm leading-6 text-[#91a79a]">Linux, networking, infrastructure and distributed systems.</p></div>
      <div className="glass rounded-3xl p-7"><p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">03</p><h2 className="mt-5 text-xl font-semibold">Secure</h2><p className="mt-3 text-sm leading-6 text-[#91a79a]">Identity, hardening, detection, automation and cloud controls.</p></div>
    </div>
    <div className="mt-10 glass rounded-3xl p-7">
      <p className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">Education</p>
      <h2 className="mt-4 text-xl font-semibold">{site.education}</h2>
      <p className="mt-2 text-sm text-[#91a79a]">Building a strong foundation in computing, statistics and analytical problem solving.</p>
    </div>
    <Link href="/resume" className="mt-10 inline-flex items-center gap-2 text-sm text-[#b5f6c6]">View resume <ArrowUpRight size={16}/></Link>
  </section></PageShell>
}

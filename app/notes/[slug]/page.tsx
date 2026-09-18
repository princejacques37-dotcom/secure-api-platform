import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { notes } from "@/data/site";

export function generateStaticParams() { return notes.map((note) => ({ slug: note.slug })); }
export default async function Note({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = notes.find((item) => item.slug === slug);
  if (!note) notFound();
  return <PageShell><section className="container py-24"><Link href="/notes" className="inline-flex items-center gap-2 text-sm text-[#91a79a] hover:text-white"><ArrowLeft size={16}/> All notes</Link><div className="mt-10 max-w-3xl"><p className="text-xs uppercase tracking-[0.2em] text-[#7cae89]">{note.category} · {note.read} · {note.status}</p><h1 className="mt-4 text-5xl font-semibold tracking-[-0.03em] md:text-6xl">{note.title}</h1><p className="mt-6 text-lg leading-8 text-[#91a79a]">This note is staged as part of the long-term engineering journal. Publish the actual write-up when the experiment or research is complete.</p></div><article className="glass mt-14 max-w-3xl rounded-3xl p-8"><h2 className="text-xs uppercase tracking-[0.16em] text-[#7cae89]">Writing area</h2><p className="mt-5 leading-7 text-[#91a79a]">Use this page for the problem, context, technical explanation, evidence, commands or code, security implications, and lessons learned. Keeping these notes public turns your learning process into durable portfolio evidence.</p></article></section></PageShell>;
}

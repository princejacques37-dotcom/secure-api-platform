import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <div className="pointer-events-none fixed inset-0 -z-10 grid-bg" />
      <SiteHeader />
      {children}
      <SiteFooter />
    </main>
  );
}

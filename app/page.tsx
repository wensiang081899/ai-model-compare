import { ModelExplorer } from "@/components/ModelExplorer";
import { Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.65]" />
      <div className="pointer-events-none absolute -left-40 top-24 h-[420px] w-[420px] glow-orb" />
      <div className="pointer-events-none absolute -right-32 top-[40%] h-[380px] w-[380px] glow-orb opacity-70" />

      <header className="relative border-b border-white/[0.06] bg-[#0a0a0f]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
              <Layers className="size-5 text-white" aria-hidden />
            </span>
            <span className="font-display text-lg font-semibold tracking-tight">
              Benchplane
            </span>
          </a>
          <nav className="flex items-center gap-3 text-sm">
            <span className="hidden text-zinc-500 sm:inline">
              API pricing at a glance
            </span>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/20">
              Sample rates
            </span>
          </nav>
        </div>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-6xl px-4 pb-2 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs font-medium text-indigo-200/90 ring-1 ring-indigo-500/15">
            Compare tokens, not hype
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Pick the right model{" "}
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              without spreadsheet fatigue
            </span>
            .
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Search across providers, sort by the cheapest blended rate, and
            compare input versus output pricing side by side — optimized for
            phones and wide monitors alike.
          </p>
        </section>

        <ModelExplorer />
      </main>

      <footer className="relative mt-8 border-t border-white/[0.06] py-10">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs leading-relaxed text-zinc-600 sm:px-6 lg:px-8">
          <p>
            Figures are illustrative examples for UI demo purposes. Always
            confirm current rates on each provider&apos;s billing page before
            you ship to production.
          </p>
          <p className="mt-2 text-zinc-700">
            © {new Date().getFullYear()} Benchplane. Built with Next.js &
            Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

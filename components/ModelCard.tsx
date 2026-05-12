import type { AIModel } from "@/lib/models";
import { blendedPricePerM } from "@/lib/models";
import { Box, Sparkles } from "lucide-react";

type Props = {
  model: AIModel;
  rank: number;
};

function formatUsd(n: number): string {
  return n.toFixed(2);
}

function formatCtx(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}

export function ModelCard({ model, rank }: Props) {
  const blended = blendedPricePerM(model);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12121a]/80 p-5 shadow-[0_0_0_1px_rgb(255_255_255/0.04)_inset] backdrop-blur-md transition hover:border-indigo-500/35 hover:bg-[#16161f]">
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:bg-indigo-400/15" />
      <div className="relative flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              {model.provider}
            </p>
            <h3 className="font-display mt-1 text-lg font-semibold tracking-tight text-white">
              {model.name}
            </h3>
          </div>
          <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-semibold tabular-nums text-zinc-300 ring-1 ring-white/[0.06]">
            #{rank}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/[0.06]">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Input
            </p>
            <p className="mt-0.5 font-mono text-sm text-emerald-300/95">
              ${formatUsd(model.inputPerMillion)}
              <span className="text-[10px] font-sans text-zinc-500"> /1M</span>
            </p>
          </div>
          <div className="rounded-xl bg-black/30 px-3 py-2 ring-1 ring-white/[0.06]">
            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              Output
            </p>
            <p className="mt-0.5 font-mono text-sm text-sky-300/95">
              ${formatUsd(model.outputPerMillion)}
              <span className="text-[10px] font-sans text-zinc-500"> /1M</span>
            </p>
          </div>
          <div className="col-span-2 rounded-xl bg-indigo-500/[0.07] px-3 py-2 ring-1 ring-indigo-400/20 sm:col-span-1">
            <p className="text-[10px] font-medium uppercase tracking-wide text-indigo-200/70">
              Blended avg
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold text-indigo-100">
              ${formatUsd(blended)}
              <span className="text-[10px] font-sans font-normal text-indigo-200/50">
                {" "}
                /1M
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-zinc-400 ring-1 ring-white/[0.06]">
            <Box className="size-3.5 opacity-70" aria-hidden />
            {formatCtx(model.contextTokens)} ctx
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-zinc-400 ring-1 ring-white/[0.06]">
            <Sparkles className="size-3.5 opacity-70" aria-hidden />
            {model.modality === "multimodal" ? "Multimodal" : "Text"}
          </span>
        </div>
      </div>
    </article>
  );
}

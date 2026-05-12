"use client";

import { useMemo, useState } from "react";
import { MODELS, blendedPricePerM, type AIModel } from "@/lib/models";
import { ModelCard } from "@/components/ModelCard";
import { ArrowDownWideNarrow, Search } from "lucide-react";

export type SortMode = "cheapest_blended" | "cheapest_input" | "cheapest_output" | "name";

function sortModels(list: AIModel[], mode: SortMode): AIModel[] {
  const copy = [...list];
  switch (mode) {
    case "cheapest_input":
      return copy.sort((a, b) => a.inputPerMillion - b.inputPerMillion);
    case "cheapest_output":
      return copy.sort((a, b) => a.outputPerMillion - b.outputPerMillion);
    case "name":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "cheapest_blended":
    default:
      return copy.sort(
        (a, b) => blendedPricePerM(a) - blendedPricePerM(b),
      );
  }
}

function matchesQuery(model: AIModel, q: string): boolean {
  if (!q.trim()) return true;
  const s = q.trim().toLowerCase();
  return (
    model.name.toLowerCase().includes(s) ||
    model.provider.toLowerCase().includes(s)
  );
}

export function ModelExplorer() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortMode>("cheapest_blended");

  const filtered = useMemo(() => {
    const matched = MODELS.filter((m) => matchesQuery(m, query));
    return sortModels(matched, sort);
  }, [query, sort]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex-1">
          <span className="sr-only">Search models</span>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model or provider…"
            className="w-full rounded-xl border border-white/[0.08] bg-[#12121a]/90 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-indigo-500/0 transition focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/15"
          />
        </label>

        <div className="flex items-center gap-2 sm:shrink-0">
          <span className="hidden text-xs text-zinc-500 sm:inline">Sort</span>
          <div className="relative flex-1 sm:flex-initial">
            <ArrowDownWideNarrow
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500"
              aria-hidden
            />
            <select
              aria-label="Sort models"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="w-full appearance-none rounded-xl border border-white/[0.08] bg-[#12121a]/90 py-3 pl-10 pr-10 text-sm text-zinc-100 outline-none ring-indigo-500/0 transition focus:border-indigo-500/40 focus:ring-4 focus:ring-indigo-500/15 sm:min-w-[220px]"
            >
              <option value="cheapest_blended">Cheapest (blended)</option>
              <option value="cheapest_input">Cheapest input</option>
              <option value="cheapest_output">Cheapest output</option>
              <option value="name">Name (A–Z)</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
              ▾
            </span>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-zinc-500">
        Showing{" "}
        <span className="font-medium text-zinc-300">{filtered.length}</span>{" "}
        models
        {query.trim() ? (
          <>
            {" "}
            matching &ldquo;{query.trim()}&rdquo;
          </>
        ) : null}
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((model, index) => (
          <li key={model.id}>
            <ModelCard model={model} rank={index + 1} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-zinc-500">
          No models match your search. Try another provider or model name.
        </p>
      ) : null}
    </div>
  );
}

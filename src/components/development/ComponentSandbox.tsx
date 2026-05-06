"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { developmentRegistry } from "@/components/development/registry";

export default function ComponentSandbox() {
  const [activeId, setActiveId] = useState(developmentRegistry[0]?.id ?? "");

  const activeComponent = useMemo(
    () => developmentRegistry.find((entry) => entry.id === activeId),
    [activeId],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-3xl border border-black/10 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-6 shadow-[0_10px_40px_rgb(0,0,0,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/60">
          Isolated Component Lab
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-black sm:text-4xl">
          Development Route
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-black/70 sm:text-base">
          Build and validate components in this route first. Once stable, move
          them into production pages.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-black/10 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-black/60">
            Component Registry
          </h2>
          <div className="space-y-2">
            {developmentRegistry.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setActiveId(entry.id)}
                className={[
                  "w-full rounded-xl border px-3 py-2 text-left transition",
                  activeId === entry.id
                    ? "border-black bg-black text-white"
                    : "border-black/10 bg-white text-black hover:border-black/40",
                ].join(" ")}
              >
                <p className="text-sm font-medium">{entry.name}</p>
                <p className="mt-1 text-xs opacity-80">{entry.description}</p>
              </button>
            ))}
          </div>
        </aside>

        <section className="space-y-6">
          <div className="rounded-2xl border border-dashed border-black/20 bg-white/95 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-black">
                  {activeComponent?.name ?? "No Component Selected"}
                </h2>
                <p className="text-sm text-black/65">
                  {activeComponent?.description ??
                    "Add entries to the development registry to preview components."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setActiveId(developmentRegistry[0]?.id ?? "")}
              >
                Reset Preview
              </Button>
            </div>

            <div className="rounded-xl bg-gradient-to-b from-white to-slate-50 p-3 sm:p-5">
              {activeComponent?.component ?? (
                <p className="text-sm text-black/60">
                  Start by adding a component in
                  <span className="font-semibold"> developmentRegistry</span>.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
            <h3 className="text-lg font-semibold text-black">
              Promote to Production
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm text-black/75">
              <li>Finalize the component API in this sandbox.</li>
              <li>Move the component into the target feature/page folder.</li>
              <li>Replace mock props with real data and hooks.</li>
              <li>Verify responsive behavior in the final page route.</li>
              <li>Remove temporary registry/demo-only entries.</li>
            </ol>
          </div>
        </section>
      </section>
    </main>
  );
}

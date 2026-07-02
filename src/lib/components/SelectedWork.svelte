<script lang="ts">
	// Selected work — a curated showcase of the org's projects.
	// NOT a data table. Editorial, scannable, each project earns its place.
	// Descending by activity (pushed_at) so the living work leads.
	import { langColor, compact, relativeTime, absDate } from '$lib/format';
	import type { RepoMeta } from '$lib/server/github';

	interface Props {
		repos: RepoMeta[];
		now: number;
		excludeName?: string;
	}

	let { repos, now, excludeName }: Props = $props();

	// Curate: drop meta/profile repos and the flagship (shown in hero),
	// then take the most recently pushed projects.
	let selected = $derived(
		repos
			.filter((r) => !r.name.startsWith('.') && !r.fork && !r.archived)
			.filter((r) => r.name !== excludeName)
			.slice(0, 6)
	);
</script>

<section id="work" class="border-t border-[var(--color-edge)]">
	<div class="mx-auto max-w-5xl px-5 py-20 sm:px-8">
		<div class="mb-10 flex items-end justify-between gap-4">
			<div>
				<div class="micro mb-3">selected work</div>
				<h2 class="text-display text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
					Things we ship.
				</h2>
			</div>
			<span class="hidden font-mono text-xs text-[var(--color-dim)] sm:block">
				{selected.length} of {repos.filter((r) => !r.fork).length} projects
			</span>
		</div>

		<ul class="grid gap-px overflow-hidden border border-[var(--color-edge)] sm:grid-cols-2">
			{#each selected as r (r.id)}
				<li
					class="group relative bg-[var(--color-panel)] transition-colors hover:bg-[var(--color-panel-2)]"
				>
					<a
						href={r.html_url}
						target="_blank"
						rel="noreferrer noopener"
						class="flex h-full flex-col p-6"
					>
						<div class="flex items-start justify-between gap-3">
							<div class="flex items-center gap-2">
								<span
									class="inline-block size-2"
									style="background: {langColor(r.language)}"
									aria-hidden="true"
								></span>
								<h3
									class="font-mono text-base font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-signal)]"
								>
									{r.name}
								</h3>
							</div>
							<svg
								width="13"
								height="13"
								viewBox="0 0 16 16"
								fill="none"
								class="shrink-0 text-[var(--color-dimmer)] transition-colors group-hover:text-[var(--color-signal)]"
								aria-hidden="true"
							>
								<path
									d="M4 12 12 4M5 4h7v7"
									stroke="currentColor"
									stroke-width="1.5"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>

						{#if r.description}
							<p class="mt-3 text-sm leading-relaxed text-[var(--color-ink-2)]">
								{r.description}
							</p>
						{:else}
							<p class="mt-3 text-sm italic text-[var(--color-dimmer)]">no description</p>
						{/if}
						<div
							class="mt-auto flex items-center gap-4 pt-5 font-mono text-[10.5px] text-[var(--color-dim)]"
						>
							{#if r.language}
								<span>{r.language}</span>
							{/if}
							{#if r.stargazers_count > 0}
								<span class="tabnum flex items-center gap-1">
									<svg
										width="9"
										height="9"
										viewBox="0 0 16 16"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											d="M8 .25a.75.75 0 0 1 .67.42l1.7 3.44 3.8.55a.75.75 0 0 1 .42 1.28l-2.75 2.68.65 3.78a.75.75 0 0 1-1.09.79L8 11.34l-3.4 1.79a.75.75 0 0 1-1.09-.79l.65-3.78L1.41 6.94a.75.75 0 0 1 .42-1.28l3.8-.55L7.33.67A.75.75 0 0 1 8 .25Z"
										/>
									</svg>
									{compact(r.stargazers_count)}
								</span>
							{/if}
							<time class="tabnum ml-auto" title={absDate(r.pushed_at)}>
								{relativeTime(r.pushed_at, now)}
							</time>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

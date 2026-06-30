<script lang="ts">
	// Landing hero. Identity → ONE primary action → proof.
	// Proof is concrete and immediate: the flagship repo, its real star count,
	// and a copyable clone command. No feature grids, no vague claims.
	import CloneButton from './CloneButton.svelte';
	import { compact } from '$lib/format';
	import type { OrgMeta, RepoMeta } from '$lib/server/github';

	interface Props {
		org: OrgMeta;
		flagship: RepoMeta | null;
	}

	let { org, flagship }: Props = $props();

	// Primary action: the flagship project. Fallback to the org itself.
	let primaryHref = $derived(flagship?.html_url ?? org.html_url);
	let primaryLabel = $derived(flagship ? `open ${flagship.name}` : 'open on github');
</script>

<section class="relative overflow-hidden">
	<!-- atmospheric scan line tied to the live-system identity -->
	<div
		class="pointer-events-none absolute inset-x-0 top-0 h-px"
		style="background: linear-gradient(90deg, transparent, var(--color-signal-glow), transparent)"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-5xl px-5 pb-20 pt-24 sm:px-8 sm:pt-32">
		<div class="micro mb-6 flex items-center gap-2">
			<span class="led" aria-hidden="true"></span>
			<span>systems workshop</span>
			<span class="text-[var(--color-dimmer)]">·</span>
			<span>est. {new Date(org.created_at).getFullYear()}</span>
		</div>

		<h1
			class="text-display max-w-3xl text-5xl font-extrabold leading-[0.95] sm:text-6xl md:text-7xl"
		>
			<span class="block text-[var(--color-ink)]">{org.name ?? org.login}</span>
			<span class="mt-3 block text-[var(--color-signal)]">builds primitives.</span>
		</h1>

		<p class="mt-7 max-w-xl text-base leading-relaxed text-[var(--color-ink-2)]">
			A small workshop forging low-level tools — blob storage, vector search, terminals, agents.
			Built to be used, not to scale.
		</p>

		<!-- ONE primary action (filled). secondary = ghost. -->
		<div class="mt-10 flex flex-wrap items-center gap-3">
			<a
				href={primaryHref}
				target="_blank"
				rel="noreferrer noopener"
				class="btn-primary inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider"
			>
				{primaryLabel}
				<svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path
						d="M3 8h10M9 4l4 4-4 4"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
			<a
				href="#work"
				class="btn-ghost inline-flex items-center gap-2 px-5 py-3 text-xs uppercase tracking-wider"
			>
				see the work
			</a>
		</div>

		<!-- proof: real flagship facts, inline, no card grid -->
		{#if flagship}
			<div class="mt-16 border-t border-[var(--color-edge)] pt-6">
				<div
					class="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 sm:grid-cols-[auto_1fr_auto]"
				>
					<div class="micro">flagship</div>
					<a
						href={flagship.html_url}
						target="_blank"
						rel="noreferrer noopener"
						class="font-mono text-lg font-semibold text-[var(--color-ink)] hover:text-[var(--color-signal)]"
					>
						{flagship.name}
						{#if flagship.language}
							<span class="ml-2 align-middle text-xs font-normal text-[var(--color-dim)]">
								{flagship.language}
							</span>
						{/if}
					</a>
					<div class="col-start-2 row-start-2 sm:col-start-3 sm:row-start-1">
						<CloneButton url={`https://github.com/${flagship.full_name}.git`} label="clone" />
					</div>
				</div>
				{#if flagship.description}
					<p class="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-2)]">
						{flagship.description}
					</p>
				{/if}
				<div
					class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-[var(--color-dim)]"
				>
					{#if flagship.stargazers_count > 0}
						<span class="tabnum flex items-center gap-1.5">
							<svg
								width="11"
								height="11"
								viewBox="0 0 16 16"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M8 .25a.75.75 0 0 1 .67.42l1.7 3.44 3.8.55a.75.75 0 0 1 .42 1.28l-2.75 2.68.65 3.78a.75.75 0 0 1-1.09.79L8 11.34l-3.4 1.79a.75.75 0 0 1-1.09-.79l.65-3.78L1.41 6.94a.75.75 0 0 1 .42-1.28l3.8-.55L7.33.67A.75.75 0 0 1 8 .25Z"
								/>
							</svg>
							{compact(flagship.stargazers_count)} stars
						</span>
					{/if}
					{#if flagship.license}
						<span>{flagship.license.spdx_id}</span>
					{/if}
					{#if flagship.homepage}
						<a
							href={flagship.homepage}
							target="_blank"
							rel="noreferrer noopener"
							class="transition-colors hover:text-[var(--color-signal)]"
						>
							{new URL(flagship.homepage).host} →
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</section>

<script lang="ts">
	// Closing CTA — the landing page's final, single action.
	// Quiet, atmospheric, one filled button. Not a banner of buttons.
	import { compact } from '$lib/format';
	import type { OrgMeta, RepoMeta } from '$lib/server/github';

	interface Props {
		org: OrgMeta;
		repos: RepoMeta[];
		flagship: RepoMeta | null;
	}

	let { org, repos, flagship }: Props = $props();

	let stars = $derived(repos.reduce((s, r) => s + r.stargazers_count, 0));
</script>

<section class="border-t border-[var(--color-edge)]">
	<div class="mx-auto max-w-5xl px-5 py-24 text-center sm:px-8">
		<div class="micro mb-5 flex items-center justify-center gap-2">
			<span class="led" aria-hidden="true"></span>
			<span>open source · built to be used</span>
		</div>

		<h2
			class="text-display mx-auto max-w-2xl text-4xl font-extrabold leading-[1.05] text-[var(--color-ink)] sm:text-5xl"
		>
			Use the work.
			<span class="text-[var(--color-signal)]">Or build with us.</span>
		</h2>

		<p class="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-[var(--color-ink-2)]">
			Every project is open source. Clone it, fork it, ship something with it.
		</p>

		<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
			<a
				href={flagship?.html_url ?? org.html_url}
				target="_blank"
				rel="noreferrer noopener"
				class="btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider"
			>
				{flagship ? `start with ${flagship.name}` : 'explore the org'}
			</a>
		</div>

		<!-- one honest proof line -->
		<p class="mt-10 font-mono text-xs text-[var(--color-dim)]">
			{repos.filter((r) => !r.fork).length} projects
			{#if stars > 0}
				<span class="text-[var(--color-dimmer)]">·</span>
				<span class="text-[var(--color-signal)] tabnum">{compact(stars)} stars</span> across the org
			{/if}
		</p>
	</div>
</section>

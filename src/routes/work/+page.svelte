<script lang="ts">
	import type { PageData } from './$types';
	import { WORK_REPO_LINKS } from '$lib/const';

	let { data }: { data: PageData } = $props();

	const orgName = $derived(data.ok ? (data.data.org.name ?? data.data.org.login) : 'Work');
	const reposByUrl = $derived(
		new Map(data.ok ? data.data.repos.map((repo) => [repo.html_url.toLowerCase(), repo]) : [])
	);
	const repos = $derived(
		WORK_REPO_LINKS.map((link) => {
			const repo = reposByUrl.get(link.href.toLowerCase());
			const nameFromUrl = link.href.replace(/\/$/, '').split('/').pop() ?? link.href;

			return {
				id: repo?.id ?? link.href,
				href: repo?.html_url ?? link.href,
				name: link.title ?? repo?.name ?? nameFromUrl,
				description: link.description ?? repo?.description,
				language: link.language ?? repo?.language
			};
		})
	);
</script>

<svelte:head>
	<title>{orgName} · Work</title>
</svelte:head>

<section class="text-cinema flex flex-1 flex-col justify-center overflow-hidden px-8 py-8 md:px-20">
	<div class="text-glass mx-auto w-full max-w-5xl px-6 py-7 md:px-8 md:py-8">
		<p class="font-mono text-[0.62rem] uppercase tracking-[0.22em] opacity-40">Flagship work</p>

		<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each repos as repo (repo.id)}
				<svelte:element
					this={"a"}
					href={repo.href as `https://${string}`}
					target="_blank"
					rel="noreferrer noopener"
					class="group theme-transition block"
				>
					<div class="flex min-w-0 items-start justify-between gap-4">
						<h2
							class="min-w-0 truncate text-xl font-semibold tracking-tight underline decoration-current/25 underline-offset-4 opacity-90 group-hover:decoration-current/70 group-hover:opacity-100"
						>
							{repo.name}
						</h2>
						{#if repo.language}
							<span
								class="shrink-0 pt-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] opacity-40"
							>
								{repo.language}
							</span>
						{/if}
					</div>
					{#if repo.description}
						<p class="mt-2 line-clamp-3 text-sm leading-relaxed opacity-55">
							{repo.description}
						</p>
					{/if}
				</svelte:element>
			{/each}
		</div>
	</div>
</section>

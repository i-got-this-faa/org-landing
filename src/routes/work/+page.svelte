<script lang="ts">
	import type { PageData } from './$types';
	import { langColor } from '$lib/format';

	let { data }: { data: PageData } = $props();

	const repos = $derived(
		data.ok
			? data.data.repos
					.filter((r) => !r.fork && !r.archived)
					.sort((a, b) => b.stargazers_count - a.stargazers_count)
					.slice(0, 6)
			: []
	);
</script>

<svelte:head>
	<title>{data.ok ? data.data.org.name ?? data.data.org.login : 'Work'} · Work</title>
</svelte:head>

<section class="text-cinema flex flex-1 flex-col overflow-hidden px-8 py-4 pt-16 md:px-14">


	<!-- Repo grid — fills remaining space -->
	<div class="grid flex-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
		{#each repos as repo (repo.name)}
			<a
				href={repo.html_url}
				target="_blank"
				rel="noreferrer"
				class="theme-transition group flex flex-col justify-between rounded-xl border border-current/10 p-5 backdrop-blur-xs hover:border-current/25 hover:bg-current/5"
			>
				<div>
					<div class="mb-2 flex items-center gap-2">
						{#if repo.language}
							<span
								class="inline-block h-2 w-2 rounded-full"
								style="background: {langColor(repo.language)}"
							></span>
							<span class="font-mono text-[0.55rem] uppercase tracking-[0.15em] opacity-50">
								{repo.language}
							</span>
						{/if}
					</div>
					<h2 class="text-lg font-bold tracking-tight md:text-xl">{repo.name}</h2>
					{#if repo.description}
						<p class="mt-1.5 text-xs font-light leading-relaxed opacity-60">
							{repo.description.length > 100 ? repo.description.slice(0, 100) + '…' : repo.description}
						</p>
					{/if}
				</div>

				<div class="mt-4 flex items-center gap-4 font-mono text-[0.55rem] uppercase tracking-[0.15em] opacity-35">
					<span>★ {repo.stargazers_count}</span>
					<span>⑂ {repo.forks_count}</span>
					{#if repo.topics.length > 0}
						<span class="ml-auto truncate max-w-[120px]">{repo.topics.slice(0, 2).join(' · ')}</span>
					{/if}
				</div>
			</a>
		{/each}
	</div>

	<!-- Browse all link -->
	{#if data.ok}
		<div class="mt-4 shrink-0 text-center">
			<a
				href="https://github.com/orgs/{data.data.org.login}/repositories"
				target="_blank"
				rel="noreferrer"
				class="theme-transition font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-30 hover:opacity-60"
			>
				browse all {data.data.org.public_repos} repos ↗
			</a>
		</div>
	{/if}
</section>

<script lang="ts">
	import type { PageData } from './$types';
	import { WORK_REPO_LINKS } from '$lib/const';
	import { langColor } from '$lib/format';

	let { data }: { data: PageData } = $props();

	const orgName = $derived(data.ok ? (data.data.org.name ?? data.data.org.login) : 'Work');
	const orgLogin = $derived(data.ok ? data.data.org.login : 'i-got-this-faa');
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
			{#each repos as repo, index (repo.id)}
				<svelte:element
					this={'a'}
					href={repo.href as `https://${string}`}
					target="_blank"
					rel="noreferrer noopener"
					class="group theme-transition block"
				>
					<div
						class="flex items-center gap-3 font-mono text-[0.58rem] uppercase tracking-[0.18em] opacity-40"
					>
						<span>{String(index + 1).padStart(2, '0')}</span>
						{#if repo.language}
							<span class="h-1.5 w-1.5 rounded-full" style:background={langColor(repo.language)}
							></span>
							<span>{repo.language}</span>
						{/if}
					</div>
					<h2 class="mt-3 text-xl font-semibold tracking-tight opacity-90 group-hover:opacity-100">
						{repo.name}
					</h2>
					{#if repo.description}
						<p class="mt-2 line-clamp-3 text-sm leading-relaxed opacity-55">
							{repo.description}
						</p>
					{/if}
				</svelte:element>
			{/each}
		</div>

		{#if data.ok}
			<a
				href="https://github.com/orgs/{orgLogin}/repositories"
				target="_blank"
				rel="noreferrer noopener"
				class="theme-transition mt-10 inline-flex font-mono text-[0.62rem] uppercase tracking-[0.2em] opacity-40 hover:opacity-75"
			>
				browse all repositories
			</a>
		{/if}
	</div>
</section>

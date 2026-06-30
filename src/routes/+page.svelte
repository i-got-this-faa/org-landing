<script lang="ts">
	// Landing page — composed from cached server data.
	// Flow: identity → work → people → action.
	import type { PageData } from './$types';
	import type { RepoMeta } from '$lib/server/github';
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import SelectedWork from '$lib/components/SelectedWork.svelte';
	import Crew from '$lib/components/Crew.svelte';
	import CallToAction from '$lib/components/CallToAction.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { data }: { data: PageData } = $props();

	// One ticking clock for all relative-time displays.
	let now = $state(Date.now());
	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 60_000);
		return () => clearInterval(t);
	});

	// Flagship = highest-starred, non-fork, non-archived project.
	function pickFlagship(repos: RepoMeta[]): RepoMeta | null {
		const eligible = repos.filter((r) => !r.fork && !r.archived);
		const pool = eligible.length ? eligible : repos;
		return pool.reduce<RepoMeta | null>(
			(best, r) => (r.stargazers_count > (best?.stargazers_count ?? -1) ? r : best),
			null
		);
	}
</script>

<svelte:head>
	<title>i-got-this-faa · systems workshop</title>
	<meta
		name="description"
		content="i-got-this-faa — a systems workshop building blob storage, vector search, terminals and agents."
	/>
	<meta name="color-scheme" content="dark" />
</svelte:head>

{#if data.ok}
	{@const d = data.data}
	{@const flagship = pickFlagship(d.repos)}

	<div class="flex min-h-dvh flex-col">
		<Nav orgLogin={d.org.login} orgUrl={d.org.html_url} />

		<main class="flex-1">
			<Hero org={d.org} {flagship} />
			<SelectedWork repos={d.repos} {now} excludeName={flagship?.name} />
			<Crew members={d.members} />
			<CallToAction org={d.org} repos={d.repos} {flagship} />
		</main>

		<Footer
			orgLogin={d.org.login}
			orgUrl={d.org.html_url}
			fetchedAt={d.fetched_at}
			cacheStatus={d.cache_status}
		/>
	</div>
{:else}
	<!-- controlled error state: plain language, a retry action -->
	<div class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
		<div class="micro mb-4 flex items-center gap-2">
			<span
				class="led"
				style="background: var(--color-danger); box-shadow: 0 0 6px rgba(248,81,73,0.4)"
			></span>
			upstream unreachable
		</div>
		<h1 class="text-display text-3xl font-bold text-[var(--color-ink)]">ledger offline</h1>
		<p class="mt-3 max-w-md font-mono text-xs leading-relaxed text-[var(--color-dim)]">
			Could not reach the GitHub API to render this page.
			{#if data.error}
				<span
					class="mt-2 block border border-[var(--color-edge)] bg-[var(--color-panel)] px-3 py-2 text-left text-[var(--color-dimmer)]"
				>
					{data.error}
				</span>
			{/if}
		</p>
		<button
			class="btn-primary mt-6 px-4 py-2 text-xs uppercase tracking-wider"
			onclick={() => location.reload()}
		>
			retry sync
		</button>
	</div>
{/if}

<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/state.svelte';
	import Background from '$lib/components/Background.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { data, children } = $props();

	const orgName = $derived(data.ok ? (data.data.org.name ?? data.data.org.login) : 'i-got-this-faa');
	const orgUrl = $derived(data.ok ? data.data.org.html_url : 'https://github.com/i-got-this-faa');

	let currentPage: '/' | '/work' | '/join' = $state('/');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="color-scheme" content="dark" />
</svelte:head>

<!-- 3D background (exact test.html scene with smooth day/night) -->
<Background isDarkMode={theme.isDark} />

<!-- Film grain -->
<div class="grain"></div>

<!-- Full-viewport UI shell -->
<div
	class="theme-transition relative z-10 flex h-dvh flex-col overflow-hidden {theme.isDark
		? 'text-white'
		: 'text-slate-900'}"
>
	<!-- ── Navigation ──────────────────────────────────────── -->
	<header class="theme-transition flex w-full shrink-0 items-center justify-between px-8 py-5 md:px-14">
		<a
			href="/"
			class="text-cinema font-mono text-xs font-bold uppercase tracking-[0.25em] opacity-80 hover:opacity-100 theme-transition"
		>
			{orgName}
		</a>

		<nav class="flex items-center gap-1">
			<a
				href="/"
				class="text-cinema rounded-full px-4 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-60 hover:opacity-100 theme-transition"
			>
				Manifesto
			</a>
			<a
				href="/work"
				class="text-cinema rounded-full px-4 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-60 hover:opacity-100 theme-transition"
			>
				Work
			</a>
			<a
				href="/join"
				class="text-cinema rounded-full px-4 py-2 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-60 hover:opacity-100 theme-transition"
			>
				Join
			</a>
		</nav>

		<button
			onclick={() => theme.toggle()}
			class="text-cinema flex h-8 w-8 items-center justify-center rounded-full opacity-70 hover:opacity-100 theme-transition"
			aria-label="Toggle day/night"
		>
			{#if theme.isDark}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
			{/if}
		</button>
	</header>

	<!-- ── Page content (fills remaining viewport) ─────── -->
	<main class="flex flex-1 flex-col overflow-hidden">
		{@render children()}
	</main>

	<!-- ── Footer strip ──────────────────────────────────── -->
	<footer class="theme-transition flex w-full shrink-0 items-center justify-between px-8 py-3 md:px-14">
		<span class="font-mono text-[0.55rem] uppercase tracking-[0.15em] opacity-30">
			© {new Date().getFullYear()} {orgName}
		</span>
		<a
			href={orgUrl}
			target="_blank"
			rel="noreferrer"
			class="font-mono text-[0.55rem] uppercase tracking-[0.15em] opacity-30 hover:opacity-60 theme-transition"
		>
			github ↗
		</a>
	</footer>
</div>

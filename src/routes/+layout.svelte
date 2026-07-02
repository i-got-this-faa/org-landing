<script lang="ts">
	import '../app.css';
	import { resolve } from '$app/paths';
	import { GitBranch, Moon, Sun } from 'lucide-svelte';
	import { theme } from '$lib/state.svelte';
	import Background from '$lib/components/Background.svelte';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/gemini-logo.svg';

	let { data, children } = $props();

	const orgLogin = $derived(data.ok ? data.data.org.login : 'i-got-this-faa');
	const themeName = $derived(theme.isDark ? 'night' : 'day');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="color-scheme" content="dark light" />
	<meta name="theme-color" content={theme.isDark ? '#07131d' : '#9ed2ea'} />
</svelte:head>

<Background isDarkMode={theme.isDark} />
<div class={['frosted-field theme-transition', themeName]}></div>
<div class={['scene-scrim theme-transition', themeName]}></div>
<div class={['screen-noise theme-transition', themeName]}></div>

<div
	class={[
		'site-shell theme-transition relative z-10 flex h-dvh flex-col overflow-hidden',
		theme.isDark ? 'theme-night' : 'theme-day'
	]}
>
	<header class="corner-header theme-transition">
		<a href={resolve('/')} class="corner-mark text-cinema" aria-label="Home">
			<img src={logo} alt="" class="corner-logo" />
		</a>

		<nav class="top-nav" aria-label="Primary navigation">
			<a
				href={resolve('/')}
				class="glass-pill nav-pill text-cinema font-mono text-[0.68rem] uppercase tracking-[0.16em] opacity-70 hover:opacity-100 theme-transition"
			>
				About
			</a>
			<a
				href={resolve('/work')}
				class="glass-pill nav-pill text-cinema font-mono text-[0.68rem] uppercase tracking-[0.16em] opacity-70 hover:opacity-100 theme-transition"
			>
				Work
			</a>
			<a
				href={resolve('/join')}
				class="glass-pill nav-pill text-cinema font-mono text-[0.68rem] uppercase tracking-[0.16em] opacity-70 hover:opacity-100 theme-transition"
			>
				Join
			</a>

			<button
				type="button"
				class="glass-pill theme-toggle text-cinema theme-transition"
				onclick={() => theme.toggle()}
				aria-label={theme.isDark ? 'Switch to day scene' : 'Switch to night scene'}
				title={theme.isDark ? 'Switch to day scene' : 'Switch to night scene'}
			>
				{#if theme.isDark}
					<Sun size={15} strokeWidth={1.9} />
				{:else}
					<Moon size={15} strokeWidth={1.9} />
				{/if}
			</button>
		</nav>
	</header>

	<main class="flex flex-1 flex-col overflow-hidden">
		{@render children()}
	</main>

	<footer class="site-footer theme-transition">
		<span></span>
		<a
			href="https://github.com/{orgLogin}"
			target="_blank"
			rel="noreferrer noopener"
			class="glass-pill footer-link footer-pill inline-flex items-center gap-2"
		>
			GitHub <GitBranch size={14} strokeWidth={1.8} />
		</a>
	</footer>
</div>

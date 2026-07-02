<script lang="ts">
	import type { PageData } from './$types';
	import faaAudio from '$lib/assets/faa.mp3';

	let { data }: { data: PageData } = $props();
	let faaPlayer: HTMLAudioElement;

	const org = $derived(data.ok ? data.data.org : null);
	const orgName = $derived(org?.name ?? org?.login ?? 'i-got-this-faa');
	const description = $derived(
		org?.description ??
			'We build open software with a cinematic eye, shaped by the people who use it and the people willing to improve it.'
	);

	function playFaa(): void {
		faaPlayer.currentTime = 0;
		void faaPlayer.play().catch(() => undefined);
	}
</script>

<svelte:head>
	<title>{orgName} · About</title>
	<meta name="description" content={description} />
</svelte:head>

<section class="reference-page text-cinema">
	<audio bind:this={faaPlayer} src={faaAudio} preload="auto"></audio>
	<p class="reference-statement text-glass cinema-serif">
		<span class="page-fade">
			We build open software with a cinematic eye,
			<br />
			Crafted under the supervision of the cat, shaped by the humans who use it.
			<br />
			Just scream "
			<button
				type="button"
				class="theme-transition cursor-pointer border-0 bg-transparent p-0 font-inherit text-inherit underline decoration-current/25 underline-offset-4 hover:decoration-current/70 focus-visible:decoration-current/70"
				onpointerenter={playFaa}
				onfocus={playFaa}
			>
				I got this, Faaaa</button
			>", and let the cat do the rest.
		</span>
	</p>
</section>

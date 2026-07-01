<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const org = $derived(data.ok ? data.data.org : null);
	const orgName = $derived(org?.name ?? org?.login ?? 'i-got-this-faa');
	const description = $derived(
		org?.description ??
			'We build open software with a cinematic eye, shaped by the people who use it and the people willing to improve it.'
	);
</script>

<svelte:head>
	<title>{orgName} · About</title>
	<meta name="description" content={description} />
</svelte:head>

<section class="reference-page text-cinema">
	<p class="reference-statement text-glass cinema-serif">
		We build better ways to faa.
		<br />
		<span>Crafted under the supervision of the cat, shaped by the humans who use it.</span>
	</p>
</section>

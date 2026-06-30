<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const org = $derived(data.ok ? data.data.org : null);
	const description = $derived(
		org?.description ?? 'We are the architects of the unseen. We believe in the power of bespoke experiences that challenge mediocrity.'
	);
</script>

<svelte:head>
	<title>{org?.name ?? org?.login ?? 'Manifesto'} · Manifesto</title>
	<meta name="description" content={description} />
</svelte:head>

<section class="text-cinema relative flex flex-1 items-center justify-start overflow-hidden px-12 md:px-24">
	<div class="relative z-10 flex max-w-4xl flex-col items-start text-left">
		
		<!-- A strong, asymmetrical typographic manifesto instead of a generic centered header -->
		<p class="mb-4 font-mono text-[0.65rem] uppercase tracking-[0.3em] opacity-40">
			The Manifesto
		</p>
		
		<h1 class="text-5xl font-black uppercase leading-[1.0] tracking-tighter md:text-7xl lg:text-8xl">
			Beyond <br />
			<span class="opacity-70">The Norm.</span>
		</h1>

		<div class="mt-8 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
			<div class="h-px w-16 bg-current opacity-30 mt-3 hidden md:block shrink-0"></div>
			<p class="max-w-2xl text-lg font-light leading-relaxed opacity-80 md:text-xl">
				{description} 
				We don't just build interfaces; we forge cinematic journeys. The digital landscape is cluttered with generic noise. We stand firmly against this.
			</p>
		</div>

	</div>
</section>

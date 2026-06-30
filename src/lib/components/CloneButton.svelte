<script lang="ts">
	// Copy-to-clipboard button for a clone URL.
	// Reveals its state explicitly: idle → copied → reverted, per the
	// "micro-interactions confirm the system understood" rule.

	interface Props {
		url: string;
		label?: string;
	}

	let { url, label = 'clone' }: Props = $props();

	let copied = $state(false);
	let timer: ReturnType<typeof setTimeout> | undefined = $state();

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
			timer = setTimeout(() => (copied = false), 1600);
		} catch {
			// Clipboard unavailable — keep the button useful by selecting the URL.
			copied = false;
		}
	}

	$effect(() => {
		return () => {
			if (timer) clearTimeout(timer);
		};
	});
</script>

<button
	class="btn-ghost spec-row group flex items-center gap-2 px-2.5 py-1.5 text-xs"
	onclick={copy}
	aria-label={`Copy clone URL: ${url}`}
	title={url}
>
	{#if copied}
		<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path
				d="M13.5 4.5 6 12l-3.5-3.5"
				stroke="var(--color-signal)"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<span style="color: var(--color-signal)">copied</span>
	{:else}
		<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" stroke-width="1.4" />
			<path
				d="M3 11V3.5A.5.5 0 0 1 3.5 3H11"
				stroke="currentColor"
				stroke-width="1.4"
				stroke-linecap="round"
			/>
		</svg>
		<span>{label}</span>
	{/if}
</button>

<script lang="ts">
	// Footer — quiet sign-off. Path, attribution, data provenance.
	import { relativeTime } from '$lib/format';

	interface Props {
		orgLogin: string;
		orgUrl: string;
		fetchedAt: number;
		cacheStatus: 'fresh' | 'stale';
	}

	let { orgLogin, orgUrl, fetchedAt, cacheStatus }: Props = $props();
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-[var(--color-edge)]">
	<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
		<div
			class="flex flex-col gap-4 font-mono text-[10.5px] text-[var(--color-dim)] sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-2">
				<span class="text-[var(--color-ink-2)]">~/{orgLogin}/ledger</span>
				<span class="text-[var(--color-dimmer)]">·</span>
				<span>© {year}</span>
			</div>

			<div class="flex flex-wrap items-center gap-x-4 gap-y-1">
				<span>
					data: github api
					<span class="text-[var(--color-dimmer)]">·</span>
					synced {relativeTime(new Date(fetchedAt).toISOString())}
				</span>
				{#if cacheStatus === 'stale'}
					<span class="text-[var(--color-warn)]">serving stale snapshot</span>
				{/if}
				<a
					href={orgUrl}
					target="_blank"
					rel="noreferrer noopener"
					class="text-[var(--color-ink-2)] hover:text-[var(--color-signal)]"
				>
					github →
				</a>
			</div>
		</div>

		<p class="mt-4 max-w-2xl font-mono text-[10px] leading-relaxed text-[var(--color-dimmer)]">
			Rendered server-side from a cached GitHub API snapshot. Upstream calls are deduped to a
			five-minute window; a last-good snapshot is served if the upstream is unreachable.
		</p>
	</div>
</footer>

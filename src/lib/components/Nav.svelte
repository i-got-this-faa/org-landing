<script lang="ts">
	// Minimal landing nav. Wordmark left, two anchor links + one primary CTA.
	// No status language, no dashboard vocabulary.
	interface Props {
		orgLogin: string;
		orgUrl: string;
	}
	let { orgLogin, orgUrl }: Props = $props();
</script>

<header
	class="sticky top-0 z-30 border-b border-[var(--color-edge)] bg-[var(--color-void)]/85 backdrop-blur-md"
>
	<div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5 sm:px-8">
		<a href="/" class="flex items-center gap-2 font-mono text-sm">
			<span class="led" aria-hidden="true"></span>
			<span class="font-semibold text-[var(--color-ink)]">{orgLogin}</span>
		</a>

		<nav class="flex items-center gap-1 font-mono text-xs sm:gap-2">
			<a
				href="#work"
				class="px-2.5 py-1.5 text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)]"
			>
				work
			</a>
			<a
				href="#crew"
				class="px-2.5 py-1.5 text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-ink)]"
			>
				crew
			</a>
			<a
				href={orgUrl}
				target="_blank"
				rel="noreferrer noopener"
				class="btn-primary px-3 py-1.5 uppercase tracking-wider"
			>
				github
			</a>
		</nav>
	</div>
</header>

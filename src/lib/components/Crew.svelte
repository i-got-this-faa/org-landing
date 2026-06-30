<script lang="ts">
	// Crew — public members, evidence-first.
	// Just identity + link. No long bios unless that's the goal.
	import type { MemberMeta } from '$lib/server/github';

	interface Props {
		members: MemberMeta[];
	}

	let { members }: Props = $props();
</script>

<section id="crew" class="border-t border-[var(--color-edge)]">
	<div class="mx-auto max-w-5xl px-5 py-20 sm:px-8">
		<div class="mb-10">
			<div class="micro mb-3">crew</div>
			<h2 class="text-display text-3xl font-bold text-[var(--color-ink)] sm:text-4xl">
				The hands behind it.
			</h2>
		</div>

		{#if members.length === 0}
			<div class="border border-dashed border-[var(--color-edge)] px-4 py-8 text-center">
				<p class="font-mono text-xs text-[var(--color-dim)]">No public members listed.</p>
			</div>
		{:else}
			<ul
				class="grid grid-cols-2 gap-px overflow-hidden border border-[var(--color-edge)] sm:grid-cols-3 lg:grid-cols-4"
			>
				{#each members as m (m.login)}
					<li class="bg-[var(--color-panel)]">
						<a
							href={m.html_url}
							target="_blank"
							rel="noreferrer noopener"
							class="group flex items-center gap-3 p-4 transition-colors hover:bg-[var(--color-panel-2)]"
						>
							<img
								src={m.avatar_url}
								alt=""
								loading="lazy"
								width="36"
								height="36"
								class="size-9 border border-[var(--color-edge-bright)] object-cover grayscale transition-[filter] group-hover:grayscale-0"
							/>
							<div class="min-w-0">
								<div
									class="truncate font-mono text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-signal)]"
								>
									@{m.login}
								</div>
								<div class="font-mono text-[10px] uppercase tracking-wider text-[var(--color-dim)]">
									member
								</div>
							</div>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>

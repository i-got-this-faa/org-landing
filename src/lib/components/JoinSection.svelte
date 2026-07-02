<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
	import type { MemberMeta } from '$lib/server/github';

	interface Props {
		members: MemberMeta[];
	}

	let { members }: Props = $props();

	const emailHref = 'mailto:hello@i-got-this-faa.dev?subject=Joining%20i-got-this-faa';

	function fallbackName(login: string): string {
		return login.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function memberName(member: MemberMeta): string {
		return member.name?.trim() || fallbackName(member.login);
	}
</script>

<section class="text-cinema flex flex-1 overflow-y-auto px-5 py-8 sm:px-8 md:px-14">
	<div class="text-glass mx-auto w-full max-w-3xl self-center px-6 py-7 sm:px-8">
		<div class="page-fade">
			<h1 class="max-w-2xl text-4xl font-black leading-[0.98] tracking-normal sm:text-5xl">
				Wana build with us?
			</h1>

			<p class="mt-5 max-w-2xl text-lg leading-snug opacity-85 sm:text-xl">
				Show us what you are making, what you want to improve, or the small tool you cannot stop
				thinking about.
			</p>

			<div class="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-relaxed">
				<a
					href={emailHref}
					class="theme-transition inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] underline decoration-current/25 underline-offset-4 opacity-90 hover:decoration-current/70 hover:opacity-100"
				>
					Email us
					<ArrowRight size={13} strokeWidth={1.8} />
				</a>
				<span class="opacity-55">
					(A short note is enough. Send a link, a rough idea, or the piece you want to work on.)
				</span>
			</div>

			<div class="mt-6 border-t border-current/10 pt-5">
				<h2 class="font-mono text-[0.62rem] uppercase tracking-[0.22em] opacity-45">The crew</h2>

				{#if members.length > 0}
					<ul class="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2 md:grid-cols-3">
						{#each members as member (member.login)}
							<li>
								<a
									href={member.html_url as `https://${string}`}
									target="_blank"
									rel="noreferrer noopener"
									class="theme-transition group flex min-w-0 items-center gap-3 opacity-75 hover:opacity-100"
								>
									<img
										src={member.avatar_url}
										alt=""
										class="h-10 w-10 shrink-0 rounded-full border border-current/10 shadow-lg shadow-black/20 transition-transform duration-300 group-hover:scale-105"
										width="40"
										height="40"
									/>
									<span class="min-w-0">
										<span class="block truncate text-sm font-semibold">{memberName(member)}</span>
										<span class="block truncate font-mono text-[0.62rem] opacity-45">
											@{member.login}
										</span>
									</span>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<p class="mt-4 text-sm leading-relaxed opacity-55">
						The member list is temporarily unavailable. GitHub still has the current org activity.
					</p>
				{/if}
			</div>
		</div>
	</div>
</section>

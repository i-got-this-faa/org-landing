<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const members = $derived(data.ok ? data.data.members : []);
	const orgName = $derived(data.ok ? (data.data.org.name ?? data.data.org.login) : 'Join');
	const orgLogin = $derived(data.ok ? data.data.org.login : 'i-got-this-faa');

	function displayName(login: string): string {
		return login.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<svelte:head>
	<title>{orgName} · Join</title>
</svelte:head>

<section class="text-cinema flex flex-1 items-center justify-center overflow-hidden px-8 md:px-14">
	<div class="text-glass grid w-full max-w-5xl gap-16 px-6 py-7 md:px-8 md:py-8 lg:grid-cols-2">
		<div class="flex flex-col justify-center">
			<h1 class="text-4xl font-black md:text-6xl">Join Us ?</h1>
			<p class="mt-3 max-w-sm text-sm font-light leading-relaxed opacity-60">
				We're always looking for people who build with intent. Drop a line.
			</p>
			<a
				href="mailto:hello@i-got-this-faa.dev?subject=Joining%20i-got-this-faa"
				class="theme-transition mt-8 inline-flex w-fit border border-current/30 px-8 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] hover:bg-current/10"
			>
				Join
			</a>
		</div>

		<div class="flex flex-col justify-center">
			<h2 class="font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-40">The Crew</h2>
			<ul class="mt-4 flex flex-wrap gap-4">
				{#each members as member (member.login)}
					<li>
						<a
							href="https://github.com/{member.login}"
							target="_blank"
							rel="noreferrer noopener"
							class="theme-transition group flex flex-col items-center gap-1.5"
						>
							<img
								src={member.avatar_url}
								alt={member.login}
								class="h-12 w-12 rounded-full border border-current/10 shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-110"
								width="48"
								height="48"
							/>
						</a>
					</li>
				{/each}
			</ul>

			<div class="mt-10 border-t border-current/10 pt-6">
				<h3 class="font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-40">Direct</h3>
				<div class="mt-3 space-y-1">
					<a
						href="https://github.com/{orgLogin}"
						target="_blank"
						rel="noreferrer noopener"
						class="theme-transition block text-sm font-light opacity-60 hover:opacity-100"
					>
						github.com/{orgLogin}
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

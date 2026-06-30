<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const members = $derived(data.ok ? data.data.members : []);
	const orgLogin = $derived(data.ok ? data.data.org.login : 'i-got-this-faa');
	const orgUrl = $derived(data.ok ? data.data.org.html_url : 'https://github.com/i-got-this-faa');

	function displayName(login: string): string {
		return login.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<svelte:head>
	<title>{data.ok ? data.data.org.name ?? data.data.org.login : 'Join'} · Join</title>
</svelte:head>

<section class="text-cinema flex flex-1 items-center justify-center overflow-hidden px-8 md:px-14">
	<div class="grid w-full max-w-5xl gap-16 lg:grid-cols-2">
		<!-- Left: Contact form -->
		<div class="flex flex-col justify-center">
			<h1 class="text-4xl font-black uppercase tracking-tighter md:text-6xl">Join Us</h1>
			<p class="mt-2 max-w-sm text-sm font-light opacity-60">
				We're always looking for people who build with intent. Drop a line.
			</p>

			<form class="mt-8 space-y-5" onsubmit={(e) => e.preventDefault()}>
				<div>
					<label for="join-name" class="mb-1 block font-mono text-[0.55rem] uppercase tracking-[0.2em] opacity-40">Name</label>
					<input
						type="text"
						id="join-name"
						placeholder="Your name"
						class="theme-transition w-full border-b border-current/20 bg-transparent py-2 text-sm font-light outline-none placeholder:opacity-25 focus:border-current/50"
					/>
				</div>
				<div>
					<label for="join-email" class="mb-1 block font-mono text-[0.55rem] uppercase tracking-[0.2em] opacity-40">Email</label>
					<input
						type="email"
						id="join-email"
						placeholder="your@email.com"
						class="theme-transition w-full border-b border-current/20 bg-transparent py-2 text-sm font-light outline-none placeholder:opacity-25 focus:border-current/50"
					/>
				</div>
				<div>
					<label for="join-msg" class="mb-1 block font-mono text-[0.55rem] uppercase tracking-[0.2em] opacity-40">Message</label>
					<textarea
						id="join-msg"
						rows="3"
						placeholder="What drives you?"
						class="theme-transition w-full resize-none border-b border-current/20 bg-transparent py-2 text-sm font-light outline-none placeholder:opacity-25 focus:border-current/50"
					></textarea>
				</div>
				<button
					type="submit"
					class="theme-transition mt-2 border border-current/30 px-8 py-2.5 font-mono text-[0.6rem] uppercase tracking-[0.2em] hover:bg-current/10"
				>
					Transmit ↗
				</button>
			</form>
		</div>

		<!-- Right: Team + Contact -->
		<div class="flex flex-col justify-center">
			<h2 class="font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-40">The Crew</h2>
			<ul class="mt-4 flex flex-wrap gap-4">
				{#each members as member (member.login)}
					<li>
						<a
							href={member.html_url}
							target="_blank"
							rel="noreferrer"
							class="theme-transition group flex flex-col items-center gap-1.5"
						>
							<img
								src={member.avatar_url}
								alt={member.login}
								class="h-12 w-12 rounded-full border border-current/10 shadow-lg shadow-black/30 transition-transform duration-300 group-hover:scale-110"
								width="48"
								height="48"
							/>
							<span class="font-mono text-[0.5rem] uppercase tracking-[0.1em] opacity-50 group-hover:opacity-80">
								{displayName(member.login)}
							</span>
						</a>
					</li>
				{/each}
			</ul>

			<div class="mt-10 border-t border-current/10 pt-6">
				<h3 class="font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-40">Direct</h3>
				<div class="mt-3 space-y-1">
					<a
						href={orgUrl}
						target="_blank"
						rel="noreferrer"
						class="theme-transition block text-sm font-light opacity-60 hover:opacity-100"
					>
						github.com/{orgLogin} ↗
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

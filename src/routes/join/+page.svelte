<script lang="ts">
	import JoinSection from '$lib/components/JoinSection.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const members = $derived(data.ok ? data.data.members : []);
	const orgName = $derived(data.ok ? (data.data.org.name ?? data.data.org.login) : 'Join');
</script>

<svelte:head>
	<title>{orgName} · Join</title>
</svelte:head>

<JoinSection {members} />

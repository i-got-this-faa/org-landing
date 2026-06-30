// Server-only GitHub data layer.
//
// One module-level in-memory cache per org, so no matter how much traffic the
// landing page gets, we make at most ~4 GitHub API requests per cache window.
// If the upstream fetch fails, we serve the last good snapshot (stale-on-error)
// rather than breaking the page. An optional GITHUB_TOKEN raises the rate limit.

import { env as dynEnv } from '$env/dynamic/private';

const TTL_MS = 5 * 60 * 1000; // refresh at most every 5 minutes
const STALE_MS = 60 * 60 * 1000; // keep a stale snapshot around for an hour as a fallback

// --- Minimal types for the fields we actually consume from the GitHub API ----

export interface OrgMeta {
	login: string;
	name: string | null;
	description: string | null;
	avatar_url: string;
	html_url: string;
	blog: string | null;
	location: string | null;
	company: string | null;
	twitter_username: string | null;
	public_repos: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
	is_verified: boolean;
}

export interface RepoMeta {
	id: number;
	name: string;
	full_name: string;
	html_url: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	forks_count: number;
	watchers_count: number;
	open_issues_count: number;
	topics: string[];
	homepage: string | null | undefined;
	license: { spdx_id: string; name: string } | null;
	archived: boolean;
	fork: boolean;
	default_branch: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
}

export interface MemberMeta {
	login: string;
	avatar_url: string;
	html_url: string;
}

export interface EventMeta {
	id: string;
	type: string;
	created_at: string;
	actor: { login: string; avatar_url: string };
	repo: { name: string };
	payload: {
		action?: string;
		ref?: string;
		ref_type?: string;
		size?: number;
		commits?: { sha: string; message: string }[];
	};
}

export interface OrgData {
	fetched_at: number; // epoch ms — when this snapshot was captured upstream
	cache_status: 'fresh' | 'stale';
	org: OrgMeta;
	repos: RepoMeta[];
	members: MemberMeta[];
	events: EventMeta[];
}

// --- Cache -------------------------------------------------------------------

interface CacheEntry {
	promise: Promise<OrgData>;
	updatedAt: number;
}

const cache = new Map<string, CacheEntry>();

// --- Fetch helper ------------------------------------------------------------

const GH_API = 'https://api.github.com';

function headers(): HeadersInit {
	const h: Record<string, string> = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'User-Agent': 'org-landing/1.0'
	};
	const token = dynEnv.GITHUB_TOKEN;
	if (token) h.Authorization = `Bearer ${token}`;
	return h;
}

async function gh<T>(path: string, signal?: AbortSignal): Promise<T> {
	const res = await fetch(`${GH_API}${path}`, { headers: headers(), signal });
	if (res.status === 404) throw new Error(`not found: ${path}`);
	if (!res.ok) {
		const limit = res.headers.get('x-ratelimit-remaining');
		const reset = res.headers.get('x-ratelimit-reset');
		const body = await res.text().catch(() => '');
		throw new Error(
			`github ${res.status} on ${path}` +
				(limit != null ? ` (ratelimit-remaining=${limit})` : '') +
				(reset ? ` reset=${reset}` : '') +
				(body ? ` :: ${body.slice(0, 180)}` : '')
		);
	}
	return (await res.json()) as T;
}

// --- Individual fetchers -----------------------------------------------------

async function fetchOrg(org: string, signal?: AbortSignal): Promise<OrgMeta> {
	return gh<OrgMeta>(`/orgs/${org}`, signal);
}

async function fetchRepos(org: string, signal?: AbortSignal): Promise<RepoMeta[]> {
	const all: RepoMeta[] = [];
	let page = 1;
	// Page through public repos (cap at a sane ceiling).
	while (all.length < 300) {
		const batch = await gh<RepoMeta[]>(
			`/orgs/${org}/repos?per_page=100&page=${page}&sort=updated&type=public`,
			signal
		);
		all.push(...batch);
		if (batch.length < 100) break;
		page += 1;
	}
	return all;
}

async function fetchMembers(org: string, signal?: AbortSignal): Promise<MemberMeta[]> {
	return gh<MemberMeta[]>(`/orgs/${org}/members?per_page=100`, signal);
}

async function fetchEvents(org: string, signal?: AbortSignal): Promise<EventMeta[]> {
	return gh<EventMeta[]>(`/orgs/${org}/events?per_page=30`, signal);
}

// --- Snapshot assembly -------------------------------------------------------

async function buildSnapshot(org: string, signal?: AbortSignal): Promise<OrgData> {
	// Fire the four independent requests concurrently.
	const [orgMeta, repos, members, events] = await Promise.all([
		fetchOrg(org, signal),
		fetchRepos(org, signal),
		fetchMembers(org, signal),
		fetchEvents(org, signal)
	]);

	return {
		fetched_at: Date.now(),
		cache_status: 'fresh',
		org: orgMeta,
		repos: repos
			.filter((r) => !r.name.startsWith('.'))
			.sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)),
		members,
		events
	};
}

// --- Public entry ------------------------------------------------------------

/**
 * Get a cached snapshot of the org's data. Makes at most ~4 upstream requests
 * per TTL window; serves a stale snapshot on upstream failure.
 */
export async function getOrgData(org: string): Promise<OrgData> {
	const key = org.toLowerCase();
	const entry = cache.get(key);

	// Fresh cache — reuse it.
	if (entry && Date.now() - entry.updatedAt < TTL_MS) {
		return entry.promise;
	}

	// Kick off a fresh fetch. Keep the previous promise around as a fallback so
	// concurrent requests during a slow refresh share one in-flight call.
	const previous = entry;
	const promise = buildSnapshot(org).catch((err) => {
		if (previous && Date.now() - previous.updatedAt < STALE_MS) {
			// Upstream failed but we still have a usable (stale) snapshot.
			return previous.promise.then((d) => ({ ...d, cache_status: 'stale' as const }));
		}
		throw err;
	});

	cache.set(key, { promise, updatedAt: Date.now() });

	try {
		return await promise;
	} catch (err) {
		// Drop the broken entry so the next request tries again immediately.
		if (cache.get(key)?.promise === promise) cache.delete(key);
		throw err;
	}
}

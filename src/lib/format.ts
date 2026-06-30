// Client-safe formatting helpers shared across components.

const UNITS: [number, string][] = [
	[1000, 'k'],
	[1000_000, 'M'],
	[1000_000_000, 'B']
];

/** Compact human number: 1234 -> "1.2k", 0 -> "0". */
export function compact(n: number): string {
	if (n < 1000) return String(n);
	for (let i = UNITS.length - 1; i >= 0; i--) {
		const [div, suffix] = UNITS[i];
		if (n >= div) {
			const v = n / div;
			const str = v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, '');
			return `${str}${suffix}`;
		}
	}
	return String(n);
}

/** Relative time from a timestamp: "just now", "3m ago", "2d ago", ... */
export function relativeTime(iso: string, now: number = Date.now()): string {
	const then = new Date(iso).getTime();
	const diff = Math.max(0, now - then);
	const s = diff / 1000;
	if (s < 45) return 'just now';
	const m = s / 60;
	if (m < 60) return `${Math.floor(m)}m ago`;
	const h = m / 60;
	if (h < 24) return `${Math.floor(h)}h ago`;
	const d = h / 24;
	if (d < 30) return `${Math.floor(d)}d ago`;
	const mo = d / 30;
	if (mo < 12) return `${Math.floor(mo)}mo ago`;
	const y = d / 365;
	return `${Math.floor(y)}y ago`;
}

/** Absolute date label for hover/title attributes. */
export function absDate(iso: string): string {
	const d = new Date(iso);
	return d.toISOString().replace('T', ' ').slice(0, 19) + 'Z';
}

/** Short event-type label, e.g. "push", "pr", "create". */
export function eventLabel(type: string): { tag: string; kind: string } {
	switch (type) {
		case 'PushEvent':
			return { tag: 'push', kind: 'commit' };
		case 'CreateEvent':
			return { tag: 'create', kind: 'ref' };
		case 'PullRequestEvent':
			return { tag: 'pr', kind: 'review' };
		case 'IssuesEvent':
			return { tag: 'issue', kind: 'track' };
		case 'ReleaseEvent':
			return { tag: 'release', kind: 'ship' };
		case 'WatchEvent':
			return { tag: 'star', kind: 'signal' };
		case 'ForkEvent':
			return { tag: 'fork', kind: 'signal' };
		case 'IssueCommentEvent':
			return { tag: 'comment', kind: 'talk' };
		default:
			return { tag: type.replace(/Event$/, '').toLowerCase(), kind: 'event' };
	}
}

/** GitHub language → accent hex. Source: github.com/ozh/github-colors blend, hand-picked. */
const LANG_COLORS: Record<string, string> = {
	Rust: '#dea584',
	Go: '#00ADD8',
	TypeScript: '#3178c6',
	Svelte: '#ff3e00',
	Python: '#3572A5',
	Astro: '#ff5a03',
	C: '#555555',
	'C++': '#f34b7d',
	'C#': '#178600',
	HTML: '#e34c26',
	TeX: '#3D6117',
	Shell: '#89e051',
	Dockerfile: '#384d54',
	JavaScript: '#f1e05a',
	CSS: '#563d7c'
};

export function langColor(lang: string | null): string {
	if (!lang) return 'var(--c-dim)';
	return LANG_COLORS[lang] ?? '#7d8590';
}

/** Build a clone URL string. */
export function cloneUrl(fullName: string): string {
	return `https://github.com/${fullName}.git`;
}

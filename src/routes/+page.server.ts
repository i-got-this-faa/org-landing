import type { PageServerLoad } from './$types';
import { getOrgData, type OrgData } from '$lib/server/github';

// The org this landing page represents. Single source of truth.
const ORG = 'i-got-this-faa';

// Re-export the shape the page consumes, so markup can stay loosely typed.
export type { OrgData };

export const load: PageServerLoad = async ({ setHeaders }) => {
	try {
		const data = await getOrgData(ORG);
		// Let the CDN/edge cache the rendered HTML briefly. The data module
		// already dedupes upstream calls to a 5-minute window.
		setHeaders({
			'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
		});
		return { ok: true as const, data };
	} catch (err) {
		// Don't crash the page if GitHub is down; render a controlled error state.
		const message = err instanceof Error ? err.message : String(err);
		setHeaders({ 'cache-control': 'public, max-age=30' });
		return { ok: false as const, error: message };
	}
};

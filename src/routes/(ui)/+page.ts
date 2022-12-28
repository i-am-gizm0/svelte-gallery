import type { Collection } from '$lib/types';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch, parent }) => {
    const recentGalleriesResponse = await fetch('/api/collections/recent');
    let recentGalleries: Collection;
    if (recentGalleriesResponse.ok) {
        recentGalleries = await recentGalleriesResponse.json();
    } else {
        recentGalleries = {
            name: 'Recent Events',
            galleries: [],
        };
    }
    const { session } = await parent();
    return {
        recentGalleries,
        headerImage: session.defaults.headerImage,
        resources: session.resources,
    };
};

import type { Collection } from '$lib/types';
import type { PageLoad } from './$types';
export const load: PageLoad = async ({ fetch, session }) => {
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
    return {
        recentGalleries,
        headerImage: session.defaults.headerImage,
        resources: session.resources,
    };
};

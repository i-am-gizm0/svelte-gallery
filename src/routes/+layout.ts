import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, session }) => {
    const galleriesResponse = await fetch('/api/galleries');
    const galleries = await galleriesResponse.json();
    return {
        navLinks: galleries,
        resources: session.resources,
    };
};

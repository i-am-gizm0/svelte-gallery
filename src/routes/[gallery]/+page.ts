import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, session }) => {
    const { gallery } = params;
    const apiResponse = await fetch(`/api/galleries/${encodeURIComponent(gallery)}`);
    if (apiResponse.ok) {
        return {
            gallery: await apiResponse.json(),
            resources: session.resources,
            defaultHeaderImage: session.defaults.headerImage,
        };
    } else {
        throw error(500, (await apiResponse.json()).userError);
    }
};

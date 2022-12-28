import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch, parent }) => {
    const { gallery } = params;
    const apiResponse = await fetch(`/api/galleries/${encodeURIComponent(gallery)}`);
    const { session } = await parent();
    if (apiResponse.ok) {
        return {
            gallery: await apiResponse.json(),
            resources: session.resources,
            defaultHeaderImage: session.defaults.headerImage,
        };
    } else if (apiResponse.status == 404) {
        throw error(404, "Not Found");
    } else {
        throw error(500, (await apiResponse.json()).userError);
    }
};

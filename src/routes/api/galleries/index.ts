import { getGalleries } from '$lib/gallerieshelper';
import type { Load } from '@sveltejs/kit';

export const GET: Load = async () => {
    const { groups } = await getGalleries();
    return {
        status: 200,
        body: groups,
    };
};

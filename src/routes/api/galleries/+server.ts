import { json } from '@sveltejs/kit';
import { getGalleries } from '$lib/server/gallerieshelper';
import type { Load } from '@sveltejs/kit';

export const GET: Load = async () => {
    const { groups } = await getGalleries();
    return json(groups);
};

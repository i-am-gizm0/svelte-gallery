import { getAllCollections } from '$lib/gallerieshelper';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async () => {
    const collections = await getAllCollections();
    return {
        status: 200,
        body: collections,
    };
};

import { json } from '@sveltejs/kit';
import { getAllCollections } from '$lib/gallerieshelper';
import type { RequestHandler } from '..svelte-kit/types/src/routes/api/collections/__types/[collectionId]';

export const GET: RequestHandler = async ({ params }) => {
    const { collectionId } = params;

    const collections = await getAllCollections();
    if (collectionId in collections) {
        return json(collections[collectionId]);
    } else {
        return json({
            error: 'Not Found',
        }, {
            status: 404
        });
    }
};

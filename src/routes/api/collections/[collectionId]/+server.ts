import { json } from '@sveltejs/kit';
import { getAllCollections } from '$lib/server/gallerieshelper';
import type { RequestHandler } from './$types';

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

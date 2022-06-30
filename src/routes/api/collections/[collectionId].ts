import { getAllCollections } from '$lib/gallerieshelper';
import type { RequestHandler } from '.svelte-kit/types/src/routes/api/collections/__types/[collectionId]';

export const get: RequestHandler = async ({ params }) => {
    const { collectionId } = params;

    const collections = await getAllCollections();
    if (collectionId in collections) {
        return {
            status: 200,
            body: collections[collectionId],
        };
    } else {
        return {
            status: 404,
            body: {
                error: 'Not Found',
            },
        };
    }
};

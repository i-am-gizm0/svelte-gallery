import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGalleryMetadata } from '$lib/gallerieshelper';

export const GET: RequestHandler = async ({ params }) => {
    const { galId } = params;

    try {
        return json(await getGalleryMetadata(galId));
    } catch (e) {
        if (e instanceof Error && e.message === 'nonesuch') {
            return json({
                error: `That gallery doesn't exist`,
            }, {
                status: 404
            });
        } else {
            throw e;
        }
    }
};

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGallery, translateGallery } from '$lib/gallerieshelper';

export const GET: RequestHandler = async ({ params }) => {
    const { galId } = params;

    try {
        return json(
            translateGallery(await getGallery(galId), galId)
        );
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

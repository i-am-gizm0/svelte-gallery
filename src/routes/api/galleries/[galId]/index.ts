import type { RequestHandler } from '.svelte-kit/types/src/routes/api/galleries/[galId]/__types/index';
import { getGallery, translateGallery } from '$lib/gallerieshelper';

export const GET: RequestHandler = async ({ params }) => {
    const { galId } = params;

    try {
        return {
            status: 200,
            body: translateGallery(await getGallery(galId), galId),
        };
    } catch (e) {
        if (e instanceof Error && e.message === 'nonesuch') {
            return {
                status: 404,
                body: {
                    error: `That gallery doesn't exist`,
                },
            };
        } else {
            throw e;
        }
    }
};

import type { RequestHandler } from '.svelte-kit/types/src/routes/api/galleries/[galId]/__types/meta';
import { getGalleryMetadata } from '$lib/gallerieshelper';

export const get: RequestHandler = async ({ params }) => {
    const { galId } = params;

    try {
        return {
            status: 200,
            body: await getGalleryMetadata(galId),
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

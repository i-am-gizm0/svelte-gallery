import { getDefaults, getGalleries } from '$lib/gallerieshelper';
import type { LayoutServerLoad } from './$types';

import { siteName, siteNameStart, siteNameEnd } from '$lib/sitename';


export const load: LayoutServerLoad = async () => {
    const galleries = await getGalleries();
    return {
        navLinks: galleries,
        session: {
            resources: {
                site: {
                    name: siteName,
                    start: siteNameStart,
                    end: siteNameEnd,
                },
            },
            defaults: await getDefaults()
        }
    };
};

import type { GetSession } from '@sveltejs/kit';
import { getDefaults } from '$lib/gallerieshelper';

const siteNameStart = process.env['SITE_NAME_START'] || 'My Gallery';
const siteNameEnd = process.env['SITE_NAME_END'] ?? '';
const siteName = (process.env['SITE_NAME'] || `${siteNameStart} ${siteNameEnd}`).trim();

export const getSession: GetSession = async () => {
    return {
        resources: {
            site: {
                name: siteName,
                start: siteNameStart,
                end: siteNameEnd,
            },
        },
        defaults: await getDefaults(),
    };
};

process.on('SIGINT', exit);
process.on('SIGTERM', exit);
function exit() {
    process.exit();
}

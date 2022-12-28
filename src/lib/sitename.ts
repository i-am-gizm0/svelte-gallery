import { env } from '$env/dynamic/public';

export const siteNameStart = env['SITE_NAME_START'] || 'My Gallery';
export const siteNameEnd = env['SITE_NAME_END'] ?? '';
export const siteName = (env['SITE_NAME'] || `${siteNameStart} ${siteNameEnd}`).trim();

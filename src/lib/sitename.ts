import { env } from '$env/dynamic/public';

// This is an awful hack and I shouldn't have to do it this way but something's wrong with Kit
// import process from 'process';
// const { env } = process;
// console.log({env});
export const siteNameStart = env['SITE_NAME_START'] || 'My Gallery';
export const siteNameEnd = env['SITE_NAME_END'] ?? '';
export const siteName = (env['SITE_NAME'] || `${siteNameStart} ${siteNameEnd}`).trim();

import { dev } from '$app/env';
import { getGalleryMetadata } from '$lib/gallerieshelper';

import FileCache from '$lib/modules/filecache';
import ImageProcessor, { type ProcessArgs } from '$lib/modules/imageprocessor';
import type { RequestHandler } from '.svelte-kit/types/src/routes/[gallery]/__types/[image]';

import 'dotenv/config';
import { existsSync } from 'fs';
import { join } from 'path';

const cache = new FileCache();
const resizer = new ImageProcessor(process.env.GALLERIES_BASE);

export const GET: RequestHandler = async ({ params, url }) => {
    const { gallery, image } = params;
    try {
        getGalleryMetadata(gallery);
    } catch (e) {
        return {
            status: 404,
            error: `That gallery doesn't exist`,
        };
    }
    const imagepath = `${gallery}/${image}`;
    log({ params, imagepath });
    const query = url.searchParams;
    const w = query.has('w') ? parseInt(query.get('w')) : undefined;
    const h = query.has('h') ? parseInt(query.get('h')) : undefined;
    const fit = query.get('fit') || undefined;
    const format = query.get('format') || undefined;

    log({ imagepath, w, h, fit, format });

    // @ts-expect-error TODO: Check for valid parameters
    const fileDefinition: [string, ProcessArgs] = [imagepath, { w, h, fit, format }];
    log({ fileDefinition });

    if (!existsSync(join(process.env.GALLERIES_BASE, imagepath))) {
        return {
            status: 404,
            error: `That image doesn't exist`,
        };
    }

    const cacheFilePath = resizer.getCacheFilePath(...fileDefinition);
    log({ cacheFilePath });
    // @ts-expect-error TODO: Check for valid parameters
    const contentType = resizer.getContentType(format);
    log({ contentType });
    if (await cache.hasFile(cacheFilePath)) {
        log('cache hit');
        time('Read File');
        const body = await cache.getFile(cacheFilePath);
        timeEnd('Read File');
        return {
            status: 200,
            headers: {
                'Content-Type': contentType,
            },
            body,
        };
    }
    log('cache miss');

    time('Process Image');
    const rawImage = await resizer.process(...fileDefinition);
    timeEnd('Process Image');

    try {
        time('Write File');
        await cache.setFile(cacheFilePath, rawImage);
    } catch (e) {
        warn(`Couldn't set cache:`, e);
    } finally {
        timeEnd('Write File');
    }

    return {
        status: 201,
        headers: {
            'Content-Type': contentType,
        },
        body: rawImage,
    };
};

const log = dev ? console.log : () => undefined;
const warn = dev ? console.warn : () => undefined;
const time = dev ? console.time : () => undefined;
const timeEnd = dev ? console.timeEnd : () => undefined;

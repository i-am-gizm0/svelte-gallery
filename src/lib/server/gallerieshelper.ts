import 'dotenv/config';
import { XMLParser } from 'fast-xml-parser';
import { readdirSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import type {
    Collections,
    Group,
    GalleryData,
    GalleryResources,
    Section,
    GalleryMeta,
    DefinedImageContents,
    Image as UtilImage,
    MaybeArray,
} from '../types';
import { castToArray, condenseImgTag, removeUndefined } from '../util';

const GALLERIES_BASE = resolve(process.env.GALLERIES_BASE || '');

const loadGalleries = async () => {
    const listFile = await readFile(join(GALLERIES_BASE, 'site.xml'), 'utf8');
    const list = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        allowBooleanAttributes: true,
    }).parse(listFile);
    return list.site;
};

const getNav = (galleriesData: {
    nav: {
        group: MaybeArray<{
            name: string;
            gallery: MaybeArray<{
                path: string;
                name: string;
                hidden?: boolean;
            }>;
        }>;
    };
}) => {
    return castToArray(galleriesData.nav?.group).map(group => {
        const name = group.name;
        const galleries = castToArray(group.gallery).filter(gallery => gallery?.hidden !== true).map(({path, name}) => { return { name, path: path.startsWith('/') ? path : `/${path}`}});
        return { name, galleries };
    });
};

const getCollections = async (galleriesData: {
    collections: {
        collection: MaybeArray<{
            gallery: MaybeArray<{ path: string }>;
            id: string;
            name: string;
        }>;
    };
}): Promise<Collections> => {
    // console.log({ collection: galleriesData.collections.collection });
    const collectionsArray: { name: string; id: string; galleries: string[] }[] = castToArray(
        galleriesData.collections.collection
    ).map(collection => {
        const { gallery, ...collectionMeta } = collection;
        const galleries = castToArray(gallery).map(gallery => gallery?.path.substring(1));
        return { galleries, ...collectionMeta };
    });
    const collections: Collections = {};
    for await (const collection of collectionsArray) {
        const galleryPromiseResults = await Promise.allSettled(
            collection.galleries.map(async galleryName => {
                return {
                    path: galleryName,
                    ...(await getGalleryMetadata(galleryName)),
                };
            })
        );
        const galleries = galleryPromiseResults
            .map(galleryPromiseResult => {
                if (galleryPromiseResult.status === 'fulfilled') {
                    return galleryPromiseResult.value;
                }
                return undefined;
            })
            .filter(removeUndefined);
        collections[collection.id] = {
            name: collection.name,
            galleries,
        };
    }
    return collections;
};

export const getAllGalleries = (): string[] => {
    return readdirSync(GALLERIES_BASE, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
};

export const getGalleries = async (): Promise<{ groups: Group[] }> => {
    const galleries = await loadGalleries();

    const groups = getNav(galleries);

    return { groups };
};

export const getAllCollections = async (): Promise<Collections> => {
    return await getCollections(await loadGalleries());
};

/** Get the definition of a gallery.
 * TODO: Ensure that the gallery name is sanitized
 */
export const getGallery = async (galleryName: string): Promise<GalleryData> => {
    const gallery = await loadGallery(galleryName);

    const meta = getMeta(gallery);
    const sections = getSections(gallery);
    const resources = getResources(gallery, galleryName);

    return { meta, sections, resources };
};

export const getGalleryMetadata = async (
    galleryName: string
): Promise<{
    title: string;
    overrides?: {
        'small-large'?: {
            small: string;
            large: string;
        };
        'large-small'?: {
            large: string;
            small: string;
        };
    };
    description?: string;
    header: GalleryImage;
}> => {
    const gallery = await loadGallery(galleryName);
    const meta = getMeta(gallery);
    const resources = getResources(gallery, galleryName);
    return {
        title: meta.title,
        overrides: meta.overrides,
        description: meta.description,
        header: translateImage(meta.header, resources),
    };
};

const loadGallery = async (galleryName: string) => {
    let galleryFile: string;
    try {
        galleryFile = await readFile(join(GALLERIES_BASE, galleryName, 'gallery.xml'), 'utf-8');
    } catch (e) {
        throw new Error('nonesuch');
    }
    const definition = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '',
        allowBooleanAttributes: true,
        // preserveOrder: true,
        ignoreDeclaration: true,
    }).parse(galleryFile);
    return definition.gallery;
};

const getMeta = (galleryData: {
    meta: {
        title: string;
        overrides?: {
            'small-large'?: { small: string; large: string };
            'large-small'?: { large: string; small: string };
        };
        description?: string;
        'header-image'?: UtilImage;
    };
}): GalleryMeta => {
    const metaDefinition = galleryData.meta;
    return {
        title: metaDefinition.title,
        overrides: metaDefinition.overrides,
        description: metaDefinition.description,
        header: metaDefinition['header-image']
            ? condenseImgTag(metaDefinition['header-image'])
            : null,
    };
};

const getSections = (
    galleryData
): (
    | { type: 'markdown'; content: string }
    | { type: 'featured'; content: string | DefinedImageContents }
    | { type: 'gallery'; content: (string | DefinedImageContents)[] }
)[] => {
    const sectionsDefinition = castToArray(galleryData.sections.section);
    return sectionsDefinition
        .map(section => {
            let sectionData:
                | { type: 'markdown'; content: string }
                | { type: 'featured'; content: string | DefinedImageContents }
                | { type: 'gallery'; content: (string | DefinedImageContents)[] };

            switch (section.type) {
                case 'markdown':
                    sectionData = {
                        type: 'markdown',
                        content: section['#text'],
                    };
                    break;

                case 'featured':
                    sectionData = {
                        type: 'featured',
                        content: condenseImgTag(section),
                    };
                    break;

                case 'gallery':
                    sectionData = {
                        type: 'gallery',
                        content: section.img
                            .map(img => condenseImgTag({ img }))
                            .filter(removeUndefined),
                    };
                    break;

                default:
                    return undefined;
            }

            return sectionData;
        })
        .filter(removeUndefined);
};

const getResources = (
    galleryData: {
        resources: { img: DefinedImageContents | DefinedImageContents[] };
    },
    galId: string
): { [key: string]: DefinedImageContents } => {
    const resources: { [key: string]: DefinedImageContents } = {};
    if (galleryData?.resources?.img) {
        const resourcesDefinition = castToArray(galleryData.resources?.img);
        resourcesDefinition.forEach(({ id, ...resource }) => {
            resources[id] = resource;
            if (!resource.src.match(/^https?:\/\//)) {
                resource.src = `/${galId}/${resource.src}`;
            }
        });
    }
    return resources;
};

export const getDefaults = async (): Promise<{
    headerImage: GalleryImage;
}> => {
    const site = await loadGalleries();
    const defaults = {
        headerImage: translateImage(site.defaults['header-image'].img, {}),
    };
    return defaults;
};

export function translateGallery({ meta, sections, resources }: GalleryData, galleryId: string): Gallery {
    const gallery: Gallery = {
        fullTitle: meta.title,
        headerImage: translateImage(meta.header, resources, galleryId),
        description: meta.description,
        sections: sections.map(section => translateSection(section, resources, galleryId)),
    };
    if (meta.overrides['large-small']) {
        gallery.bigSmallTitle = `${meta.overrides['large-small'].large}\n${meta.overrides['large-small'].small}`;
    }
    if (meta.overrides['small-large']) {
        gallery.smallBigTitle = `${meta.overrides['small-large'].small}\n${meta.overrides['small-large'].large}`;
    }
    return gallery;
}

function translateImage(
    image: string | DefinedImageContents,
    resources: GalleryResources,
    galleryId?: string
): GalleryImage | undefined {
    if (!image) {
        return undefined;
    }
    if (typeof image === 'string') {
        const ref = image.substring(1);
        if (ref in resources) {
            return translateImage(resources[ref], resources, galleryId);
        } else {
            return undefined;
        }
    }
    const uri = !image.src.startsWith('http') ? `/${galleryId}/${image.src}` : image.src;
    return <GalleryImage>{
        uri,
        // TODO: This is janky but works for now
        previewUri: image.src.includes('http') ? `${image.src}?w=800` : uri,
        blurhash: image.blurhash,
        aspect: {
            width: image.width,
            height: image.height,
        },
        caption: image.title,
        alt: image.alt,
    };
}

function translateSection({ type, content }: Section, resources: GalleryResources, galleryId: string) {
    switch (type) {
        case 'gallery':
            return <ImageGallery>{
                type: 'ImageGallery',
                images: (content as (string | DefinedImageContents)[])
                    .map(image => translateImage(image, resources, galleryId))
                    .filter(removeUndefined),
            };

        case 'featured':
            return <FeaturedImage>{
                type: 'FeaturedImage',
                image: translateImage(content as string | DefinedImageContents, resources, galleryId),
            };

        case 'markdown':
            return <MarkdownSection>{
                type: 'MarkdownSection',
                content,
            };
    }
}

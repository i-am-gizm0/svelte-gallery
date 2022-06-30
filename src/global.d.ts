/// <reference types="@sveltejs/kit" />
/// <reference types="svelte-blurhash" />
/// <reference types="svelte-markdown" />

declare namespace App {
    interface Session {
        resources: Resources;
        defaults: {
            [key: string]: unknown;
        };
    }

    type Resources = {
        [key: string]: {
            [key: string]: string;
        };
    };
}

// TODO: Remove this stuff from this file. It confuses svelte-check
type Image = {
    uri: string;
    blurhash: string;
    aspect: {
        width: number;
        height: number;
    };
    caption?: string;
};

type GalleryImage = Image & {
    previewUri: string;
};

type GallerySection<T> = T extends { type: 'ImageGallery' }
    ? ImageGallery
    : T extends { type: 'MarkdownSection' }
    ? MarkdownSection
    : T extends { type: 'FeaturedImage' }
    ? FeaturedImage
    : never;

type Gallery = {
    fullTitle: string;
    bigSmallTitle?: string;
    smallBigTitle?: string;
    headerImage?: Image;
    description?: string;
    sections: GallerySection[];
};

interface ImageGallery extends GallerySection {
    images: GalleryImage[];
}

interface MarkdownSection extends GallerySection {
    content: string;
}

interface FeaturedImage extends GallerySection {
    image: Image;
}

// gallerieshelper.ts
export type GalleryGroups = {
    groups: Group[];
};

export type Group = {
    name: string;
    galleries: GalleryListing[];
};

export type GalleryListing = {
    name: string;
    path: string;
};

export type Collections = {
    [key: string]: Collection;
};

export type Collection = {
    name: string;
    galleries: {
        path: string;
        title: string;
        overrides?: {
            'small-large'?: { small: string; large: string };
            'large-small'?: { large: string; small: string };
        };
        description?: string;
        header: GalleryImage;
    }[];
};

export type GalleryMeta = {
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
    header: string | DefinedImageContents;
};

export type Section =
    | { type: 'markdown'; content: string }
    | { type: 'featured'; content: string | DefinedImageContents }
    | { type: 'gallery'; content: (string | DefinedImageContents)[] };

export type GalleryResources = { [key: string]: DefinedImageContents };
export type GalleryData = { meta: GalleryMeta; sections: Section[]; resources: GalleryResources };

// util.ts

export type LinkImage = Image<LinkImageContents>;
export type DefinedImage = Image<DefinedImageContents>;

export interface Image<T = LinkImageContents | DefinedImageContents> {
    img: T;
}

export type LinkImageContents = {
    link: string;
};

export type DefinedImageContents = {
    id?: string;
    src: string;
    alt?: string;
    title?: string;
    blurhash: string;
    width: number | string;
    height: number | string;
};

export type MaybeArray<T> = T | T[];

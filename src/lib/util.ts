import type { DefinedImage, DefinedImageContents, Image, LinkImage } from './types';

export function castToArray<T>(value: T | T[]): T[] {
    if (value instanceof Array) {
        return value;
    } else {
        return [value];
    }
}

export function condenseImgTag(input: Image): string | DefinedImageContents {
    const imageContents = input?.img;
    if (imageContents) {
        if ('link' in imageContents) {
            return (input as LinkImage).img?.link;
        } else {
            return (input as DefinedImage).img;
        }
    } else {
        return undefined;
    }
}

export function removeUndefined(val: unknown): boolean {
    return val !== undefined && val !== null;
}

// export function isImage(input: unknown): input is Image {
//     return typeof input === 'object' && 'img' in input && ('link' in (input as {[key: string]: unknown}).img || ('src' in input.img && 'blurhash' in input.img && 'width' in input.img && 'height' in input.img));
// }

// export function isLinkImage(input: unknown): input is LinkImage {
//     return typeof input === 'object' && 'img' in input && 'link' in input.img && typeof input.img.link === 'string';
// }

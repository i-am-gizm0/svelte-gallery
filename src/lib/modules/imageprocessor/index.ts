import { basename, extname, join, resolve } from 'path';
import sharp, { type ResizeOptions, type Sharp } from 'sharp';
import InvalidFormatError from './InvalidFormatError';

/** A utility class to process images to the requested size */
export default class ImageProcessor {
    /** The base directory to read images from */
    private baseDir: string;

    /** Creates a new `ImageProcessor` which looks for images from `baseDir` */
    public constructor(baseDir: string) {
        this.baseDir = resolve(baseDir);
    }

    /** Generates a predictable file name given the path and parameters */
    public getCacheFilePath(filePath: string, { w, h, fit, format }: ProcessArgs): string {
        if (!w && !h && !fit && !format) {
            return filePath;
        }

        const ext = format || extname(filePath).substring(1);
        let args = '';
        if (w) {
            args += `.w${w}`;
        }
        if (h) {
            args += `.h${h}`;
        }
        if (fit) {
            args += `.f${fit}`;
        }
        return `${filePath}${args}.${ext}`;
    }

    /** Gets the MIME type of a format */
    public getContentType(format: OutputFormat = 'jpeg'): `image/${OutputFormat}` {
        if (ImageProcessor.isValidFormat(format)) {
            return `image/${format}`;
        }
        throw new InvalidFormatError(format);
    }

    /** Process the file at `filePath` based on the given arguments */
    public async process(filePath: string, { w, h, fit, format }: ProcessArgs): Promise<Buffer> {
        const sharpImage = sharp(join(this.baseDir, filePath)).rotate();
        const resizeOptions: ResizeOptions = {
            width: w || undefined,
            height: h || undefined,
            fit,
        };
        const resizeStep = sharpImage.resize(resizeOptions);
        let convertedImage: Sharp;
        if (format) {
            convertedImage = resizeStep.toFormat(format);
        } else {
            convertedImage = resizeStep.jpeg();
        }
        return convertedImage.toBuffer();
    }

    /** Splits `filePath` into parts: `${path}/${fileName}.${ext}` */
    public static parseFilePath(filePath: string): { path: string; fileName: string; ext: string } {
        const ext = extname(filePath).substring(1);
        const baseName = basename(filePath);
        const fileName = baseName.substring(0, baseName.lastIndexOf(ext) - 1);
        const path = filePath.substring(0, filePath.lastIndexOf(baseName) - 1);
        return { path, fileName, ext };
    }

    public static isValidFormat(format: string): format is OutputFormat {
        return ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff'].includes(format);
    }
}

export type ProcessArgs = {
    w?: number;
    h?: number;
    fit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
    format?: OutputFormat; // The formats Sharp can output
};

export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'gif' | 'avif' | 'tiff';

import { mkdir, readFile, writeFile } from 'fs/promises';
import { existsSync, mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { basename, isAbsolute, join, relative, resolve } from 'path';
import UnsafePathError from './UnsafePathError';

/** A simple file-based caching system */
export default class FileCache {
    /** The directory to cache in */
    private cacheDir: string;

    /**
     * Creates a `FileCache`. If `cacheDir` is not provided, it looks for CACHE_DIR in the environment variables and if that doesn't exist, makes a new temporary directory
     * @param cacheDir the directory to cache in
     */
    public constructor(cacheDir?: string) {
        if (cacheDir) {
            this.cacheDir = resolve(cacheDir);
        } else {
            this.cacheDir =
                'CACHE_DIR' in process.env && process.env['CACHE_DIR']
                    ? resolve(process.env['CACHE_DIR'])
                    : mkdtempSync(join(tmpdir(), 'filecache-'));
        }
    }

    /** Checks if there is a file in the cache with the file name */
    public async hasFile(fileName: string): Promise<boolean> {
        this.ensureSafePath(fileName);

        return existsSync(this.getPath(fileName));
    }

    /** Fetches the file from the cache */
    public getFile(fileName: string): Promise<Buffer> {
        this.ensureSafePath(fileName);

        return readFile(this.getPath(fileName));
    }

    /** Adds a file to or overwrites an existing file with the same name in the cache */
    public async setFile(fileName: string, contents: Buffer): Promise<void> {
        this.ensureSafePath(fileName);

        const filePath = this.getPath(fileName);
        const parentDir = filePath.substring(0, filePath.indexOf(basename(filePath)));
        if (!existsSync(parentDir)) {
            // Create necessary parent directories
            await mkdir(parentDir);
        }
        await writeFile(filePath, contents);
    }

    // TODO: Test
    /**
     * Makes sure this path does not try to escape.
     * @param fileName file path to test
     * @throws [`UnsafePathError`](../fileutils/UnsafePathError.ts) if `fileName` is not safe
     */
    private ensureSafePath(fileName: string): void {
        if (isAbsolute(fileName) || relative('.', fileName).startsWith('..')) {
            throw new UnsafePathError(fileName);
        }
    }

    /** Joins the file name with the cache dir */
    private getPath(fileName: string) {
        return join(this.cacheDir, fileName);
    }
}

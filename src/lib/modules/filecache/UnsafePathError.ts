export default class UnsafePathError extends Error {
    public constructor(path?: string) {
        super(`Unsafe path${path ? `: ${encodeURIComponent(path)}` : ''}`);
    }
}

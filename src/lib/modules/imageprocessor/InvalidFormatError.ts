export default class InvalidFormatError extends Error {
    public constructor(format?: string) {
        super(`${format ? `${format} is not` : 'Not'} a valid format`);
    }
}

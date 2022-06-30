type Source = {
    srcset: string;
    media?: string;
    type: string;
};

// TODO: Currently formats and breakpoints are specified every place this is used. They should be loaded from somewhere so they can be changed in one place
export default function generateSources(
    basePath: string,
    formats: string[],
    breakpoints: number[]
    // twoXPoint = 1200
): Source[] {
    // console.log('generateSources', { basePath, formats, breakpoints, twoXPoint });

    basePath = basePath.replace(/ /g, '%20');

    const sources: Source[] = [];

    const sortedBreakpoints = breakpoints.sort((a, b) => a - b);
    // console.log({sortedBreakpoints});

    for (const format of formats) {
        // const srcset = sortedBreakpoints.map(size => {
        //     const searchParams = new URLSearchParams({
        //         w: `${size}`,
        //         format
        //     });
        //     return `${basePath}?${searchParams.toString()} ${size}w`
        // }).join(', ');
        // const sizes = sortedBreakpoints.map((size, i) => `${i != sortedBreakpoints.length - 1 ? `(max-width: ${size}px) `: ''} ${size}px`).join(', ');

        // console.log(`Generating sources of type ${format}`);
        for (const size of sortedBreakpoints) {
            const searchParams = new URLSearchParams({
                w: `${size}`,
                format,
            });
            const srcset = `${basePath}?${searchParams}`;
            const media = `(max-width: ${size}px)`;
            const type = `image/${format}`;

            sources.push({ srcset, media, type });
        }
        sources.push({
            srcset: `${basePath}?format=${format}`,
            type: `image/${format}`,
        });
    }

    return sources;
}

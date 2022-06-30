<script lang="ts">
    import FluidBlurhash from './FluidBlurhash.svelte';

    export let image: GalleryImage;
    $: previewImage = { ...image, uri: image.previewUri };
    export let expandImage: (image: GalleryImage) => void = image => {
        console.warn(`No expand handler was provided.`, image);
    };

    export let width = 400;
    export const height = (image.aspect.height / image.aspect.width) * width;
</script>

<!-- {@debug image}
{@debug previewImage} -->

<!-- svelte-ignore a11y-invalid-attribute -->
<a
    href="#"
    class="gallery-image"
    on:click|preventDefault={() => {
        expandImage(image);
    }}
    style="--w: {image.aspect.width}; --h: {image.aspect.height}"
>
    <FluidBlurhash image={previewImage} {width} />
</a>

<style>
    a {
        width: 100%;
        max-width: 400px;
        aspect-ratio: var(--w) / var(--h);
    }
</style>

<script lang="ts">
    // TODO: Make fancy tiled, multi-column layout -> @supports(grid-template-rows: masonry)
    import PreviewImage from '../PreviewImage.svelte';

    export let images: GalleryImage[];
    export let showImage: (image?: GalleryImage, gallery?: GalleryImage[]) => void;
</script>

<section class="gallery">
    {#each images as image}
        <!-- <a href="#" on:click={showImage(image, images)}> -->
        <PreviewImage {image} expandImage={image => showImage(image, images)} />
        <!-- </a> -->
    {/each}
</section>

<style lang="scss">
    section {
        margin: var(--margin);

        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
        place-items: center;
        gap: 16px;
    }
</style>

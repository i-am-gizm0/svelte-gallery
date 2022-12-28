<script lang="ts">
    import type { Collection } from '$lib/types';
    import FluidBlurhash from './FluidBlurhash.svelte';

    type Gallery = {
        descriptor: string;
        title: string;
        image: Image;
        galleryUrl: string;
    };

    export let title = 'Recent Events';
    export let galleries: Gallery[] = [];

    export let collection: Collection;
    $: if (collection) {
        title = collection.name;
        galleries = collection.galleries.map(gallery => {
            const titleParts = {
                title: gallery.title,
                descriptor: '',
            };
            if ('overrides' in gallery && 'small-large' in gallery.overrides) {
                titleParts.descriptor = gallery.overrides['small-large'].small;
                titleParts.title = gallery.overrides['small-large'].large;
            }
            return {
                image: gallery.header,
                galleryUrl: `/${gallery.path}`,
                ...titleParts,
            };
        });
    }
</script>

<section>
    <h1>{title}</h1>
    <div class="galleries">
        {#if galleries?.length}
            {#each galleries as gallery}
                <a data-sveltekit-preload-data class="gallery" href={gallery.galleryUrl}>
                    <div class="img">
                        <div class="blurhash-wrapper">
                            <FluidBlurhash image={gallery.image} />
                        </div>
                    </div>
                    <div class="text">
                        <span class="descriptor">{gallery.descriptor}</span>
                        <span class="title">{gallery.title}</span>
                    </div>
                </a>
            {/each}
        {:else}
            <i>No Galleries Found</i>
        {/if}
    </div>
</section>

<style lang="scss">
    section {
        margin: 64px;
    }

    h1,
    .text > span {
        line-height: 1em;
        margin: 0;
    }

    .text > span {
        display: block;
    }

    h1,
    .title {
        font-family: 'Kanit', sans-serif;
        font-weight: bold;
    }

    h1 {
        margin-bottom: 32px;
        font-size: 72px;
    }

    .title {
        font-size: 48px;
    }

    .descriptor {
        font-family: 'Didact Gothic', sans-serif;
        font-weight: normal;
        font-size: 36px;
    }

    .text {
        z-index: 2;
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 16px;
    }

    .galleries {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        justify-items: center;
    }

    .gallery {
        position: relative;

        text-decoration: none;
        color: inherit;

        display: block;
        width: 100%;
        aspect-ratio: 3/2;
    }

    .img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        overflow: hidden;
    }

    .img .blurhash-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
    }

    .img::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;

        content: '';
        display: block;
        background: linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.3) 40%,
            rgba(255, 255, 255, 0) 80%
        );
        backdrop-filter: saturate(0.1);
        transition: 0.4s;
    }

    @media screen and (prefers-color-scheme: dark) {
        .img {
            background-color: #444;
        }
        .img::before {
            background: linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.6) 0%,
                rgba(0, 0, 0, 0.3) 40%,
                rgba(0, 0, 0, 0) 80%
            );
        }
    }

    .gallery:hover,
    .gallery:active {
        .img {
            opacity: 1;
        }
        .img::before {
            backdrop-filter: saturate(1);
        }
    }

    @supports not (backdrop-filter: saturate(1)) {
        .gallery .img {
            opacity: 0.8;
            transition: 0.4s;
        }
    }

    i {
        font-family: 'Noto Sans', sans-serif;
        color: #888;
    }

    @media (max-width: 1000px) {
        section {
            margin: 64px 32px 64px 32px;
        }
    }

    @media (max-width: 464px) {
        .galleries {
            display: grid;
            gap: 16px;
            grid-template-columns: 1fr;
        }
    }
</style>

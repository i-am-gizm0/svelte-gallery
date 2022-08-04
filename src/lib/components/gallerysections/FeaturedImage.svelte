<script lang="ts">
    import generateSources from '$lib/sourcegenerator';

    import { onMount } from 'svelte';

    import BlurhashPicture from "$lib/modules/blurhash";

    export let image: Image;

    let width = 0,
        height = 0;
    onMount(() => {
        height = calcHeight(width);
    });
    function calcHeight(width: number) {
        return (image.aspect.height / image.aspect.width) * width;
    }
    $: height = calcHeight(width);

    let sources = image.uri.match(/^https?:\/\//)
        ? undefined
        : generateSources(image.uri, ['avif', 'webp', 'jpeg'], [3200, 2600, 1800, 1200, 800, 400]);
</script>

<svelte:window bind:innerWidth={width} />

<section
    class="featured-image"
    style="--w: {image.aspect.width}; --h: {image.aspect.height}"
    bind:offsetWidth={width}
>
    <BlurhashPicture src={image.uri} hash={image.blurhash} {width} {height}>
        {#if sources}
            <!-- Local Picture -->
            {#each sources as { srcset, media, type } (srcset)}
                <source {srcset} {media} {type} />
            {/each}
        {/if}
    </BlurhashPicture>
</section>

<style lang="scss">
    section {
        display: block;
        background-color: #eee;

        width: 100%;
        aspect-ratio: var(--w) / var(--h);
        margin-block: var(--margin);
    }
</style>

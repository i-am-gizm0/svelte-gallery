<script lang="ts">
    import generateSources from '$lib/sourcegenerator';
    import { onMount } from 'svelte';

    import BlurhashPicture from 'svelte-blurhash/src/BlurhashPicture.svelte';
    export let image: Image;

    export let width = 0;
    let height = 0;
    onMount(() => {
        height = calcHeight(width);
    });

    // function setHeight() {
    //     height = calcHeight(width);
    // }

    function calcHeight(width: number) {
        return (image.aspect.height / image.aspect.width) * width;
    }

    $: height = calcHeight(width);

    let sizes = width ? [
        2 * width   // To handle high-density displays
    ] : [3200, 2600, 1800, 1200, 800, 400];

    let sources = image.uri.match(/^https?:\/\//)
        ? undefined
        : generateSources(image.uri, ['avif', 'webp', 'jpeg'], sizes);
</script>

<div
    class="wrapper"
    style="--w: {image.aspect.width}; --h: {image.aspect.height}"
    bind:offsetWidth={width}
    title={image.caption || ''}
>
    <div class="container">
        <BlurhashPicture src={image.uri} hash={image.blurhash} {width} {height}>
            {#if sources}
                {#each sources as { srcset, media, type } (srcset)}
                    {#if sizes.length === 1 }
                        <source {srcset} {type} />
                    {:else}
                        <source {srcset} {media} {type} />
                    {/if}
                {/each}
            {/if}
        </BlurhashPicture>
    </div>
</div>

<style>
    div.wrapper {
        position: relative;
        /* display: grid;
        place-items: center; */
        width: 100%;
        aspect-ratio: var(--w) / var(--h);
        background-color: #eee;
    }

    .container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

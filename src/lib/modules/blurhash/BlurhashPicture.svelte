<script lang="ts">
    import IntersectionObserver from 'svelte-intersection-observer';
    import Blurhash from './Blurhash.svelte';
    import Image from './Image.svelte';

    export let src = '#';
    export let hash: string;
    export let width: number;
    export let height: number;
    export let alt = '';
    export let fadeDuration = 500;

    let element: HTMLDivElement;
    let hasIntersected = false;
    let imageLoaded = false;

    // let isPicture = Object.keys($$slots).length != 0;
</script>

<IntersectionObserver {element} once bind:intersecting={hasIntersected}>
    <div style="position: relative; width: {width}px; height: {height}px" bind:this={element}>
        {#if hasIntersected}
            <picture>
                <slot />
                <Image
                    bind:imageLoaded
                    {src}
                    {alt}
                    {width}
                    {height}
                />
            </picture>
        {/if}
        {#if !imageLoaded}
            <Blurhash {hash} {width} {height} {fadeDuration} />
        {/if}
    </div>
</IntersectionObserver>
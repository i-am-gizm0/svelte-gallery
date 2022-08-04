<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import BlurhashPicture from "$lib/modules/blurhash";
    import generateSources from '$lib/sourcegenerator';
    let lightboxImage: Image;
    let gallery: Image[];

    let changeDirection = 0;

    $: shownImageIndex = gallery?.findIndex(element => element.uri === lightboxImage?.uri) ?? -1;

    function showImage(image?: Image, gal?: Image[]) {
        lightboxImage = image;
        gallery = gal;
    }

    let boxWidth = 1,
        boxHeight = 1;
    $: boxAspect = boxWidth / boxHeight;
    $: imageAspect = lightboxImage ? lightboxImage.aspect.width / lightboxImage.aspect.height : 0;

    $: wrapperWidth = imageAspect > boxAspect ? boxWidth : boxHeight * imageAspect;
    $: wrapperHeight = imageAspect > boxAspect ? boxWidth / imageAspect : boxHeight;

    function classUpdater(node: HTMLBodyElement, show: boolean) {
        function update(show: boolean) {
            if (show) {
                node.classList.add('noscroll');
            } else {
                node.classList.remove('noscroll');
            }
        }
        update(show);
        return { update };
    }

    function close() {
        changeDirection = 0;
        showImage();
    }

    function next() {
        changeDirection = 1;
        lightboxImage = gallery[(shownImageIndex + 1) % gallery.length];
    }

    function previous() {
        changeDirection = -1;
        lightboxImage = gallery[shownImageIndex ? shownImageIndex - 1 : gallery.length - 1];
    }

    $: sources =
        !lightboxImage || lightboxImage.uri.match(/^https?:\/\//)
            ? undefined
            : generateSources(
                  lightboxImage.uri,
                  ['avif', 'webp', 'jpeg'],
                  [3200, 2600, 1800, 1200, 800, 400]
              );
</script>

<slot {showImage} />

{#if shownImageIndex >= 0}
    <div class="lightbox" transition:fade={{ duration: 200 }} on:click={close}>
        <div class="top controls">
            <div class="left">
                <span>{shownImageIndex + 1}/{gallery?.length ?? 0}</span>
                <!-- Share Button -->
            </div>
            <div class="right">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#" on:click|preventDefault={close} title="Close">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-x"
                        ><line x1="18" y1="6" x2="6" y2="18" /><line
                            x1="6"
                            y1="6"
                            x2="18"
                            y2="18"
                        /></svg
                    >
                </a>
            </div>
        </div>
        <div class="contents" bind:offsetWidth={boxWidth} bind:offsetHeight={boxHeight}>
            {#key lightboxImage}
                <div
                    class="current-image-wrapper"
                    style="--w: {wrapperWidth}px; --h: {wrapperHeight}px"
                    in:fly={{ x: window.innerWidth * changeDirection }}
                    out:fly={{ x: window.innerWidth * -changeDirection }}
                    on:click|stopPropagation
                >
                    <BlurhashPicture
                        src={lightboxImage.uri}
                        hash={lightboxImage.blurhash}
                        width={wrapperWidth}
                        height={wrapperHeight}
                    >
                        {#if sources}
                            <!-- Local Picture -->
                            {#each sources as { srcset, media, type } (srcset)}
                                <source {srcset} {media} {type} />
                            {/each}
                        {/if}
                    </BlurhashPicture>
                </div>
            {/key}
            <div
                class="overlay-controls"
                style="--w: {wrapperWidth}px; --h: {wrapperHeight}px"
                on:click|stopPropagation
            >
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#" class="back control" on:click|preventDefault={previous}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-arrow-left-circle"
                        ><circle cx="12" cy="12" r="10" /><polyline points="12 8 8 12 12 16" /><line
                            x1="16"
                            y1="12"
                            x2="8"
                            y2="12"
                        /></svg
                    >
                </a>
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href="#" class="next control" on:click|preventDefault={next}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="feather feather-arrow-right-circle"
                        ><circle cx="12" cy="12" r="10" /><polyline
                            points="12 16 16 12 12 8"
                        /><line x1="8" y1="12" x2="16" y2="12" /></svg
                    >
                </a>
            </div>
            <!-- Current image, eventually support swipe gestures -->
        </div>
        <div class="bottom controls">
            <span>{lightboxImage.caption??''}</span>
        </div>
    </div>
{/if}

<svelte:body
    use:classUpdater={shownImageIndex != -1}
    on:keydown={({ key }) => {
        if (key === 'Escape') {
            close();
        } else if (key === 'ArrowLeft') {
            previous();
        } else if (key === 'ArrowRight') {
            next();
        }
    }} />
<!-- <svelte:body class:noscroll={shownImageIndex != -1} /> -->

<svelte:head>
    <style>
        body.noscroll {
            overflow-y: clip;
            pointer-events: none;
        }
    </style>
</svelte:head>

<style>
    .lightbox {
        pointer-events: all;
        display: grid;

        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;

        background-color: #222;
        color: #fff;

        z-index: 10;

        padding: calc(var(--margin) / 2);
        box-sizing: border-box;

        place-items: center;
        grid-template-rows: auto 1fr auto;
        row-gap: 8px;

        font-family: 'Didact Gothic', sans-serif;
    }

    .controls {
        width: 100%;
        display: flex;
    }

    .top.controls {
        top: var(--margin);
        justify-content: space-between;
    }

    .bottom.controls {
        bottom: var(--margin);
        flex-flow: column;
        align-items: center;
    }

    .contents {
        display: block;
        /* aspect-ratio: var(--w) / var(--h);
        background-color: #fff; */
        height: 100%;
        /* max-width: 100%; */
        width: 100%;
        display: grid;
        /* grid-template-columns: fit-content(100%);
        grid-template-rows: fit-content(100%); */
        place-items: center;
        overflow: hidden;
    }

    .current-image-wrapper {
        display: block;
        width: var(--w);
        height: var(--h);

        background-color: #fff;
        color: #000;

        position: absolute;
    }

    a {
        color: inherit !important;
    }

    .overlay-controls {
        position: absolute;
        top: 50%;
        left: 50%;
        width: var(--w);
        height: var(--h);
        transform: translate(-50%, -50%);

        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 50%;
        transition: 0.2s;
    }

    .overlay-controls .control {
        display: flex;
        flex-flow: column;
        justify-content: center;
        padding: 0 16px;
        opacity: 0;
        transition: 0.4s opacity;
        background: rgb(0, 0, 0, 0.8);
        background: linear-gradient(
            calc(var(--mod) * 90deg),
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0) 100%
        );
        overflow: hidden;
    }

    .overlay-controls .control:hover
    /* , .overlay-controls .control:focus */ {
        opacity: 1;
    }

    .overlay-controls .back.control {
        --mod: 1;
    }
    .overlay-controls .next.control {
        align-items: flex-end;
        --mod: -1;
    }

    .overlay-controls .control:hover svg
    /* , .overlay-controls .control:focus svg */ {
        transform: translateX(0);
    }

    .overlay-controls .control svg {
        transition: 0.4s transform;
        transform: translateX(calc(var(--mod) * -32px));
    }

    @media only screen and (prefers-reduced-motion: reduce) {
        .overlay-controls .control svg {
            transition: 0s;
        }
    }

    @media only screen and (pointer: coarse) {
        .overlay-controls {
            width: 100%;
            height: 100%;

            grid-template-columns: 33% auto;
            column-gap: 0;

            -webkit-touch-callout: none;
        }

        .overlay-controls .control {
            opacity: 0 !important;
        }
    }
</style>

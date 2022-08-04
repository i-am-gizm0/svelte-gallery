<script lang="ts">
    import { decode } from "blurhash";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    export let hash: string;
    export let width = 100;
    export let height = 100;
    export let resolutionX = 16;
    export let resolutionY = 16;
    export let punch = 1;
    export let fadeDuration: number;

    let canvas: HTMLCanvasElement;

    onMount(()=>{
        if (hash && canvas) {
            const pixels = decode(hash, resolutionX, resolutionY, punch);
            const ctx = canvas.getContext('2d');
            const imageData = ctx.createImageData(resolutionX, resolutionY);
            imageData.data.set(pixels);
            ctx.putImageData(imageData, 0, 0);
        }
    });
</script>

<div style="position: absolute; top: 0; left: 0; width: {width}px; height: {height}px" out:fade={{duration: fadeDuration, delay: fadeDuration}}>
    <canvas
        bind:this={canvas}
        width={resolutionX}
        height={resolutionY}
        style="width: 100%; height: 100%"
    />
</div>
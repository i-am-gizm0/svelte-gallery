<script lang="ts">
    export let src: string;
    export let alt: string;
    export let width: number;
    export let height: number;

    export let imageLoaded = false;
</script>

<img
    on:load={()=>{imageLoaded = true}}
    {src}
    {alt}
    {width}
    {height}
    style="position: absolute; top: 0; left: 0"
    loading="lazy"
    decoding="async"
/>
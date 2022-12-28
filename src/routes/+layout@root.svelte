<script lang="ts">
    import type { Group } from '$lib/types';
    import NavBar from '$lib/components/NavBar.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    $: ({ resources, navLinks } = data);
</script>

<NavBar nameStart={resources.site.start} nameEnd={resources.site.end} {navLinks} />

<slot {resources} />

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
    <link
        href="https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Kanit:wght@100;900&family=Noto+Sans&family=Sen:wght@400;700&display=swap"
        rel="stylesheet"
    />

    <style>
        body {
            margin: 0;
        }
    </style>
</svelte:head>

<style lang="scss">
    :global(img) {
        user-select: none;
    }
</style>

<script lang="ts">
    import GalleryList from '$lib/components/GalleryList.svelte';
    import Header from '$lib/components/Header.svelte';
    import type { Collection } from '$lib/types';
    
    import type { PageData } from './$types';
    export let data;

    $: ({recentGalleries, headerImage, resources} = data);
</script>

<svelte:head>
    <title>{resources.site.name}</title>
</svelte:head>

<Header titleLine1={resources.site.start} titleLine2={resources.site.end} image={headerImage} />

<GalleryList collection={recentGalleries} />

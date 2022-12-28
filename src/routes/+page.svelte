<script context="module" lang="ts">
    import type { Collection } from '$lib/types';
    export const load: Load = async ({ fetch, session }) => {
        const recentGalleriesResponse = await fetch('/api/collections/recent');
        let recentGalleries: Collection;
        if (recentGalleriesResponse.ok) {
            recentGalleries = await recentGalleriesResponse.json();
        } else {
            recentGalleries = {
                name: 'Recent Events',
                galleries: [],
            };
        }
        return {
            props: {
                recentGalleries,
                headerImage: session.defaults.headerImage,
                resources: session.resources,
            },
        };
    };
</script>

<script lang="ts">
    import GalleryList from '$lib/components/GalleryList.svelte';
    import Header from '$lib/components/Header.svelte';
    import type { Load } from '@sveltejs/kit';

    export let recentGalleries: Collection;
    export let headerImage: Image;
    export let resources: App.Resources;
</script>

<svelte:head>
    <title>{resources.site.name}</title>
</svelte:head>

<Header titleLine1={resources.site.start} titleLine2={resources.site.end} image={headerImage} />

<GalleryList collection={recentGalleries} />

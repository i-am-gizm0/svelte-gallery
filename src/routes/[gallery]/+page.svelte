<script lang="ts">
    import Header from '$lib/components/Header.svelte';
    import ImageGallery from '$lib/components/gallerysections/ImageGallery.svelte';
    import MarkdownSection from '$lib/components/gallerysections/MarkdownSection.svelte';
    import FeaturedImage from '$lib/components/gallerysections/FeaturedImage.svelte';
    import Lightbox from '$lib/components/Lightbox.svelte';

    import type { PageData } from './$types';
    export let data;
    $: ({gallery, resources, defaultHeaderImage} = data);

    $: titleParts = (
        gallery.bigSmallTitle ? gallery.bigSmallTitle.split('\n') : [gallery.fullTitle, '']
    ).map(value => (value === 'undefined' ? undefined : value));
</script>

<svelte:head>
    <title>{gallery.fullTitle} - {resources.site.name}</title>
</svelte:head>

{#key gallery}
    <Header
        titleLine1={titleParts[0]}
        titleLine2={titleParts[1]}
        description={gallery.description}
        image={gallery.headerImage || defaultHeaderImage}
    />

    <Lightbox let:showImage>
        {#each gallery.sections as section, idx (`${gallery.fullTitle}.${section.type}.${idx}`)}
            {#if section.type === 'ImageGallery'}
                <ImageGallery images={section.images} {showImage} />
            {:else if section.type === 'MarkdownSection'}
                <MarkdownSection content={section.content} />
            {:else if section.type === 'FeaturedImage'}
                <FeaturedImage image={section.image} />
            {:else}
                <i>Warning: Unknown Section</i>
            {/if}
        {/each}
    </Lightbox>
{/key}

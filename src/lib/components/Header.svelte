<script lang="ts">
    import FluidBlurhash from './FluidBlurhash.svelte';

    export let titleLine1: string;
    export let titleLine2 = '';
    export let description = '';
    export let image: Image;
    // export let image = 'https://unsplash.com/photos/97PlMioxk_Q/download';
    // export let description = 'Description';
</script>

<header>
    <div class="main-header">
        <div class="text">
            <h1>{titleLine1}</h1>
            {#if titleLine2}
                <h2>{titleLine2}</h2>
            {/if}
            {#if description}
                <p class="description">{@html description}</p>
            {/if}
        </div>

        <FluidBlurhash {image} />
    </div>
    {#if description}
        <p class="description">{@html description}</p>
    {/if}
</header>

<style lang="scss">
    @import '../layout';

    .main-header {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 32px;

        align-items: center;

        margin: var(--margin);
    }

    .text {
        z-index: 1;
    }

    h1,
    h2 {
        font-family: 'Kanit', sans-serif;
        line-height: 1em;
        margin: 0;
        /* font-size: 72px; */
        font-size: min(72px, 12vw);
    }

    h1 {
        font-weight: 900;
    }

    h2 {
        font-weight: 100;
    }

    p.description {
        font-family: 'Didact Gothic', sans-serif;
    }

    header > p.description {
        display: none;
    }

    @media (max-width: 1000px) {
        .main-header {
            display: block;
            position: relative;
        }

        .text {
            position: absolute;
            left: 0;
            bottom: -1px; /* Weird hack because there was a pixel gap on FF */

            width: 100%;
            box-sizing: border-box;

            padding: 32px;

            background: rgb(255, 255, 255, 0.8);
            background: linear-gradient(
                0deg,
                rgba(255, 255, 255, 0.8) 0%,
                rgba(255, 255, 255, 0) 100%
            );
        }

        .main-header p.description {
            display: none;
        }

        header > p.description {
            color: currentColor;
            display: block;
            margin: var(--margin);
        }

        @supports (-webkit-text-stroke: 0.03em white) {
            .text {
                background: rgb(0, 0, 0, 0.8);
                background: linear-gradient(0deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
            }

            .text h1,
            .text h2 {
                -webkit-text-stroke: 0.03em white;
                color: #0008;
            }
        }
    }

    @media (max-width: 600px) {
        .main-header {
            margin: 0;
        }
    }
</style>

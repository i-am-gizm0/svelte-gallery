<script lang="ts">
    import type { Group } from '$lib/types';
    import reduceAnimation from '$lib/motionReduce';
    import { fade, slide } from 'svelte/transition';

    export let group: Group;

    export let open = false;
    function toggleOpen() {
        open = !open;
        if (open) {
            openDropdown = group.name;
        } else {
            openDropdown = undefined;
        }
    }

    export let openDropdown: string;
    $: open = openDropdown === group.name;

    const dropdownTransition = reduceAnimation(fade, slide);
</script>

<div class="nav-item">
    <a href="#toggle" class="nav-link" on:click|preventDefault={toggleOpen} class:open>
        {group.name}
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="2 0 21 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-chevron-down"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    </a>
    {#if open}
        <div class="dropdown" transition:$dropdownTransition={{ duration: 200 }}>
            <ul>
                {#each group.galleries as gallery}
                    <li>
                        <a sveltekit:prefetch href="{gallery.path}">{gallery.name}</a>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</div>

<style lang="scss">
    div.nav-item {
        font-family: 'Noto Sans', sans-serif;
        position: relative;
    }

    a {
        color: currentColor !important;
        text-decoration: none !important;
    }

    a.nav-link {
        line-height: 1em;
        padding: 0.25em;
        padding-inline-start: 0.38em;
        box-sizing: border-box;
        background-color: #fff0;
        border-radius: 4px;
        transition: 0.2s background-color;
    }

    a.nav-link:hover,
    a.nav-link.open {
        background-color: #eee;
    }

    a.nav-link > * {
        vertical-align: middle;
    }

    a.nav-link svg.feather {
        transition: 0.2s transform;
        // width: 1em !important;
        height: 1em !important;
    }

    a.nav-link.open svg.feather {
        transform: rotate(180deg);
    }

    div.dropdown {
        position: absolute;
        bottom: -10px;
        transform: translateY(100%);

        min-width: 100%;
        // height: 100px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: #0004 0 2px 4px;

        overflow: hidden;

        box-sizing: border-box;
        padding: 0.5em;

        ul {
            padding-inline-start: 0;
            margin-block: 0;
            list-style-type: none;
        }

        li {
            border-radius: 4px;
            padding: 0.5em;
            transition: 0.2s background-color;
        }

        li:hover,
        li:focus-within {
            background-color: #ddd;
        }
    }

    @media screen and (prefers-color-scheme: dark) {
        a.nav-link {
            background-color: #0000;
        }

        a.nav-link:hover,
        a.nav-link.open {
            background-color: #333;
        }

        div.dropdown {
            background-color: #222;

            li:hover,
            li:focus-within {
                background-color: #444;
            }
        }
    }
</style>

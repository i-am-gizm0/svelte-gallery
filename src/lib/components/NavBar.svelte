<script lang="ts">
    import reduceAnimation from '$lib/motionReduce';
    import disableScroll from '$lib/disableScroll';
    import { navigating } from '$app/stores';

    import { draw, slide, fade } from 'svelte/transition';
    import Dropdown from './Dropdown.svelte';
    import { hasParent } from '$lib/uiutils';
    import { onMount } from 'svelte';
    import type { Group } from '$lib/types';

    export let navLinks: Group[];
    export let nameStart: string;
    export let nameEnd: string;

    let width: number;
    let menuOpen = false;
    $: menuVisible = width <= 1000;
    $: showMenu = menuOpen && menuVisible;
    function duration() {
        return menuVisible ? 400 : 0;
    }

    $: if (!menuVisible) {
        menuOpen = false;
    }

    const menuTransition = reduceAnimation(fade, slide);

    let openDropdown = undefined;

    $: {
        $navigating;

        menuOpen = false;
        openDropdown = undefined;
    }

    let dropdownsContainer: HTMLElement;

    onMount(() => {
        document.addEventListener('click', e => {
            if (!hasParent(e.target as HTMLElement, dropdownsContainer)) {
                openDropdown = undefined;
            }
        });
    });
</script>

<nav class:solid={showMenu} class:loading={$navigating}>
    <a data-sveltekit-preload-data href="/" id="title"><b>{nameStart}</b> {nameEnd}</a>
    <!-- TODO: Performance: Switch from JS to media queries for visibility -->
    {#if menuVisible}
        <a href="#menu" class="menuToggle" on:click|preventDefault={() => (menuOpen = !menuOpen)}>
            {#if menuOpen}
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
                    class="feather feather-x"
                >
                    <line
                        in:draw={{ delay: 0, duration }}
                        out:fade={{ duration: 200 }}
                        x1="18"
                        y1="6"
                        x2="6"
                        y2="18"
                    />
                    <line
                        in:draw={{ delay: 100, duration }}
                        out:fade={{ duration: 200 }}
                        x1="6"
                        y1="6"
                        x2="18"
                        y2="18"
                    />
                </svg>
            {:else}
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
                    class="feather feather-menu"
                >
                    <line
                        in:draw={{ delay: 0, duration }}
                        out:fade={{ duration: 200 }}
                        x1="3"
                        y1="12"
                        x2="21"
                        y2="12"
                    />
                    <line
                        in:draw={{ delay: 100, duration }}
                        out:fade={{ duration: 200 }}
                        x1="3"
                        y1="6"
                        x2="21"
                        y2="6"
                    />
                    <line
                        in:draw={{ delay: 200, duration }}
                        out:fade={{ duration: 200 }}
                        x1="3"
                        y1="18"
                        x2="21"
                        y2="18"
                    />
                </svg>
            {/if}
        </a>
    {:else if width !== undefined}
        <div class="nav-links" bind:this={dropdownsContainer}>
            {#each navLinks as group}
                <Dropdown {group} bind:openDropdown />
            {/each}
        </div>
        <!-- {@debug openDropdown} -->
    {/if}
</nav>
{#if showMenu}
    <div class="navMenu" transition:$menuTransition={{ duration: 400 }}>
        <div class="content">
            {#each navLinks as group}
                <div class="group" transition:$menuTransition={{ duration: 400 }}>
                    <span class="group-title">{group.name}</span>
                    {#each group.galleries as gallery}
                        <div class="link">
                            <a data-sveltekit-preload-data href="{gallery.path}" class="nav-link"
                                >{gallery.name}</a
                            >
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{/if}

<svelte:window bind:innerWidth={width} />
<svelte:body use:disableScroll={showMenu} />

<style lang="scss">
    nav {
        position: sticky;
        top: 0;

        width: 100%;
        height: 64px;
        padding: 16px;

        box-sizing: border-box;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: #fffffff0;

        border-bottom: 1px solid #ddd4;

        z-index: 2;
        transition: 0.4s;

        a {
            color: inherit;
            text-decoration: none;
        }

        a.menuToggle {
            width: 24px;
            height: 24px;
            position: relative;

            svg {
                position: absolute;
                // left: 0;
                // top: 0;
                // transform: translate(-50%, -50%)
            }
        }

        #title {
            font-family: 'Sen', sans-serif;
            font-size: 24px;
        }

        .nav-links {
            display: grid;
            grid-auto-flow: column;
            column-gap: 8px;
        }
    }

    nav.solid {
        background-color: #fff;
    }

    nav.loading {
        border-bottom: solid 4px #ea2222;
        -webkit-animation: color-change-5x 3s linear infinite alternate both;
        animation: color-change-5x 3s linear infinite alternate both;
    }

    @-webkit-keyframes color-change-5x {
        0% {
            border-bottom-color: #ea2222;
        }
        25% {
            border-bottom-color: #f5be10;
        }
        50% {
            border-bottom-color: #3bd80d;
        }
        75% {
            border-bottom-color: #19dcea;
        }
        100% {
            border-bottom-color: #b22cff;
        }
    }

    @keyframes color-change-5x {
        0% {
            border-bottom-color: #ea2222;
        }
        25% {
            border-bottom-color: #f5be10;
        }
        50% {
            border-bottom-color: #3bd80d;
        }
        75% {
            border-bottom-color: #19dcea;
        }
        100% {
            border-bottom-color: #b22cff;
        }
    }

    .navMenu {
        font-family: 'Noto Sans', sans-serif;

        position: fixed;
        top: 64px;
        width: 100%;
        height: calc(100% - 64px);
        z-index: 10;

        background-color: #fff;

        display: grid;
        place-items: center;

        .content {
            max-width: 100%;
            max-height: 100%;

            padding-block: 1em;
            box-sizing: border-box;

            overflow-y: auto;

            .group {
                width: 100%;
                margin-bottom: 16px;

                .group-title,
                .link {
                    display: block;
                    padding-inline: 16px;
                    text-align: center;
                }

                .group-title {
                    font-size: 1.25em;
                    padding-bottom: 0.25em;
                    border-bottom: 1px solid #888;
                }

                .link {
                    padding: 0.125em;
                    // margin-bottom: 4px;
                }

                .link:hover,
                .link:focus-within {
                    background-color: #ddd;
                }
            }
        }

        a {
            color: currentColor !important;
            text-decoration: none !important;
        }
    }

    @media screen and (prefers-color-scheme: dark) {
        .navMenu {
            background-color: #111;
        }

        nav {
            background-color: #000000e0;
        }

        nav.solid {
            background-color: #000;
        }
    }

    @supports (backdrop-filter: blur(24px)) {
        nav {
            background-color: #ffffffa7;
            backdrop-filter: blur(24px);
        }

        @media screen and (prefers-color-scheme: dark) {
            nav {
                background-color: #000000a7;
            }
        }
    }
</style>

<script lang="ts">
    // TODO: File issue about this
    import SvelteMarkdown from 'svelte-markdown/src/SvelteMarkdown.svelte';
    import sanitize from 'sanitize-html';
    import highlight from 'highlight.js';

    export let content: string;

    const markdownOptions = {
        // sanitizer: sanitize,
        highlight: (code: string, lang: string) => {
            return highlight.highlight(lang, code).value;
        },
    };
</script>

<section class="markdown-section">
    <SvelteMarkdown source={content} options={markdownOptions} />
</section>

<style lang="scss">
    section {
        margin: var(--margin);

        :global(*:not(code)) {
            font-family: 'Didact Gothic', sans-serif;
        }

        :global(h1),
        :global(h2),
        :global(h3),
        :global(h4),
        :global(h5),
        :global(h6) {
            /* Gets them out of the way of the navbar */
            padding-top: 64px;
            margin-top: -64px;
            font-family: 'Kanit', sans-serif;
        }

        :global(blockquote) {
            margin-inline-start: 20px;
            border-inline-start: 2px solid transparent;
            padding-inline-start: 18px;
        }

        :global(blockquote:hover) :global(blockquote:focus-within) {
            border-inline-start-color: #aaa;
        }

        :global(a) {
            color: inherit;
        }

        :global(img) {
            width: 100%;
        }

        :global(hr) {
            border: solid 1px #888;
        }

        :global(table) {
            border-collapse: collapse;
            min-width: 100px;
        }

        :global(table),
        :global(th),
        :global(td) {
            border: 1px solid #888;
        }

        :global(th),
        :global(td) {
            padding: 0.5em;
        }
    }

    // @media only screen and (max-width: 1000px) {
    //     section {
    //         margin: 32px;
    //     }
    // }
</style>

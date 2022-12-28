<!-- A nice easter egg I like to put in all my projects -->
<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit';

    export const load: Load = () => {
        return {
            status: 418,
        };
    };
</script>

<script lang="ts">
    import type {Album} from "$lib/types";
    import {onMount} from "svelte";
    import {browser} from "$app/environment";

    export let data: { albums: Album[] };
</script>

<ul>
    {#each data.albums as album}
        <li>
            <a href="/album/{encodeURIComponent(album.name)}">
                {album.name}
            </a>
        </li>
    {/each}
</ul>

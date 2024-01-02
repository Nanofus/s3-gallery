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
                <span>{album.name}{album.location ? " – " + album.location : ""}</span>
                {#if album.main}
                    <img src={album.main} alt={album.name} />
                {/if}
            </a>
        </li>
    {/each}
</ul>

<style>
    ul {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    li {
        list-style: none;
        display: block;
        height: 10rem;
        max-width: 50rem;
        width: 100%;
        margin: 0.5rem 0;
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    }
    
    li:hover {
        background-color: #f0f0f0;
    }
    
    li > a {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        overflow: hidden;
        text-decoration: none;
        color: #000;
    }
    
    a > span {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        width: 100%;
        height: 100%;
    }
    
    a > img {
        max-width: 20rem;
    }
    
    li > a > * {
        height: 10rem;
    }
    
</style>
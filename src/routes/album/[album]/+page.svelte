<script lang="ts">
    import type {AlbumData} from "$lib/types";
    import {PUBLIC_BACK_BUTTON_TEXT} from "$env/static/public";

    export let data: { album: AlbumData };

    const isVideo = (url: string) => {
        const ext = url.split(".")?.pop()?.toLowerCase();
        if (!ext) return false;
        return ["mp4", "webm", "ogg", "mov", "m4v", "mts"].includes(ext);
    }

    const isGif = (url: string) => {
        const ext = url.split(".")?.pop()?.toLowerCase();
        if (!ext) return false;
        return ["gif"].includes(ext);
    }

    const images = data.album.images.sort((a, b) => {
        if (isVideo(a.url) && !isVideo(b.url)) return 1;
        if (!isVideo(a.url) && isVideo(b.url)) return -1;
        return 0;
    });
</script>

<a href="/">{PUBLIC_BACK_BUTTON_TEXT}</a>
<h2>{data.album.name} {data.album.location ? " – " + data.album.location : ""}</h2>
{#if data.album.main}
    <div class="main">
        <img src="{data.album.main}" alt="album cover image">
    </div>
{/if}
<div class="gallery">
    {#each images as image}
        {#if isVideo(image.url)}
            <a href="{image.url}">
                <div class="thumbnail">Video 📽</div>
            </a>
        {:else if isGif(image.url)}
            <a href="{image.url}">
                <img src="{image.url}" class="thumbnail" alt="{image.description}">
            </a>
        {:else}
            <a href="{image.url}" target="_blank">
                <img src="{image.thumbnailUrl}" class="thumbnail" alt="{image.description}">
            </a>
        {/if}
    {/each}
</div>

<style>
    h2 {
        text-align: center;
    }

    :root {
        --image-size: 200px;
    }
    
    .main {
        display: flex;
        justify-content: center;
    }
    
    img, .thumbnail {
        box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset;
    }
    
    .main > img {
        max-width: 60rem;
        min-width: 360px;
        max-height: 100%;
    }

    .gallery {
        display: grid;
        justify-content: center;
        grid-template-columns: repeat(auto-fit, var(--image-size));
        gap: 1rem;
        margin: 1rem;
    }

    .thumbnail {
        width: var(--image-size);
        height: var(--image-size);
        background-color: white;
        object-fit: cover;
        object-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
    }
</style>

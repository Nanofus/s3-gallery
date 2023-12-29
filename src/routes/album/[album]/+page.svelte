<script lang="ts">
    import type {AlbumData} from "$lib/types";
    import {PUBLIC_BACK_BUTTON_TEXT} from "$env/static/public";

    export let data: { album: AlbumData };

    const isVideo = (url: string) => {
        const ext = url.split(".")?.pop()?.toLowerCase();
        if (!ext) return false;
        return ["mp4", "webm", "ogg", "mov", "m4v", "mts"].includes(ext);
    }

    const images = data.album.images.sort((a, b) => {
        if (isVideo(a.url) && !isVideo(b.url)) return 1;
        if (!isVideo(a.url) && isVideo(b.url)) return -1;
        return 0;
    });
</script>

<a href="/">{PUBLIC_BACK_BUTTON_TEXT}</a>
<h2>{data.album.name}</h2>
<div class="gallery">
    {#each images as image}
        {#if isVideo(image.url)}
            <a href="{image.url}">
                <div class="thumbnail">VIDEO</div>
            </a>
        {:else}
            <a href="{image.url}" target="_blank">
                <img src="{image.url}" class="thumbnail" alt="{image.description}">
            </a>
        {/if}
    {/each}
</div>

<style>
    .gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }

    .thumbnail {
        width: 200px;
        height: 200px;
        background-color: white;
        object-fit: cover;
        object-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
    }
</style>

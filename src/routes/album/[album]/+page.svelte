<script lang="ts">
    import type {AlbumData} from "$lib/types";

    export let data: { album: AlbumData };
</script>

<main>
  <h1>{data.album.name}</h1>
  {#each data.album.images as image}
    <img src="{image.url}" alt="{image.description}">
  {/each}
</main>
